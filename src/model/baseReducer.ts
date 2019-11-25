/** @module Model:base */

import {
  combineReducers
} from 'redux';
import { StravaModelState } from '../type';

import { activityReducer } from './activity';
import { detailedActivityReducer } from './detailedActivity';
import { segmentEffortReducer } from './segmentEffort';
import { segmentReducer } from './segment';

// -----------------------------------------------------------------------
// Reducers
// -----------------------------------------------------------------------
export const rootReducer = combineReducers<StravaModelState>({
  activities: activityReducer,
  detailedActivities: detailedActivityReducer,
  segmentEfforts: segmentEffortReducer,
  segments: segmentReducer,
});

// -----------------------------------------------------------------------
// Validators
// -----------------------------------------------------------------------

