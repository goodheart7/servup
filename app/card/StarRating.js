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

var StarRating = React.createClass(
  {
    getDefaultProps: function() {
      return {
        maxQunatity : '12',
      };
    },
    getInitialState() {
      return {
        liked: false,
      };
    },

    renderNumberofReviews () {
      let textStyle = this.props.reviewCount? this.props.reviewCount : styles.textStyle;
      if(this.props.numberOfReviews > 0) {
        return(
          <Text style={[this.props.style, textStyle ]}>
            {"("}{this.props.numberOfReviews}{")"}
          </Text>
        );
      }
      else {
        return <View/>;
      }

    },
    onPress () {
      if(this.props.numberOfReviews > 0 ) {
        this.props.navigator.push({id:11,cardId:this.props.cardId})
      }
    },

    render() {
      let style = this.props.style ? this.props.style : [];
      return (
          <TouchableOpacity style={[styles.ratingView,style]} onPress={() => {this.onPress()}}>
            <View style={styles.starRating}>
              {this.rating()}
            </View>
              {this.renderNumberofReviews()}
          </TouchableOpacity>
      );
    },
    rating () {
      let star = this.props.overallRating;
      let rating = [1,2,3,4,5];
      return rating.map((i) => {
        if (i <= star) {
          return(<View key={i}><Icon  name={'icon-Star_filled'} fontSize={25} color={'green'}/></View>)
        }
        else {
          return (<View key={i}><Icon  name={'icon-Star_Empty'} fontSize={23} color={'#979797'}/></View>)
        }
      });
},

  });
const styles = StyleSheet.create(
  {
    ratingView:
    {
      flexDirection: 'row',
      alignItems: 'center',
      // justifyContent: 'center',
      alignSelf: 'flex-start',
      marginTop:0,
       //margin: 5,
      paddingBottom: 17, //5
      marginHorizontal:5,
      //marginVertical: 3,
    },
    textStyle: {
      fontSize: 13,
      color: 'black',
      fontWeight: '400',
      fontFamily: Fonts.regFont[Platform.OS],
    },
    starRating:
    {
      flexDirection: 'row',
      //height:5,
     // width:5,
      alignItems: 'center',
      alignSelf: 'center',
      padding:5 ,
    },
    integerRating:
    {
      fontSize: 15,
      color: 'black',
      fontFamily: Fonts.regFont[Platform.OS],
    },

  });
module.exports = StarRating;
