export interface StravaModelState {
  activities: ActivitiesState;
}

export interface ActivitiesState {
  activities: ActivitiesMap;
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

