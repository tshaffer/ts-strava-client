import axios from 'axios';
import { addDetailedActivityAttributes, addSegment, addSegmentEffort } from '../model';
import { 
  StravatronDetailedActivityData 
} from '../type';

const serverUrl = 'http://localhost:8000';

export const loadDetailedActivity = (activityId: number): any => {
  return (dispatch: any, getState: any): any => {
    const path = serverUrl + '/getDetailedActivity?activityId=' + activityId;
    axios.get(path)
      .then((response) => {

        const detailedActivityData: StravatronDetailedActivityData = response.data as StravatronDetailedActivityData;

        const { detailedActivityAttributes, segments, allSegmentEffortsForSegmentsInActivity } = detailedActivityData;
      
        dispatch(addDetailedActivityAttributes(activityId, detailedActivityAttributes));

        for (const detailedSegment of segments) {
          dispatch(addSegment(detailedSegment.id, detailedSegment));
        }

        for (const segmentEffortInActivity of allSegmentEffortsForSegmentsInActivity) {
          dispatch(addSegmentEffort(segmentEffortInActivity.id, segmentEffortInActivity));
        }

        console.log('done');
        return;
      }).catch((err: Error) => {
        console.log(err);
      });
  };
};
