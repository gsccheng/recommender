// import Promise from 'bluebird';

import client from '../../db/elasticsearch/connect';
import { indexName as index } from '../../db/elasticsearch/config';

export default function() {
	// Will attempt to drop index even if non-existent
	return client.indices.delete({
		index,
	}).then(response => {
		console.log('Elasticsearch index dropped:', response);
	}).catch(err => {
		console.log('Error in dropping Elasticsearch Index', err);
		throw new Error(err);
	})
}
