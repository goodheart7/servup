/**
 * Created by Shoaib on 11/7/2016.
 */
import React, {
	Component,
} from 'react';
import {getReviews} from '../../lib/networkHandler';
import {
	TouchableOpacity,
	Text,
	View,
	Image,
	ScrollView,
	Dimensions,
	AsyncStorage,
	Platform,
	StyleSheet,
} from 'react-native';
import {
	Style,
	StyleConstants,
	Fonts
} from '../stylesheet/style';
import StarRating from  './StarRating';
var defaultPic = require('../../res/common/profile.png');
import MenuBar from '../common/MenuBar';
import cardBaseStyle from './Styles/cardBaseStyle';
import styles from './Style';
import * as Animatable from 'react-native-animatable';
import Review from './ReviewsStub';
import moment from 'moment';
const tempPic = require('../../res/common/profile.png');
var Reviews = React.createClass(
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
			reviews: [],
			Token: '',
		};
	},
	renderStickyHeader() {
		return (
			<MenuBar
				// color = {'red'} // Optional By Default 'black'
				title={"Reviews"} // Optional
				leftIcon={'icon-back_screen_black'}
				//rightIcon={'icon-done2'}// Optional
				onPressLeftIcon={() => this.props.navigator.pop()} // Optional
				//   onPressRightIcon={this.onPressSubmit} // Optional
			/>
		);
	},
	componentDidMount() {
		AsyncStorage.getItem("UserToken")
			.then((token) => {
			this.setState({Token: token});
			return getReviews(token, this.props.cardId)
		})
			.then((resp) => {
		 //   resp = Review;
        console.log('@@@@@@@@ reviews', resp);
				this.setState({reviews: resp});
			})
			.catch((err) => {
			 // this.setState({reviews: Review});
				console.log('@@@@@@@@ review Error', err);
				//Alert.alert(AppConstants.ServerFailureHeading, AppConstants.ServerFailureMessage);
			})
	},
	render(){
		//console.log('@@@@@@@@@@@@@@@@@@@array',this.state.reviews);
		return (
			<Animatable.View animation="fadeInUpBig" style={{flex:1}}>
				{this.renderStickyHeader()}
				<ScrollView style={{flex: 1}}>
					{this.Review(this.state.reviews)}
				</ScrollView>
			</Animatable.View>
		);
	},

	Review (reviews) {
		return reviews.map((array, key) => {
			let userImage = array.profilePicUrl ? {uri: array.profilePicUrl} : defaultPic;
			return (
				<View key={key}>
					<View style={{marginHorizontal:30}}>
		              <TouchableOpacity
		                // onPress = {this.openCreator}
		                style={{
		      							flex: 1,
		      							justifyContent: 'flex-start',
		      							flexDirection: 'row',
		      							alignItems: 'center',
		      							marginTop: 20
		      						}}>
		                <Image
		                  style={cardBaseStyle.reviewerImage}
		                  source={ userImage}
		                  resizeMode={'cover'}
		                />
		                <View style={{flex: 1, flexDirection: 'column', marginHorizontal:10}}>
		                  <Text style={[Style.textColorBlack, {fontSize: 18, fontWeight: '500'}]}>
		                    {array.name && array.name.length > 15 ? array.name.substring(0, 18) + '...' : array.name }
		                  </Text>
		                  <Text style={[Style.textColorBlack, {fontSize: 14}]}>
		                    {moment.utc(array.createdAt).format('MMM YYYY')}
		                  </Text>
		                </View>
		                <View style={{flex: 1, alignItems: 'flex-end'}}>
		                  <StarRating
		                    overallRating={array.rating}
		                    style={{alignSelf: 'flex-end', marginRight:-5}}
		                    navigator={this.props.navigator}
		                    cardId={this.props.cardId}
		                  />
		                </View>
		              </TouchableOpacity>

		                <Text style={[cardBaseStyle.descriptionText, {textAlign: 'left', marginVertical:15}]}>
		                  {array.reviewText}
		                </Text>
		            </View>
					<View style={cardBaseStyle.lineSeparator}/>
				</View>
			);
		});
	},

});

const mystyles = StyleSheet.create(
	{
		relatedImage: {
			resizeMode: 'cover',
			//  width: width*0.45,
			// height: height*0.16,
			marginBottom: 5,
		},

	});
module.exports = Reviews;