const application = require('@loopback/dist-util').loadDist(__dirname);

// Remove this (and all `options`s) when LB implements env options
const options = require('./options');

module.exports = application;

if (require.main === module) {
  // Run the application
  application.main(options).catch(err => {
    console.error('Cannot start the application.', err);
    process.exit(1);
  });
}
