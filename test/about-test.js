/* jshint node:true, quotmark:false */
/* global describe, it, beforeEach, afterEach */

'use strict';

var assert = require('assert');
var about = require('../lib/about');

describe('About me', function() {
	it('should expose explicit info params', function() {
		var params = {url: 'http://example.com', repo: 'github.com/Schibsted-Tech-Polska/about-me'};
		var handler = about(params);
		var res = { 
			content: '',
			json: function(resContent) {
				this.content = resContent;
			}
		};

		handler({}, res);

		assert.deepEqual(res.content, params);
	});

	it('should fill in missing static params with information from package.json', function() {
		var params = {url: 'http://example.com'};
		var handler = about(params);
		var res = { 
			content: '',
			json: function(resContent) {
				this.content = resContent;
			}
		};

		handler({}, res);

		assert.deepEqual(res.content, {url: 'http://example.com', repo: 'github.com/Schibsted-Tech-Polska/about-me'});
	});

	it('should use env variables to read env specific params', function() {
		process.env.DEFAULT_HOST = 'http://example.com';
		process.env.NODE_ENV = 'production';
		process.env.LOGGING = 'http://logging.com';
		process.env.MONITORING = 'http://monitoring.com';
        var handler = about();

		var res = { 
			content: '',
			json: function(resContent) {
				this.content = resContent;
			}
		};

		handler({}, res);

		assert.deepEqual(res.content, {url: 'http://example.com',
						  repo: 'github.com/Schibsted-Tech-Polska/about-me',
						  env: 'production',
						  logging: 'http://logging.com',
						  monitoring: 'http://monitoring.com'});
	});
});