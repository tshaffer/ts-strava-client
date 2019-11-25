import { cloneDeep } from 'lodash';
import { Segment, SegmentsMap } from '../type';
import { StravaModelBaseAction, SegmentAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------
export const ADD_SEGMENT = 'ADD_SEGMENT';

// ------------------------------------
// Actions
// ------------------------------------

export type PartialSegmentDescription = Partial<Segment>;

export interface AddSegmentPayload {
  segmentId: number;
  segment: Segment;
}

export const addSegment = (
  segmentId: number,
  segment: Segment
): SegmentAction<AddSegmentPayload> => {

  return {
    type: ADD_SEGMENT,
    payload: {
      segmentId,
      segment,
    },
  };
};

// ------------------------------------
// Reducer
// ------------------------------------

const initialState: SegmentsMap = {};

export const segmentReducer = (
  state: SegmentsMap = initialState,
  action: StravaModelBaseAction<PartialSegmentDescription & AddSegmentPayload>
): SegmentsMap => {
  switch (action.type) {
    case ADD_SEGMENT: {
      const newState = cloneDeep(state);
      const { segmentId, segment } = action.payload;
      newState[segmentId] = segment;
      return newState;
    }
    default:
      return state;
  }
};

