import * as React from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { isNil } from 'lodash';

import * as Converters from '../utilities/converters';

import {
  loadDetailedActivity
} from '../controller';
import {
  StravatronDetailedActivityAttributes,
  SegmentsMap,
  StravatronDetailedSegment,
  StravatronSegmentEffortsBySegment,
  StravatronSegmentEffort,
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
  detailedActivity: StravatronDetailedActivityAttributes;
  segmentEfforts: StravatronSegmentEffort[];
  effortsForSegments: StravatronSegmentEffortsBySegment;
  segmentsMap: SegmentsMap;
  onLoadDetailedActivity: (activityId: string) => any;
}

class DetailedActivityComponent extends React.Component<DetailedActivityProps> {

  componentWillMount() {
    console.log('DetailedActivity, id:', this.props.params.id);
    this.props.onLoadDetailedActivity(this.props.params.id);
  }

  buildRideSummaryHeader(detailedActivity: StravatronDetailedActivityAttributes) {

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
        <table className='summaryTable'>

          <tbody>

            <tr className='summaryDataRow'>
              <td>{detailedActivity.name}</td>
              <td>{Converters.getMovingTime(detailedActivity.movingTime)}</td>
              <td>{Converters.metersToFeet(detailedActivity.totalElevationGain).toFixed(0)} ft</td>
              <td>{Converters.metersToMiles(detailedActivity.distance).toFixed(1)} mi</td>
              <td>{calories}</td>
              <td>{np}</td>
              <td>{tss}</td>
              <td>{averageWatts}</td>
              <td>{detailedActivity.maxWatts}</td>
              <td>{detailedActivity.averageHeartrate}</td>
              <td>{detailedActivity.maxHeartrate}</td>
            </tr>

            <tr className='summaryLabels'>
              <td>{Converters.getDateTime(detailedActivity.startDateLocal)}</td>
              <td>Time</td>
              <td>Elevation</td>
              <td>Distance</td>
              <td>Kilojoules</td>
              <td>NP</td>
              <td>TSS</td>
              <td>Average Watts</td>
              <td>Max Watts</td>
              <td>Average Heart Rate</td>
              <td>Max Heart Rate</td>
            </tr>

          </tbody>
        </table>
      </div>
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

  buildSegmentEffortRows(segmentEfforts: StravatronSegmentEffort[]) {

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
        <Link to='/activities' id='backFromDetailedActivityButton'>Back</Link>
        <br />
        {rideSummaryHeader}
        {segmentEffortsTable}
      </div>
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
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailedActivityComponent);
