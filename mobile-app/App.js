import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, ActivityIndicator, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { useState, useRef } from 'react';

const APP_URL = 'https://bold-beyond.vercel.app/appx';

export default function App() {
  const [loading, setLoading] = useState(true);
  const webViewRef = useRef(null);

  const handleNavigationStateChange = (navState) => {
    // Track navigation if needed
  };

  const handleShouldStartLoadWithRequest = (request) => {
    const url = request.url;
    
    if (url.includes('bold-beyond.vercel.app')) {
      return true;
    }
    
    if (url.startsWith('tel:') || url.startsWith('mailto:')) {
      return true;
    }
    
    return false;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1a5f4a" />
        </View>
      )}
      
      <WebView
        ref={webViewRef}
        source={{ uri: APP_URL }}
        style={styles.webview}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onNavigationStateChange={handleNavigationStateChange}
        onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        mediaPlaybackRequiresUserAction={false}
        allowsInlineMediaPlayback={true}
        allowsBackForwardNavigationGestures={true}
        cacheEnabled={true}
        pullToRefreshEnabled={true}
        bounces={true}
        scalesPageToFit={true}
        userAgent="BoldAndBeyond/1.0 (iOS; Mobile)"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
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
    backgroundColor: '#ffffff',
    zIndex: 10,
  },
});
