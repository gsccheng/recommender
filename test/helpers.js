import Promise from 'bluebird';

import drop from '../seed/drop/dropAll';
import seed from '../seed/populate/seedAll';

export function resetDB() {
	return Promise.resolve(drop())
		.then(seed)
		.then(() => {
			console.log('Elasticsearch database reset.');
		}).catch(err => {
			console.log('Error in Elasticsearch database reset');
			throw new Error(err)
		});
}
