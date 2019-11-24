import { StravaModelState, DetailedActivity } from '../type';

export const getDetailedActivity = (state: StravaModelState, activityId: string): DetailedActivity => {
    return state.detailedActivities[activityId];
}