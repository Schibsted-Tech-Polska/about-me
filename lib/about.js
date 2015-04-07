/* jshint node:true */

'use strict';

var fs = require('fs');
var _ = require('underscore');

function about(packageJsonPath, configParams) {
    var packageJson = packageJsonPath? JSON.parse(fs.readFileSync(packageJsonPath).toString()) : {};

    var staticParams = {
        url: process.env.DEFAULT_HOST,
        repo: packageJson && packageJson.repository && packageJson.repository.url,
        env: process.env.NODE_ENV,
        logging: process.env.LOGGING,
        monitoring: process.env.MONITORING
    };

    var staticParamsWithValues = _.pick(staticParams, function (value) {
        return !!value;
    });

    configParams = configParams || {};

    var mergedParams = _.extend(staticParamsWithValues, configParams);

    return function (req, res) {
        res.json(mergedParams);
    };
}

module.exports = about;