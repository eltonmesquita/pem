module.exports = {
  dist: {
    files: {
      '<%= dirs.output %>/pem.js': ['src/js/pem.js']
    }
  },
  options: {
    transform: ['babelify']
  }
};
