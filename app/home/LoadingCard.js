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

var LoadingCard = React.createClass({
	getInitialState() {
		return {
			
		};
	},

	componentDidMount() {

	},

	render() {
		return (
			<View style = {{flexGrow: 1, height: height/2, margin: 5, marginVertical: 15, backgroundColor: '#FFFFFF'}}>
				<View style = {{flex: 1, margin: 5}}>
					<Bar
						colors = {['rgba(100, 100, 100, 0.1)', 'rgba(100, 100, 100, 0.5)', 'rgba(100, 100, 100, 0.1)']}
						backgroundColor = {'rgba(100, 100, 100, 0.1)'}
						maximumOpacity = {0.2}
						minimumOpacity = {0.1}
						reverse = {true}
						active = {this.state.active}
						width = {300}
						height = {10}
					/>
					<Bar
						colors = {['rgba(100, 100, 100, 0.1)', 'rgba(100, 100, 100, 0.5)', 'rgba(100, 100, 100, 0.1)']}
						backgroundColor = {'rgba(100, 100, 100, 0.1)'}
						maximumOpacity = {0.2}
						minimumOpacity = {0.1}
						reverse = {true}
						active = {this.state.active}
						width = {350}
						height = {10}
					/>
					<Bar
						colors = {['rgba(100, 100, 100, 0.1)', 'rgba(100, 100, 100, 0.5)', 'rgba(100, 100, 100, 0.1)']}
						backgroundColor = {'rgba(100, 100, 100, 0.1)'}
						maximumOpacity = {0.2}
						minimumOpacity = {0.1}
						reverse = {true}
						active = {this.state.active}
						width = {275}
						height = {10}
					/>
					<Bar
						colors = {['rgba(100, 100, 100, 0.1)', 'rgba(100, 100, 100, 0.5)', 'rgba(100, 100, 100, 0.1)']}
						backgroundColor = {'rgba(100, 100, 100, 0.1)'}
						maximumOpacity = {0.2}
						minimumOpacity = {0.1}
						reverse = {true}
						active = {this.state.active}
						width = {120}
						height = {10}
					/>
					<Bar
						colors = {['rgba(100, 100, 100, 0.1)', 'rgba(100, 100, 100, 0.5)', 'rgba(100, 100, 100, 0.1)']}
						backgroundColor = {'rgba(220, 220, 220, 0.1)'}
						maximumOpacity = {0.1}
						minimumOpacity = {0.1}
						reverse = {true}
						active = {this.state.active}
						width = {width-20}
						height = {height/4}
					/>
					<Bar
						colors = {['rgba(100, 100, 100, 0.1)', 'rgba(100, 100, 100, 0.5)', 'rgba(100, 100, 100, 0.1)']}
						backgroundColor = {'rgba(100, 100, 100, 0.1)'}
						maximumOpacity = {0.2}
						minimumOpacity = {0.1}
						reverse = {true}
						active = {this.state.active}
						width = {225}
						height = {10}
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
					/>
				</View>
			</View>
		);
	}
});
module.exports = LoadingCard;
