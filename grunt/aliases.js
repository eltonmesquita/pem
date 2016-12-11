module.exports = {
  'default': {
    description: 'Starts Browsersync server.',
    tasks: ['browserSync', 'watch'],
  },
  'build': {
    description: 'Build all the files.',
    tasks: [
      'browserify',
      'uglify'
    ]
  }
};
