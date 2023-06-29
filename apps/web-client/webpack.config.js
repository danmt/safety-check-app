module.exports = {
  resolve: {
    fallback: {
      crypto: false,
      stream: false,
      util: false,
      assert: false,
      fs: false,
      process: false,
      path: false,
      zlib: false,
    },
  },
};
