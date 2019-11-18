import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { ActivitiesState, Activity } from '../type';
import { getActivities } from '../selector';

import * as Converters from '../utilities/converters';

export interface ActivitiesProps {
  activities: ActivitiesState;
}

class Activities extends React.Component<ActivitiesProps> {

  buildSummaryActivityRow(activity: Activity): any {

    let calories = '';
    if (activity.kilojoules) {
      calories = activity.kilojoules.toFixed(0);
    }

    return (
      <tr key={activity.id}>
        <td>
          {Converters.getDateTime(activity.startDateLocal)}
        </td>
        <td>
          {activity.name}
        </td>
        <td>
          {Converters.getMovingTime(activity.movingTime)}
        </td>
        <td>
          {Converters.metersToMiles(activity.distance).toFixed(1)} mi
        </td>
        <td>
          {Converters.metersToFeet(activity.totalElevationGain).toFixed(0)} ft
        </td>
        <td>
          {Converters.metersPerSecondToMilesPerHour(activity.averageSpeed).toFixed(1)} mph
        </td>
        <td>
          {calories}
        </td>
      </tr>
    );
  }

  buildActivityRows(): any[] {

    const activities: Activity[] = [];

    const activitiesLUT = this.props.activities.activities;

    for (const activityId in activitiesLUT) {
      if (activitiesLUT.hasOwnProperty(activityId)) {
        const activity = activitiesLUT[activityId];
        activities.push(activity);
      }
    }

    // sort by start_date
    activities.sort((a, b) => {

      const asd = new Date(a.startDateLocal).getTime();
      const bsd = new Date(b.startDateLocal).getTime();

      if (asd > bsd) {
        return -1;
      }
      if (asd < bsd) {
        return 1;
      }
      return 0;
    });

    const self = this;
    const activityRows = activities.map((activity) => {
      const activityRow = self.buildSummaryActivityRow(activity);
      return activityRow;
    });
    return activityRows;

  }

  render() {

    console.log(Object.keys(this.props.activities).length);

    if (Object.keys(this.props.activities).length > 0) {

      const activityRows = this.buildActivityRows();

      return (
        <div id='SummaryActivities'>
          <br/>
          <table id='activitiesTable'>
            <thead>
              <tr>
                <th>Date</th>
                <th>Name</th>
                <th>Riding Time</th>
                <th>Distance</th>
                <th>Elevation</th>
                <th>Average Speed</th>
                <th>Calories</th>
              </tr>
            </thead>
            <tbody>
              {activityRows}
            </tbody>
          </table>
        </div>
      );
      }
    return (
      <div>
        Loading...
      </div>
    );
  }
}

function mapStateToProps(state: any) {
  return {
    activities: getActivities(state),
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Activities);
