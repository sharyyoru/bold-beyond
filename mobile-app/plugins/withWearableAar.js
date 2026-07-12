const { withProjectBuildGradle, withAndroidBuildGradle, withAndroidSettingsGradle, withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const AAR_FILES = [
  { source: 'docs/wearables/v8-android-sdk/blesdk_v8_7.0-release.aar', target: 'libs/blesdk-v8.aar' },
  { source: 'docs/wearables/v5-android-sdk/2436sdk1.0.jar', target: 'libs/blesdk-v5.jar' },
  { source: 'docs/wearables/v4-android-sdk/2501sdk1.0.jar', target: 'libs/blesdk-v4.jar' },
];

function copyAars(projectRoot, androidProjectPath) {
  const libsDir = path.join(androidProjectPath, 'app', 'libs');
  fs.mkdirSync(libsDir, { recursive: true });

  for (const aar of AAR_FILES) {
    const src = path.join(projectRoot, aar.source);
    const dst = path.join(libsDir, path.basename(aar.target));
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dst);
      console.log(`Copied wearable SDK: ${path.basename(aar.target)}`);
    } else {
      console.warn(`Wearable SDK not found: ${src}`);
    }
  }
}

module.exports = function withWearableAar(config) {
  // 1. Copy AAR/JAR files into android/app/libs
  config = withDangerousMod(config, [
    'android',
    async (config) => {
      const projectRoot = config.modRequest.projectRoot;
      const androidProjectPath = config.modRequest.platformProjectRoot;
      copyAars(projectRoot, androidProjectPath);
      return config;
    },
  ]);

  // 2. Add flatDir repository and dependencies
  config = withProjectBuildGradle(config, (config) => {
    if (!config.modResults.contents.includes('flatDir')) {
      config.modResults.contents = config.modResults.contents.replace(
        /allprojects\s*\{[\s\S]*?repositories\s*\{/,
        (match) => `${match}\n        flatDir { dirs "${config.android?.path ? '../../app/libs' : 'app/libs'}" }`
      );
    }
    return config;
  });

  config = withAndroidBuildGradle(config, (config) => {
    const dependenciesBlock = config.modResults.contents;
    if (!dependenciesBlock.includes('blesdk-v8')) {
      config.modResults.contents = config.modResults.contents.replace(
        /dependencies\s*\{/,
        `dependencies {\n    implementation(files(\"libs/blesdk-v8.aar\"))\n    implementation(files(\"libs/blesdk-v5.jar\"))\n    implementation(files(\"libs/blesdk-v4.jar\"))\n`
      );
    }
    return config;
  });

  return config;
};
