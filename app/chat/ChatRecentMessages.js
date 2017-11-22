import React, {Component,} from 'react';
import {
	TouchableOpacity,
	StyleSheet,
	Text,
	TextInput,
	View,
	ScrollView,
	Dimensions,
	Platform,
	ListView,
	Image,
	AsyncStorage,
} from 'react-native';
import ScrollableTabView, {
	DefaultTabBar,
	ScrollableTabBar
} from 'react-native-scrollable-tab-view';
import Icon from '../stylesheet/icons'
import moment from 'moment';
const {height, width} = Dimensions.get('window');

import {
	Style,
	StyleConstants,
	Fonts
} from '../stylesheet/style';

import MenuBar from '../common/MenuBar';
import NavBar from '../common/NavBar';
import {
	getRecentChats,
	getPublicIdAgaintUserToken
} from '../../lib/networkHandler';
var ds = new ListView.DataSource({
	rowHasChanged: (oldRow, newRow) => { oldRow !== newRow	}
});
var ds2 = new ListView.DataSource({
	rowHasChanged: (oldRow, newRow) => { oldRow !== newRow	}
});
var ds3 = new ListView.DataSource({
	rowHasChanged: (oldRow, newRow) => { oldRow !== newRow	}
});
var ChatRecentMessages = React.createClass({

	getInitialState () {

		return {
			chatSource: ds,
			spChats: ds2,
			userChats:ds3,
		}
	},
	renderSearchPlate(){
		return (
			<View style={styles.inputContainer}>
				<View style={{marginTop: 5, flex: 1}}>
					<Icon name={'icon-discover'} fontSize={20} color={'grey'}/>
				</View>
				<TextInput
					ref="query"
					autoFocus={true}
					placeholderStyle={[Style.f16, styles.input]}
					placeholderTextColor={StyleConstants.textColorGray}
					placeholder="Search Contacts"
					keyboardType="default"
					value={this.state.query}
					returnKeyType="done"
					underlineColorAndroid="transparent"
					style={[Style.f16, styles.input]}
					onChangeText={(query) => {
						this.setState({query});

					}}
					onSubmitEditing={(event) => {
						this.handleOnChange();
					}}
				/>
			</View>
		);
	},
	backFunction () {
		this.props.navigator.pop();
	},
	filterDataSource(text) {
		console.log('@@@@@@', text);
		//var ages = [{"a":32}, {a:33}, {a:16}, {a:40}];
		let sections = this.state.ContactsList;
		const safe = String(text || '').replace(/([.*^$+?!(){}\[\]\/\\])/g, '\\$1');
		console.log('@@@@safe', safe);
		const regex = new RegExp(safe, 'i');
		const filter = (row) => {

			if (regex.test(row.name) || regex.test(row.mobileNumber)) {
				console.log('@@@@@@@@@@@@@@@@@sdfsa', regex.test(row.name))
				return row;
			}
		};
		//  let y = _.filter([{"a":32,"b":0}],this.checkme);
		//console.log('@@@@@@@@@@YY', y);
		var out = {};
		for (var sectionID in sections) {
			if (!sections.hasOwnProperty(sectionID)) {
				continue;
			}
			//
			//console.log('@@@@@@@@@sectionID', sectionID);
			//   console.log('@@@@@@@@@sectionData', sections[sectionID]);
			//console.log('@@@@@@@@@arra', sections[sectionID]);
			var x = [];
			x.push(sections[sectionID]);
			out[sectionID] = _.filter(x, filter);
		}
		console.log('out', out);
		return ds.cloneWithRowsAndSections(out);
	},
	goToContactScreen() {
		this.props.navigator.push({id: 200});
	},
	componentDidMount(){
		if(this.props.chatSource) {
			console.log('@@@@@@@@@@@@@@@@@@@@', this.props.chatSource);
			let arr = this.props.chatSource._dataBlob.s1;
			let spChats = arr.filter((x)=>{return x.type=="sp"});
			let userChats = arr.filter((x)=>{return x.type=="user"});
			console.log('@@@@@@@@@@@@@@@@@@@@sp chats', spChats);
			console.log('@@@@@@@@@@@@@@@@@@@@user chats', userChats);
			this.setState({spChats: ds2.cloneWithRows(spChats), userChats:ds3.cloneWithRows(userChats)});
			console.log('@@@@@@@@@@@@@@@@@@@@sp chats', this.state.spChats);
			console.log('@@@@@@@@@@@@@@@@@@@@user chats', this.state.userChats);
		}
	},
	render () {
		var {navigator, chatSource} = this.props;

		let recentchatlist = () => {
			return (
				<ListView
					enableEmptySections={true}
					renderHeader={this.renderSearchPlate}
					dataSource={this.state.userChats}
					renderRow={this.renderList}
					bounces={false}
				/>
			);
		}
		let recentchatlistSp = () => {
			return (
				<ListView
					enableEmptySections={true}
					renderHeader={this.renderSearchPlate}
					dataSource={this.state.spChats}
					renderRow={this.renderList}
					bounces={false}
				/>
			);
		}
		let emptymessage = () => {
			return (
				<View style={{flex: 1, height: height * 0.7, justifyContent: 'center'}}>
					<Text style={{alignSelf: 'center', fontSize: 18, color: 'darkgrey'}}>
						You Don't Have Any Recent Message
					</Text>
				</View>
			);
		}
		//  console.log('@@@@@@@@@@@chat source', chatSource.getRowCount());
		return (
			<View style={styles.container}>
				<MenuBar
					// color = {'red'} // Optional By Default 'black'
					title={'Inbox'} // Optional
					leftIcon={'icon-back_screen_black'}
					rightIcon={'icon-inbox'} // Optional
					// disableLeftIcon = {true} // Optional By Default false
					// disableRightIcon = {true} // Optional By Default false
					onPressLeftIcon={() => this.props.navigator.pop()} // Optional
					onPressRightIcon={() => {
						navigator.push({id: 250})
					}} // Optional
				/>
				<ScrollableTabView
					tabBarBackgroundColor={'white'}
					tabBarActiveTextColor={StyleConstants.primary}
					tabBarTextStyle={{fontFamily: Fonts.regFont[Platform.OS], fontSize: 18, paddingTop: 5}}
					tabBarUnderlineStyle={[{backgroundColor: StyleConstants.primary, height: 2.5, marginBottom: 2,}]}
					renderTabBar={() => <DefaultTabBar />}
				>
					<ScrollView tabLabel='Groups'>
						{chatSource ? recentchatlist() : emptymessage()}
					</ScrollView>
					<ScrollView tabLabel='Service Providers'>
						{chatSource ? recentchatlistSp() : emptymessage()}
					</ScrollView>
				</ScrollableTabView>


				<NavBar
					navigator={this.props.navigator}
					unreadCount={this.props.unreadCount}
				/>
			</View>
		);
	},

	renderList(rowData, sectionID, rowID) {
		console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@asdas' + rowID, rowData)
		if (rowData && rowData.lastPost && rowData.lastPost.message) {
			// append '..' if the last message length is more then 35 chars

			var message = '';
			if (rowData.lastPost.message.text) {
				message = rowData.lastPost.message.text;
				if (message.length > 27) {
					message = message.substring(0, 27) + '..';
				}
			}

			// set default profile picture of a user if he/she has no profile image
			if (rowData.user && rowData.user.profilePictureURL) {
				personImg = {uri: rowData.user.profilePictureURL};
			}
			else if ( rowData.user && rowData.user.profilePicture) {
				personImg = {uri: rowData.user.profilePicture};
			} else {
				personImg = require('../../res/common/profile.png');
			}
			let name = '';
			if (rowData.user && rowData.user.name) {
				name = rowData.user.name;
			}
			else if (rowData.user && rowData.user.firstName) {
				name = rowData.user.firstName + " " + rowData.user.lastName;
			} else {
				name = "Card Liked";
			}
			// perform styles based if the 'isRead' keyvalye is 'false'
			var isReadStatus = rowData.isRead ? '' : styles.notRead;
			var isMessageRead = rowData.isRead ? '' : styles.textBold;

			return (
				<TouchableOpacity
					style={Style.listRow}
					onPress={() => {
						rowData.isRead = true;
						var userId = rowData.user && rowData.user.publicId ? rowData.user.publicId : '0';

						AsyncStorage.setItem('chatwithUserId', userId);
						let userName = rowData.user && rowData.user.name ? rowData.user.name : (rowData.user &&  rowData.user.firstName ? rowData.user.firstName : "Card Liked");
						this.props.navigator.push({id: 260, userName: userName, chatGroupId: rowData.id})
					}}

				>
					<View style={Style.rowWithSpaceBetween}>

						<View style={Style.row}>
							<Image
								style={[Style.userImage, {marginRight: 10}]}
								source={personImg}
								resizeMode={'cover'}
							/>
							<View>
								<Text style={isMessageRead}>{name}</Text>
								<Text style={{fontFamily: Fonts.regFont[Platform.OS]}}>{message}</Text>
							</View>
						</View>

						<View>
							<Text>{moment.utc(rowData.lastPostAt).format('h:mm A')}</Text>
							<View style={isReadStatus}/>
						</View>

					</View>


				</TouchableOpacity>
			);
		}
	}

});

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'white',
	},

	notRead: {
		marginTop: 10,
		width: 10,
		height: 10,
		borderRadius: 5,
		alignSelf: 'center',
		backgroundColor: '#2e8bfe',
	},

	textBold: {
		fontSize: 14,
		color: '#333',
		fontWeight: 'bold',
		fontFamily: Fonts.regFont[Platform.OS],
	},
	inputContainer: {
		flex: 1,
		height: 35,
		flexDirection: 'row',
		justifyContent: 'flex-start',
		paddingLeft: 10,
		alignSelf: 'center',
		//borderRadius: 4,
		//borderWidth: 0.75,
		backgroundColor: '#f2f2f2',

		//borderColor: 'gray',
		//marginLeft: 5,
	},

	input: {
		height: 35,
		marginHorizontal: 5,
		flex: 9,
		//paddingHorizontal: 20,
		paddingVertical: 6,
		fontFamily: Fonts.regFont[Platform.OS],
	},

});

module.exports = ChatRecentMessages;
