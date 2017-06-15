import Promise from 'bluebird';

import drop from './drop/dropAll';
import seed from './populate/seedAll';

Promise.resolve(drop())
	.then(seed)
	.then(() => {
		console.log('Elasticsearch database reset.');
	}).catch(err => {
		console.log('Error in Elasticsearch database reset');
		throw new Error(err)
	});
