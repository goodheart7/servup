/**
 * Created by Shoaib on 11/11/2016.
 */
import React, {Component} from 'react';
import {
  TextInput,
  View,
  Alert,
  Platform,
  Dimensions,
  StyleSheet,
  AsyncStorage,
} from 'react-native';
var { height, width } = Dimensions.get('window');
import MenuBar from '../common/MenuBar';
import {
  Style,
  StyleConstants,
  Fonts
} from '../stylesheet/style';
import WriteRating from '../card/WriteRating';

let AppRating = React.createClass({
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
        <View>
          <WriteRating starCount={this.state.rating} onPress={(i) => {
            this.setState({rating: i})
          }}/>
        </View>
        <View style={styles.lineSeparator}/>
        <TextInput
          ref="text"
          placeholderTextColor={StyleConstants.textColorGray}
          placeholder="Write Here..."
          autoCapitalize="words"
          keyboardType="default"
          multiline={true}
          //numberOfLine={10}
          returnKeyType="done"
          underlineColorAndroid="transparent"
          style={[styles.textInput, Style.f20, {marginHorizontal:15}]}
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
    /*AsyncStorage.getItem("UserToken")
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
      })*/
    Alert.alert('Thanks', 'Your Feed Back is Important for us',
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'OK', onPress: () => this.props.navigator.pop()}
      ])
    console.log('myObject', obj);


    //token,cardId,review
    console.log('@@@@@@@@@@@@@@@', this.state.rating);
    console.log('@@@@@@@@@@@@@@@', this.state.reviewText);
  },
  renderStickyHeader() {
    return (
      <MenuBar
        leftIcon={'icon-arrow-left2'}
        title={"Rate Our App"}
        rightIcon={'icon-done2'}
        onPressRightIcon={this.onPressSubmit}
        onPressLeftIcon={() => this.props.navigator.pop() }
      />
    );
  },
});
const styles = StyleSheet.create({
  textStyle: {
    fontSize: 20,
    color: 'black',
    paddingVertical: 10,
    fontFamily: Fonts.regFont[Platform.OS],
  },
  lineSeparator: {
    height: 0.7,
    backgroundColor: 'black',
    marginVertical: 5,
    width: width - 20,
    marginHorizontal: 10,
  },
});
export default AppRating;
