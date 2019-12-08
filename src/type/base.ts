export interface StravaModelState {
  activities: ActivitiesMap;
  detailedActivities: DetailedActivityAttributesMap;
  segments: SegmentsMap;
  segmentEfforts: SegmentEffortsMap;
}

export interface ActivitiesMap {
  [id: string]: StravatronSummaryActivity; // activityid
}

export interface DetailedActivityAttributesMap {
  [id: string]: StravatronDetailedActivityAttributes; // activityId
}

export interface SegmentsMap {
  [id: string]: StravatronDetailedSegment; // segmentId
}

export interface SegmentEffortsMap {
  [id: string]: StravatronSegmentEffort; // segmentEffortId
}

export interface StravatronSegmentEffortsBySegment {
  [id: string]: StravatronSegmentEffort[]; // segmentId
}

export type StravatronSegmentEffortsForSegment = StravatronSegmentEffort[];

export interface StravatronDetailedActivityData {
  detailedActivityAttributes: StravatronDetailedActivityAttributes;
  allSegmentEffortsForSegmentsInActivity: StravatronSegmentEffort[];
  streams: StravatronStreams;
  segments: StravatronDetailedSegment[];
}

export interface StravatronDetailedActivityAttributes {
  name: string;
  distance: number;
  movingTime: number;
  averageSpeed: number;
  calories: number;
  kilojoules: number;
  totalElevationGain: number;
  startDateLocal: Date;
  map: StravaNativePolylineMap;
}

export interface StravatronAthlete {
  id: string;
  nickname: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface StravatronDetailedSegment {
  id: number;
  name: string;
  distance: number;
  averageGrade: number;
  maximumGrade: number;
  elevationHigh: number;
  elevationLow: number;
  activityType: string;
  climbCategory: number;
  startLatlng: StravaNativeLatLng;
  endLatlng: StravaNativeLatLng;
  athletePrEffort?: any; // ****
  totalElevationGain: number;
  map: StravaNativePolylineMap;
  effortCount: number;
}

export interface StravatronAchievement {
  type: string;
  rank: number;
  typeId: number;
}

export interface StravatronSegmentEffort {
  id: number;
  segmentId: number;
  name: string;
  activityId: number;
  elapsedTime: number;
  movingTime: number;
  startDateLocal: Date;
  distance: number;
  averageWatts: number;
  prRank: number;
  achievements: StravatronAchievement[];
  averageCadence: number;
  averageHeartrate: number;
  deviceWatts: boolean;
  maxHeartrate: number;
  startDate: Date;
  komRank?: number;
}

export interface StravatronStream {
  data: any[];
  originalSize: number;
  resolution: string;
  seriesType: string;
  type: string;
}

export interface StravatronStreams {
  time: any[];
  location: any[];
  elevation: any[];
  distance: any[];
  gradient: any[];
  cadence: any[];
  heartrate: any[];
  watts: any[];
}

export interface StravatronSummaryActivity {
  achievementCount: number;
  athleteId: number;
  averageSpeed: number;
  averageTemp?: number;
  averageWatts: number;
  deviceWatts?: boolean;
  distance: number;
  elapsedTime: number;
  elevHigh?: number;
  elevLow?: number;
  endLatlng: StravaNativeLatLng;
  id: number;
  kilojoules: number;
  city?: string;
  country: string;
  state?: string;
  map: StravaNativePolylineMap; // does not include polyline
  maxSpeed: number;
  movingTime: number;
  name: string;
  prCount: number;
  resourceState: number;
  startDate: Date;
  startDateLocal: Date;
  startLatitude: number;
  startLatlng: StravaNativeLatLng;
  startLongitude: number;
  timezone: string;
  totalElevationGain: number;
  weightedAverageWatts?: number;
}

export interface StravatronDetailedActivity extends StravatronSummaryActivity {
  description: string;
  calories: number;
  segmentEfforts: StravatronSegmentEffort[];

  averageCadence: number;
  averageHeartrate: number;
  deviceName: string;
  hasHeartrate: boolean;
  maxHeartrate: number;
  maxWatts: number;
  type: string;
  utcOffset: number;

  bestEfforts?: any; // DetailedSegmentEffort or DetailedSegmentEffort[] ??
}

// export interface Athlete {
//   id: string;
//   nickname: string;
//   firstName: string;
//   lastName: string;
//   email: string;
// }

export interface StravaNativeLatLng {
  latlng: number[];
}

export interface StravaNativePolylineMap {
  id: string;
  polyline: string;
  summary_polyline: string;
}

// export interface Segment {
//   id: number;
//   name: string;
//   distance: number;
//   averageGrade: number;
//   maximumGrade: number;
//   elevationHigh: number;
//   elevationLow: number;
//   activityType: string;
//   climbCategory: number;
//   endLatlng: StravaNativeLatLng;
//   startLatLng: StravaNativeLatLng;
//   // startDate: Date;
//   // startDateLocal: Date;
// }

// export interface DetailedSegment extends Segment {
//   totalElevationGain: number;
//   map: StravaNativePolylineMap;
//   effortCount: number;
// }

// export interface Achievement {
//   type: string;
//   rank: number;
//   typeId: number;
// }

// export interface SegmentEffortWithSegment {
//   id: number;
//   name: string;
//   elapsedTime: number;
//   movingTime: number;
//   startDateLocal: Date;
//   distance: number;
//   averageWatts: number;
//   segment: Segment;
//   prRank: number;
//   achievements: Achievement[];
//   activityId: number;
//   averageCadence: number;
//   averageHeartrate: number;
//   deviceWatts: boolean;
//   maxHeartrate: number;
//   startDate: Date;
// }

// export interface SegmentEffort {
//   id: number;
//   name: string;
//   activityId: number;
//   elapsedTime: number;
//   movingTime: number;
//   startDateLocal: Date;
//   distance: number;
//   averageWatts: number;
//   segment: Segment;
//   prRank: number;
//   achievements: Achievement[];
//   averageCadence: number;
//   averageHeartrate: number;
//   deviceWatts: boolean;
//   maxHeartrate: number;
//   startDate: Date;

// }

// export interface Activity {
//   achievementCount: number;
//   athleteId: number;
//   averageSpeed: number;
//   averageTemp?: number;
//   averageWatts: number;
//   deviceWatts?: boolean;
//   distance: number;
//   elapsedTime: number;
//   elevHigh?: number;
//   elevLow?: number;
//   endLatlng: StravaNativeLatLng;
//   id: number;
//   kilojoules: number;
//   city?: string;
//   country: string;
//   state?: string;
//   map: StravaNativePolylineMap; // does not include polyline
//   maxSpeed: number;
//   movingTime: number;
//   name: string;
//   prCount: number;
//   resourceState: number;
//   startDate: Date;
//   startDateLocal: Date;
//   startLatitude: number;
//   startLatlng: StravaNativeLatLng;
//   startLongitude: number;
//   timezone: string;
//   totalElevationGain: number;
//   weightedAverageWatts?: number;
// }

// export interface DetailedActivity extends Activity {
//   // averageTemp: number;
//   averageCadence: number;
//   averageHeartrate: number;
//   averageWatts: number;
//   calories: number;
//   description: string;
//   deviceName: string;
//   deviceWatts: boolean;
//   hasHeartrate: boolean;
//   maxHeartrate: number;
//   maxWatts: number;
//   segmentEfforts: SegmentEffortWithSegment[];
//   type: string;
// }

// export interface Stream {
//   data: any[];   // type is dependent on type of stream
//   original_size: number;
//   resolution: string;
//   series_type: string;
//   type: string;
// }

// export interface DetailedActivityAttributes {
//   calories: number;
//   segmentEfforts: SegmentEffort[];
//   map: StravaNativePolylineMap;
//   streams: Stream[];
// }

// export interface DetailedActivityData {
//   detailedActivityAttributes: DetailedActivityAttributes;
//   detailedSegments: DetailedSegment[];
//   locationData: any[]; // array of 2 element arrays [lat, lng]?
//   segmentEfforts: SegmentEffort[];
//   segmentEffortsInActivity: SegmentEffortWithSegment[];
//   segments: Segment[];
// }

// export interface StravatronAthlete {
//   id: string;
//   nickname: string;
//   firstName: string;
//   lastName: string;
//   email: string;
// }

// export interface StravatronSummarySegment {
//   id: number;
//   name: string;
//   distance: number;
//   averageGrade: number;
//   maximumGrade: number;
//   elevationHigh: number;
//   elevationLow: number;
//   activityType: string;
//   climbCategory: number;
//   startLatlng: StravaNativeLatLng;
//   endLatlng: StravaNativeLatLng;
//   athletePrEffort?: any; // ****
// }

// export interface StravatronDetailedSegment extends StravatronSummarySegment {
//   totalElevationGain: number;
//   map: StravaNativePolylineMap;
//   effortCount: number;
// }

// export interface StravatronAchievement {
//   type: string;
//   rank: number;
//   typeId: number;
// }

// export type StravatronSegmentEffortsForSegment = StravatronSegmentEffort[];

// export interface StravatronSegmentEffort {
//   id: number;
//   name: string;
//   activityId: number;
//   elapsedTime: number;
//   movingTime: number;
//   startDateLocal: Date;
//   distance: number;
//   averageWatts: number;
//   segment: StravatronSummarySegment;
//   prRank: number;
//   achievements: StravatronAchievement[];
//   averageCadence: number;
//   averageHeartrate: number;
//   deviceWatts: boolean;
//   maxHeartrate: number;
//   startDate: Date;
//   komRank?: number;
// }

// export interface StravatronStream {
//   data: any[];
//   originalSize: number;
//   resolution: string;
//   seriesType: string;
//   type: string;
// }

// export interface StravatronStreamData {
//   timeData: any[];
//   locationData: any[];
//   elevationData: any[];
//   distanceData: any[];
//   gradientData: any[];
//   cadenceData: any[];
//   heartrateData: any[];
//   wattsData: any[];
// }

// export interface StravatronSummaryActivity {
//   achievementCount: number;
//   athleteId: number;
//   averageSpeed: number;
//   averageTemp?: number;
//   averageWatts: number;
//   deviceWatts?: boolean;
//   distance: number;
//   elapsedTime: number;
//   elevHigh?: number;
//   elevLow?: number;
//   endLatlng: StravaNativeLatLng;
//   id: number;
//   kilojoules: number;
//   city?: string;
//   country: string;
//   state?: string;
//   map: StravaNativePolylineMap; // does not include polyline
//   maxSpeed: number;
//   movingTime: number;
//   name: string;
//   prCount: number;
//   resourceState: number;
//   startDate: Date;
//   startDateLocal: Date;
//   startLatitude: number;
//   startLatlng: StravaNativeLatLng;
//   startLongitude: number;
//   timezone: string;
//   totalElevationGain: number;
//   weightedAverageWatts?: number;
// }

// export interface StravatronDetailedActivity extends StravatronSummaryActivity {
//   description: string;
//   calories: number;
//   segmentEfforts: StravatronSegmentEffort[];

//   averageCadence: number;
//   averageHeartrate: number;
//   deviceName: string;
//   hasHeartrate: boolean;
//   maxHeartrate: number;
//   maxWatts: number;
//   type: string;
//   utcOffset: number;

//   bestEfforts?: any; // DetailedSegmentEffort or DetailedSegmentEffort[] ??
// }

// export interface StravatronDetailedActivityAttributes {
//   calories: number;
//   segmentEfforts: StravatronSegmentEffort[];
//   map: StravaNativePolylineMap;
//   streams: any[];
// }

// export interface StravatronDetailedActivityData {
//   detailedActivityAttributes: StravatronDetailedActivityAttributes;
//   locationData: any[];
//   segments: StravatronSummarySegment[];
//   detailedSegments: StravatronDetailedSegment[];
//   segmentEfforts: StravatronSegmentEffort[];
//   segmentEffortsInActivity: StravatronSegmentEffort[];
// }

