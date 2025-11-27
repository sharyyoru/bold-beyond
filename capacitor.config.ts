import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "ae.boldandbeyond.app",
  appName: "Bold & Beyond",
  webDir: "out",
  server: {
    androidScheme: "https",
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#1B365D",
      showSpinner: false,
      androidSpinnerStyle: "small",
      spinnerColor: "#D4AF37",
    },
    StatusBar: {
      style: "dark",
      backgroundColor: "#1B365D",
    },
    Keyboard: {
      resize: "body",
      resizeOnFullScreen: true,
    },
  },
  ios: {
    contentInset: "automatic",
  },
  android: {
    allowMixedContent: true,
  },
};

export default config;
