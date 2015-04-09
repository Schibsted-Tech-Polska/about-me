/* jshint node:true */

'use strict';

var fs = require('fs');
var _ = require('underscore');
var request = require('request');

function about(packageJsonPath, configParams, registrationCallback) {
    registrationCallback = registrationCallback || request.post;
    var packageJson = packageJsonPath? JSON.parse(fs.readFileSync(packageJsonPath).toString()) : {};

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
        registrationCallback(mergedParams.registry);
    }

    return function (req, res) {
        res.json(mergedParams);
    };
}

module.exports = about;