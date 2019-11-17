import { combineReducers } from 'redux';

import { ActivitiesState } from '../type';

import { activityReducer } from './activity';

export default combineReducers<ActivitiesState>({
  activities: activityReducer
});
