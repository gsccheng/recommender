import elasticsearch from 'elasticsearch';
import dbConfig from './config';

const client = new elasticsearch.Client(dbConfig)

export default client;
