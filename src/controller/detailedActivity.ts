import axios from 'axios';
import { addDetailedActivityAttributes, addSegment, addSegmentEffort } from '../model';
import { DetailedActivity, DetailedActivityAttributes, SegmentEffort } from '../type';

const serverUrl = 'http://localhost:8000';

export const loadDetailedActivity = (activityId: number): any => {
  return (dispatch: any, getState: any): any => {
    const path = serverUrl + '/getDetailedActivity?activityId=' + activityId;
    axios.get(path)
      .then((response) => {
        const detailedActivity: DetailedActivity = response.data as DetailedActivity;
        // console.log(detailedActivity);

        const detailedActivityAttributes: DetailedActivityAttributes = {
          id: detailedActivity.id,
          mapPolyline: detailedActivity.mapPolyline,
          averageWatts: detailedActivity.averageWatts,
          averageTemp: detailedActivity.averageTemp,
        };
        dispatch(addDetailedActivityAttributes(activityId, detailedActivityAttributes));

        for (const segmentEffortWithSegment of detailedActivity.segmentEfforts) {
          const segmentEffort: SegmentEffort = {
            id: segmentEffortWithSegment.id,
            name: segmentEffortWithSegment.name,
            activityId,
            elapsedTime: segmentEffortWithSegment.elapsedTime,
            movingTime: segmentEffortWithSegment.movingTime,
            startDateLocal: segmentEffortWithSegment.startDateLocal,
            distance: segmentEffortWithSegment.distance,
            averageWatts: segmentEffortWithSegment.averageWatts,
            segmentId: segmentEffortWithSegment.id,
            prRank: segmentEffortWithSegment.prRank,
            achievements: segmentEffortWithSegment.achievements,
          };
          dispatch(addSegmentEffort(segmentEffortWithSegment.id, segmentEffort));
          dispatch(addSegment(segmentEffortWithSegment.segment.id, segmentEffortWithSegment.segment));
        }

      }).catch((err: Error) => {
        console.log(err);
      });
  };
};
