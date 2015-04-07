/* jshint node:true */

'use strict'; 

var fs = require('fs');
var _ = require('underscore');

var packageJson = JSON.parse(fs.readFileSync(__dirname + '/../package.json').toString());
var staticParams = {
    url: 'my_app', 
    repo: packageJson.repository.url
}
            

function about(configParams) {
    configParams = configParams || {};

    var mergedParams = _.extend(staticParams, configParams);

    return function(req, res) {
        res.json(mergedParams);
    }
}

module.exports = about;