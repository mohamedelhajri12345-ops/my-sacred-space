const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');
const config = getDefaultConfig(__dirname);
const repoRoot = path.resolve(__dirname, '..');
config.watchFolders = [repoRoot];
config.resolver = {
  ...config.resolver,
  unstable_enablePackageExports: true
};
module.exports = config;
