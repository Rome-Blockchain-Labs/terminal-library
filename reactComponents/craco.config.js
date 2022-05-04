// @typescript-eslint/no-var-requires
const { addBeforeLoader, loaderByName } = require('@craco/craco');
// const MomentLocalesPlugin = require('moment-locales-webpack-plugin');

module.exports = {
  plugins: [
    {
      plugin: {
        overrideWebpackConfig: ({ webpackConfig }) => {
          // remove CaseSensitivePathsPlugin (replace with tsconfig setting or eslint setting)
          webpackConfig.plugins = webpackConfig.plugins.filter(
            (plugin) => plugin.constructor.name !== 'CaseSensitivePathsPlugin'
          );

          // remove IgnorePlugin
          webpackConfig.plugins = webpackConfig.plugins.filter(
            (plugin) => plugin.constructor.name !== 'IgnorePlugin'
          );
          // add new ContextReplacementPlugin via moment-locales-webpack-plugin
          // webpackConfig.plugins.push(new MomentLocalesPlugin()); // exclude all locales except en

          // const smp = new SpeedMeasurePlugin({
          //   loaderTopFiles: 5,
          //   outputFormat: 'humanVerbose',
          // });

          return webpackConfig;

          // return smp.wrap(webpackConfig);
        },
      },
    },
  ],
  webpack: {
    configure: (config) => {
      const yamlLoader = {
        test: /\.ya?ml$/,
        type: 'json',
        use: 'yaml-loader',
      };

      addBeforeLoader(config, loaderByName('file-loader'), yamlLoader);

      return config;
    },
  },
};
