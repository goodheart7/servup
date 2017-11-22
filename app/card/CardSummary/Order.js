/**
 * Created by Shoaib on 11/11/2016.
 */
import React, {Component} from 'react';
import moment from 'moment';
import {
	Text,
	View,
	TouchableOpacity,
} from 'react-native';
import {
	Style,
} from '../../stylesheet/style';
import MenuBar from '../../common/MenuBar';
import styles from  './Style';

let Order = React.createClass({
	getInitialState()
	{
		return {orderDetails: this.props.orderDetails}
	},
	render() {
		let {orderDetails} = this.state;
		if (orderDetails != null) {
			return (
				<View>
					{this.renderStickyHeader()}
					{orderDetails.paymentStatus != 'active' ? this.renderPaymentFailure(orderDetails.orderId) : <View/>}
					<View style = {{marginHorizontal: 40, borderRadius: 4, borderWidth: 1, borderColor: StyleConstants.primary}}>
						
						<View style={{borderBottomWidth: 0.5, paddingVertical: 10}}>
							<View style={[Style.rowWithSpaceBetween, {marginHorizontal: 15}]}>
								<Text style={[styles.textStyle, {fontSize: 18}]}>
									Status
								</Text>
								<Text style={[styles.textStyle, , {fontSize: 18},{color: 'green'}]}>
									{orderDetails.orderStatus}
								</Text>
							</View>
						</View>
						
						<View style={{borderBottomWidth: 0.5, paddingVertical: 10}}>
							<View style={[Style.rowWithSpaceBetween, {marginHorizontal: 15}]}>
								<Text style={[styles.textStyle, {fontSize: 18}]}>
									Order Date
								</Text>
								<Text style={[styles.textStyle, {fontSize: 18}]}>
									{moment.utc(orderDetails.orderDate).format('MMM DD YYYY')}
								</Text>
							</View>
						</View>
						
						<View style={[Style.rowWithSpaceBetween, {paddingVertical: 10, marginHorizontal: 15}]}>
							<Text style={[styles.textStyle, {fontSize: 18}]}>
								Order ID
							</Text>
							<Text style={[styles.textStyle, {fontSize: 18}]}>
								{orderDetails.orderId}
							</Text>
						</View>
					</View>
				</View>
			);
		}
	},
	renderPaymentFailure(id) {
		return (
			<TouchableOpacity onPress={()=>{this.props.navigator.push({id: 110, transactionId: id})}}>
				<View style={{
					flexDirection: 'column',
					marginHorizontal: 40,
					borderWidth:1,
					marginVertical:15,
					borderRadius: 4,
					borderColor: StyleConstants.primary,
					backgroundColor: StyleConstants.primary,
				}}>
					<Text style={[styles.textStyle,{color:'white', justifyContent:'center', alignSelf:'center', paddingVertical:8}]}>
						Reattempt Payment
					</Text>
				</View>
			</TouchableOpacity>
		);
	},
	renderStickyHeader() {
		return (
			<MenuBar
				leftIcon={'icon-back_screen_black'}
				title={'Order'} // Optional
				onPressLeftIcon={() => this.props.navigator.pop() }
			/>
		);
	},
});

export default Order;
