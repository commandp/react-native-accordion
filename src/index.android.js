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
    let height = new Animated.Value(0)

    return {
      is_visible: false,
      isAnimating: true,
      height: height,
      content_height: 0,
      isAfterLayout: false
    };
  },

  componentDidMount () {
    this.state.height.addListener(({ value }) => {
      if (
        (value === this.state.content_height)
        && value !== 0
      ) {
        this.setState({
          isAnimating: false,
        })
      }
    })
  },
  close() {
    this.setState({
      is_visible: false,
      isAnimating: true
    })

    Animated.timing(this.state.height, {
      easing: Easing.inOut(Easing.quad),
      duration: 300,
      toValue: 0
    }).start();
  },

  open() {
    this.setState({
      is_visible: true,
      isAnimating: true
    })

    Animated.timing(this.state.height, {
      easing: Easing.inOut(Easing.quad),
      duration: 300,
      toValue: this.state.content_height
    }).start()
  },

  toggle() {
    if (this.state.is_visible) {
      this.close()
    } else {
      this.open()
    }
  },

  _onPress() {
    this.toggle();

    if (this.props.onPress) {
      this.props.onPress()
    }
  },

  handleContentLayout(e) {
    let height = e.nativeEvent.layout.height

    if(height !== 0) {
      this.setState({
        content_height: height,
        isAfterLayout: true
      })
    }
  },

  renderContent () {
    if(!this.state.isAnimating || !this.state.isAfterLayout) {
      return this.props.content
    }
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
          style={{ height: this.state.height, backgroundColor: this.props.contentBackground }}
        >
          <View ref="AccordionContent" onLayout={this.handleContentLayout}>
            {this.renderContent()}
          </View>
        </Animated.View>
      </View>
      /*jshint ignore:end */
    );
  }
});

module.exports = Accordion;
