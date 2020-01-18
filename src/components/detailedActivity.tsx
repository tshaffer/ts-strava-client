import * as React from 'react';

// import Link from '@material-ui/core/Link';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton';


import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { isNil } from 'lodash';

import * as Converters from '../utilities/converters';

import {
  loadDetailedActivity, forceReloadEfforts, getMmpData,
} from '../controller';
import {
  SegmentsMap,
  StravatronDetailedSegment,
  StravatronSegmentEffortsBySegment,
  StravatronSegmentEffort,
  StravatronActivity,
} from '../type';
import {
  getStravatronDetailedActivityAttributes,
  getSegmentEffortsForActivity,
  getSegments,
  getEffortsForActivitySegments
} from '../selector/detailedActivity';
import moment = require('moment');

export interface DetailedActivityProps {
  params: any;
  detailedActivity: StravatronActivity;
  segmentEfforts: StravatronSegmentEffort[];
  effortsForSegments: StravatronSegmentEffortsBySegment;
  segmentsMap: SegmentsMap;
  onLoadDetailedActivity: (activityId: string) => any;
  onForceReloadEfforts: (activityId: string) => any;
  onGetMmpData: (activityId: string) => any;
}

class DetailedActivityComponent extends React.Component<DetailedActivityProps> {

  constructor(props: DetailedActivityProps) {
    super(props);

    this.handleFetchEfforts = this.handleFetchEfforts.bind(this);
    this.handleGetMmpData = this.handleGetMmpData.bind(this);
  }

  componentWillMount() {
    console.log('DetailedActivity, id:', this.props.params.id);
    this.props.onLoadDetailedActivity(this.props.params.id);
  }

  handleFetchEfforts(activityId: any) {
    console.log('handleFetchEfforts: ', activityId);
    this.props.onForceReloadEfforts(this.props.params.id);
  }

  handleGetMmpData(activityId: any) {
    console.log('handleGetMmpData: ', activityId);
    this.props.onGetMmpData(this.props.params.id);
  }

  buildRideSummaryHeader(detailedActivity: StravatronActivity) {

    if (isNil(detailedActivity)) {
      return <div>Loading</div>;
    }

    let calories = '';
    if (detailedActivity.kilojoules) {
      calories = detailedActivity.kilojoules.toFixed(0);
    }

    const averageWatts = isNil(detailedActivity.averageWatts) ? 0 : detailedActivity.averageWatts;
    const np = isNil(detailedActivity.normalizedPower) ? '' : detailedActivity.normalizedPower.toFixed(1);
    const tss = isNil(detailedActivity.trainingStressScore) ? '' : detailedActivity.trainingStressScore.toFixed(1);

    return (
      <div id='RideSummary'>
        <Table className='summaryTable'>

          <TableHeader displaySelectAll={false} adjustForCheckbox={false} enableSelectAll={false}>
            <TableRow className='summaryLabels'>
              <TableHeaderColumn style={{width: '192px'}}>{Converters.getDateTime(detailedActivity.startDateLocal)}</TableHeaderColumn>
              <TableHeaderColumn style={{width: '64px'}}>Time</TableHeaderColumn>
              <TableHeaderColumn>Elevation</TableHeaderColumn>
              <TableHeaderColumn>Distance</TableHeaderColumn>
              <TableHeaderColumn>Kilojoules</TableHeaderColumn>
              <TableHeaderColumn>NP</TableHeaderColumn>
              <TableHeaderColumn>TSS</TableHeaderColumn>
              <TableHeaderColumn>Average Watts</TableHeaderColumn>
              <TableHeaderColumn>Max Watts</TableHeaderColumn>
              <TableHeaderColumn>Average Heart Rate</TableHeaderColumn>
              <TableHeaderColumn>Max Heart Rate</TableHeaderColumn>
            </TableRow>
          </TableHeader>

          <TableBody displayRowCheckbox={false}>
            <TableRow className='summaryDataRow'>
              <TableRowColumn style={{width: '192px'}}>{detailedActivity.name}</TableRowColumn>
              <TableRowColumn style={{width: '64px'}}>{Converters.getMovingTime(detailedActivity.movingTime)}</TableRowColumn>
              <TableRowColumn>{Converters.metersToFeet(detailedActivity.totalElevationGain).toFixed(0)} ft</TableRowColumn>
              <TableRowColumn>{Converters.metersToMiles(detailedActivity.distance).toFixed(1)} mi</TableRowColumn>
              <TableRowColumn>{calories}</TableRowColumn>
              <TableRowColumn>{np}</TableRowColumn>
              <TableRowColumn>{tss}</TableRowColumn>
              <TableRowColumn>{averageWatts}</TableRowColumn>
              <TableRowColumn>{detailedActivity.maxWatts}</TableRowColumn>
              <TableRowColumn>{detailedActivity.averageHeartrate}</TableRowColumn>
              <TableRowColumn>{detailedActivity.maxHeartrate}</TableRowColumn>
            </TableRow>
          </TableBody>

        </Table>
      </div >
    );
  }

  analyzeEffortsForSegment(effortsForSegment: StravatronSegmentEffort[]): any {

    const effortsSortedByMovingTime: StravatronSegmentEffort[] = effortsForSegment.concat();
    const effortsSortedByDate: StravatronSegmentEffort[] = effortsForSegment.concat();

    // 'best time' by sorting efforts by movingTime
    effortsSortedByMovingTime.sort((a, b) => {

      const aMovingTime = Number(a.movingTime);
      const bMovingTime = Number(b.movingTime);

      if (aMovingTime > bMovingTime) {
        return 1;
      }
      if (aMovingTime < bMovingTime) {
        return -1;
      }
      return 0;
    });

    // most recent will be first in the array
    effortsSortedByDate.sort((a, b) => {

      const aDate = a.startDateLocal;
      const bDate = b.startDateLocal;

      if (aDate < bDate) {
        return 1;
      }
      if (aDate > bDate) {
        return -1;
      }
      return 0;
    });

    const analyzedEffortsForSegment =
    {
      effortsSortedByMovingTime,
      effortsSortedByDate
    };

    return analyzedEffortsForSegment;
  }

  // TEDTODO - come up with a better name - it's not just recent efforts
  buildRecentEfforts(segmentId: number): any {

    let recentEffortsLbl: any;
    let effortsForSegmentLbl: any;

    if (!isNil(this.props.effortsForSegments)) {
      const effortsForSegments: StravatronSegmentEffortsBySegment = this.props.effortsForSegments;
      if (effortsForSegments.hasOwnProperty(segmentId)) {
        const effortsForSegment: StravatronSegmentEffort[] = effortsForSegments[segmentId];
        const effortData = this.analyzeEffortsForSegment(effortsForSegment);

        const bestEffortTime = moment().startOf('day')
          .seconds(Number(effortData.effortsSortedByMovingTime[0].movingTime))
          .format('h:mm:ss');

        const bestEffortDate = moment(effortData.effortsSortedByMovingTime[0].startDateLocal).format('YYYY-MM-DD');

        effortsForSegmentLbl =
          (
            <span>
              <span>{bestEffortTime}</span>
              <span className='smallDimDate'>{bestEffortDate}</span>
            </span>
          );

        if (!isNil(effortData.effortsSortedByMovingTime[1])) {
          const nextBestEffortTime = moment().startOf('day')
            .seconds(Number(effortData.effortsSortedByMovingTime[1].movingTime))
            .format('h:mm:ss');
          const nextBestEffortDate =
            moment(effortData.effortsSortedByMovingTime[1].startDateLocal).format('YYYY-MM-DD');

          effortsForSegmentLbl =
            (
              <span>
                <span>{bestEffortTime}</span>
                <span className='smallDimDate'>{bestEffortDate}</span>
                <span>, {nextBestEffortTime}</span>
                <span className='smallDimDate'>{nextBestEffortDate}</span>
              </span>
            );
        }

        // effortsSortedByDate
        const recentEfforts = [];
        const recentEffort =
        {
          movingTime: '',
          date: '',
          separator: ''
        };

        recentEfforts.push(recentEffort);
        recentEfforts.push(recentEffort);
        recentEfforts.push(recentEffort);

        let index = 0;
        while (index < 3) {
          if (effortData.effortsSortedByDate.length > (index + 1)) {
            const effort = effortData.effortsSortedByDate[index + 1];
            recentEfforts[index] =
            {
              movingTime: effort.movingTime,
              date: effort.startDateLocal,
              separator: ', '
            };
          }
          index++;
        }

        recentEffortsLbl =
          (
            <span>
              <span>{Converters.elapsedTimeToTimeString(recentEfforts[0].movingTime)}</span>
              <span className='smallDimDate'>{Converters.formatDate(recentEfforts[0].date)}</span>
              <span>{recentEfforts[1].separator}</span>
              <span>{Converters.elapsedTimeToTimeString(recentEfforts[1].movingTime)}</span>
              <span className='smallDimDate'>{Converters.formatDate(recentEfforts[1].date)}</span>
              <span>{recentEfforts[2].separator}</span>
              <span>{Converters.elapsedTimeToTimeString(recentEfforts[2].movingTime)}</span>
              <span className='smallDimDate'>{Converters.formatDate(recentEfforts[2].date)}</span>
            </span>
          );
      }
    }
    return { recentEffortsLbl, effortsForSegmentLbl };
  }

  buildSegmentEffortRow(segmentEffort: StravatronSegmentEffort) {

    const self = this;

    // TEDTODO - id confusion
    const segmentId = segmentEffort.segmentId;
    // const segment: Segment = this.props.segmentsMap[segmentId];
    const segment: StravatronDetailedSegment = this.props.segmentsMap[segmentId];
    const speed = segmentEffort.distance / segmentEffort.movingTime;

    let averageGrade = '';
    if (segment && segment.averageGrade) {
      averageGrade = segment.averageGrade.toFixed(1) + '%';
    }

    let totalElevationGain = '';
    if (segment && segment.totalElevationGain) {
      totalElevationGain = Converters.metersToFeet(segment.totalElevationGain).toFixed(0) + 'ft';
    }

    const effortsData = this.buildRecentEfforts(segmentId);
    const { recentEffortsLbl, effortsForSegmentLbl } = effortsData;
    /*
        <td>
          <button onClick={() => {
            self.handleAllActivitiesWithThisSegment(segment.id);
          }
          }>Show all...</button>
        </td>
    */

    const { averageWatts, averageHeartrate, maxHeartrate, normalizedPower } = segmentEffort;
    const normalizedPowerLbl = isNil(normalizedPower) ? '' : normalizedPower.toFixed(1);
    const averageWattsLbl = isNil(averageWatts) ? 0 : averageWatts;

    return (
      <TableRow key={segmentEffort.id}>
        <TableRowColumn style={{width: '192px'}}>
          {segmentEffort.name}
        </TableRowColumn>
        <TableRowColumn style={{width: '64px'}}>
          {Converters.getMovingTime(segmentEffort.movingTime)}
        </TableRowColumn>
        <TableRowColumn>
          {effortsForSegmentLbl}
        </TableRowColumn>
        <TableRowColumn>
          {recentEffortsLbl}
        </TableRowColumn>
        <TableRowColumn>
          {Converters.metersToMiles(segmentEffort.distance).toFixed(1)} mi
        </TableRowColumn>
        <TableRowColumn>
          {Converters.metersPerSecondToMilesPerHour(speed).toFixed(1)} mph
        </TableRowColumn>
        <TableRowColumn>
          {averageGrade}
        </TableRowColumn>
        <TableRowColumn>
          {totalElevationGain}
        </TableRowColumn>
        <TableRowColumn>
          {normalizedPowerLbl}
        </TableRowColumn>
        <TableRowColumn>
          {averageWattsLbl}
        </TableRowColumn>
        <TableRowColumn>
          {segmentEffort.averageHeartrate}
        </TableRowColumn>
        <TableRowColumn>
          {segmentEffort.maxHeartrate}
        </TableRowColumn>
        <TableRowColumn>
        </TableRowColumn>
      </TableRow>
    );
  }

  buildSegmentEffortRows(segmentEfforts: StravatronSegmentEffort[]) {

    const self = this;

    const sortedSegmentEffortRows: StravatronSegmentEffort[] = segmentEfforts.concat();
    sortedSegmentEffortRows.sort((a, b) => {
      const aStartTime = a.startDate;
      const bStartTime = b.startDate;

      if (aStartTime > bStartTime) {
        return 1;
      }
      if (aStartTime < bStartTime) {
        return -1;
      }
      return 0;
    });

    const segmentEffortRows = sortedSegmentEffortRows.map((segmentEffort) => {
      const segmentEffortRow = self.buildSegmentEffortRow(segmentEffort);
      return segmentEffortRow;
    });
    return segmentEffortRows;
  }

  buildSegmentEffortsTable() {

    console.log(this.props.segmentEfforts);

    const segmentEffortRows = this.buildSegmentEffortRows(this.props.segmentEfforts);

    return (
      <div>
        <Table>
          <TableHeader
            displaySelectAll={false}
            adjustForCheckbox={false}
            enableSelectAll={false}
          >
            <TableRow>
              <TableHeaderColumn style={{width: '192px'}}>Name</TableHeaderColumn>
              <TableHeaderColumn style={{width: '64px'}}>Time</TableHeaderColumn>
              <TableHeaderColumn>Best Times</TableHeaderColumn>
              <TableHeaderColumn>Recent Efforts</TableHeaderColumn>
              <TableHeaderColumn>Distance</TableHeaderColumn>
              <TableHeaderColumn>Speed</TableHeaderColumn>
              <TableHeaderColumn>Average Grade</TableHeaderColumn>
              <TableHeaderColumn>Elevation Gain</TableHeaderColumn>
              <TableHeaderColumn>NP</TableHeaderColumn>
              <TableHeaderColumn>Average Watts</TableHeaderColumn>
              <TableHeaderColumn>Average Heartrate</TableHeaderColumn>
              <TableHeaderColumn>Max Heartrate</TableHeaderColumn>
              <TableHeaderColumn></TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody
            displayRowCheckbox={false}
          >
            {segmentEffortRows}
          </TableBody>
        </Table>
      </div>
    );
  }

  render(): any {

    const activity = this.props.detailedActivity;

    console.log('detailedActivityAttributes');
    console.log(activity);

    console.log('segmentEfforts');
    console.log(this.props.segmentEfforts);

    if (isNil(activity)) {
      return <div>Loading...</div>;
    }

    const rideSummaryHeader = this.buildRideSummaryHeader(activity);
    const segmentEffortsTable = this.buildSegmentEffortsTable();
    // return (
    //   <div>
    //     <Link to='/activities' id='backFromDetailedActivityButton'>Back</Link>
    //     <br />
    //     {rideSummaryHeader}
    //     <button onClick={() => this.handleFetchEfforts(activity.id)}>Refresh efforts</button>
    //     <br />
    //     {segmentEffortsTable}
    //   </div>
    // );
    return (
      <MuiThemeProvider>
        <div>
          <Link to='/activities' id='backFromDetailedActivityButton'>Back</Link>
          <br />
          {rideSummaryHeader}
          <br />
          <button onClick={() => this.handleFetchEfforts(activity.id)}>Refresh efforts</button>
          <br />
          <button onClick={() => this.handleGetMmpData(activity.id)}>Get MMP Data</button>
          <br />
          <br />
          <br />
          {segmentEffortsTable}
        </div>
      </MuiThemeProvider>
    );
  }
}

function mapStateToProps(state: any, ownProps: any) {

  return {
    params: ownProps.params,
    detailedActivity: getStravatronDetailedActivityAttributes(state, parseInt(ownProps.params.id, 10)),
    segmentEfforts: getSegmentEffortsForActivity(state, parseInt(ownProps.params.id, 10)),
    effortsForSegments: getEffortsForActivitySegments(state, parseInt(ownProps.params.id, 10)),
    segmentsMap: getSegments(state),
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    onLoadDetailedActivity: loadDetailedActivity,
    onForceReloadEfforts: forceReloadEfforts,
    onGetMmpData: getMmpData,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailedActivityComponent);
