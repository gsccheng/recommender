import client from '../../db/elasticsearch/connect';
import { indexName as index } from '../../db/elasticsearch/config';
import { recommendations } from '../config';

export function getSubtopicRecommendations(req, res) {
  const subtopicId = req.query.subtopic;

  return aggregateSubtopics(subtopicId)
    .then(populateSubtopicInfo.bind(this, res));
}

function aggregateSubtopics(subtopicId) {
  return client.search({
    index,
    body: {
      query: {
        terms: {
          "user_listens": [subtopicId]
        }
      },
      aggregations: {
        recommended_subtopics: {
          significant_terms: {
            field: "user_listens",
            min_doc_count: 1
          }
        }
      }
    }
  }).then(results => {
    const topRecommendations = results.aggregations['recommended_subtopics'].buckets;
    console.log('results are', topRecommendations);
    const { NUM_TO_RETURN } = recommendations;

    const subtopicIds = topRecommendations.slice(0, NUM_TO_RETURN).map(function(subtopic) {
      return subtopic.key;
    });

    return subtopicIds;
  }).catch(err => {
    throw new Error(err);
  })
}

function populateSubtopicInfo(res, ids) {
  console.log('Subtopic ids to populate:', ids);
  return client.search({
    index,
    type: 'subtopics',
    body: {
      query: {
        "terms" : {
          "_id" : ids
        }
      }
    }
  }).then(results => {
    console.log('results in populateSubtopicInfo', results);
    const subtopics = results.hits.hits.map(function(subtopic) {
      return {
        id: subtopic._id,
        name: subtopic._source['subtopic_name'],
        description: subtopic._source['subtopic_description']
      }
    })
    console.log('Subtopic results are', results.hits.hits);
    res.json(subtopics);
  });
}
