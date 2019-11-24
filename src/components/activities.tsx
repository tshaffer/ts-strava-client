import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { hashHistory } from 'react-router';

// import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { ActivitiesMap, Activity } from '../type';
import { getActivities } from '../selector';

import * as Converters from '../utilities/converters';

export interface ActivitiesProps {
  activities: ActivitiesMap;
}

class Activities extends React.Component<ActivitiesProps> {

  constructor(props: ActivitiesProps) {
    super(props);

    this.handleShowDetailedMap = this.handleShowDetailedMap.bind(this);
  }

  handleShowDetailedMap(activityId: number) {
    console.log('handleShowDetailedMap: ', activityId);
    hashHistory.push('/detailedActivity/' + activityId.toString());
  }

  buildSummaryActivityRow(activity: Activity): any {

    const self = this;

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
        <td>
          <button onClick={() => self.handleShowDetailedMap(activity.id)}>Show details</button>
        </td>
      </tr>
    );
  }

  buildActivityRows(): any[] {

    const activities: Activity[] = [];

    const activitiesLUT = this.props.activities;

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
                <th/>
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
