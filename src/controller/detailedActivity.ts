import axios from 'axios';
// import { DetailedActivity } from '../type';
import { addDetailedActivity } from '../model';

const serverUrl = 'http://localhost:8000';

export const loadDetailedActivity = (activityId: string): any => {
  return (dispatch: any, getState: any): any => {
    const path = serverUrl + '/getDetailedActivity?activityId=' + activityId;
    axios.get(path)
      .then((response) => {
        const detailedActivity: any = response.data as any;
        console.log(detailedActivity);

        dispatch(addDetailedActivity(activityId, detailedActivity));
      }).catch((err: Error) => {
        console.log(err);
      });
  };
};
