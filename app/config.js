/**
 *  Create and export configuration variables
 * 
 */

// General containers for all the environments
var environments = {};

// Staging (default) environment
environments.staging = {
    'httpPort': 3000,
    'httpsPort': 3001,
    'envName':'staging'
};

// Production environment
environments.production = {
    'httpPort': 5000,
    'httpsPort': 5001,
    'envName':'production'
};

// Determine which environment was passes as a commandline argument
var currentEnv = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() :'';

// Validating current environment that it is one of the environments above, if not, default to staging
var environmentToExport = typeof(environments[currentEnv])=='object'?environments[currentEnv] : environments.staging;

// Exporting the module

module.exports = environmentToExport;
