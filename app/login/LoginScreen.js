import React, {
Component,
} from 'react';

import {
ActivityIndicator,
TouchableOpacity,
AppRegistry,
StyleSheet,
Text,
View,
KeyboardAvoidingView,
Image,
Platform,
StatusBar,
AsyncStorage,
Dimensions,
Navigator,
TextInput,
Alert,
} from 'react-native';
import {
Style,
StyleConstants,
Fonts
} from '../stylesheet/style';
import {registerNum as registerNumb} from '../../lib/networkHandler';
const {height, width} = Dimensions.get('window');
const dismissKeyboard = require('dismissKeyboard');
import {IndicatorViewPager, PagerTitleIndicator, PagerDotIndicator} from 'rn-viewpager';
import KeyboardSet from '../common/KeyboardSet';

var LoginScreen = React.createClass({

getInitialState(){
	return {
		style: styles.nextOff,
		disabled: true,
		Numb: '',
		keyboardOpened: false,
	};
},

componentDidMount() {
	setTimeout(this.stopLoader, 50);
},

stopLoader() {
	this.setState({loader: false});
},

buttonDisabler() {
	this.setState({disabled: true, style: styles.nextOff, loader: true,});
},

buttonEnabler() {
	this.setState({disabled: false, style: styles.next, loader: false,});
},

minValue(e) {
	if (e.length == 3 && this.state.Numb.length == 2) {
		e = e + ' ';
		this.setState({Numb: e, disabled: true, style: styles.nextOff});
	}
	else if (e.length == 3 && this.state.Numb.length == 4) {
		e = e.substring(0, 2)
		this.setState({Numb: e, disabled: true, style: styles.nextOff});
	}
	else if (e.length == 11) {
		// dismissKeyboard();
		this.setState({Numb: e, disabled: false, style: styles.next});
	}
	else if (e.length < 11)
		this.setState({Numb: e, disabled: true, style: styles.nextOff});
},

nextButtonFunction() {
	dismissKeyboard();
	var fullNumber = '0092' + this.state.Numb.substring(0, 3) + this.state.Numb.substring(4, 11);
	console.log('fullNumber is: ' + fullNumber);
	console.log('@@@@@@@@@@@@fullNumber length: ' + fullNumber.length);
	if (fullNumber.length == 14) {
		this.buttonDisabler();
		AsyncStorage.setItem("UserPhoneNumber", fullNumber);
		registerNumb(fullNumber)
			.then((resp) => {
				console.log('@@@@@@@@jason resp',resp);
				this.buttonEnabler();
				if (!resp.isUserExists)
					this.props.navigator.push({id: 3});
				else if(resp.isUserExists)
					this.props.navigator.push({id: 5});
			})
			.catch((err) => {
				console.log("\n\n\n" + err);
				this.buttonEnabler();
				Alert.alert('Server Error', 'There was a problem connecting to the server. Please check your internet connection and try again in a while');
			});
	}
},

renderDotIndicator() {
	return <PagerDotIndicator pageCount={3} dotStyle={styles.dotStyle} selectedDotStyle={styles.selectedDotStyle}/>;
},

render(){
	return (
		<View style={{flex: 1, backgroundColor: 'white'}}>
			<IndicatorViewPager
				style={styles.upperArea}
				indicator={this.renderDotIndicator()}
			>
				<View style={[styles.imageViewStyle, {top: this.state.keyboardOpened? -height/11 : 0}]}>
					<Image style={styles.imageStyle} source={require('./images/login1.png')}/>
					<Text style={styles.imageTextStyle}>
						{'Discover great services everywhere'}
					</Text>
				</View>
				<View style={[styles.imageViewStyle, {top: this.state.keyboardOpened? -height/11 : 0}]}>
					<Image style={styles.imageStyle} source={require('./images/login2.png')}/>
					<Text style={styles.imageTextStyle}>
						{'Save, Share, Subscribe to services easily'}
					</Text>
				</View>
				<View style={[styles.imageViewStyle, {top: this.state.keyboardOpened? -height/11 : 0}]}>
					<Image style={styles.imageStyle} source={require('./images/login3.png')}/>
					<Text style={styles.imageTextStyle}>
						{'Engage with service providers\n and customers'}
					</Text>
				</View>
			</IndicatorViewPager>

			<View style={styles.lowerArea}>
				<View style={styles.viewMargin}>
					<View style={styles.inputAreaLeft}>
						<Text style={styles.textStyle}>
							+92
						</Text>
					</View>

					<View style={styles.inputAreaRight}>
						<TextInput
							onFocus = {()=> this.setState({keyboardOpened: true})}
							onBlur = {()=> this.setState({keyboardOpened: false})}
							text={this.state.Numb}
							value={this.state.Numb}
							style={[{color: '#999999'}, styles.inText]}
							keyboardType='phone-pad'
							maxLength={11}
							underlineColorAndroid={"transparent"}
							returnKeyType={'done'}
							onChangeText={this.minValue}
							onSubmitEditing = {()=> dismissKeyboard()}
							placeholderTextColor={'#DDD'}
							placeholder = {'Your mobile number?'}
							// onEndEditing={this.nextButtonFunction}
						/>
					</View>
				</View>

				<View>
					<TouchableOpacity disabled={this.state.Numb.length!=11} onPress={this.nextButtonFunction} style={this.state.style}>
						<Text style={styles.nextText}>
							{'Next'}
						</Text>
					</TouchableOpacity>
				</View>
			</View>

			<ActivityIndicator
				animating = {this.state.loader}
				style = {{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, zIndex: this.state.loader? 1 : -1}}
				color = {StyleConstants.primary}
				size = {'large'}
			/>

			<KeyboardSet topSpacing = {Platform.OS == 'android'? -height/4 : 0}/>
		</View>
	);
},

});

const styles = StyleSheet.create({

upperArea: {
	flex: 4,
	marginBottom: height / 25,
},

dotStyle: {
	backgroundColor: 'white',
	borderColor: StyleConstants.primary,
	borderWidth: 1,
},

selectedDotStyle: {
	backgroundColor: StyleConstants.primary,
	borderColor: 'white',
	borderWidth: 1,
	width: 8,
	height: 8,
},

imageViewStyle: {
	flex: 1,
	alignItems: 'center',
	justifyContent: 'center',
	// backgroundColor: StyleConstants.primary,
},

imageStyle: {
	alignSelf: 'center',
	width: width,
	height: height/2.5,
	resizeMode: 'cover',
	marginBottom: 5,
},

imageTextStyle:
{
	textAlign: 'center',
	marginHorizontal: 10,
	fontWeight: '200',
	fontFamily: Fonts.regFont[Platform.OS],
	fontSize: 25,
	color: StyleConstants.primary,
},

lowerArea: {
	flex: 1.25,
	minHeight: 50,
	justifyContent: 'space-around',
	alignItems: 'center',
},

viewMargin: {

	marginHorizontal: width / 8,
	flexDirection: 'row',
	backgroundColor: 'white',
	borderBottomColor: '#6666',
	borderBottomWidth: 1,
},

inputAreaLeft: {
	flex: 2,
	// borderRadius: width / 15,
	// borderBottomColor: '#6666',
	// borderBottomWidth: 1,
	// borderBottomRightRadius: 0,
	// borderTopRightRadius: 0,
	alignItems: 'center',
	justifyContent: 'center',
},

textStyle: {
	fontSize: 20,
},

inputAreaRight: {
	flex: 8,
	// borderRadius: width / 15,
	// borderBottomColor: '#6666',
	// borderBottomWidth: 1,
	// borderBottomLeftRadius: 0,
	// borderTopLeftRadius: 0,
},

inText: {
	marginLeft: width / 50,
	fontSize: 20,
	fontFamily: Fonts.regFont[Platform.OS],
	color: '#666',
	textAlign: 'left',
	height: 50,
},

next: {
	width: width * 0.75,
	marginTop: height * 0.10,
	// flexGrow: 1,
	height: height / 18,
	borderRadius: 4,
	backgroundColor: StyleConstants.primary,
	justifyContent: 'center',
	alignItems: 'center',
	alignSelf: 'stretch',
},

nextOff: {

	width: width * 0.75,
	// flexGrow: 1,
	height: height / 18,
	borderRadius: 4,
	backgroundColor: '#999',
	justifyContent: 'center',
	marginTop: height * 0.10,
	alignItems: 'center',
	//alignSelf: 'center',
},

nextText: {
	fontFamily: Fonts.regFont[Platform.OS],
	fontSize: 20,
	color: '#FFFFFF',
}

});

module.exports = LoginScreen;
