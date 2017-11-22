import React, {
  Component,
} from 'react';

import {
  Navigator,
  View,
  Dimensions,
} from 'react-native';

const {height, width} = Dimensions.get('window');

import {IndicatorViewPager, PagerTitleIndicator, PagerDotIndicator} from 'rn-viewpager';

import TelcoMainCard from './components/TelcoMainCard';
import TelcoPlanSingle from './components/TelcoPlanSingle';
import ServicesCardMain from './components/ServicesCardMain';
import MyDeviceCard from './components/MyDeviceCard';

var TelcoCards = React.createClass({

  render() {
    return (
      <IndicatorViewPager	style={{height: height/2.8}} 	>
        <View>
          <TelcoMainCard 	navigator = {this.props.navigator} />
        </View>

        <View>
          <TelcoPlanSingle navigator = {this.props.navigator} />
        </View>

        <View>
          <ServicesCardMain navigator = {this.props.navigator} />
        </View>

        <View>
          <MyDeviceCard navigator = {this.props.navigator} />
        </View>
      </IndicatorViewPager>
    );
  }
});

module.exports = TelcoCards
