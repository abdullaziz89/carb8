module.exports = function(api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "react-native-reanimated/plugin",
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
