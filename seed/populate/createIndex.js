import client from '../../db/elasticsearch/connect';
import { indexName as index } from '../../db/elasticsearch/config';

export default function () {
	return client.indices.create({ index })
		.then(() => {
			console.log('Index %s created', index);
		}).catch(err => {
			throw new Error(err);
		});
}
