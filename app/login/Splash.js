import React, {
	Component,
} from 'react';
import {
  Style,
  StyleConstants,
  Fonts
} from '../stylesheet/style';
import {
	BackAndroid,
	TouchableOpacity,
	AppRegistry,
	StyleSheet,
	ToastAndroid,
	Text,
	NetInfo,
	View,
	Image,
	Platform,
	StatusBar,
	AsyncStorage,
	Dimensions,
	Navigator,
	ActivityIndicator,
	Animated,
	TimerMixin,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {checkServ as checkServerHealth} from '../../lib/networkHandler';
import Icon from '../stylesheet/icons';

const {height, width} = Dimensions.get('window');
var minDuration = 1000;
var maxDuration = 1500;
var timeInterval;
var timeTimeout;

var Splash = React.createClass(
{
	getInitialState() {
		return {
			opacity: new Animated.Value(1),
			loaded: false,
			loader: false,
			errorValue: 'There was a problem connecting to the server. Please check your internet connection and try later.',
		};
	},

	componentDidMount() {
		AsyncStorage.getItem("logged")
		.then((value) => {
			this.setState({"logged": value, loader: false});
		})
		.done();
		this.changeStyle();
	},

	componentWillUnmount() {
		this.timeInterval && clearInterval(this.timeInterval);
		this.timeTimeout && clearTimeout(this.timeTimeout);
	},

	light() {
		Animated.timing(
			this.state.opacity,
				{toValue: 0, duration: 1000}
		).start();
	},

	dark() {
		Animated.timing(
			this.state.opacity,
				{toValue: 1, duration: 1000}
		).start();
	},

	animTimer() {
		this.light();
		this.timeTimeout = setTimeout(()=> this.dark(), 1000);
	},

	shader() {
		this.animTimer();
		this.timeInterval = setInterval (()=>this.animTimer(), 2000);
	},
	
	changeStyle() {
		this.shader();
		// this.load();
		setTimeout( this.load, 2000);
		// this.setState({loader: true});
	},

	randomNumber(min, max) {
		return Math.random() * max + min;
	},
	
	renderExtraSpaceForIOS (){
		if (Platform.OS === 'ios') {
			return (<View style={Style.extraSpaceForIOS}/>)
		}
		else {
			return (<View/>)
		}
	},
	
	load() {
		 checkServerHealth()
		.then( (response) => {
			// Server working fine
			this.setState ({loaded: true, serverError: false, loader: false}, function() {
				if (this.state.logged === 'yes')
					this.props.navigator.push({id: 6});
				else
					this.props.navigator.push({id: 2});
			});

		})
		.catch( (err) => {
			// Show server error
			//console.log('@@@@@@@@@@@@@@@@@', response);
			this.setState({loaded: true, serverError: true, loader: false});
		});
	},

	componentWillMount() {
		if (Platform.OS === 'android') {
		BackAndroid.addEventListener('hardwareBackPress', () => {

				var routID = this.props.navigator.getCurrentRoutes()[0].id;
				var length = this.props.navigator.getCurrentRoutes().length;
				var homeID = this.props.navigator.getCurrentRoutes()[length - 1].id;
			
				if(((routID == 1 || routID == 2) && length <= 2)|| homeID == 6) {
					
					//ToastAndroid.show("Exiting the app...", ToastAndroid.SHORT);
					//BackAndroid.exitApp(0);
        // moveTaskToBack(true);
				}
				else {
					this.props.navigator.pop();
				}
             return true;
		});
		}
	},

	render() {
		console.log ("Loaded: " + this.state.loaded + "\n");
		return this.renderSplash();
	},

	serverError(){
		if (this.state.serverError)
			return (
				<Text style={styles.welcome}>
					{this.state.errorValue}
				</Text>
			);
	},

	renderSplash() {
		return(
			<View style={styles.container}>
				<StatusBar hidden = {true} backgroundColor={StyleConstants.primary} barStyle="light-content"/>
				<ActivityIndicator
					animating={this.state.loader}
					style={{zIndex: 1, position: 'absolute', top: height/2, left: 0, right: 0, bottom: 0}}
					color={'white'}
					size="large"
				/>
				<Animated.View style = {[styles.logoContainer, {opacity: this.state.opacity}]}>
					<Icon
						name = {'icon-my_services'}
						fontSize = {150}
						color = {'white'}
						// source = {require('./images/s1.png')}
						// resizeMode = {'cover'}
						
					/>		
					{this.serverError()}
				</Animated.View>
			</View>
		)
	},

});

const styles = StyleSheet.create({

	container:
	{
		flex: 1,
		backgroundColor: StyleConstants.primary,
		// justifyContent: 'center',
	},

	logoContainer:
	{
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},

	imageStyle:
	{
		top: 75,
		alignSelf: 'center',
		width: 260,
		height: 88,
		resizeMode: 'contain',
	},

	Circle1:
	{
		opacity: 1,
		top: -85,
		left: -50,
		width: 200,
		height: 200,
		borderRadius: 100,
		backgroundColor: StyleConstants.primary,
	},

	Circle2:
	{
		opacity: 1,
		width: 150,
		height: 150,
		borderRadius: 80,
		backgroundColor: StyleConstants.primary,
	},

	Circle3:
	{
		opacity: 1,
		top: -40,
		left: -50,
		width: 250,
		height: 250,
		borderRadius: 125,
		backgroundColor: StyleConstants.primary,
	},

	welcome:
	{
		fontSize: 13,
		textAlign: 'center',
		alignSelf: 'center',
		margin: 10,
		color: 'white',
		fontFamily: Fonts.regFont[Platform.OS],
	},
});

module.exports = Splash;
