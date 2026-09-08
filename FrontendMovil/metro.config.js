const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Asegura que Metro resuelva archivos .jsx (screens, components, contexts)
if (!config.resolver.sourceExts.includes('jsx')) {
  config.resolver.sourceExts.push('jsx');
}

module.exports = config;
