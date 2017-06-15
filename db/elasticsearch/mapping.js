import { indexName } from './config';

export const users = {
  index: indexName,
  type: 'users',
  body: {
  	properties: {
  		'user_listens': {
        type: 'keyword'
      }
  	}
  }
}

export const subtopics = {
  index: indexName,
  type: 'subtopics',
  body: {
    properties: {
      'subtopic_name': {
        'type': 'string'
      },
      'subtopicdescription': {
        'type': 'string'
      }
    }
  }
};
