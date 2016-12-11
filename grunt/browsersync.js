module.exports = {
  dev: {
    bsFiles: {
      src : [
        '<%= dirs.output %>/*.js'
      ]
    },
    options: {
      watchTask: true,
      server: './'
    }
  }
};
