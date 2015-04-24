'use strict';

var fs = require('fs');
var _ = require('underscore');
var request = require('request');

function readPackageJson() {
    try {
        return JSON.parse(fs.readFileSync(process.cwd() + '/package.json').toString());
    }
    catch(e) {
        return {};
    }
}

function about(configParams, registrationCallback) {
    registrationCallback = registrationCallback || request.post;
    var packageJson = readPackageJson();
    
    var staticParams = {
        url: process.env.DEFAULT_HOST,
        repo: packageJson && packageJson.repository && packageJson.repository.url,
        logging: process.env.LOGGING,
        monitoring: process.env.MONITORING
    };

    var staticParamsWithValues = _.pick(staticParams, function (value) {
        return !!value;
    });

    configParams = configParams || {};

    var mergedParams = _.extend(staticParamsWithValues, configParams);

    if(mergedParams.registry) {
        registrationCallback(mergedParams.registry, function(err, httpResponse, body) {
            if(err) {
                console.log('Error when registering service: ', err);
            }
        });
    }

    return function (req, res) {
        res.json(mergedParams);
    };
}

module.exports = about;
