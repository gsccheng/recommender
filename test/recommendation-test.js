import request from 'supertest';
// Use if prefer to start a separate test server
// var request = require('supertest');
// request = request('http://localhost:3000');

import app from '../app';

import dropDB from '../seed/drop/dropAll';
import seedDB from '../seed/populate/seedAll';
import { resetDB } from './helpers';
import { recommendations as config } from '../app/config';
import { testHost } from '../config';

before(function() {
	this.timeout(1000*60*30);
	return resetDB();
});

describe('/recommendations', function() {
 	it('should respond with recommendations no more than ' + config.NUM_TO_RETURN, function(done) {
		setTimeout(function() {
	    // request
	    request(app)
	    	.get('/recommendations')
	    	.query({ subtopic: '56bd5ef6ef80b60300ce21d1' })
	    	.expect(function(res) {
	    		if (res.body.length > config.NUM_TO_RETURN) {
	    			throw new Error('Too many recommendations returned');
	    		}
	    	})
      	.expect(200, done);
	  }, 1000);
  })
});
