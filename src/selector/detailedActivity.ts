import { filter } from 'lodash';

import { StravaModelState, DetailedActivityAttributes, SegmentEffortsMap, SegmentEffort } from '../type';

export const getDetailedActivityAttributes = (state: StravaModelState, activityId: number): DetailedActivityAttributes => {
    return state.detailedActivities[activityId];
};

// https://lodash.com/docs/4.17.15#filter
export const getSegmentEffortsForActivity = (state: StravaModelState, activityId: number): SegmentEffort[] => {

  const segmentEfforts: SegmentEffort[] = [];

  const segmentEffortsMap: SegmentEffortsMap = state.segmentEfforts;
  for (const segmentEffortId in segmentEffortsMap) {
    if (segmentEffortsMap.hasOwnProperty(segmentEffortId)) {
      const segmentEffort: SegmentEffort = segmentEffortsMap[segmentEffortId];
      segmentEfforts.push(segmentEffort);
    }
  }

  const segmentsInActivity = filter(segmentEfforts, (segmentEffort) => {
    return segmentEffort.activityId === activityId;
  });

  return segmentsInActivity;
};
