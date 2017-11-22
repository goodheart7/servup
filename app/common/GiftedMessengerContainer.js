import React, {
	Component,
} from 'react';
import {
	Linking,
	Platform,
	ActionSheetIOS,
	Dimensions,
	View,
	Text,
	Navigator,
	AppRegistry,
} from 'react-native';

import './UserAgent';

window.navigator.userAgent = 'react-native';
var GiftedMessenger = require('react-native-gifted-messenger');
var Communications = require('react-native-communications');
var TitleBar = require('./TitleBar');
import io from 'socket.io-client/socket.io';

var STATUS_BAR_HEIGHT = Navigator.NavigationBar.Styles.General.StatusBarHeight;
if (Platform.OS === 'android') {
	var ExtraDimensions = require('react-native-extra-dimensions-android');
	var STATUS_BAR_HEIGHT = ExtraDimensions.get('STATUS_BAR_HEIGHT');
}

import {themeColor as themeColor} from './theme';
var chat;
var user1 = '632ca84f-06e6-49fa-870b-4777242e0707';
var user3 = '52c3f7cf-699b-4de3-ba37-7d0ca27dfc49';
var chatInitiationID;

var GiftedMessengerContainer = React.createClass(
{
	getInitialState()
	{
		this.socket = io('localhost:3001', {jsonp: false});
		this._isMounted = false;
		this._messages = this.getInitialMessages();

		return {
			messages: this._messages,
			isLoadingEarlierMessages: false,
			typingMessage: '',
			allLoaded: false,
		}
	},

	componentDidMount()
	{
		var yae = this;
		this._isMounted = true;

		setTimeout(() => {
			this.setState({
				typingMessage: 'React-Bot is typing a message...',
			});
		}, 1000); // simulating network

		setTimeout(() => {
			this.setState({
				typingMessage: '',
			});
		}, 3000); // simulating network


		setTimeout(() => {
			this.handleReceive({
				text: 'Hello Awesome Developer',
				name: 'React-Bot',
				image: {uri: 'https://facebook.github.io/react/img/logo_og.png'},
				position: 'left',
				date: new Date(),
				uniqueId: Math.round(Math.random() * 10000), // simulating server-side unique id generation
			});
		}, 3300); // simulating network

		chat = io.connect('http://54.208.154.155/chat', { query: 'userId=' + user3 , transports: ['websocket']});

		chat.on('connect', function() {
			console.log('>>>> Connected');

			chat.emit('servupChatServer:createThread', user3, user1, function(data) {
				chatInitiationID = data.id;
				console.log('###', data);

				// chat.on('servupChatServer:receiveMsg', function(data) {
				//     console.log('Message Received: ', data);
				// });				  
				
			});

			chat.on('servupChatServer:receiveMessage', function(data) {
				console.log('>>>', data);
				yae.handleReceive({
					text: data.message,
					name: 'React-Bot',
					image: {uri: 'https://facebook.github.io/react/img/logo_og.png'},
					position: 'left',
					date: new Date(),
					uniqueId: Math.round(Math.random() * 10000),});
				});
		});
	},

	componentWillUnmount()
	{
		this._isMounted = false;
	},

	getInitialMessages()
	{
		return [
			{
				text: 'Are you building a chat app?',
				name: 'React-Bot',
				image: {uri: 'https://facebook.github.io/react/img/logo_og.png'},
				position: 'left',
				date: new Date(2016, 3, 14, 13, 0),
				uniqueId: Math.round(Math.random() * 10000), // simulating server-side unique id generation
			},
			{
				text: "Yes, and I use Gifted Messenger!",
				name: 'Awesome Developer',
				image: null,
				position: 'right',
				date: new Date(2016, 3, 14, 13, 1),
				uniqueId: Math.round(Math.random() * 10000), // simulating server-side unique id generation
			},
		];
	},

	setMessageStatus(uniqueId, status)
	{
		let messages = [];
		let found = false;

		for (let i = 0; i < this._messages.length; i++) {
			if (this._messages[i].uniqueId === uniqueId) {
				let clone = Object.assign({}, this._messages[i]);
				clone.status = status;
				messages.push(clone);
				found = true;
			} else {
				messages.push(this._messages[i]);
			}
		}

		if (found === true) {
			this.setMessages(messages);
		}
	},

	setMessages(messages)
	{
		this._messages = messages;

		// append the message
		this.setState({
			messages: messages,
		});
	},

	handleSend(message = {})
	{

		// Your logic here
		// Send message.text to your server
		//	message.text = 'Testing message from User 1';

		chat.emit('servupChatClient:sendMessage', chatInitiationID, user3, user1, message.text);
		console.log (">>" + message.text);

		message.uniqueId = Math.round(Math.random() * 10000); // simulating server-side unique id generation
		this.setMessages(this._messages.concat(message));

		// mark the sent message as Seen
		setTimeout(() => {
			this.setMessageStatus(message.uniqueId, 'Seen'); // here you can replace 'Seen' by any string you want
		}, 1000);

		// if you couldn't send the message to your server :
		// this.setMessageStatus(message.uniqueId, 'ErrorButton');
	},

	onLoadEarlierMessages()
	{

		// display a loader until you retrieve the messages from your server
		this.setState({
			isLoadingEarlierMessages: true,
		});

		// Your logic here
		// Eg: Retrieve old messages from your server

		// IMPORTANT
		// Oldest messages have to be at the begining of the array
		var earlierMessages = [
			{
				text: 'React Native enables you to build world-class application experiences on native platforms using a consistent developer experience based on JavaScript and React. https://github.com/facebook/react-native',
				name: 'React-Bot',
				image: {uri: 'https://facebook.github.io/react/img/logo_og.png'},
				position: 'left',
				date: new Date(2016, 0, 1, 20, 0),
				uniqueId: Math.round(Math.random() * 10000), // simulating server-side unique id generation
			}, {
				text: 'This is a touchable phone number 0606060606 parsed by taskrabbit/react-native-parsed-text',
				name: 'Awesome Developer',
				image: null,
				position: 'right',
				date: new Date(2016, 0, 2, 12, 0),
				uniqueId: Math.round(Math.random() * 10000), // simulating server-side unique id generation
			},
		];

		setTimeout(() => {
			this.setMessages(earlierMessages.concat(this._messages)); // prepend the earlier messages to your list
			this.setState({
				isLoadingEarlierMessages: false, // hide the loader
				allLoaded: true, // hide the `Load earlier messages` button
			});
		}, 1000); // simulating network

	},

	handleReceive(message = {})
	{
		// make sure that your message contains :
		// text, name, image, position: 'left', date, uniqueId
		this.setMessages(this._messages.concat(message));
	},

	onErrorButtonPress(message = {})
	{
		// Your logic here
		// re-send the failed message

		// remove the status
		this.setMessageStatus(message.uniqueId, '');
	},

	// will be triggered when the Image of a row is touched
	onImagePress(message = {})
	{
		// Your logic here
		// Eg: Navigate to the user profile
	},


	backFunction()
	{
		this.props.navigator.pop();
	},

	render()
	{
		return (
			<View>
				<TitleBar
					leftButton = {require('../../res/common/back.png')}
					title = "Chat"
				//	titleImage = {require('./images/Servup_logo.png')}
				//	rightButton = {require('../res/common/menu.png')}
				//	rightButton2 = {require('../../res/common/menu.png')}
					onLeftButtonPress={this.backFunction}
				//	onRightButton2Press= {this.sideMenuScreen}
				//	subText="last seen at 2:10 PM"
				//	rightText = "Add"
				/>
				<GiftedMessenger
					ref={(c) => this._GiftedMessenger = c}

					styles={{
						bubbleRight: {
							marginLeft: 70,
							backgroundColor: themeColor.wind,
						},
					}}

					autoFocus={false}
					messages={this.state.messages}
					handleSend={this.handleSend}
					onErrorButtonPress={this.onErrorButtonPress}
					maxHeight={Dimensions.get('window').height - Navigator.NavigationBar.Styles.General.NavBarHeight - STATUS_BAR_HEIGHT}

					loadEarlierMessagesButton={!this.state.allLoaded}
					onLoadEarlierMessages={this.onLoadEarlierMessages}

					senderName='Awesome Developer2'
					senderImage={null}
					onImagePress={this.onImagePress}
					displayNames={true}

					parseText={true} // enable handlePhonePress, handleUrlPress and handleEmailPress
					handlePhonePress={this.handlePhonePress}
					handleUrlPress={this.handleUrlPress}
					handleEmailPress={this.handleEmailPress}

					isLoadingEarlierMessages={this.state.isLoadingEarlierMessages}

					typingMessage={this.state.typingMessage}
				/>
			</View>
		);
	},

	handleUrlPress(url)
	{
		Linking.openURL(url);
	},

	// TODO
	// make this compatible with Android
	handlePhonePress(phone)
	{
		if (Platform.OS !== 'android') {
			var BUTTONS = [
				'Text message',
				'Call',
				'Cancel',
			];
			var CANCEL_INDEX = 2;

			ActionSheetIOS.showActionSheetWithOptions({
				options: BUTTONS,
				cancelButtonIndex: CANCEL_INDEX
			},
			(buttonIndex) => {
				switch (buttonIndex) {
					case 0:
						Communications.phonecall(phone, true);
						break;
					case 1:
						Communications.text(phone);
						break;
				}
			});
		}
	},

	handleEmailPress(email)
	{
		Communications.email(email, null, null, null, null);
	},

});


module.exports = GiftedMessengerContainer;