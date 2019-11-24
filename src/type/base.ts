export interface StravaModelState {
  activities: ActivitiesMap;
  detailedActivities: DetailedActivitiesMap;
}

export interface ActivitiesMap {
  [id: string]: Activity;
}

export interface Athlete {
  id: string;
  nickname: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Activity {
  id: number;
  athlete: any;
  averageSpeed: number;
  description: string;
  distance: number;
  elapsedTime: number;
  kilojoules: number;
  city: string;
  mapSummaryPolyline?: string;
  maxSpeed: number;
  movingTime: number;
  name: string;
  startDateLocal: string;
  totalElevationGain: number;
}

export interface DetailedActivitiesMap {
  [id: string]: DetailedActivity;
}

export interface Segment {
  id: number;
  name: string;
  distance: number;
  averageGrade: number;
  maximumGrade: number;
  elevationHigh: number;
  elevationLow: number;
}

export interface Achievement {
  type: string;
  rank: number;
}

export interface SegmentEffort {
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
}

export interface DetailedActivity extends Activity {
  mapPolyline: string;
  averageTemp: string;
  averageWatts: string;
  segmentEfforts: SegmentEffort[];
}
