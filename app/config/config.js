/*
 * Server configuration
 */
var fs = require('fs');

module.exports = {

  // Configartion settings
  environments: {
    'staging': {
      'httpPort': 3000,
      'httpsPort': 3001,
      'envName': 'staging',
      'serverOptions': {}
    },
    'production': {
      'httpPort': 5000,
      'httpsPort': 5001,
      'envName': 'production',
      'serverOptions': {}
    }
  },

  setServerOptions: function(environment) {

    environment.serverOptions = {
      'key': fs.readFileSync('./config/certificates/key.pem'),
      'cert': fs.readFileSync('./config/certificates/cert.pem')
    };

  },

  set: function() {

    var that = this;
    return new Promise(function(resolve, reject) {
      try {
        // Determine exported environment
        var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';
        // Check defined environments
        var environmentToExport = typeof(that.environments[currentEnvironment]) == 'object' ? that.environments[currentEnvironment] : that.environments.staging;

        that.setServerOptions(environmentToExport);

        resolve(environmentToExport);
      } catch (error) {
        reject(error);
      }
    });


  }

};
