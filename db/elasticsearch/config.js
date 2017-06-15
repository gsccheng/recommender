import ENV from '../../config';
let indexName;

switch(ENV) {
	case 'test':
		indexName = 'recommender-test';
		break;
	case 'development':
		indexName = 'recommender-dev';
		break;
	default:
		indexName = 'recommender-prod';
};

export { indexName };

const dbConfig = {
	development: {
	  requestTimeout: 1000*60*10,
	  host: 'localhost:9200'
	},
  test: {
	  requestTimeout: 1000*60*10,
  	host: 'localhost:9200'
  },
  staging: {
	  requestTimeout: 60*10,
   	host: 'elasticsearch:9200',
    apiVersion: '5.0'
  },
  production: {
	  requestTimeout: 60*10,
   	host: 'elasticsearch:9200',
  	apiVersion: '5.0'
  }
};

const db = dbConfig[ENV];

export default db;
