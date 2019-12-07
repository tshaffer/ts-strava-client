import { filter, isNil } from 'lodash';

import { StravaModelState, DetailedActivityAttributes, SegmentEffortsMap, SegmentEffort, Activity, Segment, SegmentsMap, StravatronSegmentEffort, StravatronSegmentEffortsBySegment, ActivitiesMap } from '../type';

export const getDetailedActivityAttributes = (state: StravaModelState, activityId: number): DetailedActivityAttributes => {
  const activity: Activity = state.activities[activityId];
  const detailedActivity: DetailedActivityAttributes = state.detailedActivities[activityId];
  const fullActivity = Object.assign({}, activity, detailedActivity);
  return fullActivity;
};

// https://lodash.com/docs/4.17.15#filter
export const getSegmentEffortsForActivity = (state: StravaModelState, activityId: number): StravatronSegmentEffort[] => {

  const segmentEfforts: StravatronSegmentEffort[] = [];

  // TEDTODO - investigate to find a better way to do this. shouldn't need to add all then filter out desired ones.
  const segmentEffortsMap: SegmentEffortsMap = state.segmentEfforts;
  for (const segmentEffortId in segmentEffortsMap) {
    if (segmentEffortsMap.hasOwnProperty(segmentEffortId)) {
      const segmentEffort: StravatronSegmentEffort = segmentEffortsMap[segmentEffortId];
      segmentEfforts.push(segmentEffort);
    }
  }

  const segmentsInActivity: StravatronSegmentEffort[] = filter(segmentEfforts, (segmentEffort) => {
    return segmentEffort.activityId === activityId;
  });

  return segmentsInActivity;
};

// for each segment in the activity corresponding to the activityId, retrieve a list of segment efforts
// return value should be a map
//    index is segmentId
//    value is array of segmentEfforts
// first pass, possibly brute force approach
//    initialize return object
//    iterate through state.segmentEfforts
//      if the activity id of the segment effort corresponds to the current activityId, add it to the map
//        if there are no entries corresponding to thei segment, add an empty array to the map
//        push segment effort onto array
export const getEffortsForActivitySegments = (state: StravaModelState, activityId: number): StravatronSegmentEffortsBySegment => {
  
  const allSegmentEffortsForSegmentsInActivity: StravatronSegmentEffortsBySegment = {};

  for (const segmentEffortId in state.segmentEfforts) {
    if (state.segmentEfforts.hasOwnProperty(segmentEffortId)) {
      const segmentEffort: StravatronSegmentEffort = state.segmentEfforts[segmentEffortId];
      const segmentId = segmentEffort.segment.id;
      if (segmentEffort.activityId === activityId) {
        if (!allSegmentEffortsForSegmentsInActivity.hasOwnProperty(segmentId)) {
          allSegmentEffortsForSegmentsInActivity[segmentId] = [];
        }
        allSegmentEffortsForSegmentsInActivity[segmentId].push(segmentEffort);
      }
    }
  }
  
  return allSegmentEffortsForSegmentsInActivity;
};

export const getSegments = (state: StravaModelState): SegmentsMap => {
  return state.segments;
};
