import React from 'react';
import PropTypes from 'prop-types';
import ReactDom from 'react-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import cjk from '../index';

class ReversingDistorter extends cjk.Distorter {
  constructor(key, priority, getRangeFunc) {
    super(key, priority);
    this.getRangeFunc = getRangeFunc;
  }

  isInRange = (defaultPointer, distortedPointer, prevDistortedPointer) => {
    const range = this.getRangeFunc();
    const curX = distortedPointer.currentX;
    const curY = distortedPointer.currentY;
    return range.left <= curX && curX <= range.right
           && range.top <= curY && curY <= range.bottom;
  }

  distort = (defaultPointer, distortedPointer, prevDistortedPointer) => {
    const range = this.getRangeFunc();
    const relativeX = distortedPointer.currentX - range.left;
    const relativeY = distortedPointer.currentY - range.top;
    return new cjk.CursorPointer(distortedPointer.prevX, distortedPointer.prevY, 
      range.width-relativeX+range.left, range.height-relativeY+range.top);
  }
}

class ReversingArea extends React.Component {
  static propTypes = {
    pos: PropTypes.shape({
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired,
    }),
    createAddDistorterEvent: PropTypes.func,
    createDeleteDistorterEvent: PropTypes.func
  }

  constructor(props) {
    super(props);
    this.distorter = new ReversingDistorter('reversing-distorter', 100, this.getRangeFunc);
  }

  render() {
    const style = {
      "width": this.props.pos.width,
      "height": this.props.pos.height,
      "backgroundColor": "#ff9999",
      "textAlign": "center"
    };
    return (
      <div style={style}>
        <p>Reversing Cursor</p>
      </div>
    );
  }

  componentDidMount() {
    this.props.createAddDistorterEvent([
      this.distorter
    ]);
  }

  componentWillUnmount() {
    this.props.createDeleteDistorterEvent([
      this.distorter
    ]);
  }

  getRangeFunc = () => (
    ReactDom.findDOMNode(this).getBoundingClientRect()
  )
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(cjk.ActionCreators, dispatch);
}

export default connect(null, mapDispatchToProps, null, {withRef: true})(ReversingArea);