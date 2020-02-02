const path = require("path");

module.exports = {
  plugins: [
    { plugin: require('@semantic-ui-react/craco-less') },
    { plugin: require('@dvhb/craco-extend-scope'), options: { path: './../' } },
    { plugin: require('@dvhb/craco-extend-scope'), options: { path: './../common' } }
  ],
  babel: {
    plugins: [
      ["@babel/plugin-proposal-decorators", { legacy: true }],
      ["@babel/plugin-proposal-class-properties", { loose: true }]
    ]
  },
  webpack: {
    alias: {
      '../../theme.config': require('path').join(
        __dirname,
        '/src/semantic-ui-less/theme.config',
      ),
    },
    resolve: {
      alias: {
        "@common": path.resolve(__dirname, "../common/"),
      }
    }
  },
}
