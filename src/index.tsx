import thunkMiddleware from 'redux-thunk';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { 
  Router, 
  Route,
  hashHistory
} from 'react-router';

import { createStore, applyMiddleware, compose } from 'redux';

import { rootReducer } from './model';

import App from './components/app';
import Activities from './components/activities';

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  rootReducer, /* preloadedState, */ composeEnhancers(
    applyMiddleware(thunkMiddleware)
  ));

ReactDOM.render(
  <Provider store={store}>
    <Router history={hashHistory}>
      <Route path='/' component={App} />
      <Route path='/activities' component={Activities} />
    </Router>
  </Provider>,
  document.getElementById('content') as HTMLElement,
);
