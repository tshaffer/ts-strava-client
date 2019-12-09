import { cloneDeep } from 'lodash';
import { 
  StravatronStreams, 
   
} from '../type';
import { StravaModelBaseAction, StreamsAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------
export const ADD_STREAMS = 'ADD_STREAMS';

// ------------------------------------
// Actions
// ------------------------------------

export interface AddStreamsPayload {
  streams: StravatronStreams;
}

export const addStreams = (
  streams: StravatronStreams
): StreamsAction<AddStreamsPayload> => {

  return {
    type: ADD_STREAMS,
    payload: {
      streams,
    },
  };
};

// ------------------------------------
// Reducer
// ------------------------------------

const initialState: StravatronStreams = {
  time: [],
  location: [],
  elevation: [],
  distance: [],
  gradient: [],
  cadence: [],
  heartrate: [],
  watts: [],
};

export const streamsReducer = (
  state: StravatronStreams = initialState,
  action: StravaModelBaseAction<StravatronStreams & AddStreamsPayload>
): StravatronStreams => {
  switch (action.type) {
    case ADD_STREAMS: {
      const newState = action.payload;
      return newState;
    }
    default:
      return state;
  }
};

