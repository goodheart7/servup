/**
 * Created by Shoaib on 11/11/2016.
 */
import React, {Component} from 'react';
import {
  TextInput,
  View,
  Alert,
  AsyncStorage,
} from 'react-native';
let images = {
  'right_caret': require('../../../res/common/arrow_right.png'),
  'left_caret': require('../../../res/common/back.png'),
  'check': require('../../../res/common/check.png'),
  'empty': require('../../../res/common/emptyPixel.png'),
};
import MenuBar from '../../common/MenuBar';
import {postReviews} from '../../../lib/networkHandler';
import StarRating from  '../StarRating';
import styles from  './Style';
import WriteRating from '../WriteRating';

let WriteReview = React.createClass({
  getInitialState()
  {
    return {
      SwitchState: false,
      rating: 0,
      reviewText: '',
    }
  },
  render() {
    return (
      <View>
        {this.renderStickyHeader()}
        <View style={{marginVertical:20, alignSelf:'center', justifyContent:'center'}}>
          <WriteRating starCount={this.state.rating} onPress={(i) => {
            this.setState({rating: i})
          }}/>
        </View>
        <View style={Style.lineSeparator}/>
        <TextInput
          ref="text"
          placeholderTextColor={StyleConstants.textColorGray}
          placeholder="Write Here..."
          autoCapitalize="words"
          keyboardType="default"
          multiline={true}
          numberOfLine={3}
          returnKeyType="done"
          underlineColorAndroid="transparent"
          style={[styles.textInput, Style.f20, {margin:30, height:150}]}
          onChangeText={(text) => {
            this.setState({reviewText: text});
          }}
          onSubmitEditing={(event) => {
            this.onPressSubmit();
          }}
        />
      </View>
    );
  },
  onPressSubmit() {
    let obj = {
      rating: this.state.rating,
      reviewText: this.state.reviewText,
      cardId: this.props.cardId,
    }
    AsyncStorage.getItem("UserToken")
      .then((value) => {
        this.setState({"token": value})
        return postReviews(value, this.props.cardId, obj);
      })
      .then((resp) => {
        Alert.alert('Thanks', 'Your Feed Back is Important for us',
          [
            {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
            {text: 'OK', onPress: () => this.props.navigator.pop()}
          ])

      })
      .catch((err) => {
        console.log(err);
        Alert.alert(AppConstants.ServerFailureHeading, AppConstants.ServerFailureMessage);
      })
    console.log('myObject', obj);


    //token,cardId,review
    console.log('@@@@@@@@@@@@@@@', this.state.rating);
    console.log('@@@@@@@@@@@@@@@', this.state.reviewText);
  },
  renderStickyHeader() {
    return (
      <MenuBar
        leftIcon={'icon-back_screen_black'}
        title={"Write a Review"}
        rightIcon={'icon-done'}
        onPressRightIcon={this.onPressSubmit}
        onPressLeftIcon={() => this.props.navigator.pop() }
      />
    );
  },
});

export default WriteReview;
