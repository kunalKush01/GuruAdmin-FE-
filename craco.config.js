const path = require("path");
const webpack = require("webpack");

module.exports = {
  reactScriptsVersion: "react-scripts",

  babel: {
    plugins:
      process.env.NODE_ENV !== "development"
        ? ["babel-plugin-transform-remove-console"]
        : [],
  },

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
      "react/jsx-runtime": require.resolve("react/jsx-runtime"),
    },

    configure: (webpackConfig) => {
      // ✅ Log Webpack version
      console.log("⚙️  Using Webpack version:", webpack.version);

      // ✅ Enable persistent filesystem caching
      webpackConfig.cache = {
        type: "filesystem",
        buildDependencies: {
          config: [__filename],
        },
      };

      // ✅ Drop console.logs in production
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
