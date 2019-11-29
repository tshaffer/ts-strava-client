export interface StravaModelState {
  activities: ActivitiesMap;
  detailedActivities: DetailedActivityAttributesMap;
  segments: SegmentsMap;
  segmentEfforts: SegmentEffortsMap;
}

export interface ActivitiesMap {
  [id: string]: Activity; // activityid
}

export interface DetailedActivityAttributesMap {
  [id: string]: DetailedActivityAttributes; // activityId
}

export interface SegmentsMap {
  [id: string]: Segment; // segmentId
}

export interface SegmentEffortsMap {
  [id: string]: SegmentEffort; // segmentEffortId
}


export interface Athlete {
  id: string;
  nickname: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface StravaNativeLatLng {
  latlng: number[];
}

export interface StravaNativePolylineMap {
  id: string;
  polyline: string;
  summary_polyline: string;
}

export interface Segment {
  id: number;
  name: string;
  distance: number;
  averageGrade: number;
  maximumGrade: number;
  elevationHigh: number;
  elevationLow: number;
  activityType: string;
  climbCategory: number;
  endLatlng: StravaNativeLatLng;
  startLatLng: StravaNativeLatLng;
  startDate: Date;
  startDateLocal: Date;
}

export interface Achievement {
  type: string;
  rank: number;
}

export interface SegmentEffortWithSegment {
  id: number;
  name: string;
  elapsedTime: number;
  movingTime: number;
  startDateLocal: Date;
  distance: number;
  averageWatts: number;
  segment: Segment;
  prRank: number;
  achievements: Achievement[];
  activityId: number;
  averageCadence: number;
  averageHeartrate: number;
  deviceWatts: boolean;
  maxHeartrate: number;
  startDate: Date;
}

export interface SegmentEffort {
  id: number;
  name: string;
  activityId: number;
  elapsedTime: number;
  movingTime: number;
  startDateLocal: Date;
  distance: number;
  averageWatts: number;
  segmentId: number;
  prRank: number;
  achievements: Achievement[];
}

export interface Activity {
  achievementCount: number;
  athleteId: number;
  averageSpeed: number;
  // averageTemp: number;
  averageWatts: number;
  deviceWatts: boolean;
  distance: number;
  elapsedTime: number;
  elevHigh: number;
  elevLow: number;
  endLatlng: StravaNativeLatLng;
  id: number;
  kilojoules: number;
  city: string;
  country: string;
  state: string;
  map: StravaNativePolylineMap;
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
}

export interface DetailedActivity extends Activity {
  // averageTemp: number;
  averageCadence: number;
  averageHeartrate: number;
  averageWatts: number;
  calories: number;
  description: string;
  deviceName: string;
  deviceWatts: boolean;
  hasHeartrate: boolean;
  maxHeartrate: number;
  maxWatts: number;
  segmentEfforts: SegmentEffortWithSegment[];
  type: string;
}

export interface DetailedActivityAttributes {
  id: number;
  // mapPolyline: string;
  // averageTemp: number;
  averageWatts: number;
}
