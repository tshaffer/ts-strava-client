import { filter } from 'lodash';

import { StravaModelState, DetailedActivityAttributes, SegmentEffortsMap, SegmentEffort, Activity, Segment, SegmentsMap } from '../type';

export const getDetailedActivityAttributes = (state: StravaModelState, activityId: number): DetailedActivityAttributes => {
  const activity: Activity = state.activities[activityId];
  const detailedActivity: DetailedActivityAttributes = state.detailedActivities[activityId];
  const fullActivity = Object.assign( {}, activity, detailedActivity);
  return fullActivity;
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

// export const getSegment = (state: StravaModelState, segmentId: number): Segment => {
//   return state.segments[segmentId];
// };

export const getSegments = (state: StravaModelState): SegmentsMap => {
  return state.segments;
};