module.exports = {
  plugins: [
    { plugin: require('@semantic-ui-react/craco-less') },
    { plugin: require('@dvhb/craco-extend-scope'), options: { path: './../' } },
    { plugin: require('@dvhb/craco-extend-scope'), options: { path: './../common' } }
  ],
  webpack: {
    alias: {
      '../../theme.config': require('path').join(
        __dirname,
        '/src/semantic-ui-less/theme.config',
      ),
    },
  },
}
