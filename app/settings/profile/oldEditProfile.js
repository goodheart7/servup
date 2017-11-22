import React, {
	Component,
} from 'react';

import {
	Navigator,
	ScrollView,
	TouchableOpacity,
	AppRegistry,
	StyleSheet,
	Text,
	View,
	Dimensions,
	Platform,
	ListView,
	Image,
	AsyncStorage,
	Switch,
	TextInput,
	Alert,
} from 'react-native';

import {fnt as fnt} from '../common/fontLib';
import {themeColor as themeColor} from '../common/theme';
import {getUserProfile} from '../../lib/networkHandler';
import {updateUserProfile} from '../../lib/networkHandler';

import Modal from 'react-native-simple-modal';

var TitleBar = require('../common/TitleBar');
var NavBar = require('../common/NavBar');

const {height, width} = Dimensions.get('window');

var bgWhite = '#FFFFFF';
var arrow_right = require('../../res/common/arrow_right.png');

var EditProfile = React.createClass({

    getInitialState() {
		return {
			disabled: false,

			backed:  false,
			modalOpen: false,
			multiLineModalInput: false,
			modalOpen2: false,
			modalHeading:'',
			modalPlaceHolder: '',
			modalCurrentValue: '',
			userName: 'John Smith',
			userTagLine: '',
			userLocation: 'Lahore, Pakistan',
			userAboutMe: 'I am the man who walks alone when i am walking a dark road. At night or strolling through the dark',
			userEmail: 'johnsmith@gmail.com',
			userTwitter: '@johnsmith' ,
			userFacebook: 'fb.com\john.smith',
			userLinkedin: 'connect',
			dob: 'Feburary 14',
			editingDisabled: false,
			buttonTextStyle: styles.textStyle,
			buttonTextStyleMini: styles.textStyleMini,
		}
	},

	componentDidMount() {
		AsyncStorage.getItem("userDetails").then((value) => {
			var userFromStorage = JSON.parse(value);
      // userFromStorage = JSON.parse(userFromStorage);
      console.log('EditProfile.js->componentDidMount() userFromStorage is: ', userFromStorage);
			this.setState({
				userName: userFromStorage.name,
				dob: userFromStorage.birthDay,
				userTagLine: userFromStorage.tagLine,
				userJobTitle: userFromStorage.title,
				userAboutMe: userFromStorage.aboutMe,
				userTwitter: userFromStorage.twitter,
				userFacebook: userFromStorage.faceBook,
                userLinkedin: userFromStorage.linkedIn,
				userInstagram: userFromStorage.instagram,
			});
		});
		AsyncStorage.getItem("UserPhoneNumber").then((value) => {
			this.setState({"UserPhoneNumber": value})
			return AsyncStorage.getItem("UserToken")
		})
		.then((value) => {
			this.setState({"token": value});
			return getUserProfile(this.state.token);
		})
		.then ((response) => {
			console.log ("EditProfile.js->componentDidMount() getUser response is: " + JSON.stringify(response));
			// if (response.crmResponseStatus === "PENDING")
			// 	this.setState({
			// 		editingDisabled: true,
			// 		buttonTextStyle: styles.textStyleGrey,
			// 		buttonTextStyleMini: styles.textStyleMiniGreyed,
			// 	});
            return AsyncStorage.getItem("UserEmail");
        })
        .then((value) => {
            console.log('EditProfile.js->componentDidMount()  email response is: ', value)
            this.setState({"userEmail": value})
        })
		.catch((err) => {
			console.log(err);
		})
	},

	backFunction() {
		this.setState({modalOpen2: false});
		if (this.state.backed == false)
		{
			this.state.backed = true;
			setTimeout(()=>{this.state.backed = false;}, 1000);
			this.props.navigator.pop();
		}
	},

	saveButtonFunction() {
		this.setState({ disabled: true }, this.saveFeatures());

	},

	saveFeatures() {
		this.setState({modalOpen2: false});
		var userProfile = {
            'name': this.state.userName,
			"location": this.state.userLocation,
			"tagLine": this.state.userTagLine,
			"aboutMe": this.state.userAboutMe,
			"title": this.state.userJobTitle,
			"faceBook": this.state.userFacebook,
			"twitter": this.state.userTwitter,
            "linkedIn": this.state.userLinkedin,
			"instagram": this.state.userInstagram,
		};

		console.log ("value of EDITINGDISABLED in STATE: " + this.state.editingDisabled);
		if (this.state.editingDisabled === false)
		{
			updateUserProfile(this.state.token, userProfile)
			.then ((userUpdated) => {
				console.log ("updateUser response is: " + JSON.stringify(userUpdated));
				// this.setState({editingDisabled: true});
				// console.log ("value of EDITINGDISABLED in STATE after saving: " + this.state.editingDisabled);
				this.props.navigator.push({id: 6});
			})
			.catch((err) => {
				console.log(err);
			});
		}
		else
			Alert.alert('System Message',
				"Your previous profile changes are awaiting network-provider's acceptance. Please try agian later.");
	},


	modalFunction() {
        // something here
	},

	modalValueChanged(n) {
		console.log("EditProfile.js->modalValueChanged() Heading is ",this.state.modalHeading, "n is ", n );
		// console.log("modalCurrentValue is ",this.state.modalCurrentValue, " modalCurrentValue length is ", this.state.modalCurrentValue.length );
		if (this.state.modalHeading === 'Name')
		{
			this.setState({modalCurrentValue: n, userName: n});
			if (n.length > 25)
			{
				n = n.substring(0, 25)
				this.setState({modalCurrentValue: n, userName: n});
			}
		}
		else if (this.state.modalHeading === 'Tag Line')
		{
			this.setState({modalCurrentValue: n, userTagLine: n});
			if (n.length > 30)
			{
				n = n.substring(0, 30)
				this.setState({modalCurrentValue: n, userTagLine: n});
			}
		}
		else if (this.state.modalHeading === 'Location')
		{
			this.setState({modalCurrentValue: n, userLocation: n});
			if (n.length > 50)
			{
				n = n.substring(0, 50)
				this.setState({modalCurrentValue: n, userLocation: n});
			}
		}
		else if (this.state.modalHeading === 'Job Title')
		{
			this.setState({modalCurrentValue: n, userJobTitle: n});
			if (n.length > 30)
			{
				n = n.substring(0, 30)
				this.setState({modalCurrentValue: n, userJobTitle: n});
			}
		}
		else if (this.state.modalHeading === 'About Me')
		{
			this.setState({modalCurrentValue: n, userAboutMe: n});
			if (n.length > 100)
			{
				n = n.substring(0, 100)
				this.setState({modalCurrentValue: n, userAboutMe: n});
			}
		}
		else if (this.state.modalHeading === 'Email Address')
		{
			this.setState({modalCurrentValue: n, userEmail: n});
			if (n.length > 30)
			{
				n = n.substring(0, 30)
				this.setState({modalCurrentValue: n, userEmail: n});
			}
		}
		else if (this.state.modalHeading === 'Twitter Address') {
			this.setState({modalCurrentValue: n, userTwitter: n});
        }
		else if (this.state.modalHeading === 'Facebook Address') {
			this.setState({modalCurrentValue: n, userFacebook: n});
        }
		else if (this.state.modalHeading === 'linkedin Address') {
			this.setState({modalCurrentValue: n, userLinkedin: n});
        }
        else if (this.state.modalHeading === 'Instagram Address') {
            this.setState({modalCurrentValue: n, userInstagram: n});
        }
	},

	coverChanger() {
    // do something
	},

	nameChanger() {
		this.setState({
            modalHeading: 'Name',
			modalPlaceHolder: this.state.userName,
			modalCurrentValue: this.state.userName,
			modalOpen: true,
			multiLineModalInput: false
        });
	},

	tagLineChanger() {
		this.setState({
            modalHeading: 'Tag Line',
			modalPlaceHolder: this.state.userTagLine,
			modalCurrentValue: this.state.userTagLine,
			modalOpen: true,
			multiLineModalInput: true
        });
	},

	aboutMeChanger() {
		this.setState({
            modalHeading: 'About Me',
			modalPlaceHolder: this.state.userAboutMe,
			modalCurrentValue: this.state.userAboutMe,
			modalOpen: true,
			multiLineModalInput: true
        });
	},

	jobTitleChanger() {
		this.setState({
            modalHeading: 'Job Title',
			modalPlaceHolder: this.state.userJobTitle,
			modalCurrentValue: this.state.userJobTitle,
			modalOpen: true,
			multiLineModalInput: false
        });
	},

	locationChanger() {
		this.setState({
            modalHeading: 'Location',
			modalPlaceHolder: this.state.userLocation,
			modalCurrentValue: this.state.userLocation,
			modalOpen: true,
			multiLineModalInput: false
        });
	},

	emailAddressChanger() {
		this.setState({
            modalHeading: 'Email Address',
			modalPlaceHolder: this.state.userEmail,
			modalCurrentValue: this.state.userEmail,
			modalOpen: true,
			multiLineModalInput: false
        });
	},

	twitterChanger() {
		this.setState({
            modalHeading: 'Twitter Address',
			modalPlaceHolder: this.state.userTwitter,
			modalCurrentValue: this.state.userTwitter,
			modalOpen: true,
			multiLineModalInput: false
        });
	},

	facebookChanger() {
		this.setState({
            modalHeading: 'Facebook Address',
			modalPlaceHolder: this.state.userFacebook,
			modalCurrentValue: this.state.userFacebook,
			modalOpen: true,
			multiLineModalInput: false
        });
	},

	linkedinChanger() {
		this.setState({
            modalHeading: 'linkedin Address',
			modalPlaceHolder: this.state.userLinkedin,
			modalCurrentValue: this.state.userLinkedin,
			modalOpen: true,
			multiLineModalInput: false
        });
	},

  instagramChanger() {
      this.setState({
          modalHeading: 'Instagram Address',
          modalPlaceHolder: this.state.userInstagram,
          modalCurrentValue: this.state.userInstagram,
          modalOpen: true,
          multiLineModalInput: false
      });
  },

  warningModalFunction() {
        return(
            <Modal
                offset = {this.state.offset}
                open = {this.state.modalOpen2}
                modalDidOpen = {() => console.log('modal did open')}
                modalDidClose = {() => this.setState({modalOpen2: false})}
                style = {{alignItems: 'center'}}
            >
                <View>
                    <Text style={styles.modalTextStyleHeading}>
                        WARNING!
                    </Text>

                    <Text style = {styles.textStyleGrey,{ marginVertical: 10,}}>
                        Your changes have been requested. You can not modify your profile until the changes are
                        verified from your Network Service Provider
                    </Text>

                    <TouchableOpacity style={styles.next} onPress={this.saveFeatures}>
                        <Text style = {styles.verifyButtonText}>
                            OK
                        </Text>
                    </TouchableOpacity>

                </View>
            </Modal>
        );
    },

	render() {
		let {disabled} = this.state;
		return (
			<View style = {styles.scrollBox}>
				<TitleBar
					leftButton = {require('../../res/common/back.png')}
					title = "Edit Profile"
					// titleImage = {require('./images/Servup_logo.png')}
					// rightButton = {require('../res/common/menu.png')}
					// rightButton2 = {require('../res/common/menu.png')}
					onLeftButtonPress={this.backFunction}
					// onRightButtonPress={this.backFunction}
					onRightButton2Press={!disabled && this.saveButtonFunction}
					// subText="last seen at 2:10 PM"
					rightText = "Save"
				/>
				<ScrollView bounces= {false} style={{flex: 1}} keyboardShouldPersistTaps = {true}>
					<View style = {styles.cols}>
						<TouchableOpacity disabled = {this.state.editingDisabled} style={styles.rows} onPress={this.nameChanger}>
							<View style = {styles.rightNextToIt}>
								<Text style = {this.state.buttonTextStyle}>
									Name
								</Text>
							</View>
							<View style = {styles.rightNextToIt}>
								<Text style = {this.state.buttonTextStyle}>
									{this.state.userName}{" "}
								</Text>
							</View>
						</TouchableOpacity>

						<TouchableOpacity disabled = {this.state.editingDisabled} style={styles.rows} onPress={this.tagLineChanger}>
							<View style = {styles.rightNextToIt}>
								<Text style = {this.state.buttonTextStyle}>
									Tagline
								</Text>
							</View>
							<View style = {styles.rightNextToIt}>
                                <Text style = {this.state.buttonTextStyle}>
                                    {this.state.userTagLine}
                                </Text>
							</View>
						</TouchableOpacity>

						<TouchableOpacity disabled = {this.state.editingDisabled} style={styles.rows} onPress={this.jobTitleChanger}>
							<View style = {styles.rightNextToIt}>
								<Text style = {this.state.buttonTextStyle}>
									Job Title
								</Text>
							</View>
							<View style = {styles.rightNextToIt}>
								<Text style = {this.state.buttonTextStyle}>
									{this.state.userJobTitle}
								</Text>
							</View>
						</TouchableOpacity>

						<TouchableOpacity disabled = {this.state.editingDisabled} style={styles.rowsAboutMe} onPress={this.aboutMeChanger}>
							<View style = {styles.rightNextToIt}>
								<Text style = {this.state.buttonTextStyle}>
									About Me
								</Text>
							</View>
							<View style = {styles.para}>
								<Text style = {this.state.buttonTextStyleMini}>
									{"\n"}{this.state.userAboutMe}
								</Text>
							</View>
						</TouchableOpacity>

						<TouchableOpacity disabled = {this.state.editingDisabled} style={styles.rows} onPress={this.locationChanger}>
							<View style = {styles.rightNextToIt}>
								<Text style = {this.state.buttonTextStyle}>
									Location
								</Text>
							</View>
							<View style = {styles.rightNextToIt}>
								<Text style = {this.state.buttonTextStyle}>
									{this.state.userLocation}{" "}
								</Text>
								<Image
									style = {styles.switchArea}
									source = {arrow_right}
								/>
							</View>
						</TouchableOpacity>

						<View style={styles.rowLast}>
							<View style = {styles.rightNextToIt}>
								<Text style = {this.state.buttonTextStyle}>
									Birthday
								</Text>
							</View>
							<View style = {styles.rightNextToIt}>
								<Text style = {this.state.buttonTextStyle}>
									{this.state.dob}{" "}
								</Text>
							</View>
						</View>

						<View style={styles.greyArea}>
						</View>

						<TouchableOpacity disabled = {this.state.editingDisabled} style={styles.rows} onPress={this.twitterChanger}>
							<View style = {styles.rightNextToIt}>
								<Image
									style = {styles.switchArea}
									source = {require('../../res/common/twitter_logo.png')}
								/>
								<View style = {{marginRight: 5}}/>
								<Text style = {this.state.buttonTextStyle}>
									Twitter
								</Text>
							</View>
							<View style = {styles.rightNextToIt}>
								<Text style = {this.state.buttonTextStyle}>
									{"@"}{this.state.userTwitter}
								</Text>

								<Image
									style = {styles.switchArea}
									source = {arrow_right}
								/>
							</View>
						</TouchableOpacity>

						<TouchableOpacity disabled = {this.state.editingDisabled} style={styles.rows} onPress={this.facebookChanger}>
							<View style = {styles.rightNextToIt}>
								<Image
									style = {styles.switchArea}
									source = {require('../../res/common/facebook_logo.png')}
								/>
								<View style = {{marginRight: 5}}/>
								<Text style = {this.state.buttonTextStyle}>
									Facebook
								</Text>
							</View>
							<View style = {styles.rightNextToIt}>
								<Text style = {this.state.buttonTextStyle}>
									{this.state.userFacebook}
								</Text>

								<Image
									style = {styles.switchArea}
									source = {arrow_right}
								/>
							</View>
						</TouchableOpacity>

						<TouchableOpacity disabled = {this.state.editingDisabled} style={styles.rows} onPress={this.linkedinChanger}>
							<View style = {styles.rightNextToIt}>
								<Image
									style = {styles.switchArea}
									source = {require('../../res/common/linkedin_color.png')}
								/>
								<View style = {{marginRight: 5}}/>
								<Text style = {this.state.buttonTextStyle}>
									LinkedIn
								</Text>
							</View>

							<View style = {styles.rightNextToIt}>
								<Text style = {this.state.buttonTextStyle}>
									{this.state.userLinkedin}
								</Text>

								<Image
									style = {styles.switchArea}
									source = {arrow_right}
								/>
							</View>
						</TouchableOpacity>

                        <TouchableOpacity disabled = {this.state.editingDisabled} style={styles.rows} onPress={this.instagramChanger}>
                            <View style = {styles.rightNextToIt}>
                                <Image
                                    style = {styles.switchArea}
                                    source = {require('../../res/common/linkedin_color.png')}
                                />
                                <View style = {{marginRight: 5}}/>
                                <Text style = {this.state.buttonTextStyle}>
                                    Instagram
                                </Text>
                            </View>

                            <View style = {styles.rightNextToIt}>
                                <Text style = {this.state.buttonTextStyle}>
                                    {this.state.userInstagram}
                                </Text>

                                <Image
                                    style = {styles.switchArea}
                                    source = {arrow_right}
                                />
                            </View>
                        </TouchableOpacity>
					</View>
				</ScrollView>


        <Modal
					offset = {this.state.offset}
					open = {this.state.modalOpen}
					modalDidOpen = {() => console.log('modal did open')}
					modalDidClose = {() => this.setState({modalOpen: false})}
					style = {{alignItems: 'center'}}
				>
					<View>
						<Text style={styles.modalTextStyleHeading}>
							Enter your new {this.state.modalHeading}
						</Text>
						<View style = {{marginBottom: 30,}}/>
						<TextInput
							style = {styles.inputStyle}
							autoCapitalize={this.state.modalHeading == 'Name' ? 'words' : 'sentences'}
							defaultValue   = {this.state.modalPlaceHolder}
							value = {this.state.modalCurrentValue}
							onChangeText = {this.modalValueChanged}
							multiline = {this.state.multiLineModalInput}
							disabled = {this.state.modalInputDisabled}
							// keyboardType = 'phone-pad'
							// onSubmitEditing = {this.checkNumber}
						/>

						<TouchableOpacity style={styles.next} onPress={() => this.setState({modalOpen: false})}>
							<Text style = {styles.verifyButtonText}>
								Done
							</Text>
						</TouchableOpacity>
					</View>
				</Modal>

        {this.warningModalFunction()}
			</View>
		);
	},
});

const styles = StyleSheet.create(
{
	scrollBox:
	{
		flex:1,
		backgroundColor: bgWhite,
	},

	editCover:
	{
		flex: 1,
		justifyContent: 'center',
		height: height/6,
		backgroundColor: '#ececec',
	},

	cols:
	{
		flex:1,
		borderWidth: 4,
		borderColor: '#ececec',
		borderBottomWidth: 0,
	},

	rowsAboutMe:
	{
	//	flexDirection: 'row',
		justifyContent: 'space-between',
		padding: 20,
		marginBottom: 1,
		borderWidth: 1,
		borderBottomColor: '#ececec',
		borderTopColor: bgWhite,
		borderLeftColor: bgWhite,
		borderRightColor: bgWhite,
		backgroundColor: bgWhite,
	},

	rows:
	{
		flexDirection: 'row',
		justifyContent: 'space-between',
		padding: 20,
		marginBottom: 1,
		borderWidth: 1,
		borderBottomColor: '#ececec',
		borderTopColor: bgWhite,
		borderLeftColor: bgWhite,
		borderRightColor: bgWhite,
		backgroundColor: bgWhite,
	},

	rowLast:
	{
		flexDirection: 'row',
		justifyContent: 'space-between',
		padding: 20,
		marginBottom: 0,
		borderWidth: 0,
		borderBottomColor: '#ececec',
		borderTopColor: bgWhite,
		borderLeftColor: bgWhite,
		borderRightColor: bgWhite,
		backgroundColor: bgWhite,
	},

	rightNextToIt:
	{
		flexDirection: 'row',
	},

	para:
	{
		flex: 1,
	},

	textStyle:
	{
		// alignSelf: 'flex-end',
		// marginHorizontal: 10,
		alignSelf: 'center',
		fontSize: 14,
		color: '#333',
		fontFamily: fnt.regFont[Platform.OS],
	},

	textStyleGrey:
	{
		// alignSelf: 'flex-end',
		// marginHorizontal: 10,
		alignSelf: 'center',
		fontSize: 14,
		color: '#6666',
		fontFamily: fnt.regFont[Platform.OS],
	},

	textStyleMini:
	{
		// alignSelf: 'flex-end',
		// marginHorizontal: 10,
		alignSelf: 'flex-start',
		fontSize: 11,
		color: '#666',
		fontFamily: fnt.regFont[Platform.OS],
	},

	textStyleMiniGreyed:
	{
		// alignSelf: 'flex-end',
		// marginHorizontal: 10,
		alignSelf: 'flex-start',
		fontSize: 11,
		color: '#6666',
		fontFamily: fnt.regFont[Platform.OS],
	},

	switchArea:
	{
		alignSelf: 'center',
		// marginRight: 10,
	},

	greyArea:
	{
		backgroundColor: '#ececec',
		height: 20,
	},

	whiteArea:
	{
		backgroundColor: bgWhite,
	},

	   inputFieldView:
    {
        borderTopColor:'grey',
        borderWidth:1,
        marginHorizontal: 30,
        borderTopColor: 'grey',
        borderLeftColor: '#FFFFFF',
        borderRightColor: '#FFFFFF',
        borderBottomColor: '#FFFFFF',
    },

	inputStyle:
	{
		alignSelf: 'center',
		height: 50,
		width: width/1.5,
		borderWidth: 0,
		textAlign: 'center',
		fontFamily: fnt.regFont[Platform.OS],
		fontSize: 13,
		color: '#333',
	},

	modalTextStyleHeading:
	{
		// alignSelf: 'flex-end',
		// marginHorizontal: 10,
		alignSelf: 'center',
		fontSize: 20,
		color: '#333',
		fontFamily: fnt.regFont[Platform.OS],
	},

	next:
	{
		// marginTop: 40,
		// marginBottom: 20,
		// marginLeft: 100,
		// marginRight: 100,
		margin:10,
		borderRadius:5,
		backgroundColor: themeColor.wind,
		justifyContent: 'center',
		alignItems: 'center',
		alignSelf: 'center',
		padding: 10,
		paddingHorizontal: 20,
	},

	verifyButtonText:
	{
		fontFamily: fnt.regFont[Platform.OS],
		fontSize: 15,
		color: '#FFFFFF',
	},
});

module.exports = EditProfile
