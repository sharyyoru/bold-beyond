import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Platform, ActivityIndicator, View, Linking } from 'react-native';
import { WebView } from 'react-native-webview';
import { useState, useRef, useCallback } from 'react';

const APP_URL = 'https://bold-beyond.vercel.app/appx';
const APP_DOMAIN = 'bold-beyond.vercel.app';

export default function App() {
  const [loading, setLoading] = useState(true);
  const webViewRef = useRef(null);

  // Handle navigation state changes
  const handleNavigationStateChange = (navState) => {
    // Track navigation if needed for analytics
  };

  // Control which URLs open in WebView vs external browser
  const handleShouldStartLoadWithRequest = useCallback((request) => {
    const url = request.url;
    
    // Allow your app domain - keep everything in-app
    if (url.includes(APP_DOMAIN)) {
      return true;
    }
    
    // Allow Supabase auth callbacks
    if (url.includes('supabase.co')) {
      return true;
    }
    
    // Allow tel: and mailto: to open native handlers
    if (url.startsWith('tel:') || url.startsWith('mailto:')) {
      Linking.openURL(url);
      return false;
    }
    
    // Allow WhatsApp links to open in WhatsApp app
    if (url.includes('wa.me') || url.includes('whatsapp.com')) {
      Linking.openURL(url);
      return false;
    }
    
    // Open external links in system browser
    if (url.startsWith('http://') || url.startsWith('https://')) {
      Linking.openURL(url);
      return false;
    }
    
    // Block all other URLs
    return false;
  }, []);

  // Injected JavaScript for better app experience
  const injectedJavaScript = `
    // Disable long-press context menu for app-like feel
    document.body.style.webkitTouchCallout = 'none';
    document.body.style.webkitUserSelect = 'none';
    
    // Prevent zoom on double-tap
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(event) {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) {
        event.preventDefault();
      }
      lastTouchEnd = now;
    }, false);
    
    true;
  `;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" backgroundColor="#ffffff" />
      
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
        
        // Enable JavaScript
        javaScriptEnabled={true}
        
        // Enable DOM storage for localStorage/sessionStorage
        domStorageEnabled={true}
        
        // Allow media playback
        mediaPlaybackRequiresUserAction={false}
        allowsInlineMediaPlayback={true}
        
        // iOS specific - enable swipe back/forward
        allowsBackForwardNavigationGestures={true}
        
        // Caching for offline-ish experience
        cacheEnabled={true}
        
        // Pull to refresh (iOS)
        pullToRefreshEnabled={true}
        
        // Bounce effect for iOS feel
        bounces={true}
        
        // Auto-adjust content
        scalesPageToFit={true}
        
        // Share cookies between sessions
        sharedCookiesEnabled={true}
        
        // Inject JavaScript for app-like behavior
        injectedJavaScript={injectedJavaScript}
        
        // User agent to identify app requests
        userAgent="BoldAndBeyond/1.0 (iOS; Mobile)"
        
        // Allow file access
        allowFileAccess={true}
        
        // Enable third-party cookies for auth
        thirdPartyCookiesEnabled={true}
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
