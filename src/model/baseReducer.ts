/** @module Model:base */

import {
  combineReducers
} from 'redux';
import { StravaModelState } from '../type';

import { activityReducer } from './activity';
import { detailedActivityReducer } from './detailedActivity';

// -----------------------------------------------------------------------
// Reducers
// -----------------------------------------------------------------------
export const rootReducer = combineReducers<StravaModelState>({
  activities: activityReducer,
  detailedActivities: detailedActivityReducer,
});

// -----------------------------------------------------------------------
// Validators
// -----------------------------------------------------------------------

