import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

export interface DetailedActivityProps {
  params: any;
}

class DetailedActivity extends React.Component<DetailedActivityProps> {

  componentWillMount() {
    console.log('DetailedActivity, id:', this.props.params.id);
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
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailedActivity);
