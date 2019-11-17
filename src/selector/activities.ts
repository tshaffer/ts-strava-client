import { StravaModelState, ActivitiesState } from '../type';

export const getActivities = (state: StravaModelState): ActivitiesState => {
  return state.activities;
};

