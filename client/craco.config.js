const path = require("path");

module.exports = {
  plugins: [
    { plugin: require('@semantic-ui-react/craco-less') },
    { plugin: require('@dvhb/craco-extend-scope'), options: { path: './../' } }
  ],
  babel: {
    plugins: [
      ["@babel/plugin-proposal-decorators", { legacy: true }],
      ["@babel/plugin-proposal-class-properties", { loose: true }]
    ]

  },
  webpack: {
    alias: {
      '../../theme.config': require('path').join(__dirname, '/src/semantic-ui-less/theme.config'),
      '@openapi': path.resolve(__dirname, '../openapi/dist/'),
    }
  },
}

