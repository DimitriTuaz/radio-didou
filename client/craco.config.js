module.exports = {
  plugins: [{ plugin: require('@semantic-ui-react/craco-less') }],
  webpack: {
    alias: {
      '../../theme.config': require('path').join(
        __dirname,
        '/src/semantic-ui-less/theme.config',
      ),
    },
  },
}

