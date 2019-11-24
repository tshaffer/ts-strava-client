import { StravaModelState, ActivitiesMap } from '../type';

export const getActivities = (state: StravaModelState): ActivitiesMap => {
  return state.activities;
};

