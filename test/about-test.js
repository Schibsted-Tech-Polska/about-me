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
		}

		handler({}, res);

		assert.deepEqual(params, res.content);
	});

	it('should fill in missing static params with information from package.json', function() {
		var params = {url: 'http://example.com'};
		var handler = about(params);
		var res = { 
			content: '',
			json: function(resContent) {
				this.content = resContent;
			}
		}

		handler({}, res);

		assert.deepEqual({url: 'http://example.com', repo: 'github.com/Schibsted-Tech-Polska/about-me'}, res.content);
	});
});