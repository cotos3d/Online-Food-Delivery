const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

config.resolver.alias = {
  ...config.resolver.alias,
  "react-native-sqlite-storage": "react-native-sqlite-2",
};

module.exports = config;
