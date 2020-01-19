import { isNil } from 'lodash';

import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { hashHistory } from 'react-router';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton';

import { ActivitiesMap, StravatronSummaryActivity, StravatronActivity } from '../type';
import { getActivities } from '../selector';

import * as Converters from '../utilities/converters';
import { addActivity } from '../model';

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

  buildSummaryActivityRow(activity: StravatronActivity): any {

    const self = this;

    let kilojoules = '';
    if (activity.kilojoules) {
      kilojoules = activity.kilojoules.toFixed(0);
    }

    const normalizedPower = isNil(activity.normalizedPower) ? '' : activity.normalizedPower.toFixed(1);
    const tss = isNil(activity.trainingStressScore) ? '' : activity.trainingStressScore.toFixed(1);
    const averageWatts = isNil(activity.averageWatts) ? 0 : activity.averageWatts;

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
          {kilojoules}
        </td>
        <td>
          {normalizedPower}
        </td>
        <td>
          {tss}
        </td>
        <td>
          {averageWatts}
        </td>
        <td>
          {activity.maxWatts}
        </td>
        <td>
          {activity.averageHeartrate}
        </td>
        <td>
          {activity.maxHeartrate}
        </td>
        <td>
          <button onClick={() => self.handleShowDetailedMap(activity.id)}>Show details</button>
        </td>
      </tr>
    );
  }

  buildSummaryRow(activity: StravatronActivity): any {

    const self = this;

    let kilojoules = '';
    if (activity.kilojoules) {
      kilojoules = activity.kilojoules.toFixed(0);
    }

    const normalizedPower = isNil(activity.normalizedPower) ? '' : activity.normalizedPower.toFixed(1);
    const tss = isNil(activity.trainingStressScore) ? '' : activity.trainingStressScore.toFixed(1);
    const averageWatts = isNil(activity.averageWatts) ? 0 : activity.averageWatts;

    return (
      <TableRow key={activity.id}>
        <TableRowColumn style={{width: '64px'}}>
          {Converters.getDateTime(activity.startDateLocal)}
        </TableRowColumn>
        <TableRowColumn style={{width: '192px'}}>
          {activity.name}
        </TableRowColumn>
        <TableRowColumn style={{width: '64px'}}>
          {Converters.getMovingTime(activity.movingTime)}
        </TableRowColumn>
        <TableRowColumn style={{width: '64px'}}>
          {Converters.metersToMiles(activity.distance).toFixed(1)} mi
        </TableRowColumn>
        <TableRowColumn style={{width: '64px'}}>
          {Converters.metersToFeet(activity.totalElevationGain).toFixed(0)} ft
        </TableRowColumn>
        <TableRowColumn style={{width: '64px'}}>
          {kilojoules}
        </TableRowColumn>
        <TableRowColumn style={{width: '64px'}}>
          {normalizedPower}
        </TableRowColumn>
        <TableRowColumn style={{width: '64px'}}>
          {tss}
        </TableRowColumn>
        <TableRowColumn style={{width: '64px'}}>
          {averageWatts}
        </TableRowColumn>
        <TableRowColumn style={{width: '64px'}}>
          {activity.maxWatts}
        </TableRowColumn>
        <TableRowColumn style={{width: '64px'}}>
          {activity.averageHeartrate}
        </TableRowColumn>
        <TableRowColumn style={{width: '64px'}}>
          {activity.maxHeartrate}
        </TableRowColumn>
        <TableRowColumn style={{width: '64px'}}>
          <RaisedButton
            label='Show details'
            onClick={() => self.handleShowDetailedMap(activity.id)}
            style={{
              verticalAlign: 'top',
              marginTop: '4px'
            }}
          />
        </TableRowColumn>
        <TableRowColumn>
        </TableRowColumn>
      </TableRow>
    );
  }

  buildActivityRows(): any[] {

    const activities: StravatronSummaryActivity[] = [];

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
      const activityRow = self.buildSummaryRow(activity);
      return activityRow;
    });
    return activityRows;
  }

  render() {

    if (Object.keys(this.props.activities).length > 0) {

      const activityRows = this.buildActivityRows();

      return (
        <MuiThemeProvider>
          <div id='SummaryActivities'>
            <br />

            <Table style={{width: '1597px'}}>
              <TableHeader
                displaySelectAll={false}
                adjustForCheckbox={false}
                enableSelectAll={false}
              >
                <TableRow>
                  <TableHeaderColumn style={{width: '64px', whiteSpace: 'normal'}}>Date</TableHeaderColumn>
                  <TableHeaderColumn style={{width: '192px'}}>Name</TableHeaderColumn>
                  <TableHeaderColumn style={{width: '64px', whiteSpace: 'normal'}}>Riding Time</TableHeaderColumn>
                  <TableHeaderColumn style={{width: '64px', whiteSpace: 'normal'}}>Distance</TableHeaderColumn>
                  <TableHeaderColumn style={{width: '64px', whiteSpace: 'normal'}}>Elevation</TableHeaderColumn>
                  <TableHeaderColumn style={{width: '64px', whiteSpace: 'normal'}}>Kilojoules</TableHeaderColumn>
                  <TableHeaderColumn style={{width: '64px', whiteSpace: 'normal'}}>NP</TableHeaderColumn>
                  <TableHeaderColumn style={{width: '64px', whiteSpace: 'normal'}}>TSS</TableHeaderColumn>
                  <TableHeaderColumn style={{width: '64px', whiteSpace: 'normal'}}>Average Watts</TableHeaderColumn>
                  <TableHeaderColumn style={{width: '64px', whiteSpace: 'normal'}}>Max Watts</TableHeaderColumn>
                  <TableHeaderColumn style={{width: '64px', whiteSpace: 'normal'}}>Average Heartrate</TableHeaderColumn>
                  <TableHeaderColumn style={{width: '64px', whiteSpace: 'normal'}}>Max Heartrate</TableHeaderColumn>
                  <TableHeaderColumn style={{width: '64px', whiteSpace: 'normal'}}></TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody
                displayRowCheckbox={false}
              >
                {activityRows}
              </TableBody>
            </Table>
          </div>
        </MuiThemeProvider>
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
