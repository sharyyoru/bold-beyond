import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Platform, ActivityIndicator, View, Text, NativeModules, NativeEventEmitter } from 'react-native';
import { WebView } from 'react-native-webview';
import { useState, useRef, useEffect } from 'react';

const APP_URL = 'https://bold-beyond.vercel.app/appx';
const { BandSdk } = NativeModules;
const bandEmitter = BandSdk ? new NativeEventEmitter(BandSdk) : null;

export default function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const webViewRef = useRef(null);
  const pendingSyncs = useRef(new Set()).current;

  const postToWeb = (payload) => {
    const js = 
      (function(){
        try {
          if (window.BandBridge && window.BandBridge.onNativeMessage) {
            window.BandBridge.onNativeMessage();
          } else {
            window.dispatchEvent(new MessageEvent('message', { data:  }));
          }
        } catch(e){ console.error('BandBridge post error', e); }
      })();
    ;
    webViewRef.current?.injectJavaScript(js);
  };

  useEffect(() => {
    if (!bandEmitter) return;

    const subs = [
      bandEmitter.addListener('BandDeviceFound', (device) => {
        postToWeb({ type: 'deviceFound', device });
      }),
      bandEmitter.addListener('BandDataReceived', (data) => {
        postToWeb({ type: 'dataReceived', data });
      }),
    ];

    return () => subs.forEach((s) => s.remove());
  }, []);

  const handleMessage = async (event) => {
    let payload;
    try {
      payload = JSON.parse(event.nativeEvent.data);
    } catch {
      return;
    }

    if (!payload || payload.channel !== 'band') return;

    switch (payload.action) {
      case 'isBluetoothSupported':
        BandSdk.isBluetoothSupported().then((v) =>
          postToWeb({ id: payload.id, type: 'result', result: v })
        ).catch((err) => postToWeb({ id: payload.id, type: 'error', error: err.message }));
        break;
      case 'isBluetoothEnabled':
        BandSdk.isBluetoothEnabled().then((v) =>
          postToWeb({ id: payload.id, type: 'result', result: v })
        ).catch((err) => postToWeb({ id: payload.id, type: 'error', error: err.message }));
        break;
      case 'startScan':
        BandSdk.startScan(payload.timeoutMs || 10000).then(() =>
          postToWeb({ id: payload.id, type: 'result', result: true })
        ).catch((err) => postToWeb({ id: payload.id, type: 'error', error: err.message }));
        break;
      case 'stopScan':
        BandSdk.stopScan();
        postToWeb({ id: payload.id, type: 'result', result: true });
        break;
      case 'connect':
        BandSdk.connect(payload.deviceId).then(() =>
          postToWeb({ id: payload.id, type: 'result', result: true })
        ).catch((err) => postToWeb({ id: payload.id, type: 'error', error: err.message }));
        break;
      case 'disconnect':
        BandSdk.disconnect();
        postToWeb({ id: payload.id, type: 'result', result: true });
        break;
      case 'syncHealthData':
        BandSdk.syncHealthData(payload.dataType).then((resultJson) =>
          postToWeb({ id: payload.id, type: 'result', result: JSON.parse(resultJson) })
        ).catch((err) => postToWeb({ id: payload.id, type: 'error', error: err.message }));
        break;
      case 'writeCommand':
        BandSdk.writeCommand(payload.commandBase64).then(() =>
          postToWeb({ id: payload.id, type: 'result', result: true })
        ).catch((err) => postToWeb({ id: payload.id, type: 'error', error: err.message }));
        break;
      default:
        postToWeb({ id: payload.id, type: 'error', error: 'Unknown action: ' + payload.action });
    }
  };

  const handleError = (syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    console.error('WebView error:', nativeEvent);
    setError(nativeEvent.description || 'Failed to load app');
    setLoading(false);
  };

  const handleHttpError = (syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    console.error('HTTP error:', nativeEvent);
  };

  const handleShouldStartLoadWithRequest = (request) => {
    const url = request.url;
    if (url.includes('bold-beyond.vercel.app')) return true;
    if (url.startsWith('tel:') || url.startsWith('mailto:')) return true;
    return false;
  };

  const injectedJS = \
    window.BandBridge = window.BandBridge || {
      _callbacks: {},
      _id: 0,
      call: function(action, params = {}) {
        return new Promise((resolve, reject) => {
          const id = 'b_' + (++window.BandBridge._id);
          window.BandBridge._callbacks[id] = { resolve, reject };
          const payload = Object.assign({ channel: 'band', id, action }, params);
          window.ReactNativeWebView.postMessage(JSON.stringify(payload));
        });
      },
      onNativeMessage: function(raw) {
        try {
          const msg = JSON.parse(raw);
          const cb = window.BandBridge._callbacks[msg.id];
          if (cb) {
            delete window.BandBridge._callbacks[msg.id];
            if (msg.type === 'error') cb.reject(new Error(msg.error));
            else cb.resolve(msg.result);
          } else if (msg.type === 'deviceFound' || msg.type === 'dataReceived') {
            window.dispatchEvent(new CustomEvent('band:' + msg.type, { detail: msg }));
          }
        } catch(e) { console.error('BandBridge parse error', e); }
      }
    };
  \;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1a5f4a" />
        </View>
      )}

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Unable to load app</Text>
          <Text style={styles.errorDetail}>{error}</Text>
        </View>
      ) : (
        <WebView
          ref={webViewRef}
          source={{ uri: APP_URL }}
          style={styles.webview}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          onError={handleError}
          onHttpError={handleHttpError}
          onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
          onMessage={handleMessage}
          injectedJavaScript={injectedJS}
          injectedJavaScriptBeforeContentLoaded={injectedJS}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          mediaPlaybackRequiresUserAction={false}
          allowsInlineMediaPlayback={true}
          allowsBackForwardNavigationGestures={true}
          cacheEnabled={true}
          startInLoadingState={true}
          bounces={true}
          mixedContentMode="compatibility"
          userAgent={\BoldAndBeyond/1.0 (\; Mobile)\}
          allowFileAccess={true}
          allowUniversalAccessFromFileURLs={true}
          originWhitelist={['*']}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    zIndex: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ef4444',
    marginBottom: 10,
  },
  errorDetail: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
});
