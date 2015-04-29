'use strict';

var fs = require('fs');
var _ = require('underscore');
var request = require('request');

var packageJson = require(process.cwd() + '/package.json') || {};

function toHTMLDefinitionList(params) {
    var output = '<dl>';
    Object.keys(params).forEach(function(param) {
        output += '<dt>' + param + '</dt><dd>' + params[param] + '</dd>';
    });
    output += '</dl>';

    return output;
}

function createLink(href, title) {
    title = title || href;
    var tmpl = '<a href="%href">%title</a>';

    if(!href) {
        return '';
    }

    if(!href.match(/^http(s)*|^\/\//)) {
        href = '//' + href;
    }

    return tmpl
        .replace('%href', href)
        .replace('%title', title);
}

function about(configParams, registrationCallback) {
    registrationCallback = registrationCallback || request.post;
    configParams = configParams || {};

    var staticParams = {
        url: createLink(process.env.DEFAULT_HOST, packageJson.name),
        repo: packageJson.repository && createLink(packageJson.repository.url, packageJson.repository.type),
        logging: createLink(process.env.LOGGING),
        monitoring: createLink(process.env.MONITORING)
    };

    var staticParamsWithValues = _.pick(staticParams, function (value) {
        return !!value;
    });

    var mergedParams = _.extend(staticParamsWithValues, configParams);

    return {
        json: function(req, res) {
            res.json(mergedParams);
        },
        html: function(req, res) {
            res.send(toHTMLDefinitionList(mergedParams));
        },
        register: function() {
            if(mergedParams.registry) {
                registrationCallback(mergedParams.registry, function(err, httpResponse, body) {
                    if(err) {
                        console.log('Error when registering service: ', err);
                    }
                });
            }
        }
    };
}

module.exports = about;
