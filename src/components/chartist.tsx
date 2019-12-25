import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import ChartistGraph from 'react-chartist';
import { IBarChartOptions } from 'chartist';

class BarComponent extends React.Component<any> {

  render(): any {
    const data = {
      labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10'],
      series: [
        [1, 2, 4, 8, 6, -2, -1, -4, -6, -2]
      ]
    };

    const options: IBarChartOptions = {
      high: 10,
      low: -10,
      axisX: {
        labelInterpolationFnc(value: any, index: any) {
          return index % 2 === 0 ? value : null;
        }
      }
    };

    const type = 'Bar';

    return (
      <div>
        <ChartistGraph data={data} options={options} type={type} />
      </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(BarComponent);
