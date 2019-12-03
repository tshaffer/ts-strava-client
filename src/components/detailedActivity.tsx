import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { isNil } from 'lodash';

import * as Converters from '../utilities/converters';

import {
  loadDetailedActivity
} from '../controller';
import {
  DetailedActivity,
  SegmentEffortWithSegment,
  Segment,
  DetailedActivityAttributes,
  SegmentEffort,
  SegmentsMap,
  DetailedSegment,
  EffortsForActivitySegments
} from '../type';
import {
  getDetailedActivityAttributes,
  getSegmentEffortsForActivity,
  getSegments,
  getEffortsForActivitySegments
} from '../selector/detailedActivity';
import moment = require('moment');

export interface DetailedActivityProps {
  params: any;
  detailedActivity: DetailedActivity;
  segmentEfforts: SegmentEffort[];
  effortsForSegments: EffortsForActivitySegments;
  segmentsMap: SegmentsMap;
  onLoadDetailedActivity: (activityId: string) => any;
}

class DetailedActivityComponent extends React.Component<DetailedActivityProps> {

  componentWillMount() {
    console.log('DetailedActivity, id:', this.props.params.id);
    this.props.onLoadDetailedActivity(this.props.params.id);
  }

  buildRideSummaryHeader(detailedActivity: DetailedActivity) {

    if (isNil(detailedActivity)) {
      return <div>Loading</div>;
    }

    let calories = '';
    if (detailedActivity.kilojoules) {
      calories = detailedActivity.kilojoules.toFixed(0);
    }

    return (
      <div id='RideSummary'>
        <table className='summaryTable'>

          <tbody>

            <tr className='summaryDataRow'>
              <td>{detailedActivity.name}</td>
              <td>{Converters.getMovingTime(detailedActivity.movingTime)}</td>
              <td>{Converters.metersToFeet(detailedActivity.totalElevationGain).toFixed(0)} ft</td>
              <td>{Converters.metersToMiles(detailedActivity.distance).toFixed(1)} mi</td>
              <td>{Converters.metersPerSecondToMilesPerHour(detailedActivity.averageSpeed).toFixed(1)} mph</td>
              <td>{calories}</td>
            </tr>

            <tr className='summaryLabels'>
              <td>{Converters.getDateTime(detailedActivity.startDateLocal)}</td>
              <td>Time</td>
              <td>Elevation</td>
              <td>Distance</td>
              <td>Speed</td>
              <td>Calories</td>
            </tr>

          </tbody>
        </table>
      </div>
    );
  }

  analyzeEffortsForSegment(effortsForSegment: SegmentEffort[]): any {

    const effortsSortedByMovingTime: SegmentEffort[] = effortsForSegment.concat();
    const effortsSortedByDate: SegmentEffort[] = effortsForSegment.concat();

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


  buildSegmentEffortRow(segmentEffort: SegmentEffort) {

    const self = this;

    // TEDTODO - id confusion
    const segmentId = segmentEffort.segment.id;
    // const segment: Segment = this.props.segmentsMap[segmentId];
    const summarySegment: Segment = segmentEffort.segment;
    const segment: DetailedSegment = this.props.segmentsMap[summarySegment.id];
    const speed = segmentEffort.distance / segmentEffort.movingTime;

    let averageGrade = '';
    if (segment && segment.averageGrade) {
      averageGrade = segment.averageGrade.toFixed(1) + '%';
    }

    let totalElevationGain = '';
    if (segment && segment.totalElevationGain) {
      totalElevationGain = Converters.metersToFeet(segment.totalElevationGain).toFixed(0) + 'ft';
    }

    let effortsForSegmentLbl;
    let recentEffortsLbl;
    if (!isNil(this.props.effortsForSegments)) {
      const effortsForSegment: SegmentEffort[] = this.props.effortsForSegments[segmentId];
      if (!isNil(effortsForSegment)) {
        if (effortsForSegment.length > 0) {

          const effortData = this.analyzeEffortsForSegment(effortsForSegment);

          const bestEffortTime = moment().startOf('day')
            .seconds(Number(effortData.effortsSortedByMovingTime[0].movingTime))
            .format('mm:ss');

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
              .format('mm:ss');
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
    }

    /*
        <td>
          <button onClick={() => {
            self.handleAllActivitiesWithThisSegment(segment.id);
          }
          }>Show all...</button>
        </td>
    */

    return (
      <tr key={segmentEffort.id}>
        <td>
          {segmentEffort.name}
        </td>
        <td>
          {Converters.getMovingTime(segmentEffort.movingTime)}
        </td>
        <td>
          {effortsForSegmentLbl}
        </td>
        <td>
          {recentEffortsLbl}
        </td>
        <td>
          {Converters.metersToMiles(segmentEffort.distance).toFixed(1)} mi
        </td>
        <td>
          {Converters.metersPerSecondToMilesPerHour(speed).toFixed(1)} mph
        </td>
        <td>
          {averageGrade}
        </td>
        <td>
          {totalElevationGain}
        </td>
      </tr>
    );
  }


  buildSegmentEffortRows(segmentEfforts: SegmentEffort[]) {

    const self = this;

    const segmentEffortRows = segmentEfforts.map((segmentEffort) => {
      const segmentEffortRow = self.buildSegmentEffortRow(segmentEffort);
      return segmentEffortRow;
    });
    return segmentEffortRows;
  }


  buildSegmentEffortsTable() {

    console.log(this.props.segmentEfforts);

    const segmentEffortRows = this.buildSegmentEffortRows(this.props.segmentEfforts);

    return (

      <div id='DetailedActivity' className='detailsActivity'>
        <table id='DetailedActivityTable' className='detailsActivityTable'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Time</th>
              <th>Best Times</th>
              <th>Recent Efforts</th>
              <th>Distance</th>
              <th>Speed</th>
              <th>Average Grade</th>
              <th>Elevation Gain</th>
            </tr>
          </thead>
          <tbody>
            {segmentEffortRows}
          </tbody>
        </table>
      </div>

    );
  }

  render(): any {

    // const self = this;

    const activity = this.props.detailedActivity;

    console.log('detailedActivityAttributes');
    console.log(activity);

    console.log('segmentEfforts');
    console.log(this.props.segmentEfforts);

    if (isNil(activity) || this.props.segmentEfforts.length === 0) {
      return <div>Loading...</div>;
    }

    const rideSummaryHeader = this.buildRideSummaryHeader(activity);
    const segmentEffortsTable = this.buildSegmentEffortsTable();
    return (
      <div>
        {rideSummaryHeader}
        {segmentEffortsTable}
      </div>
    );
  }
}

function mapStateToProps(state: any, ownProps: any) {

  return {
    params: ownProps.params,
    detailedActivity: getDetailedActivityAttributes(state, parseInt(ownProps.params.id, 10)),
    segmentEfforts: getSegmentEffortsForActivity(state, parseInt(ownProps.params.id, 10)),
    effortsForSegments: getEffortsForActivitySegments(state, parseInt(ownProps.params.id, 10)),
    segmentsMap: getSegments(state),
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    onLoadDetailedActivity: loadDetailedActivity,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailedActivityComponent);
