import { getSubtopicRecommendations } from '../helpers/recommendationHelpers';

export default function getRecommendations(req, res) {
  return getSubtopicRecommendations(req, res);
}
