import { Action, Dispatch } from 'redux';
import { StravaModelState } from '../type';

export interface StravaBaseAction extends Action {
  type: string;
  payload: {} | null;
}

export interface StravaModelBaseAction<T> extends Action {
  type: string;   // override Any - must be a string
  payload: T;
  error?: boolean;
  meta?: {};
}

export interface ActivityAction<T> extends StravaBaseAction {
  payload: T;
}
