module.exports = {
  options: {
    mangle: true
  },
  dist: {
    files: {
        '<%= dirs.output %>/pem.min.js': ['<%= dirs.output %>/pem.js']
    }
  }
};
