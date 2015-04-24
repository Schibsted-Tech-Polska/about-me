/* global describe, it, beforeEach, afterEach */

'use strict';

var assert = require('assert');
var about = require('../lib/about');

describe('About me', function() {
    var res;

    beforeEach(function(){
        res = {
            content: '',
            json: function(resContent) {
                this.content = resContent;
            },
            send: function(resContent) {
                this.content = resContent;
            }
        };
    });

    it('should expose explicit info params', function() {
		var params = {url: 'http://example.com', repo: 'github.com/Schibsted-Tech-Polska/about-me'};
		var handler = about(params).json;

		handler({}, res);

		assert.deepEqual(res.content, params);
	});

    it('shoudl be able to render response as HTML', function() {
		var params = {url: 'http://example.com', repo: 'github.com/Schibsted-Tech-Polska/about-me'};
		var handler = about(params).html;
        var urlHTML = '<dt>url</dt><dd>http://example.com</dd>';
        var repoHTML = '<dt>repo</dt><dd>github.com/Schibsted-Tech-Polska/about-me</dd>';
        var wrapHTML = '<dl></dl>';

		handler({}, res);

        assert.ok(res.content.indexOf(urlHTML) > -1);
        assert.ok(res.content.indexOf(urlHTML) > -1);

		assert.deepEqual(res.content.length, urlHTML.length + repoHTML.length + wrapHTML.length);
    });

	it('should fill in missing static params with information from package.json', function() {
		var params = {url: 'http://example.com'};
		var handler = about(params).json;

		handler({}, res);

		assert.deepEqual(res.content, {url: 'http://example.com', repo: 'github.com/Schibsted-Tech-Polska/about-me'});
	});

	it('should use env variables to read env specific params', function() {
		process.env.DEFAULT_HOST = 'http://example.com';
		process.env.LOGGING = 'http://logging.com';
		process.env.MONITORING = 'http://monitoring.com';
        var handler = about().json;

		handler({}, res);

		assert.deepEqual(res.content, {url: 'http://example.com',
						  repo: 'github.com/Schibsted-Tech-Polska/about-me',
						  logging: 'http://logging.com',
						  monitoring: 'http://monitoring.com'});
	});

    it('should register itself in humane registry at init time with POST hook', function(done) {
        var params = {url: 'http://example.com', registry: 'http://registry.com?url=http%3A%2F%2Fexample.com'};
        var handler = about(params, function(hookUrl) {
            assert.deepEqual(hookUrl, 'http://registry.com?url=http%3A%2F%2Fexample.com');
            done();
        }).json;

        handler({}, res);
    });
});
