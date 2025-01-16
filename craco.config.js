const path = require("path");

module.exports = {
  reactScriptsVersion: "react-scripts",
  style: {
    sass: {
      loaderOptions: {
        sassOptions: {
          includePaths: ["node_modules", "src/assets"],
        },
      },
    },
    postOptions: {
      plugins: [],
    },
  },
  webpack: {
    alias: {
      "@src": path.resolve(__dirname, "src"),
      "@assets": path.resolve(__dirname, "src/@core/assets"),
      "@components": path.resolve(__dirname, "src/@core/components"),
      "@layouts": path.resolve(__dirname, "src/@core/layouts"),
      "@store": path.resolve(__dirname, "src/redux"),
      "@styles": path.resolve(__dirname, "src/@core/scss"),
      "@configs": path.resolve(__dirname, "src/configs"),
      "@utils": path.resolve(__dirname, "src/utility/Utils"),
      "@hooks": path.resolve(__dirname, "src/utility/hooks"),
      // Remove this line to prevent issues with the jsx-runtime import
      // 'react/jsx-runtime': path.resolve(__dirname, 'node_modules/react/jsx-runtime'),
    },
    configure: (webpackConfig) => {
      if (!webpackConfig.resolve) webpackConfig.resolve = {};
      if (!webpackConfig.resolve.fallback) webpackConfig.resolve.fallback = {};

      if (process.env.NODE_ENV === "production") {
        const terserPlugin = webpackConfig.optimization.minimizer.find(
          (plugin) =>
            plugin.constructor && plugin.constructor.name === "TerserPlugin"
        );
        if (terserPlugin && terserPlugin.options.terserOptions) {
          terserPlugin.options.terserOptions.compress = {
            ...terserPlugin.options.terserOptions.compress,
            drop_console: true,
          };
        }
      }
      return webpackConfig;
    },
  },
};
