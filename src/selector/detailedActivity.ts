import { filter, isNil } from 'lodash';

import { StravaModelState, DetailedActivityAttributes, SegmentEffortsMap, SegmentEffort, Activity, Segment, SegmentsMap, EffortsForActivitySegments } from '../type';

export const getDetailedActivityAttributes = (state: StravaModelState, activityId: number): DetailedActivityAttributes => {
  const activity: Activity = state.activities[activityId];
  const detailedActivity: DetailedActivityAttributes = state.detailedActivities[activityId];
  const fullActivity = Object.assign({}, activity, detailedActivity);
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

export const getEffortsForActivitySegments = (state: StravaModelState, activityId: number): EffortsForActivitySegments => {

  const effortsForActivitySegments: EffortsForActivitySegments = {};

  const segmentEfforts: SegmentEffortsMap = state.segmentEfforts;

  console.log('effortsForActivitySegments');
  console.log(state.segmentEfforts);

  // tslint:disable-next-line: forin
  for (const segmentEffortId in state.segmentEfforts) {
    console.log(segmentEffortId);
    if (state.segmentEfforts.hasOwnProperty(segmentEffortId)) {
      const segmentEffort = segmentEfforts[segmentEffortId];
      const segmentId = segmentEffort.segment.id;

      if (isNil(effortsForActivitySegments[segmentId]) || isNil(effortsForActivitySegments.hasOwnProperty(segmentId))) {
        effortsForActivitySegments[segmentId] = [];
      }

      const effortsForSegment = effortsForActivitySegments[segmentId];
      effortsForSegment.push(segmentEffort);
    }
  }

  console.log(effortsForActivitySegments);

  return effortsForActivitySegments;
};

// export const getSegment = (state: StravaModelState, segmentId: number): Segment => {
//   return state.segments[segmentId];
// };

export const getSegments = (state: StravaModelState): SegmentsMap => {
  return state.segments;
};