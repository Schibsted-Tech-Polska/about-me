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

    it('should be able to create links', function() {
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

		assert.deepEqual(res.content, {url: 'http://example.com', repo: '<a href="//github.com/Schibsted-Tech-Polska/about-me">git</a>'});
	});

	it('should use env variables to read env specific params', function() {
		process.env.DEFAULT_HOST = 'http://example.com';
		process.env.LOGGING = 'http://logging.com';
		process.env.MONITORING = 'http://monitoring.com';
        var handler = about().json;

		handler({}, res);

		assert.deepEqual(res.content, {url: '<a href="http://example.com">about-me</a>',
						  repo: '<a href="//github.com/Schibsted-Tech-Polska/about-me">git</a>',
                          logging: '<a href="http://logging.com">http://logging.com</a>',
						  monitoring: '<a href="http://monitoring.com">http://monitoring.com</a>'});
	});

    it('should fix link in case of absent protocol', function() {
		process.env.DEFAULT_HOST = 'example.com';
		process.env.LOGGING = '//logging.com';
        var handler = about().json;

        handler({}, res);

        assert.equal(res.content.url, '<a href="//example.com">about-me</a>');
        assert.equal(res.content.logging, '<a href="//logging.com">//logging.com</a>');
    });

    it('should expose a method to register itself in humane registry', function(done) {
        var params = {url: 'http://example.com', registry: 'http://registry.com?url=http%3A%2F%2Fexample.com'};
        var register = about(params, function(hookUrl) {
            assert.deepEqual(hookUrl, 'http://registry.com?url=http%3A%2F%2Fexample.com');
            done();
        }).register;

        register();
    });
});
