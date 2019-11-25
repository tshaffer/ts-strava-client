import { cloneDeep } from 'lodash';
import { SegmentEffort, SegmentEffortsMap } from '../type';
import { StravaModelBaseAction, SegmentEffortAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------
export const ADD_SEGMENT_EFFORT = 'ADD_SEGMENT_EFFORT';

// ------------------------------------
// Actions
// ------------------------------------

export type PartialSegmentEffortDescription = Partial<SegmentEffort>;

export interface AddSegmentEffortPayload {
  segmentEffortId: number;
  segmentEffort: SegmentEffort;
}

export const addSegmentEffort = (
  segmentEffortId: number,
  segmentEffort: SegmentEffort
): SegmentEffortAction<AddSegmentEffortPayload> => {

  return {
    type: ADD_SEGMENT_EFFORT,
    payload: {
      segmentEffortId,
      segmentEffort,
    },
  };
};

// ------------------------------------
// Reducer
// ------------------------------------

const initialState: SegmentEffortsMap = {};

export const segmentEffortReducer = (
  state: SegmentEffortsMap = initialState,
  action: StravaModelBaseAction<PartialSegmentEffortDescription & AddSegmentEffortPayload>
): SegmentEffortsMap => {
  switch (action.type) {
    case ADD_SEGMENT_EFFORT: {
      const newState = cloneDeep(state);
      const { segmentEffortId, segmentEffort } = action.payload;
      newState[segmentEffortId] = segmentEffort;
      return newState;
    }
    default:
      return state;
  }
};

