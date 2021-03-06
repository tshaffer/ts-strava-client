/** @module Model:base */

import {
  combineReducers
} from 'redux';
import { StravaModelState } from '../type';

import activityStateReducer from './activityState';

// -----------------------------------------------------------------------
// Reducers
// -----------------------------------------------------------------------
export const rootReducer = combineReducers<StravaModelState>({
  activities: activityStateReducer,

});

// -----------------------------------------------------------------------
// Validators
// -----------------------------------------------------------------------

