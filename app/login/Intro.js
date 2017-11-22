import React, { Component } from 'react';
import {
	AppRegistry,
	Navigator,
	StyleSheet,
	Platform,
	TouchableOpacity,
	TouchableHighlight,
	Image,
	Text,
	Dimensions,
	View
} from 'react-native';
import {
  Style,
  StyleConstants,
  Fonts
} from '../stylesheet/style';
var {height, width} = Dimensions.get('window');

var Intro = React.createClass (
{
	getInitialState() {
		return {
			index: 0
		};
	},

	getImage (index) {
		switch(index) {
			case 0:
				return require('./images/1_Profile.jpg');
			case 1:
				return require('./images/2_Notice_Board.jpg');
			case 2:
				return require('./images/3_Telco_Cards.jpg');
			case 3:
				return require('./images/4_Service_Cards.jpg');
			case 4:
				return require('./images/5_My_Services.jpg');
			break;
		}
	},
  renderExtraSpaceForIOS (){
    if (Platform.OS === 'ios') {
      return (<View style={Style.extraSpaceForIOS}/>)
    } else {
      return (<View/>)
    }
  },
	onPress() {
		if (this.state.index === 4 )
			this.props.navigator.push ({ id: 6 });
		else
			this.setState({ index : this.state.index+1 })
	},

	onPressSkip() {
		this.props.navigator.push({ id: 6 });
	},

	render() {
		return (
			<View>
				<TouchableOpacity onPress={this.onPress}  style={{flex:1}} >
					<Image
						source={this.getImage(this.state.index)}
						style={{ flex: 1, width: width, height: height }}
						resizeMode='stretch'
					>
						<TouchableOpacity onPress={this.onPressSkip} style={{alignSelf: 'flex-end'}}>
							<Text style = {styles.Skipp} >
								Skip
							</Text>
						</TouchableOpacity>
					</Image>
				</TouchableOpacity>
			</View>
		);
	}
});

const styles = StyleSheet.create({
	container:
	{
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#F5FCFF',
	},

	welcome:
	{
		fontSize: 20,
		textAlign: 'center',
		margin: 10,
	},

	instructions:
	{
		textAlign: 'center',
		color: '#333333',
		marginBottom: 5,
	},

	Skipp:
	{
		flex: 1,
		fontSize: 15,
		backgroundColor: 'transparent',
		alignSelf: 'flex-end',
		fontWeight: 'bold',
		padding: 15,
		top: height/19,
		color: 'blue',
		zIndex: 5,
	},

	main:
	{
		flex: 5,
		height:height,
		width: width,
	}
});

module.exports = Intro;
