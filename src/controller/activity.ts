import axios from 'axios';
import { addActivity } from '../model/activity';
import { Activity } from '../type';

const serverUrl = 'http://localhost:8000';

export const loadSummaryActivities = (): any => {
  return (dispatch: any, getState: any): any => {
    const path = serverUrl + '/getActivities';
    axios.get(path)
      .then((response) => {
        const summaryActivities: Activity[] = response.data as Activity[];
        console.log(summaryActivities);

        for (const activity of summaryActivities) {
          dispatch(addActivity(activity.id.toString(), activity));
        }
      }).catch((err: Error) => {
        console.log(err);
      });
  };
};
