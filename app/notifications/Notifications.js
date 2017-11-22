import React, {
	Component,
} from 'react';

import {
	ScrollView,
	TouchableOpacity,
	StyleSheet,
	Text,
	View,
	Dimensions,
	Alert,
	Platform,
	ListView,
	Image,
	AsyncStorage,
} from 'react-native';

import moment from 'moment';
import {get} from '../../lib/rest';
import LoadingCardMini from '../home/LoadingCardMini';
import {markReadNotification, readNotifications, changeRelationRequest} from '../../lib/networkHandler';
var NavBar = require('../common/NavBar');
import MenuBar from '../common/MenuBar';

import {
	Style,
	StyleConstants,
	Fonts
} from '../stylesheet/style';
import Icon from '../stylesheet/icons'
const {height, width} = Dimensions.get('window');

let images = {
	'profile': require('../../res/common/network_settings.png'),
};

import stubs from './stubs/NotificationStubs';

var ds = new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2});

export default class Notifications extends Component {

	constructor(props) {
		super(props);
		this.state = {
			loaded: false,
			notificationsList: ds.cloneWithRows([{}]),
		};
		this.renderNotifications = this.renderNotifications.bind(this);
		this.onPressNotification = this.onPressNotification.bind(this);
	}

	animatedLoader() {
		return (
			<LoadingCardMini/>
		);
	}

	componentDidMount() {
		AsyncStorage.getItem("UserToken")
			.then((token) => {
				this.setState({
					token,
				});
				return token;
			})
			.then((token) => {
				return get(token, 'Users/Notifications/all');
			})
			.then((res) => {
				console.log('@@@@@@@@@@@@@@@@@xdasdas', res);
				if (!res.Message && !res.Errors) {
					// console.log(res.Result);
					this.setState({
						notificationsList: this.state.notificationsList.cloneWithRows(res),
						loaded: true,
					});
				}
				return readNotifications(this.state.token, 'all');
			})
			.then((resp) => {
				console.log('Read notifications resp',resp );
			})
			.catch((error) => {
				console.log('Error: ', error);
			})
	}

	onPressNotification(mydata) {
		console.log('@@@@@@@@@@@@my notification', mydata);
		let targetId = mydata.target != '' ? parseInt(mydata.target) : '';
		if (targetId != '' && targetId != '10101') {
			let dataObj = JSON.parse(mydata.data);
			dataObj.id = targetId;
			console.log('@@@@@@@@@dataObj', dataObj);
			this.props.navigator.push(dataObj);
		}
		else {
			console.log('@@@@@@@@@ elsee');
			Alert.alert(
									'Change of Relation Request',
									mydata.text,
									[
										{text: 'Confirm', onPress: () => changeRelationRequest(mydata.data.userId,mydata.data.group, this.state.token, 'accepted')},
										{text: 'Reject', onPress: () => changeRelationRequest(mydata.data.userId,mydata.data.group, this.state.token, 'rejected')},
									]
								)
		}

		markReadNotification(this.state.token, mydata.id)
			.then((res) => {
			console.log('@@@@@@@@@@@@@mark readNotification resp', res);
				if (res.status === 200) {
					get(this.state.token, 'Notifications')
						.then((res) => {
							if (!res.Message && !res.Errors) {
								this.setState({
									notificationsList: this.state.notificationsList.cloneWithRows(res.Result)
								});
							}
						})
				}
			})
			.catch((error) => {
				console.log('Error: ', error);
			})
	}

	renderNotifications(rowData, sectionID, rowID) {
		let {navigator} = this.props;
		// console.log('@@@@@@ ', rowData);
		let {iconUrl, text, timeStamp, readFlag, id} = rowData;
		let isRead = readFlag ? {backgroundColor: 'white'} : {backgroundColor: '#e5e5e5'};

		let image = iconUrl ? {uri: iconUrl} : images.profile;

		return (
			<TouchableOpacity
				style={[styles.rows, isRead]}
				onPress={() => this.onPressNotification(rowData)}
			>
				<View style={styles.profileImageWrapper}>
					<Image
						style={styles.profileImage}
						source={image}
						resizeMode={'cover'}
					/>
				</View>

				<View>
					<Text style={styles.text}>{text}</Text>
					<Text style={styles.date}>
						{moment.utc(timeStamp).format('h:mm A')}
					</Text>
				</View>
			</TouchableOpacity>
		);
	}

	render() {
		let {navigator} = this.props;
		let {notificationsList} = this.state;

		renderList = () => {
			return (
				<ListView
					ref='list'
					style={styles.listView}
					dataSource={notificationsList}
					renderRow={this.state.loaded? this.renderNotifications : this.animatedLoader}
					enableEmptySections={true}
					bounces={false}
				/>
			);
		}

		return (
			<View style={styles.container}>
				<MenuBar
					// color = {'red'} // Optional By Default 'black'
					title={'Notifications'} // Optional
					leftIcon={'icon-back_screen_black'}
					// rightIcon = {'icon-done2'} // Optional
					// disableLeftIcon = {true} // Optional By Default false
					// disableRightIcon = {true} // Optional By Default false
					onPressLeftIcon={() => {
						navigator.pop()
					}} // Optional
					// onPressRightIcon = {() => { navigator.pop() }} // Optional
				/>
				<View style={styles.wrapper}>
					{renderList()}
				</View>
				<NavBar navigator={navigator}/>
			</View>
		);
	}

}

const styles = StyleSheet.create({

	container: {
		flex: 1,
		backgroundColor: 'white',
	},

	wrapper: {
		flex: 1,
		backgroundColor: 'white',
		borderColor: '#ececec',
		borderTopWidth: 5,
		borderLeftWidth: 5,
		borderRightWidth: 5,
	},

	listView: {
		flex: 1,
	},

	profileImageWrapper: {
		width: 46,
		height: 46,
		alignSelf: 'center',
		borderRadius: 23,
		//borderWidth: 0.75,
		borderColor: 'gray',
		backgroundColor: 'white',
	},

	profileImage: {
		alignSelf: 'center',
		width: 46,
		height: 46,
		borderRadius: 23,
		borderWidth: 0.75,
		borderColor: 'transparent',
	},

	rows: {
		flexDirection: 'row',
		padding: 10,
		// backgroundColor: 'white',
		borderBottomColor: '#ececec',
		borderBottomWidth: 4,
	},

	text: {
		width: width / 1.3,
		marginLeft: 10,
		alignSelf: 'flex-start',
		fontSize: 16,
		color: 'black',
		fontFamily: Fonts.regFont[Platform.OS],
	},

	date: {
		alignSelf: 'flex-start',
		fontSize: 14,
		color: 'black',
		fontFamily: Fonts.regFont[Platform.OS],
		marginLeft: 10,
	},

});
