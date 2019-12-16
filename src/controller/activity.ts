import axios from 'axios';
import { addActivity } from '../model/activity';
import { StravatronSummaryActivity } from '../type';

const serverUrl = 'http://localhost:8000';
const apiUrlFragment = '/api/v1/';

export const loadSummaryActivities = (): any => {
  return (dispatch: any, getState: any): any => {
    const path = serverUrl + apiUrlFragment + '/activities';
    axios.get(path)
      .then((response) => {
        const summaryActivities: StravatronSummaryActivity[] = response.data as StravatronSummaryActivity[];
        console.log(summaryActivities);

        for (const activity of summaryActivities) {
          dispatch(addActivity(activity.id.toString(), activity));
        }
      }).catch((err: Error) => {
        console.log(err);
      });
  };
};
