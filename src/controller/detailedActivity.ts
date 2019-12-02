import axios from 'axios';
import { addDetailedActivityAttributes, addSegment, addSegmentEffort } from '../model';
import { DetailedActivity, DetailedActivityAttributes, SegmentEffort, DetailedActivityData } from '../type';

const serverUrl = 'http://localhost:8000';

export const loadDetailedActivity = (activityId: number): any => {
  return (dispatch: any, getState: any): any => {
    const path = serverUrl + '/getDetailedActivity?activityId=' + activityId;
    axios.get(path)
      .then((response) => {
        const detailedActivityData: DetailedActivityData = response.data as DetailedActivityData;
        const { detailedActivityAttributes, detailedSegments, locationData, segmentEfforts, segmentEffortsInActivity, segments } = detailedActivityData;

        // const detailedActivity: DetailedActivity = response.data as DetailedActivity;

        // TEDTODO - not sure of the following...
        // const detailedActivityAttributes: DetailedActivityAttributes = {
        //   id: detailedActivity.id,
        //   // mapPolyline: detailedActivity.mapPolyline,
        //   averageWatts: detailedActivity.averageWatts,
        //   // averageTemp: detailedActivity.averageTemp,
        // };
        dispatch(addDetailedActivityAttributes(activityId, detailedActivityAttributes));

        for (const detailedSegment of detailedSegments) {
          dispatch(addSegment(detailedSegment.id, detailedSegment));
        }
        
        for (const segmentEffort of segmentEfforts) {
          // const segmentEffort: SegmentEffort = {
          //   id: segmentEffortWithSegment.id,
          //   name: segmentEffortWithSegment.name,
          //   activityId,
          //   elapsedTime: segmentEffortWithSegment.elapsedTime,
          //   movingTime: segmentEffortWithSegment.movingTime,
          //   startDateLocal: segmentEffortWithSegment.startDateLocal,
          //   distance: segmentEffortWithSegment.distance,
          //   averageWatts: segmentEffortWithSegment.averageWatts,
          //   segmentId: segmentEffortWithSegment.id,
          //   prRank: segmentEffortWithSegment.prRank,
          //   achievements: segmentEffortWithSegment.achievements,
          // };
          dispatch(addSegmentEffort(segmentEffort.id, segmentEffort));
          // dispatch(addSegmentEffort(activityId, segmentEffort));
          // dispatch(addSegment(segmentEffort.segment.id, segmentEffort.segment));
        }

        for (const segmentEffortInActivity of segmentEffortsInActivity) {
          dispatch(addSegmentEffort(segmentEffortInActivity.id, segmentEffortInActivity));
        }

        console.log('done');
        return;
      }).catch((err: Error) => {
        console.log(err);
      });
  };
};
