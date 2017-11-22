/**
 * Created by Shoaib on 11/16/2016.
 */
/**
 * Created by Shoaib on 11/1/2016.
 */
import React, {
  Component,
} from 'react';

import {
  TouchableOpacity,
  Text,
  View,
  Image,
  Dimensions,
  Platform,
  StyleSheet,
} from 'react-native';
import {
  Style,
  StyleConstants,
  Fonts
} from '../stylesheet/style';

import Icon from '../stylesheet/icons';
var starEmpty = require('../../res/common/unfilled_star.png');
var starFilled = require('../../res/common/filled_star.png');
var WriteRating = React.createClass(
  {
    getDefaultProps: function () {
      return {
        //rating
        maxQunatity: '12',
      };
    },
    getInitialState() {
      return {
        liked: false,
      };
    },
    render() {
      return (
        <View style={styles.ratingView}>
          <View style={styles.starRating}>
            {this.rating(this.props.starCount)}
          </View>
        </View>
      );
    },
    handlePress(i){
      this.props.onPress(i);
    },
    rating (star) {
      //let star = 4;
      let rating = [1, 2, 3, 4, 5]
      return rating.map((i) => {
        if (i <= star) {
          return (
            <TouchableOpacity onPress={() => this.handlePress(i)}>
              <Icon key={i} name={'icon-Star_filled'} fontSize={47} color={'orange'}/>
            </TouchableOpacity>)
        }
        else {
          return (
            <TouchableOpacity onPress={() => this.handlePress(i)}>
              <Icon key={i} name={'icon-Star_Empty'} fontSize={43} color={'#00833c'}/>
            </TouchableOpacity>)
        }
      });
    },

  });
const styles = StyleSheet.create(
  {
    ratingView: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'center',
      marginVertical: 25,
    },
    starRating: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'center',
    },

  });
module.exports = WriteRating;