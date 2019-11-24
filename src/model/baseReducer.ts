/** @module Model:base */

import {
  combineReducers
} from 'redux';
import { StravaModelState } from '../type';

import { activityReducer } from './activity';

// -----------------------------------------------------------------------
// Reducers
// -----------------------------------------------------------------------
export const rootReducer = combineReducers<StravaModelState>({
  activities: activityReducer,

});

// -----------------------------------------------------------------------
// Validators
// -----------------------------------------------------------------------

