import Promise from 'bluebird';

import createIndex from './createIndex';
import seedUsersAndSubtopics from './seedUsersAndSubtopics';

export default function() {
	return Promise.resolve(createIndex()).then(() => {
		return seedUsersAndSubtopics();
	});
}
