import { cloneDeep } from 'lodash';
import { DetailedActivity, DetailedActivitiesMap } from '../type';
import { StravaModelBaseAction, DetailedActivityAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------
export const ADD_DETAILED_ACTIVITY = 'ADD_DETAILED_ACTIVITY';

// ------------------------------------
// Actions
// ------------------------------------

export type PartialDetailedActivityDescription = Partial<DetailedActivity>;

export interface AddDetailedActivityPayload {
  detailedActivityId: string;
  detailedActivity: DetailedActivity;
}

export const addDetailedActivity = (
  detailedActivityId: string,
  detailedActivity: DetailedActivity
): DetailedActivityAction<AddDetailedActivityPayload> => {

  return {
    type: ADD_DETAILED_ACTIVITY,
    payload: {
      detailedActivityId,
      detailedActivity,
    },
  };
};

// ------------------------------------
// Reducer
// ------------------------------------

const initialState: DetailedActivitiesMap = {};

export const detailedActivityReducer = (
  state: DetailedActivitiesMap = initialState,
  action: StravaModelBaseAction<PartialDetailedActivityDescription & AddDetailedActivityPayload>
): DetailedActivitiesMap => {
  switch (action.type) {
    case ADD_DETAILED_ACTIVITY: {
      const newState = cloneDeep(state);
      const { detailedActivityId, detailedActivity } = action.payload;
      newState[detailedActivityId] = detailedActivity;
      return newState;
    }
    default:
      return state;
  }
};

