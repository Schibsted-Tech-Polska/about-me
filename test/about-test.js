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

		assert.equal(params, res.content);
	});
});