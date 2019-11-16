import * as React from 'react';
import { connect } from 'react-redux';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { bindActionCreators } from 'redux';

export interface AppProps {
}

class App extends React.Component<AppProps> {

  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <MuiThemeProvider>
        <div>
          <h2>StravaTed</h2>
          Eat more pizza!
        </div>
      </MuiThemeProvider>
    );
  }
}

function mapStateToProps(state: any) {
  return {
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
