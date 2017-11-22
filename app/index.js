import React, {
	Component,
} from 'react';

import {
	Navigator,
	AppRegistry,
	StyleSheet,
	Text,
	View,
	ListView,
	StatusBar,
	AsyncStorage,
	BackAndroid,
	Platform,
} from 'react-native';

import {
  Style,
  StyleConstants,
  Fonts
} from '../app/stylesheet/style';

global.Style = Style;
global.StyleConstants = StyleConstants;
global.Fonts = Fonts;

import _ from 'lodash';
import routes from './routes';
import configureScene from './configureScene';
import {getRecentChats} from '../lib/networkHandler';

window.navigator.userAgent = "react-native";
var io = require('socket.io-client/dist/socket.io');

var ds = new ListView.DataSource({
	rowHasChanged: (oldRow, newRow) => { oldRow !== newRow	}
});

var messagesDs = new ListView.DataSource({
	rowHasChanged: (oldRow, newRow) => { oldRow !== newRow	}
});

var ServUp = React.createClass({

	getInitialState() {
		return {
			chats: [],
			chatsSource: [],
			messagesSource: messagesDs, // Indivisual Chat Messages
			messages: []
		}
		contactsCount : ''
	},


	componentDidMount() {
		AsyncStorage.getItem("UserToken")
		.then((token) => {
			this.setState({ "userToken": token });
			this.connectSocket(token);
			return getRecentChats(token);
		})
		.then((chats) => {
			var array = chats;
			if (array.Errors)
				array = [];
		//	console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ resent chats', chats)
			array = _.sortBy(array, ['isRead', 'lastPostAt']);
			this.setState({
				array,
				unreadChats: _.filter(array, {isRead: false}).length,
				chatSource: ds.cloneWithRows(array)
			});
			return AsyncStorage.getItem("servupContactCount")
		})
		.then ((value) => {
			this.setState({ contactsCount: value })
		})
		.catch((err) => {
			console.log('index.js -- componentDidMount() Error: ', err);
		});

	},

	connectSocket(accessToken) {
		this.socket = io(
			'http://servup.io/?access_token=' + accessToken,
			{
			  jsonp: false,
			  transports: ['websocket'],
			  forceNew: true
			}
		);

		this.socket.on('connect', () => {
		  console.log('index.js -- componentDidMount() Connected to Chat Server');
		});

		this.socket.on('disconnect', () => {
			console.log('index.js -- componentDidMount() Disconnected From Chat Server')
		});

		this.socket.on('error', () => {
		  console.log('index.js -- componentDidMount() Error! Not Connected To Chat Server');
		});

		this.socket.on('comm', (message) => {
			console.log('comm: ', message);

			var chatItems = _.clone(this.state.chats);
			var chat = _.find(chatItems, {id: message.chatId});

			if(chat)
			{

				chat.lastPost = message.message;
				chat.lastPostAt = new Date().toISOString();
				chat.isRead = false;

				var chatMessages = [];

				if (this.state.messages[chat.id]) {
					chat.isRead = true;
					chatMessages[chat.id] = _.concat([message.message], this.state.messages[chat.id])
					this.setState({messages: chatMessages}, function() {
						this.setState({messagesSource: messagesDs.cloneWithRows(this.state.messages[chat.id])});
					});
				}

			}
			else
			{
				chatItems.push(this.getNewChat(message.message));
			}

			var chatItems = _.sortBy(chatItems, ['isRead', 'lastPostAt']);
			this.setState({ chats: chatItems });

			this.setState({ unreadChats: _.filter(chatItems, {isRead: false}).length });
			this.setState({ chatSource: ds.cloneWithRows(chatItems)} );

		});
	},

	getNewChat(message) {
		//console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
		//console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
		//console.log('Index.js GetNewChat', message);
		return {
			"id": message.chatId,
			"name": "57dbf3527ef2010e80496da4-57dbf3fa7ef2010e80496da5",
			"type": "user",
			"lastPostAt": new Date().toISOString(),
			"totalMessagesCount": 3,
			"isResolved": false,
			"isOnHold": false,
			"userId": message.userId,
			"isRead": false,
			"lastPost": message
		};
	},

	updateMessages(chatId, messages) {
		console.log('Update messages called with', chatId, messages);
		var chatMessages = [];
		chatMessages[chatId] = messages;

		if (messages)
		{
			this.setState({
				messagesSource: messagesDs.cloneWithRows(messages),
				messages: chatMessages
			}, function() {
				console.log('Found chat in state is ', this.state.chats);
				var chatItems = _.clone(this.state.chats);
				console.log('Found chat items are ', chatItems);
				var chat = _.find(chatItems, {id: chatId});
				console.log('Found chat is ', chat);
				chat.isRead = true;
				var chatItems = _.sortBy(chatItems, ['isRead', 'lastPostAt']);
				this.setState({ chats: chatItems });

				this.setState({ unreadChats: _.filter(chatItems, {isRead: false}).length });
				this.setState({ chatSource: ds.cloneWithRows(chatItems)} );
			});
		}
		else
		{
			this.setState({
				messagesSource: messagesDs.cloneWithRows([]),
				messages: []
			});
		}
	},

	disconnectSocket(saySomething) {
		// console.log('Logging out...........................', saySomething);
		// this.socket.disconnect();
	},

	_renderScene(route, navigator) {
		let data = {
			unreadCount: this.state.unreadChats,
			contactsCount: this.state.contactsCount,
			disconnectSocket: this.disconnectSocket,
			messageSource: this.state.messagesSource,
			chatSource: this.state.chatSource,
			updateMessages: this.updateMessages,
		};
		return routes(route, navigator, data);
	},

	render() {
		return(
			<Navigator
				initialRoute = {{ id: 1}}
				renderScene = {this._renderScene}
				props = {{ cards: '' }}
				configureScene = {(route) => configureScene(route)}
			/>

		);
	}
});

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'flex-end',
		backgroundColor: StyleConstants.primary,
	},
})

AppRegistry.registerComponent('ServUp', () => ServUp);
module.exports = ServUp;
