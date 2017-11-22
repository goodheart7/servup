import React, {
	Component,
} from 'react';

import {
	Navigator,
	TouchableOpacity,
	StyleSheet,
	Text,
	View,
	Image,
	AsyncStorage,
	Dimensions,
	Platform,
	Share
} from 'react-native';

import {
	Style,
	StyleConstants,
	Fonts
} from '../stylesheet/style';
import Icon from '../stylesheet/icons'
const {height, width} = Dimensions.get('window');

var FriendInvite = React.createClass({

	getInitialState() {
		return {
			name: '',
		};
	},
	componentDidMount() {

		AsyncStorage.getItem('Name')
			.then((resp) => {
				this.setState({name: resp || ''});
			})
			.catch((err) => {
				console.log(err);
			})
	},
	share() {
		Share.share({
			message: 'Name has invited you to join Servup https://www.servup.co'
		})
			.then(() => {
				console.log('Promise Resolved')
			})
			.catch(err => console.log(err))
	},
	renderExtraSpaceForIOS (){
		if (Platform.OS === 'ios') {
			return (<View style={[Style.extraSpaceForIOS, {backgroundColor:StyleConstants.primary}]}/>)
		} else {
			return (<View/>)
		}
	},
	componentWillUnmount() {
		console.log("@@@@@@@@@@@@@@Bye from frnds invite@@@@@@@");
		if (this.props.id == 200) {
			this.props.onUnmount();
		}
	},

	render() {

		return (
			<View style={styles.mainContainer}>
				{this.renderExtraSpaceForIOS()}
				<View style={{flex: 5}}>

					<TouchableOpacity
						style={styles.crossStyle}
						onPress={() => {
							this.props.navigator.pop()
						} }>

						<Icon name={'icon-Remove_credit_card'} fontSize={15} color={'white'}/>
					</TouchableOpacity>

					<View style={[styles.Logo, {flex: 8, marginBottom: 20}]}>
						<Image
							source={require('../../res/common/contactx.png')}
						/>
					</View>

					<View style={[styles.textViewStyle, {flex: 12, marginBottom: 15}]}>
						<Text style={styles.mainTextStyle}>
							Help friends, family & coworkers discover great services
						</Text>
					</View>

					<TouchableOpacity
						style={[styles.inviteButton]}
						onPress={() => {
							this.props.navigator.push({id: 230})
						} }>
						<Text style={styles.textStyle}>
							Invite Contacts
						</Text>
					</TouchableOpacity>

				</View>
				<View style={{flex: 5, marginBottom: 5}}>
					<View style={styles.orContainerStyle}>
						<View style={[styles.lineStyle, {justifyContent: 'center'}]}/>
						<Text style={[styles.mainTextStyle, {color: 'white', paddingHorizontal: 2}]}>
							OR
						</Text>
						<View style={[styles.lineStyle, {justifyContent: 'center'}]}/>
					</View>
					<View style={{flex: 12, paddingVertical:5}}>

						<View style={[styles.textViewStyle, {marginBottom: 20}]}>
							<Text style={styles.mainTextStyle}>
								Share your link
							</Text>
						</View>
						<TouchableOpacity
							style={[styles.shareButton, {flexDirection: 'row', backgroundColor: 'white'}]}
							onPress={ this.share }>
							<View style={{flex: 9, paddingVertical: 7, paddingLeft: 20}}>
								<Text style={[styles.textStyle]}>
									{this.state.name.length > 10 ? this.state.name.substring(0, 10) + '...' : this.state.name  }

								</Text>
							</View>
							<View style={styles.shareIconStyle}>
								<Image
									style={{alignSelf: 'center'}}
									source={require('../../res/common/sharex.png')}
								/>
							</View>
						</TouchableOpacity>

					</View>
					<View style={{flex: 3}}>
						<View style={styles.textViewStyle}>
							<Text style={styles.bottomTextStyle}>
								We'll sync your contacts to help you and others connect.
							</Text>
						</View>
					</View>
				</View>
			</View>
		)
	},
});

const styles = StyleSheet.create(
	{
		mainContainer: {
			flex: 1,
			backgroundColor: StyleConstants.primary,
		},

		Logo: {
			//margin: 10,
			alignSelf: 'center',
			justifyContent: 'center',
		},

		crossStyle: {
			flex: 4,
			padding: 5,
			margin: 20,
			alignSelf: 'flex-start',
			justifyContent: 'flex-start',
		},

		textViewStyle: {
			alignSelf: 'center',
			marginHorizontal: 14,
		},

		textStyle: {
			fontSize: 18,
			color: StyleConstants.primary,
			textAlign: 'center',
			//alignSelf: 'center',
			justifyContent: 'center',
			paddingVertical: 2,
			fontFamily: Fonts.regFont[Platform.OS],
		},

		mainTextStyle: {
			fontSize: 20,
			color: '#FFFFFF',
			textAlign: 'center',
			fontFamily: Fonts.regFont[Platform.OS],

		},

		bottomTextStyle: {
			fontSize: 12,
			color: '#FFFFFF',
			textAlign: 'center',
			fontFamily: Fonts.regFont[Platform.OS],

		},

		inviteButton: {
			backgroundColor: '#FFFFFF',
			//marginHorizontal:50,
			marginTop: 10,
			alignSelf: 'center',
			width: width * 0.70,
			justifyContent: 'center',
			borderRadius: 5,
			padding: 5,

		},
		shareButton: {
			// backgroundColor:'white',
			//marginHorizontal:13,
			borderRadius: 30,
			borderWidth: 1,
			borderColor: 'white',
			alignSelf: 'center',
			//flex: 2,
			width: width * 0.70,
			justifyContent: 'center',

		},
		lineStyle: {
			height: 1,
			backgroundColor: 'white',
			width: width / 3,
			marginVertical: 15,
		},
		orContainerStyle: {
			flex: 4,
			flexDirection: 'row',
			alignSelf: 'center',
			margin: 15,
			alignItems: 'center',
			marginTop: 25,
		},
		shareIconStyle: {
			backgroundColor: '#ececec',
			borderBottomRightRadius: 30,
			borderTopRightRadius: 30,
			//borderRadius:30,
			flex: 1,
			alignSelf: 'center',
			justifyContent: 'center',
			padding: 15
		},

	});

module.exports = FriendInvite
