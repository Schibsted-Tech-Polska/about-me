/* jshint node:true */

'use strict'; 

var fs = require('fs');

var packageJson = JSON.parse(fs.readFileSync(__dirname + '/../package.json').toString());

function about(configParams) {
    return function(req, res) {
        if(configParams) {
            res.json(configParams);
        } else {
            res.json({
                url: 'my_app', 
                git: packageJson.repository.url
            });
        }
    }
}

module.exports = about;