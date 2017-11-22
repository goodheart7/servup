import React, { Component } from 'react';
import {
	AppRegistry,
	StyleSheet,
	Text,
	View,
	Dimensions,
	Animated
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const {width, height} = Dimensions.get('window');
var timeout1;
var timeout2;
var timeout3;

var Bar = React.createClass({
	getInitialState() {
		return {
			move: new Animated.Value(0),
			active: true,
		};
	},

	componentDidMount() {
		this.reload();
	},

	componentWillUnmount() {
		this.timeout1 && clearTimeout(this.timeout1);
		this.timeout2 && clearTimeout(this.timeout2);
		this.timeout3 && clearTimeout(this.timeout3);
	},

	reload() {
		if (this.state.active)
		{	
			this.setState({
				move: new Animated.Value(0),
				fadeAnim: new Animated.Value(this.props.maximumOpacity || 1),
			},
				()=>this.load()
			);
		}
	},

	reverse() {
		Animated.timing(
			this.state.fadeAnim,
				{toValue: 0.1}
		).start();
		Animated.timing(
			this.state.move,
			{
				toValue: 0,
				duration: 1500,
			}
		).start();
	},

	load() {
		Animated.timing(
			this.state.fadeAnim,
			{
				toValue: this.props.minimumOpacity || 0,
				duration: 1500,
			}
		).start();

		Animated.timing(
			this.state.move,
			{
				toValue: this.props.width - this.props.width/3,
				duration: 1500,
			}
		).start();
		if (this.props.reverse)
		{
			this.timeout1 = setTimeout(()=> this.reload(), 3000);
			this.timeout2 = setTimeout(()=> this.reverse(), 1500);
		}
		else
			this.timeout3 = setTimeout(()=> this.reload(), 1500);
	},

	render() {
		return (
			<View style = {[styles.transparentBar, {width: this.props.width || width/2, height: this.props.height || 10, backgroundColor: this.props.backgroundColor}, this.props.style]}>
				<Animated.View style = {{zIndex: 1, opacity: this.state.fadeAnim, transform: [{translateX: this.state.move}]}}>
					<LinearGradient
						colors = {this.props.colors}
						style = {{width: this.props.width/3, height: this.props.height || 10}}
						start = {{x: 0.0, y: 0.0}}
						end = {{x: 1.0, y: 0.0}}
						locations = {[0.0, 0.5, 0.75]}
					/>
				</Animated.View>
			</View>
		);
	}
});

const styles = StyleSheet.create({
	transparentBar:
	{
		height: 10,
		backgroundColor: 'transparent',
		marginVertical: 5,
		justifyContent: 'center',
	},

});

module.exports = Bar;
