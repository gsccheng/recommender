import Promise from 'bluebird';
import fs from 'fs';
import JSONStream from 'JSONStream';
import es from 'event-stream';

import client from '../../db/elasticsearch/connect';
import { indexName as _index } from '../../db/elasticsearch/config';
import { users, subtopics } from '../../db/elasticsearch/mapping';

import subtopicData from '../data/subtopics.json';

export default function() {
	return Promise.resolve(mapTypes())
		.then(populateData)
}

function mapTypes() {
	return client.indices.putMapping(subtopics).then(() => {
		return client.indices.putMapping(users).then(() => {
			console.log('Objects mapped to Elasticsearch');
		}).catch(err => {
			throw new Error('Elasticsearch', err);
		})
	});
}

function populateData() {
	return populateSubtopics()
		.then(populateUsers)
		.then(res => {
			console.log('Listen and Subtopic data populated');
		}).catch(err => {
			console.log('Error in populating Listen and Subtopic data:', err);
			throw new Error(err);
		})
}

function populateSubtopics() {
	const bulkSubtopicsRequest = [];

	subtopicData.forEach(function(item) {
		const action = { index: { _index, _type: 'subtopics', _id: item.id } };
		const doc = {
			'subtopic_name': item.name,
      'subtopic_description': item.description
		};

		bulkSubtopicsRequest.push(action);
		bulkSubtopicsRequest.push(doc);
	})

	return client.bulk({ body: bulkSubtopicsRequest, timeout: '30m' });
}

function populateUsers(res) {
	const bulkUsersRequest = [];

 	return new Promise(function(resolve) {
	  const listenData = 'seed/data/listens.json',
	    stream = fs.createReadStream(listenData, {encoding: 'utf8'}),
	    parser = JSONStream.parse('*');

    parser.on('data', function(item) {
			const update = {
				"upsert": {
			    "user_listens": [item.subtopic]
				},
				"script": {
			    "inline": "ctx._source[\"user_listens\"].add(params.subtopic)",
			    "params": {
			      "subtopic": item.subtopic
			    }
			  }
			};

			const req = {
				index: _index,
				type: 'users',
				id: item.user,
				body: update
			}

			bulkUsersRequest.push(req);
		});

		parser.on('end', function() {
			resolve();
		})

    stream.pipe(parser);
	}).then(() => {
		return Promise.each(bulkUsersRequest, function(req) {
			return new Promise(function (resolve) {
				client.update(req, function(err, res) {
					resolve(res);
				});
			});
		})
	}).catch(err => {
		console.log('error in user population:', err);
		throw new Error(err);
	});
}
