module.exports = {
  options: {
    livereload: true,
  },
  js: {
    files: ['src/js/**/**.js'],
    tasks: ['browserify']
  },
  gruntfile: {
    files: ['Gruntfile.js'],
    tasks: ['build']
  }
};
