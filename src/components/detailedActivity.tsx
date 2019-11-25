import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { isNil } from 'lodash';

import * as Converters from '../utilities/converters';

import {
  loadDetailedActivity
} from '../controller';
import { DetailedActivity, SegmentEffortWithSegment, Segment, DetailedActivityAttributes } from '../type';
import { getDetailedActivityAttributes, getSegmentEffortsForActivity } from '../selector/detailedActivity';
import moment = require('moment');

export interface DetailedActivityProps {
  params: any;
  detailedActivity: DetailedActivity;
  segmentEfforts: SegmentEffortWithSegment[];
  onLoadDetailedActivity: (activityId: string) => any;
}

class DetailedActivityComponent extends React.Component<DetailedActivityProps> {

  componentWillMount() {
    console.log('DetailedActivity, id:', this.props.params.id);
    this.props.onLoadDetailedActivity(this.props.params.id);
  }

  // buildRideSummaryHeader(detailedActivity: DetailedActivity) {

  //   if (!detailedActivity) {
  //     return <div>Loading</div>;
  //   }

  //   let calories = '';
  //   if (detailedActivity.kilojoules) {
  //     calories = detailedActivity.kilojoules.toFixed(0);
  //   }

  //   return (
  //     <div id='RideSummary'>
  //       <table className='summaryTable'>

  //         <tbody>

  //           <tr className='summaryDataRow'>
  //             <td>{detailedActivity.name}</td>
  //             <td>{Converters.getMovingTime(detailedActivity.movingTime)}</td>
  //             <td>{Converters.metersToFeet(detailedActivity.totalElevationGain).toFixed(0)} ft</td>
  //             <td>{Converters.metersToMiles(detailedActivity.distance).toFixed(1)} mi</td>
  //             <td>{Converters.metersPerSecondToMilesPerHour(detailedActivity.averageSpeed).toFixed(1)} mph</td>
  //             <td>{calories}</td>
  //           </tr>

  //           <tr className='summaryLabels'>
  //             <td>{Converters.getDateTime(detailedActivity.startDateLocal)}</td>
  //             <td>Time</td>
  //             <td>Elevation</td>
  //             <td>Distance</td>
  //             <td>Speed</td>
  //             <td>Calories</td>
  //           </tr>

  //         </tbody>
  //       </table>
  //     </div>
  //   );
  // }

  // buildSegmentEffortRow(segmentEffort: SegmentEffort) {

  //   const self = this;

  //   const segmentId = segmentEffort.id;
  //   const segment = this.props.segments.segmentsById[segmentId];

  //   const speed = segmentEffort.distance / segmentEffort.movingTime;

  //   let averageGrade = '';
  //   if (segment && segment.averageGrade) {
  //     averageGrade = segment.averageGrade.toFixed(1) + '%';
  //   }

  //   let totalElevationGain = '';
  //   if (segment && segment.totalElevationGain) {
  //     totalElevationGain = Converters.metersToFeet(segment.totalElevationGain).toFixed(0) + 'ft';
  //   }

  //   let effortsForSegmentLbl = 'none';
  //   let recentEffortsLbl = 'none';
  //   if (this.props.effortsForSegments) {
  //     const effortsForSegment = this.props.effortsForSegments[segmentId];
  //     if (effortsForSegment) {
  //       if (effortsForSegment.length > 0) {

  //         const effortData = this.analyzeEffortsForSegment(effortsForSegment);

  //         const bestEffortTime = moment().startOf('day')
  //           .seconds(Number(effortData.effortsSortedByMovingTime[0].movingTime))
  //           .format('mm:ss');

  //         const bestEffortDate = moment(effortData.effortsSortedByMovingTime[0].startDateLocal).format('YYYY-MM-DD');

  //         effortsForSegmentLbl =
  //           (
  //             <span>
  //               <span>{bestEffortTime}</span>
  //               <span className='smallDimDate'>{bestEffortDate}</span>
  //             </span>
  //           );

  //         if (effortData.effortsSortedByMovingTime[1]) {

  //           const nextBestEffortTime = moment().startOf('day')
  //             .seconds(Number(effortData.effortsSortedByMovingTime[1].movingTime))
  //             .format('mm:ss');
  //           const nextBestEffortDate =
  //             moment(effortData.effortsSortedByMovingTime[1].startDateLocal).format('YYYY-MM-DD');

  //           effortsForSegmentLbl =
  //             (
  //               <span>
  //                 <span>{bestEffortTime}</span>
  //                 <span className='smallDimDate'>{bestEffortDate}</span>
  //                 <span>, {nextBestEffortTime}</span>
  //                 <span className='smallDimDate'>{nextBestEffortDate}</span>
  //               </span>
  //             );
  //         }

  //         // effortsSortedByDate
  //         let recentEfforts = [];
  //         let recentEffort =
  //           {
  //             movingTime: '',
  //             date: '',
  //             separator: ''
  //           };

  //         recentEfforts.push(recentEffort);
  //         recentEfforts.push(recentEffort);
  //         recentEfforts.push(recentEffort);

  //         let index = 0;
  //         while (index < 3) {
  //           if (effortData.effortsSortedByDate.length > (index + 1)) {
  //             const effort = effortData.effortsSortedByDate[index + 1];
  //             recentEfforts[index] =
  //             {
  //               movingTime: effort.movingTime,
  //               date: effort.startDateLocal,
  //               separator: ', '
  //             };
  //           }
  //           index++;
  //         }

  //         recentEffortsLbl =
  //           (
  //             <span>
  //               <span>{Converters.elapsedTimeToTimeString(recentEfforts[0].movingTime)}</span>
  //               <span className='smallDimDate'>{Converters.formatDate(recentEfforts[0].date)}</span>
  //               <span>{recentEfforts[1].separator}</span>
  //               <span>{Converters.elapsedTimeToTimeString(recentEfforts[1].movingTime)}</span>
  //               <span className='smallDimDate'>{Converters.formatDate(recentEfforts[1].date)}</span>
  //               <span>{recentEfforts[2].separator}</span>
  //               <span>{Converters.elapsedTimeToTimeString(recentEfforts[2].movingTime)}</span>
  //               <span className='smallDimDate'>{Converters.formatDate(recentEfforts[2].date)}</span>
  //             </span>
  //           );
  //       }
  //     }
  //   }

  //   return (
  //     <tr key={segmentEffort.id}>
  //       <td>
  //         {segmentEffort.name}
  //       </td>
  //       <td>
  //         {Converters.getMovingTime(segmentEffort.movingTime)}
  //       </td>
  //       <td>
  //         {effortsForSegmentLbl}
  //       </td>
  //       <td>
  //         {recentEffortsLbl}
  //       </td>
  //       <td>
  //         {Converters.metersToMiles(segmentEffort.distance).toFixed(1)} mi
  //       </td>
  //       <td>
  //         {Converters.metersPerSecondToMilesPerHour(speed).toFixed(1)} mph

  //       </td>
  //       <td>
  //         {averageGrade}
  //       </td>
  //       <td>
  //         {totalElevationGain}
  //       </td>
  //       <td>
  //         <button onClick={() => {
  //           self.handleAllActivitiesWithThisSegment(segment.id);
  //         }
  //         }>Show all...</button>
  //       </td>
  //     </tr>
  //   );
  // }


  // buildSegmentEffortRows(segmentEfforts: SegmentEffort[]) {

  //   const self = this;


  //   segmentEfforts.forEach( (segmentEffort) => {
  //     self.buildSegmentEffortRow(segmentEffort);
  //   });

  //   const segmentEffortRows = segmentEfforts.map(function(segmentEffort) {
  //     const segmentEffortRow = self.buildSegmentEffortRow(segmentEffort);
  //     return segmentEffortRow;
  //   });
  //   return segmentEffortRows;
  // }


  // buildSegmentEffortsTable() {

  //   const segmentEffortRows = this.buildSegmentEffortRows(this.props.segmentEfforts);

  //   return (

  //     <div id='DetailedActivity' className='detailsActivity'>
  //       <table id='DetailedActivityTable' className='detailsActivityTable'>
  //         <thead>
  //           <tr>
  //             <th>Name</th>
  //             <th>Time</th>
  //             <th>Best Times</th>
  //             <th>Recent Efforts</th>
  //             <th>Distance</th>
  //             <th>Speed</th>
  //             <th>Average Grade</th>
  //             <th>Elevation Gain</th>
  //             <th/>
  //           </tr>
  //         </thead>
  //         <tbody>
  //           {segmentEffortRows}
  //         </tbody>
  //       </table>
  //     </div>

  //   );
  // }


  render(): any {

    // const self = this;

    const detailedActivity = this.props.detailedActivity;

    console.log('detailedActivityAttributes');
    console.log(detailedActivity);

    console.log('segmentEfforts');
    console.log(this.props.segmentEfforts);

    if (isNil(detailedActivity) || this.props.segmentEfforts.length === 0) {
      return <div>Loading...</div>;
    }
    else {
      return <div>Show Me</div>;
    }
  }
}

function mapStateToProps(state: any, ownProps: any) {

  return {
    params: ownProps.params,
    detailedActivity: getDetailedActivityAttributes(state, ownProps.params.id),
    segmentEfforts: getSegmentEffortsForActivity(state, ownProps.params.id),
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    onLoadDetailedActivity: loadDetailedActivity,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailedActivityComponent);
