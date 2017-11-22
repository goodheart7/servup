'use strict';
import React, { Component } from 'react';
import {
	StyleSheet,
	Text,
	View,
	Dimensions,
	Platform,
	AsyncStorage,
	ScrollView,
	TextInput,
	Alert,
	TouchableOpacity,
	Modal,
} from 'react-native';

import moment from 'moment';
// import Modal from 'react-native-simple-modal';
var {GooglePlacesAutocomplete} = require('react-native-google-places-autocomplete');
import get from '../../../lib/get';
import {getUserProfile, updateUserProfile} from '../../../lib/networkHandler';
//import RNGooglePlacePicker from 'react-native-google-place-picker';
let images = {
	'right_caret': require('../../../res/common/arrow_right.png'),
	'left_caret': require('../../../res/common/back.png'),
	'plus': require('../../../res/common/add.png'),
	'check': require('../../../res/common/check.png'),
};
import DatePicker from 'react-native-datepicker';
import MenuBar from '../../common/MenuBar';
var KeyboardSet = require('../../common/KeyboardSet');

import {
	Style,
	StyleConstants,
	Fonts
} from '../../stylesheet/style';
const {height, width} = Dimensions.get('window');

let EditProfile = React.createClass({

	getInitialState () {
		return {
        	placesAPIKey: 'AIzaSyDRb3_kTnAgVqV1VhKy1HctzjA84DeIftg',
			enable: true,
			loading: false,
			locationX: '',
			modalVisible: false,
		};
	},

	componentDidMount () {
 /*   RNGooglePlacePicker.show((response) => {
			if (response.didCancel) {
				console.log('User cancelled GooglePlacePicker');
			}
			else if (response.error) {
				console.log('GooglePlacePicker Error: ', response.error);
			}
			else {
				this.setState({
					location: response
				});
			}
		})
*/
		AsyncStorage.getItem("UserToken")
		.then((value) => {
			this.setState({"token": value});
			return getUserProfile(this.state.token);
		})
		.then((value) => {
			console.log('User Profile', value);
		/*  if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition((position)=>{
					console.log('@@@@@@@@@@@@@@@@@ position', position)
				 // var initialPosition = JSON.stringify(position);
					//console.log('@@@@@@@@@@@@@@@@@', initialPosition);
				});
			} else {
				console.log('@@@@@@@@@@@@@@@@@ elseekjkjwe ');
			}
			this.setState({ ...value });*/
			this.setState({ ...value , locationX: value.location.city})
		})
		.catch((error) => {
			console.log('EditProfile Error: ', error);
		});

	},

	componentWillUnmount() {
		if(this.props.contextId == 100)
		{
			this.props.onUnmount();
			console.log('Bye to side menu');
		}

	},
	onPressBack () {
		this.props.navigator.pop();
	},

	onPressUpdate () {
		let {enable, name} = this.state;

		if (name === '') {
			Alert.alert('Name Required', 'This is a required field');
			this.refs.name.focus();
		}

		if (enable && name !== '') {
			this.setState({ enable: false, loading: true }, () => {
				this.onSubmitForm();
			});
		}
	},

	onSubmitForm () {
		let {
			name,
			email,
			title,
			locationX,
			company,
			tagLine,
			aboutMe,
			birthDay,
			personalURL,
			faceBook,
			twitter,
			linkedIn,
			instagram,
		} = this.state;
		let myLocation = {
			latitude:'',
			longitude:'',
			area:'',
			city: locationX,
			country:'',
			placeId:'',
			description:'',
		};

		let object = {
			name,
			email,
			title,
			location: myLocation,
			company,
			tagLine,
			aboutMe,
			birthDay,
			personalURL,
			faceBook,
			twitter,
			linkedIn,
			instagram,
		};

		updateUserProfile(this.state.token, object)
		.then ((userUpdated) => {
			console.log ("updateUser response is: " , userUpdated);
			this.props.navigator.pop();
		})
		.catch((err) => {
			console.log(err);
			Alert.alert(err.errorCode, err.data);
		});

		 //this.props.navigator.push({ id: 6 });
		// console.log(object);
	},

	locationClicked() {
		this.setState({modalVisible: !this.state.modalVisible});
	},

	modalView() {
		return (
			<Modal 
				animationType = {"fade"}
				transparent = {true}
				visible = {this.state.modalVisible}
				onRequestClose = {() => {console.log("Modal has been closed.")}}
			>
				<TouchableOpacity style = {styles.modalOverallView} onPress = {this.locationClicked}>
					<View style = {styles.modalInnerView}>
						<GooglePlacesAutocomplete
							placeholder = 'Enter Location'
							placeholderTextColor = 'grey'
							minLength = {2} // minimum length of text to search
							autoFocus = {true}
							listViewDisplayed = 'auto'    // true/false/undefined
							fetchDetails = {true}
							renderDescription = {(row) => row.description || row.vicinity} // custom description render
							onPress = {(data, details = null) => { // 'details' is provided when fetchDetails = true
								this.setState({locationX: data.description || details.vicinity});
								console.log(data);
								console.log(details);
								this.locationClicked();
							}}
							getDefaultValue={() => {
								return this.state.locationX; // text input default value
							}}
							query = {{
							// available options: https://developers.google.com/places/web-service/autocomplete
								key: this.state.placesAPIKey,
								language: 'en', // language of the results
								types: '(cities)', // default: 'geocode'
							}}
							styles = {{
								textInputContainer: {
									backgroundColor: 'rgba(200,200,200,0.5)',
									height: 44,
									borderTopColor: 'transparent',
									borderBottomColor: 'transparent',
									borderTopWidth: 0,
									borderBottomWidth: 0,
									borderRadius: 10,
								},
								textInput: {
									color: 'black',
									backgroundColor: 'rgba(100,100,100,0.0)',
								},
								description: {
									fontWeight: 'bold',
									color: 'black',
								},
								predefinedPlacesDescription: {
									color: StyleConstants.primary,
								},
							}}

							currentLocation = {true} // Will add a 'Current location' button at the top of the predefined places list
							currentLocationLabel = "Pick Current location"
							nearbyPlacesAPI = 'GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
							// GoogleReverseGeocodingQuery={{
							// available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
							// }}
							// GooglePlacesSearchQuery={{
							// available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
								// rankby: 'distance',
								// types: ['address', '(cities)'],
							// }}
						/>
					</View>
					<KeyboardSet/>
				</TouchableOpacity>
			</Modal>
		);
	},

	render () {
		let {navigator} = this.props;
		let {
			name,
			title,
			location,
			locationX,
			company,
			tagLine,
			aboutMe,
			birthDay,
			personalURL,
			faceBook,
			twitter,
			linkedIn,
			instagram,
			email,
		} = this.state;

		return (
			<View style = {styles.container}>
				{this.modalView()}

				<MenuBar
					// color = {'red'} // Optional By Default 'black'
					title = {'Edit Profile'} // Optional
					leftIcon = {'icon-back_screen_black'}
					rightIcon = {'icon-done'} // Optional
					// disableLeftIcon = {true} // Optional By Default false
					// disableRightIcon = {true} // Optional By Default false
					onPressLeftIcon = {() => { navigator.pop() }} // Optional
					onPressRightIcon = {this.onPressUpdate} // Optional
				/>

				<ScrollView style={styles.form} keyboardShouldPersistTaps={'always'}>

					<View style={styles.inputGroup}>
						<Text style={[Style.f20, styles.text]}>Name</Text>
						<View style={styles.textInputContainer}>
							<TextInput
								ref = "name"
								placeholderTextColor={StyleConstants.textColorGray}
								placeholder="Enter Your Name"
								value={name}
								autoCapitalize = "words"
								keyboardType = "default"
								returnKeyType = "done"
								underlineColorAndroid = "transparent"
								style={[styles.textInput, Style.f20]}
								onChangeText={(name) => {
									this.setState({ name });
								}}
								onSubmitEditing={(event) => {
									this.refs.email.focus();
								}}
							/>
						</View>
					</View>

					<View style={styles.inputGroup}>
						<Text style={[Style.f20, styles.text]}>Email</Text>
						<View style={styles.textInputContainer}>
							<TextInput
								ref = "email"
								placeholderTextColor={StyleConstants.textColorGray}
								placeholder="Enter Your Email"
								value={email}
								autoCapitalize = "words"
								keyboardType = "email-address"
								returnKeyType = "done"
								underlineColorAndroid = "transparent"
								style={[styles.textInput, Style.f20]}
								onChangeText={(email) => {
									this.setState({ email });
								}}
								onSubmitEditing={(event) => {
									this.refs.title.focus();
								}}
							/>
						</View>
					</View>

					<View style={styles.inputGroup}>
						<Text style={[Style.f20, styles.text]}>Title</Text>
						<View style={styles.textInputContainer}>
							<TextInput
								ref = "title"
								placeholderTextColor={StyleConstants.textColorGray}
								placeholder="Enter Your Title"
								value={title}
								autoCapitalize = "words"
								keyboardType = "default"
								returnKeyType = "done"
								underlineColorAndroid = "transparent"
								style={[styles.textInput, Style.f20]}
								onChangeText={(title) => {
									this.setState({ title });
								}}
								onSubmitEditing={(event) => {
									this.refs.location.focus();
								}}
							/>
						</View>
					</View>

					<View style={styles.inputGroup}>
						<Text style={[Style.f20, styles.text]}>Location</Text>
						<TouchableOpacity style={styles.textInputContainer} onPress = {this.locationClicked}>
							<TextInput
								ref = "location"
								editable = {false}
								placeholderTextColor={StyleConstants.textColorGray}
								placeholder="Enter Your Location"
								value = {this.state.locationX}
								autoCapitalize = "words"
								keyboardType = "default"
								returnKeyType = "done"
								underlineColorAndroid = "transparent"
								style={[styles.textInput, Style.f20]}
								onChangeText={(locationX) => {
									this.setState({ locationX});
								}}
								onSubmitEditing={(event) => {
									this.refs.company.focus();
								}}
							/>
						</TouchableOpacity>
					</View>

					<View style={styles.inputGroup}>
						<Text style={[Style.f20, styles.text]}>Company</Text>
						<View style={styles.textInputContainer}>
							<TextInput
								ref = "company"
								placeholderTextColor={StyleConstants.textColorGray}
								placeholder="Enter Your Company"
								value={company}
								autoCapitalize = "words"
								keyboardType = "default"
								returnKeyType = "done"
								underlineColorAndroid = "transparent"
								style={[styles.textInput, Style.f20]}
								onChangeText={(company) => {
									this.setState({ company });
								}}
								onSubmitEditing={(event) => {
									this.refs.aboutMe.focus();
								}}
							/>
						</View>
					</View>

					<View style={styles.inputGroup}>
						<Text style={[Style.f20, styles.text]}>About</Text>
						<View style={styles.textInputContainer}>
							<TextInput
								ref = "aboutMe"
								placeholderTextColor={StyleConstants.textColorGray}
								placeholder="Tell us about yourself"
								value={aboutMe}
								multiline={true}
								autoCapitalize = "words"
								keyboardType = "default"
								returnKeyType = "done"
								underlineColorAndroid = "transparent"
								style={[styles.textInput, Style.f20]}
								onChangeText={(aboutMe) => {
									this.setState({ aboutMe });
								}}
							/>
						</View>
					</View>

					<View style={styles.inputGroup}>
						<Text style={[Style.f20, styles.text]}>Date Of Birth</Text>
						<View style={styles.textInputContainer}>
							<DatePicker
								style = {{flex: 1}}
								date = {this.state.birthDay}
								mode = "date"
								placeholder = {"Birthday"}
								format = "DD.MM.YYYY"
								minDate = {new Date()} 
								maxDate = "01.06.2050"
								confirmBtnText = "Select"
								cancelBtnText = "Cancel"
								showIcon = {false}
								onDateChange={(date) => this.setState({birthDay: date})}
								customStyles = {{
									// dateIcon: {
									// //	position: 'absolute',
									// //	top: 4,
									// 	// marginLeft: width/2.5,
									// 	left: Platform.OS == 'ios'? width/this.props.left || width/2.5 : 0,
									// 	alignSelf: 'center',
									// 	width: 20,
									// 	height: 20,
									// },

									dateInput: {
										borderColor: 'transparent',
										alignSelf: 'flex-start'
									},

									placeholderText: [styles.textInput, Style.f20, {right: Platform.OS == 'ios'?  width/2.5 : 0}],
									dateText: [styles.textInput, Style.f20]
									// ... You can check the source to find the other keys.
								}}
							/>
						</View>
					</View>

					<View style={styles.inputGroup}>
						<Text style={[Style.f20, styles.text]}>Website</Text>
						<View style={styles.textInputContainer}>
							<TextInput
								ref = "personalURL"
								placeholderTextColor={StyleConstants.textColorGray}
								placeholder="Your website"
								value={personalURL}
								autoCapitalize = "words"
								keyboardType = "email-address"
								returnKeyType = "done"
								underlineColorAndroid = "transparent"
								style={[styles.textInput, Style.f20]}
								onChangeText={(personalURL) => {
									this.setState({ personalURL });
								}}
								onSubmitEditing={(event) => {
									this.refs.faceBook.focus();
								}}
							/>
						</View>
					</View>

					<View style={styles.inputGroup}>
						<Text style={[Style.f20, styles.text]}>Facebook</Text>
						<View style={styles.textInputContainer}>
							<TextInput
								ref = "faceBook"
								placeholderTextColor={StyleConstants.textColorGray}
								placeholder="Your Facebook username"
								value={faceBook}
								autoCapitalize = "words"
								keyboardType = "email-address"
								returnKeyType = "done"
								underlineColorAndroid = "transparent"
								style={[styles.textInput, Style.f20]}
								onChangeText={(faceBook) => {
									this.setState({ faceBook });
								}}
								onSubmitEditing={(event) => {
									this.refs.twitter.focus();
								}}
							/>
						</View>
					</View>

					<View style={styles.inputGroup}>
						<Text style={[Style.f20, styles.text]}>Twitter</Text>
						<View style={styles.textInputContainer}>
							<TextInput
								ref = "twitter"
								placeholderTextColor={StyleConstants.textColorGray}
								placeholder="Your website"
								value={twitter}
								autoCapitalize = "words"
								keyboardType = "email-address"
								returnKeyType = "done"
								underlineColorAndroid = "transparent"
								style={[styles.textInput, Style.f20]}
								onChangeText={(twitter) => {
									this.setState({ twitter });
								}}
								onSubmitEditing={(event) => {
									this.refs.linkedIn.focus();
								}}
							/>
						</View>
					</View>

					<View style={styles.inputGroup}>
						<Text style={[Style.f20, styles.text]}>LinkedIn</Text>
						<View style={styles.textInputContainer}>
							<TextInput
								ref = "linkedIn"
								placeholderTextColor={StyleConstants.textColorGray}
								placeholder="Your website"
								value={linkedIn}
								autoCapitalize = "words"
								keyboardType = "email-address"
								returnKeyType = "done"
								underlineColorAndroid = "transparent"
								style={[styles.textInput, Style.f20]}
								onChangeText={(linkedIn) => {
									this.setState({ linkedIn });
								}}
								onSubmitEditing={(event) => {
									this.refs.instagram.focus();
								}}
							/>
						</View>
					</View>

					<View style={styles.inputGroup}>
						<Text style={[Style.f20, styles.text]}>Instagram</Text>
						<View style={styles.textInputContainer}>
							<TextInput
								ref = "instagram"
								placeholderTextColor={StyleConstants.textColorGray}
								placeholder="Your website"
								value={instagram}
								autoCapitalize = "words"
								keyboardType = "email-address"
								returnKeyType = "done"
								underlineColorAndroid = "transparent"
								style={[styles.textInput, Style.f20]}
								onChangeText={(instagram) => {
									this.setState({ instagram });
								}}
								onSubmitEditing={(event) => {
									this.onPressUpdate();
								}}
							/>
						</View>
					</View>

				</ScrollView>
				<KeyboardSet/>

			</View>
		)
	}
});

const styles = StyleSheet.create({

	container: {
		flex:1,
		backgroundColor: 'white',
	},

	modalOverallView:
	{
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.25)',
		alignItems: 'center',
		justifyContent: 'center',
	},

	modalInnerView:
	{
		height: height/2,
		width: width/1.25,
		borderRadius: 10,
		padding: 10,
		backgroundColor: 'white',
		alignItems: 'center',
		justifyContent: 'center',
	},

	modal: {
		padding: 50,
	},

	form: {
		//flex: 1,
		paddingHorizontal: 15,
		paddingVertical: 10,
		//marginBottom: 30,
	},

	inputGroup: {
		paddingBottom: 10,
	},

	text: {
		color: 'lightslategrey',
		marginTop: 10,
	},

	textInputContainer: {
		borderBottomWidth: 0.5,
		borderBottomColor: 'black',
	},

	textInput: {
		height: 33,
		padding: 0,
		marginHorizontal: 5,
		marginVertical: 15,
	},

});


export default EditProfile;
