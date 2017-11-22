import React, {
	Component,
} from 'react';

import {
	Navigator,
	ScrollView,
	TouchableOpacity,
	AppRegistry,
	StyleSheet,
	Text,
	View,
	Dimensions,
	Platform,
	ListView,
	Image,
	AsyncStorage,
	Switch,


} from 'react-native';
import {fnt as fnt} from '../../common/fontLib';
import {themeColor as themeColor} from '../../common/theme';
import MenuBar from '../../common/MenuBar';
var bgWhite = '#FFFFFF';
var NavBar = require('../../common/NavBar');

const {height, width} = Dimensions.get('window');


var NetworkSettings = React.createClass(
{
	getInitialState() {
		return {
			roaming: false,
			data: false,
			services: false,
			voice: false,
			pushtalk: false,
			forwarding: false,
			sms: false,
			backed: false
		}
	},

	backFunction()
	{
		if (this.state.backed == false)
		{
			this.state.backed = true;
			setTimeout(()=>{this.state.backed = false;}, 1000);
			this.props.navigator.pop();
		}
	},

	render()
	{
		return (
			<View style = {styles.scrollBox}>

				<MenuBar
					// color = {'red'} // Optional By Default 'black'
					title = {'Network Settings'} // Optional
					leftIcon = {'icon-arrow-left2'}
					// rightIcon = {'icon-done2'} // Optional
					// disableLeftIcon = {true} // Optional By Default false
					// disableRightIcon = {true} // Optional By Default false
					onPressLeftIcon = {() => { this.props.navigator.pop() }} // Optional
					// onPressRightIcon = {() => { navigator.pop() }} // Optional
				/>

				<View style = {styles.cols}>
					<View style={styles.rows}>
						<Text style = {styles.textStyle}>
							Roaming
						</Text>

						<Switch
							style = {styles.switchArea}
							value = {this.state.roaming}
							// onValueChange = {(roaming) => this.setState({roaming})}
						/>
					</View>

					<View style={styles.rows}>
						<Text style = {styles.textStyle}>
							Data Roaming
						</Text>

						<Switch
							style = {styles.switchArea}
							value = {this.state.data}
							// onValueChange = {(data) => this.setState({data})}
						/>
					</View>

					<View style={styles.rows}>
						<Text style = {styles.textStyle}>
							Data Services
						</Text>

						<Switch
							style = {styles.switchArea}
							value = {this.state.services}
							// onValueChange = {(services) => this.setState({services})}
						/>
					</View>

					<View style={styles.rows}>
						<Text style = {styles.textStyle}>
							Voice Mail
						</Text>

						<Switch
							style = {styles.switchArea}
							value = {this.state.voice}
							// onValueChange = {(voice) => this.setState({voice})}
						/>
					</View>

					<View style={styles.rows}>
						<Text style = {styles.textStyle}>
							Push to Talk
						</Text>

						<Switch
							style = {styles.switchArea}
							value = {this.state.pushtalk}
							// onValueChange = {(pushtalk) => this.setState({pushtalk})}
						/>
					</View>

					<View style={styles.rows}>
						<Text style = {styles.textStyle}>
							Call Forwarding
						</Text>

						<Switch
							style = {styles.switchArea}
							value = {this.state.forwarding}
							// onValueChange = {(forwarding) => this.setState({forwarding})}
						/>
					</View>

					<View style={styles.rows}>
						<Text style = {styles.textStyle}>
							SMS Forwarding
						</Text>

						<Switch
							style = {styles.switchArea}
							value = {this.state.sms}
							// onValueChange = {(sms) => this.setState({sms})}
						/>
					</View>

					<View style={styles.whiteArea}>
					</View>

				</View>
			</View>
		);
	},
});

const styles = StyleSheet.create(
{
	scrollBox:
	{
		flex:1,
		height: height,
		backgroundColor: '#ececec',
	},

	cols:
	{
		flex:1,
		borderWidth: 4,
		borderColor: '#ececec',
		borderBottomWidth: 0,
	},

	rows:
	{
		flexDirection: 'row',
		justifyContent: 'space-between',
		padding: 20,
		marginBottom: 1,
		borderWidth: 1,
		borderBottomColor: '#ececec',
		borderTopColor: bgWhite,
		borderLeftColor: bgWhite,
		borderRightColor: bgWhite,
		backgroundColor: bgWhite,
	},

	textStyle:
	{
		alignSelf: 'flex-start',
		fontSize: 14,
		color: 'grey',
		fontFamily: fnt.regFont[Platform.OS],
	},

	switchArea:
	{
		alignSelf: 'flex-end',
	},

	whiteArea:
	{
		backgroundColor: bgWhite,
	//	padding: height,
	},
});

module.exports = NetworkSettings
