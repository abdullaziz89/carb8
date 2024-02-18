module.exports = function(api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "@babel/plugin-proposal-export-namespace-from",
      "react-native-reanimated/plugin",
      require.resolve("expo-router/babel"),
      [
        "i18next-extract",
        {
          locales: ["en"],
          outputPath: "config/lang/{{ns}}.json",
          keyAsDefaultValue: ["en"],
          keySeparator: null,
          nsSeparator: null,
        },
      ],
    ]
  };
};
