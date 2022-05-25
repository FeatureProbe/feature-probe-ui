module.exports = {
  plugins: [{ plugin: require('@semantic-ui-react/craco-less') }],
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      return webpackConfig
    }
  }
}