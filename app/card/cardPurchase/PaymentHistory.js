/**
 * Created by Shoaib on 11/14/2016.
 */

import React, { Component } from 'react';
import {
	Text,
	View,
	Platform,
	Alert,
	AsyncStorage,
	Image,
	StyleSheet,
	Dimensions,
	TouchableOpacity,
	ListView,
} from 'react-native';
import {
	Style,
	StyleConstants,
	Fonts,
} from '../../stylesheet/style';

import { getPaymentHistory, getPaymentMethods } from '../../../lib/networkHandler';
import AppConstants from '../../AppConstants';
import MenuBar from '../../common/MenuBar';
import moment from 'moment';
var rightArrow = require('../../../res/common/arrow_right.png');
var { height, width } = Dimensions.get('window');

let PaymentHistory = React.createClass({
	getInitialState() {
		var ds = ds2 = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
		return {
			ds,ds2,
			dataSource: ds.cloneWithRows([
				{name: 'abc', brand: 'xyz', paymentDate: new Date(), amount: 500},
				{name: 'xyz', brand: 'abc', paymentDate: new Date(), amount: 1500},
			]),
			dataSource2: ds2.cloneWithRows([

			]),
			SwitchState:  false,
			subscriptionId:this.props.subscriptionId,
			paymentHistory :[{},{}],
			paymentMethods : [],
		}
	},

	componentDidMount() {
		let {token, subscriptionId} = this.state;
		AsyncStorage.getItem("UserToken").
		then((token) => {
			this.setState({token: token});
			//console.log('@@',this.props.cardId)
			return getPaymentMethods(token)
		})
		.then((resp) => {
			this.setState({
				paymentMethods: resp,
				dataSource2: this.state.ds2.cloneWithRows(resp),
			});
			return getPaymentHistory(this.state.token, subscriptionId)
		})
		.then((resp) => {
			this.setState({
				// paymentHistory: resp,
				// dataSource: this.state.ds.cloneWithRows(resp)
			});
		})
		.catch((err) => {
			console.log('service card api error,', err);
			Alert.alert(AppConstants.ServerFailureHeading, AppConstants.ServerFailureMessage);
		})
	},

	renderPaymentHistoryView(rowData, sectionID, rowID) {
		return (
			<View style = {{
				flex: 1,
				justifyContent: 'space-between',
				flexDirection: 'row',
				alignItems: 'center',
				paddingVertical: 15,
				marginHorizontal: 15,
				borderBottomColor: rowID == this.state.paymentHistory.length-1? 'transparent' : 'grey',
				borderBottomWidth: 1
			}}>
				<View>
					<Text style={[styles.textStyle]}>
						{rowData.name}
					</Text>
					<Text style={[styles.textStyleMini]}>
						Via {rowData.brand}
					</Text>
					<Text style={[styles.textStyleMini]}>
						{moment.utc(rowData.paymentDate).format('MMM Do YYYY')}
					</Text>
				</View>
				<View style = {{borderWidth: 1, padding: 5}}>
					<Text style={[styles.textStyle,{color:'red', alignSelf:'center'}]}>
						{rowData.amount}
					</Text>
				</View>
			</View>
		);
	},

	renderPaymentHistory () {
		if (this.state.paymentHistory.length>0)
			return (
				<View style={[Style.rowWithSpaceBetween, {
						marginHorizontal: 15,
						borderWidth: 1,
						padding: 10,
						borderRadius: 10,
						borderColor: StyleConstants.primary
				}]}>
					<ListView
						dataSource = {this.state.dataSource}
						renderRow = {this.renderPaymentHistoryView}
						enableEmptySections = {true}
					/>
				</View>
			);
		return <View/>;
	},

	renderDefaultPaymentView(rowData, sectionID, rowID) {
		return (
			<View style={[Style.rowWithSpaceBetween,{marginHorizontal:15, marginVertical:15}, {
				borderWidth: 1,
				padding: 10,
				borderRadius: 10,
				borderColor: 'black'
			}]}>
				 <Text style={styles.textStyle}>
					 Payment Method
				 </Text>
				 <View style={Style.rowWithSpaceBetween}>
					 <Text style={{color:'black', fontSize:16,marginHorizontal:5, justifyContent:'center', alignSelf: 'center'}}>
						{rowData.addtionalParameters.brand}
					 </Text>
					 <TouchableOpacity onPress={()=> this.props.navigator.push({id:10.5})} style={{justifyContent:'center', alignSelf:'center'}}>
						 <Image
							 source = {rightArrow}
							 resizeMode = {'cover'}
							 style={{alignSelf:'center', justifyContent:'center'}}
						 />
					 </TouchableOpacity>
				 </View>
			 </View>
		);
	},

	renderDefaultPayment () {
		return (
			<ListView
				dataSource = {this.state.dataSource2}
				renderRow = {this.renderDefaultPaymentView}
				enableEmptySections = {true}
			/>
		);
	},

	render() {

		return(
			<View>
				{this.renderStickyHeader()}
				{this.renderDefaultPayment()}
				{this.renderPaymentHistory()}
			</View>
		);
	},

	renderStickyHeader() {
		return(
				<MenuBar
					// color = {'red'} // Optional By Default 'black'
					title = {"Payment History"} // Optional
					leftIcon = {'icon-back_screen_black'}
					//rightIcon = {'icon-done2'}// Optional
					// disableLeftIcon = {true} // Optional By Default false
					// disableRightIcon = {true} // Optional By Default false
					onPressLeftIcon = {()=> this.props.navigator.pop()} // Optional
				/>
		);
	},
});

export default PaymentHistory;

let styles = StyleSheet.create({
	textStyle: {
		color:'black',
		fontSize:18,
		fontFamily: Fonts.regFont[Platform.OS],
		justifyContent:'flex-start',
		alignSelf: 'flex-start'
	},
	lineSeparator: {
		height: 0.7,
		backgroundColor: 'black',
		marginVertical: 5,
		width: width - 20,
		marginHorizontal: 10,
	},
	textStyleMini: {
		color:'black',
		fontSize:14,
		fontFamily: Fonts.regFont[Platform.OS],
		justifyContent:'center',
		alignSelf: 'flex-start'
	},


});
