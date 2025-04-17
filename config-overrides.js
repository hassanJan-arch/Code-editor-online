module.exports = function override(config, env) {
  // Add configuration to ignore source map warnings for monaco-editor
  config.ignoreWarnings = [
    {
      module: /monaco-editor/,
      message: /Failed to parse source map/,
    },
  ];
  
  return config;
}; 