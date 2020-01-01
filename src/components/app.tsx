import * as React from 'react';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';

// import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { bindActionCreators } from 'redux';
import { loadSummaryActivities } from '../controller';

export interface AppProps {
  onShowActivities: () => any;
}

class App extends React.Component<AppProps> {

  constructor(props: any) {

    super(props);

    console.log('pizza69');

    this.handleShowActivities = this.handleShowActivities.bind(this);
  }

  handleShowActivities() {
    this.props.onShowActivities();
    hashHistory.push('/activities');
  }

  render() {
    return (
      <div>
        <h2>StravaTed</h2>
        Eat more pizza and burgers!
          <br />
        <button onClick={this.handleShowActivities}>Show athlete activities</button>

      </div>
    );
  }
}

function mapStateToProps(state: any) {
  return {
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    onShowActivities: loadSummaryActivities,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
