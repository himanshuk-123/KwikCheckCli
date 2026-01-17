const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration for React Native
 * Optimized for faster builds and reduced memory usage
 */
const config = {
  projectRoot: __dirname,
  
  // Optimize resolver
  resolver: {
    // Exclude large node_modules directories to speed up builds
    blockList: [
      /android\/.*\/build\//,
      /ios\/Pods\//,
    ],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
