import React, { Component } from 'react';
import {
	AppRegistry,
	StyleSheet,
	Text,
	View,
	Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const {width, height} = Dimensions.get('window');

var Bar = React.createClass({
	getInitialState() {
		return {
			v1: 0,
			v2: 0,
			v3: 0,
			active: false,
			fullTimer: null,
		};
	},

	componentDidMount() {
		this.checkActiveAndStart();
	},

	componentWillReceiveProps() {
		this.checkActiveAndStart();
	},

	checkActiveAndStart() {
		this.setState({active: this.props.active});
		setTimeout( ()=> this.again(), 100);
	},

	again() {
		clearInterval(this.state.fullTimer);
		if (this.state.active)
			setTimeout( ()=> this.mover(), 500);
	},

	move() {
		if (this.state.v1 < 1)
		{
			this.setState({
				v1: this.state.v1 + 0.1,
				v2: this.state.v2 + 0.1,
				v3: this.state.v3 + 0.1
			});
		}
		else
		{
			clearInterval(this.state.fullTimer);
			this.setState({
				v1: 0.0,
				v2: 0.0,
				v3: 0.0,
			});
			setTimeout( ()=> this.again(), 500);
		}
	},

	mover() {
		this.setState({
			v1: 0.0,
			v2: 0.1,
			v3: 0.2,
			fullTimer: setInterval(()=> this.move(), 100)
		});
	},

	render() {
		return (
			<LinearGradient
				colors = {[
					'black',
					'red',
					'black',
				]}
				style = {[styles.transparentBar, this.props.style]}
				start = {{x: 0.0, y: 0.0}}
				end = {{x: 1.0, y: 0.0}}
				locations = {[
					this.state.v1,
					this.state.v2,
					this.state.v3,
				]}
			/>
		);
	}
});

const styles = StyleSheet.create({
	transparentBar:
	{
		width: width/2,
		height: 20,
		borderRadius: 20,
	},
});

module.exports = Bar;
