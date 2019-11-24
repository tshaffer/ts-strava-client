import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {
  loadDetailedActivity
} from '../controller';

export interface DetailedActivityProps {
  params: any;
  onLoadDetailedActivity: (activityId: string) => any;
}

class DetailedActivity extends React.Component<DetailedActivityProps> {

  componentWillMount() {
    console.log('DetailedActivity, id:', this.props.params.id);
  }

  componentDidMount() {
    this.props.onLoadDetailedActivity(this.props.params.id);
  }

  render(): any {
    return null;
  }
}

function mapStateToProps(state: any, ownProps: any) {
  return {
    params: ownProps.params,
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    onLoadDetailedActivity: loadDetailedActivity,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailedActivity);
