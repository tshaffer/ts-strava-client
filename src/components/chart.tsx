import { Chart } from 'react-google-charts';
import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

const options = {
  title: 'Age vs. Weight comparison',
  hAxis: { title: 'Age', viewWindow: { min: 0, max: 15 } },
  vAxis: { title: 'Weight', viewWindow: { min: 0, max: 15 } },
  legend: 'none'
};
const data = [
  ['Age', 'Weight'],
  [8, 12],
  [4, 5.5],
  [11, 14],
  [4, 5],
  [3, 3.5],
  [6.5, 7]
];

class ChartComponent extends React.Component<any> {
  render(): any {
    return (
      <Chart
        chartType='ScatterChart'
        data={data}
        options={options}
        width='80%'
        height='400px'
        legendToggle
      />
    );
  }
}

function mapStateToProps(state: any, ownProps: any) {
  return {
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ChartComponent);
