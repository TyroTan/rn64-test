module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "react-native-reanimated/plugin",
      [
        "babel-plugin-root-import",
        {
          rootPathSuffix: "./",
          rootPathPrefix: "~/",
        },
      ],
      [
        "inline-dotenv",
        {
          path: "./.env", // See motdotla/dotenv for more options
        },
      ],
    ],
  };
};
