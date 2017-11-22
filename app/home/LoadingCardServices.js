import React, { Component } from 'react';
import {
	AppRegistry,
	StyleSheet,
	Text,
	View,
	Dimensions,
	Animated
} from 'react-native';
import Bar from './Bar'
const {width, height} = Dimensions.get('window');

var LoadingCardServices = React.createClass({
	getInitialState() {
		return {
			
		};
	},

	componentDidMount() {

	},

	render() {
		return (
			<View style = {{flexGrow: 1, height: height/3, margin: 5, marginVertical: 5, backgroundColor: '#FFFFFF'}}>
				<View style = {{flex: 1, margin: 5, justifyContent: 'center', alignItems: 'center'}}>
					<Bar
						colors = {['rgba(100, 100, 100, 0.1)', 'rgba(100, 100, 100, 0.5)', 'rgba(100, 100, 100, 0.1)']}
						backgroundColor = {'rgba(220, 220, 220, 0.1)'}
						maximumOpacity = {0.1}
						minimumOpacity = {0.1}
						reverse = {true}
						active = {this.state.active}
						height = {height/7}
						width = {height/3.5}
					/>
					<Bar
						colors = {['rgba(100, 100, 100, 0.1)', 'rgba(100, 100, 100, 0.5)', 'rgba(100, 100, 100, 0.1)']}
						backgroundColor = {'rgba(100, 100, 100, 0.1)'}
						maximumOpacity = {0.2}
						minimumOpacity = {0.1}
						reverse = {true}
						active = {this.state.active}
						width = {200}
						height = {10}
						style = {{alignSelf: 'flex-start'}}
					/>
					<Bar
						colors = {['rgba(100, 100, 100, 0.1)', 'rgba(100, 100, 100, 0.5)', 'rgba(100, 100, 100, 0.1)']}
						backgroundColor = {'rgba(100, 100, 100, 0.1)'}
						maximumOpacity = {0.2}
						minimumOpacity = {0.1}
						reverse = {true}
						active = {this.state.active}
						width = {250}
						height = {10}
						style = {{alignSelf: 'flex-start'}}
					/>
					<Bar
						colors = {['rgba(100, 100, 100, 0.1)', 'rgba(100, 100, 100, 0.5)', 'rgba(100, 100, 100, 0.1)']}
						backgroundColor = {'rgba(100, 100, 100, 0.1)'}
						maximumOpacity = {0.2}
						minimumOpacity = {0.1}
						reverse = {true}
						active = {this.state.active}
						width = {200}
						height = {10}
						style = {{alignSelf: 'flex-start'}}
					/>
				</View>
			</View>
		);
	}
});
module.exports = LoadingCardServices;
