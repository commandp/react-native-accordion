'use strict';

var React = require('react-native');
var tweenState = require('react-tween-state');

var {
  StyleSheet,
  TouchableHighlight,
  Animated,
  Easing,
  View,
  Text
} = React;

var Accordion = React.createClass({
  propTypes: {
    activeOpacity: React.PropTypes.number,
    animationDuration: React.PropTypes.number,
    content: React.PropTypes.element.isRequired,
    easing: React.PropTypes.string,
    header: React.PropTypes.element.isRequired,
    onPress: React.PropTypes.func,
    underlayColor: React.PropTypes.string,
    style: React.PropTypes.object
  },

  getDefaultProps() {
    return {
      activeOpacity: 1,
      animationDuration: 300,
      easing: 'linear',
      underlayColor: '#000',
      style: {},
    };
  },

  getInitialState() {
    return {
      is_visible: false,
      height: new Animated.Value(0),
      content_height: 0
    };
  },

  close() {
    this.state.is_visible && this.toggle();
  },

  open() {
    !this.state.is_visible && this.toggle();
  },

  toggle() {
    this.state.is_visible = !this.state.is_visible;

    Animated.timing(this.state.height, {
      easing: Easing.inOut(Easing.quad),
      duration: 300,
      toValue: this.state.is_visible ? this.state.content_height : 0,
    }).start();
  },

  _onPress() {
    this.toggle();

    if (this.props.onPress) {
      this.props.onPress.call(this);
    }
  },

  _getContentHeight() {
    if (this.refs.AccordionContent) {
      this.refs.AccordionContent.measure((ox, oy, width, height, px, py) => {
        // Sets content height in state
        this.setState({content_height: height});
      });
    }
  },

  componentDidMount() {
    // Gets content height when component mounts
    // without setTimeout, measure returns 0 for every value.
    // See https://github.com/facebook/react-native/issues/953
    setTimeout(this._getContentHeight);
  },

  render() {
    return (
      /*jshint ignore:start */
      <View style={{ overflow: 'hidden'}}>
        <TouchableHighlight
          ref="AccordionHeader"
          onPress={this._onPress}
          underlayColor={this.props.underlayColor}
          style={this.props.style}
        >
          {this.props.header}
        </TouchableHighlight>
        <Animated.View
          ref="AccordionContentWrapper"
          style={{ height: this.state.height, overflow: 'hidden' }}
        >
          <View ref="AccordionContent">
            {this.props.content}
          </View>
        </Animated.View>
      </View>
      /*jshint ignore:end */
    );
  }
});

module.exports = Accordion;
