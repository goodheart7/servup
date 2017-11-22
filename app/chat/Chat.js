import React, { Component, } from 'react';
import {
		Navigator,
		ScrollView,
		TouchableOpacity,
		StyleSheet,
		Text,
		TextInput,
		View,
		Dimensions,
		Platform,
		ListView,
		Image,
		AsyncStorage,
		Keyboard,
} from 'react-native';

const {height, width} = Dimensions.get('window');

import _ from 'lodash';
import moment from 'moment';
import * as Animatable from 'react-native-animatable';
import InvertibleScrollView from 'react-native-invertible-scroll-view';
import Modal from 'react-native-simple-modal';
import Communications from 'react-native-communications';

import KeyboardSet from '../common/KeyboardSet';

import {
	Style,
	StyleConstants,
	Fonts
} from '../stylesheet/style';

import MenuBar from '../common/MenuBar';

import {
	startChatWithOtherPerson,
	getAllPostOfChatWithPerson,
	markChatAsRead,
	createAPostInChat,
	getPublicIdAgaintUserToken
} from '../../lib/networkHandler';

import UserPostedMessage from './ChatTypes/UserPostedMessage';
import UserLikedCard from './ChatTypes/UserLikedCard';
import UserSharedCard from './ChatTypes/UserSharedCard';
import UserSharedAnotherCard from './ChatTypes/UserSharedAnotherCard';
import UserSharedQuickResponse from './ChatTypes/UserSharedQuickResponse';
import UserUnsubscribedCard from './ChatTypes/UserUnsubscribedCard';
import UserMarkedResolve from './ChatTypes/UserMarkedResolve';
import UserPostedFile from './ChatTypes/UserPostedFile';
import UserPostedPicture from './ChatTypes/UserPostedPicture';

import chatstub from './stubs/IndivisualChatStub';

var ds = new ListView.DataSource({ rowHasChanged: (oldRow, newRow) => { } });
var newList;

var Chat = React.createClass({

	getInitialState () {
		return {
			backed:  false,
			messages: ds.cloneWithRows(this.props.messages),
			FakeMessages: ds.cloneWithRows(chatstub),
			newMessage: '',
			loader:false,
			loadingMessages:true,
			chatGroupId:this.props.chatGroupId,
		}
	},

	componentWillMount () {
		this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardHide);
	},

	componentWillUnmount () {
		this.props.updateMessages(this.state.chatGroupId, '');
	},

	componentDidMount () {
		console.log('Chat.js DidMount chat group id', this.props.chatGroupId);
		if (this.props.chatGroupId)
		{
			AsyncStorage.getItem("UserToken")
			.then((value) => {
				this.setState({"token": value});
				return getPublicIdAgaintUserToken(value)
			})
			.then((value) => {
				console.log("Chat.js DidMount getPublicIdAgaintUserToken response", value);
				this.setState({ publicId: value.userId });
				/* return AsyncStorage.getItem("chatwithUserId");
				 })
				 .then((value) => {
				 console.log("@@@@@@@@@@Other User ID chat@@@@@@@@@@", value);
				 this.setState({'chatwithUserId': value});
				 return startChatWithOtherPerson(this.state.chatwithUserId, this.state.token);
				 })
				 .then((value) => {
				 console.log("@@@@@@@@@@Group Id@@@@@@@@@@", value);
				 this.setState({ chatGroupId: value.id });*/
				return getAllPostOfChatWithPerson(this.props.chatGroupId, this.state.token)
			})
			.then((value) => {
				console.log("Chat.js DidMount getAllPostOfChatWithPerson response", value);
				// console.log('Chat Message Are: ', value);
				this.setState({loadingMessages:false});
				this.props.updateMessages(this.state.chatGroupId, value);
				return markChatAsRead(this.state.chatGroupId, this.state.token)
			})
			.then((value) => {
				console.log("Chat.js DidMount markChatAsRead response", value);
			})
			.catch((err) => {
				this.sendData('removeMe');
				console.log('Chat.js -> if - Error: ', err);
			})
		}
		else
		{

			AsyncStorage.getItem("UserToken")
			.then((value) => {
				this.setState({"token": value});
				console.log('@@@@@ suser token', value);
				return getPublicIdAgaintUserToken(value)
			})
			.then((value) => {
				console.log("@@@@@@@@@@public ID against token@@@@@@@@@@", value);
				this.setState({publicId: value.userId});
				return AsyncStorage.getItem("chatwithUserId")
			})
			.then((value) => {
				console.log("@@@@@@@@@@Other User ID chat@@@@@@@@@@", value);
				this.setState({'chatwithUserId': value});
				return startChatWithOtherPerson(value, this.state.token);
			})
			.then((value) => {
				console.log("@@@@@@@@@@Group Id@@@@@@@@@@", value);
				this.setState({ chatGroupId: value._id });
				return getAllPostOfChatWithPerson(value._id, this.state.token);
			})
			.then((value) => {
				console.log('Chat Message Are: ', value);
				this.setState({loadingMessages:false});
				this.props.updateMessages(this.state.chatGroupId, value);
				return markChatAsRead(this.state.chatGroupId, this.state.token)
			})
			.then((value) => {
				console.log("Chat.js DidMount markChatAsRead response", value);
			})
			.catch((err) => {
				console.log('Chat.js -> else - Error: ', err);
			})
		}
	},

	backFunction () {
		if (this.state.backed == false) {
				this.state.backed = true;
				setTimeout(()=>{this.state.backed = false;}, 1000);
				this.props.navigator.pop();
		}
	},

	_keyboardHide() {
			// this.setState({ 'marginBottom': 0 });
	},

	callButtonPressed() {
		console.log('Testing Calling Feature');
		// this.setState({ callModalOpen: true });
		Communications.phonecall('123456789654', true);
	},

	callModal() {
		return (
			<Modal
				offset = {this.state.offset}
				open = {this.state.callModalOpen}
				modalDidOpen = {() => console.log('modal did open')}
				modalDidClose = {() => this.setState({callModalOpen: false})}
			>
				<View style = {{ flex: 1, alignItems: 'center' }}>
						<Text style={styles.callModalText}>
							This Feature Is Coming Soon
						</Text>
				</View>
			</Modal>
		);
	},

	render () {
		let {navigator, userName} = this.props;

		let title = userName ? userName : 'User'

		return(
			<View style={styles.container}>
				<MenuBar
					// color = {'red'} // Optional By Default 'black'
					title = {title} // Optional
					leftIcon = {'icon-back_screen_black'}
					rightIcon = {'icon-call_support'} // Optional
					// disableLeftIcon = {true} // Optional By Default false
					// disableRightIcon = {true} // Optional By Default false
					onPressLeftIcon = {() => { navigator.pop() }} // Optional
					onPressRightIcon = {this.callButtonPressed} // Optional
				/>

				<ListView
					renderScrollComponent={props => <InvertibleScrollView {...props} inverted keyboardShouldPersistTaps = {'always'} />}
					// enableEmptySections={true}
					// dataSource={this.state.FakeMessages}
					dataSource={this.props.messages}
					renderRow={this.renderMessages}
					renderHeader={this.renderFooter}
					bounces={false}
				 // onEndReached={this.renderLoader}
					renderFooter={()=>this.renderLoader(this.state.loadingMessages)}
					style= {styles.chatlistbody}
				/>
				{this.callModal()}
				{this.ImageModal()}
				<KeyboardSet />
			</View>
		);
	},
	renderLoader(flag){
		if (flag) {
			return (
				<View style={[styles.loader, {paddingVertical:5}]}>
					<Animatable.View
						// ref="view"
						animation="bounceIn" iterationCount={"infinite"} direction="alternate" delay={500} easing={"linear"}
						style={styles.dot}>
					</Animatable.View>
					<Animatable.View
						// ref="view"
						animation="bounceIn" iterationCount={"infinite"} direction="alternate" easing={"ease"}
						style={styles.dot}>
					</Animatable.View>
					<Animatable.View
						// ref="view"
						animation="bounceIn" iterationCount={"infinite"} direction="alternate" delay={500} easing={"ease-in"}
						style={styles.dot}>
					</Animatable.View>
					<Animatable.View
						// ref="view"
						animation="bounceIn" iterationCount={"infinite"} direction="alternate" easing={"ease-out"}
						style={styles.dot}>
					</Animatable.View>
				</View>
			);
		} else {
			return (<View></View>);
		}
	},
	sendData(initialMessage) {
		console.log("@@@@@@@@@@Group ISSSd@@@@@@@@@@", this.state.chatGroupId);
		this.setState({loader:true});
		console.log('Send Data called');
		let {chatGroupId, token, newMessage} = this.state;
		let {messages} = this.props;
		console.log("@@@@@@@@@@Group ISSSd@@@@@@@@@@", chatGroupId);
		newList = messages;
		this.setState({ messages: ds.cloneWithRows(newList) });
		console.log('@@@@@@@@@@@@ before Response ', newMessage);
		if (initialMessage == 'removeMe')
		{
			createAPostInChat(chatGroupId, token, 'removeMe')
			.then((message) => {
				console.log('@@@@@@@@@@@@ on Response ', message);
				// newList.unshift(message);
				// this.props.messages.unshift(message);
				this.setState({
					loader:false,
					messages: ds.cloneWithRows(newList),
					newMessage: '',
				});
			})
			.catch((err) => {
				console.log('Chat.js sendData() Error: ', err);
			});
		}
		else
		{
			createAPostInChat(chatGroupId, token, newMessage)
			.then((message) => {
				console.log('@@@@@@@@@@@@ on Response ', message);
				// newList.unshift(message);
				// this.props.messages.unshift(message);
				this.setState({
					loader:false,
					messages: ds.cloneWithRows(newList),
					newMessage: ''
				});
			})
			.catch((err) => {
				console.log('Chat.js sendData() Error: ', err);
			});
		}
		// this.refs.input.focus();
	},

	renderFooter() {
		return (
			<View >
				{this.renderLoader(this.state.loader)}
			<View style={styles.sendMessageContainer}>
				<View style={styles.inputContainer}>
					<TextInput
						ref="InputChat"
						style={{ flex: 1, paddingHorizontal: 15 }}
						multiline={false}
						autoFocus={true}
						underlineColorAndroid="transparent"
						placeholder={"Your Message"}
						placeholderTextColor={'#999'}
						keyboardType="default"
						returnKeyType="done"
						autoCapitalize="sentences"
						value = {this.state.newMessage}
						// value={this.state.newMessage}
						onChangeText={(e) => { this.setState({ newMessage: e }); }}
						onSubmitEditing={this.sendData}
					/>
				</View>

				<TouchableOpacity style={styles.inputAreaIcon}>
					<Image source={require('../../res/common/attach.png')} />
				</TouchableOpacity>

			</View>
			</View>
		);
	},

	ImageModal () {
		return (
			<Modal
				offset = {this.state.offset}
				open = {this.state.showImageModal}
				modalDidOpen = {() => console.log('modal did open')}
				modalDidClose = {() => this.setState({ showImageModal: false })}
				style={{ backgroundColor: 'transparent' }}
			>
				<Image
					style={styles.modalImage}
					source={{ uri: this.state.modalImage }}
					resizeMode={'cover'}
				/>
			</Modal>
		);
	},

	handleImageModal (image) {
		this.setState({
			showImageModal: true,
			modalImage: image,
		});
	},

	renderMessages(rowData, sectionID, rowID) {
	 // this.renderLoader();
		 //console.log('@@@@@@@@@@@@@@@@@@@@@@ Single Message: ', rowData);
		if(rowData.user.profilePictureURL !== null && rowData.user.profilePictureURL != '') {
			personImg = { uri: rowData.user.profilePictureURL };
		} else {
			personImg = require('../../res/common/profile.png');
		}

		if (rowData.userId === this.state.publicId) {
		// if (rowData.userId === 'dbdf4f9c4ce44fcbb31a5145bd2775af') {

			if (rowData.type === 'user_posted_message') {
				return <UserPostedMessage person={"sender"} {...rowData} profileImage={personImg}/>
			}
			else if (rowData.type === 'user_liked_card') {
				return <UserLikedCard person={"sender"} {...rowData} profileImage={personImg}/>
			}
			else if (rowData.type === 'user_shared_card') {
				return <UserSharedCard person={"sender"} {...rowData} profileImage={personImg}/>
			}
			else if (rowData.type === 'user_shared_another_card') {
				return <UserSharedAnotherCard person={"sender"} {...rowData} profileImage={personImg}/>
			}
			else if (rowData.type === 'user_shared_quick_response') {
				return <UserSharedQuickResponse person={"sender"} {...rowData} profileImage={personImg}/>
			}
			else if (rowData.type === 'user_unsubscribed_card') {
				return <UserUnsubscribedCard person={"sender"} {...rowData} profileImage={personImg}/>
			}
			else if (rowData.type === 'user_marked_resolved') {
				return <UserMarkedResolve person={"sender"} {...rowData} profileImage={personImg}/>
			}
			else if (rowData.type === 'user_posted_file') {
				return <UserPostedFile person={"sender"} {...rowData} profileImage={personImg}/>
			}
			else if (rowData.type === 'user_posted_picture') {
				return (
					<UserPostedPicture
					person={"sender"}
					{...rowData}
					profileImage={personImg}
					onPressAttachment={this.handleImageModal} />
				);
			} else {
				return <View></View>
			}

		} else {

			if (rowData.type === 'user_posted_message') {
				return <UserPostedMessage person={"reciever"} {...rowData}
								profileImage={personImg}
								navigator={this.props.navigator}/>
			}
			else if (rowData.type === 'user_liked_card') {
				return <UserLikedCard person={"reciever"} {...rowData}
								profileImage={personImg}
								navigator={this.props.navigator}/>
			}
			else if (rowData.type === 'user_shared_card') {
				return <UserSharedCard person={"reciever"} {...rowData}
								profileImage={personImg}
								navigator={this.props.navigator}/>
			}
			else if (rowData.type === 'user_shared_another_card') {
				return <UserSharedAnotherCard person={"reciever"} {...rowData}
								profileImage={personImg}
								navigator={this.props.navigator}/>
			}
			else if (rowData.type === 'user_shared_quick_response') {
				return <UserSharedQuickResponse person={"reciever"} {...rowData}
								profileImage={personImg}
								navigator={this.props.navigator}/>
			}
			else if (rowData.type === 'user_unsubscribed_card') {
				return <UserUnsubscribedCard person={"reciever"} {...rowData}
								profileImage={personImg}
								navigator={this.props.navigator}/>
			}
			else if (rowData.type === 'user_marked_resolved') {
				return <UserMarkedResolve person={"reciever"} {...rowData}
								profileImage={personImg}
								navigator={this.props.navigator}/>
			}
			else if (rowData.type === 'user_posted_file') {
				return <UserPostedFile person={"reciever"} {...rowData}
								profileImage={personImg}
								navigator={this.props.navigator}/>
			}
			else if (rowData.type === 'user_posted_picture') {
				return <UserPostedPicture
								person={"reciever"}
								{...rowData}
								profileImage={personImg}
								onPressAttachment={this.handleImageModal}
								navigator={this.props.navigator}/>
			} else {
				return <View></View>
			}


		}

	},

});

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'white',
	},

	chatlistbody: {
		backgroundColor: 'white',
		paddingBottom: 20, // this is an invertible so bottom means top`
	},

	senderMessages: {
		width: width*0.4,
		backgroundColor: StyleConstants.primary,
		paddingVertical: 10,
		paddingHorizontal: 20,
		marginBottom: 5,
		marginRight: 15,
		borderTopRightRadius: 0,
		borderTopLeftRadius: 15,
		borderBottomLeftRadius: 15,
		borderBottomRightRadius: 15,
		alignSelf: 'flex-end',
	},

	recieverMessages: {
		flex: 8,
		backgroundColor: '#f0f0f0',
		paddingVertical: 10,
		paddingHorizontal: 20,
		// marginRight: width*0.4,
		marginRight: 15,
		marginLeft: 10,
		marginBottom: 5,
		borderTopLeftRadius: 0,
		borderTopRightRadius: 15,
		borderBottomLeftRadius: 15,
		borderBottomRightRadius: 15,
	},

	recieverMessagesForCard: {
		flex: 8,
		flexDirection: 'row',
		marginRight: 15,
		marginLeft: 10,
		marginBottom: 5,
		borderWidth: 0.75,
		borderColor: StyleConstants.gray,
		borderRadius: 15,
	},

	cardImage: {
		width: 80,
		height: 80,
		borderBottomLeftRadius: 15,
		borderTopLeftRadius: 15,
	},
	loader: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		marginVertical: 10,
	},

	dot: {
		width: 10,
		height: 10,
		borderRadius: 5,
		marginHorizontal: 3,
		backgroundColor: 'black',
	},
	modalImage: {
		width: 380,
		height: 380,
		alignSelf: 'center',
	},

	senderMessagesText: {
		color: 'white',
	},

	recieverMessagesText: {
		color: '#333',
	},

	senderDate: {
		marginRight: 35,
		alignSelf: 'flex-end',
		marginBottom: 20,
	},

	recieverDate: {
		marginLeft: 100,
		marginBottom: 20,
	},

	contactImage: {
			width: 50,
			height: 50,
			borderRadius: 25,
			marginLeft: 15,
			alignSelf: 'flex-start',
	},

	sendMessageContainer: {
		flex: 1,
		flexDirection: 'row',
		height: 60,
		backgroundColor: '#f2f1ef',
		paddingVertical: 10,
		paddingHorizontal: 10,
		// marginTop: 20,
		alignItems: 'center'
	},

	inputAreaIcon: {
		// flex: 1,
		paddingHorizontal: 5,
	},

	inputContainer: {
		flex: 1,
		height: 40,
		borderWidth: 1,
		borderRadius: 6,
		borderColor: '#e2e2e1',
		backgroundColor: 'white',
		marginHorizontal: 10,
		marginVertical: 2,
		alignSelf: 'center',
	},

	callModalText: {
		paddingHorizontal: 20,
		paddingVertical: 30,
		fontSize: 18,
		fontFamily: Fonts.regFont[Platform.OS],
	},

	recieverHowToContainer: {
		flex: 8,
		marginRight: 15,
		marginLeft: 10,
		marginBottom: 5,
		borderWidth: 0.75,
		borderColor: StyleConstants.gray,
		borderRadius: 15,
	},

	recieverHowToHRLine: {
		flex: 1,
		borderBottomWidth: 1,
		borderBottomColor: StyleConstants.gray,
	},

	recieverHowToContainerText: {
		paddingVertical: 5,
		paddingHorizontal: 10,
	}
});

module.exports = Chat
