/**
 * Created by Shoaib on 11/16/ hdsj2016.
 */
import React, {Component} from 'react';
import {
	TextInput,
	Platform,
	Text,
	Alert,
	TouchableOpacity,
	StyleSheet,
	AsyncStorage,
	Dimensions,
	ScrollView,
	Image,
	View,
} from 'react-native';
import {
	Style,
	StyleConstants,
	Fonts
} from '../stylesheet/style';

import cardStyle from './Style';
import cardBaseStyle from './Styles/cardBaseStyle';
const {height, width} = Dimensions.get('window');
let images = {
	'right_caret': require('../../res/common/arrow_right.png'),
	'left_caret': require('../../res/common/back.png'),
	'check': require('../../res/common/check.png'),
	'defaultProfileImage': require('../../res/common/profile.png'),
	'empty': require('../../res/common/emptyPixel.png'),
};

import MenuBar from '../common/MenuBar';

var planArrayLength = 0, colorArray=[];

let Plans = React.createClass({
	getInitialState() {
		return {
			SwitchState: false,
			rating: 0,
			myIndex: '',
			selectedUsers: [],
			selectedPlanId: null,
			selectedPlanPrice: '',
			selectedState: false,
			plans: this.props.plans,
			cardView: false,

		}
	},

	componentWillMount() {
		planArrayLength = this.props.plans.length;
		for (x=0; x<planArrayLength; x++)
		{
			if (x%2 == 0)
				colorArray[x] = '#FFF000';
			else
				colorArray[x] = 'dodgerblue';
		}
		console.log('COLOR ARRAY: ', colorArray);
	},

	renderPlans(plans) {
		//console.log('@@@@@@@@@@@@ prop plan id ', this.props.planId);
		if (plans != null) {
			return plans.map((plan, key) => {
				let price = plan.price.amount == 0 ? 'Free' : plan.price.currency + ' ' + plan.price.amount;
				//   console.log('@@@@@@@@@@@@@@@ plan', plan);
				// console.log('@@@@@@@@@@@@@@@ price', price);
				return (
					<SinglePlan
						selectedState={ (this.state.myIndex === key || plan.id === this.state.selectedPlanId) ? !this.state.selectedState : this.state.selectedState }
						plan={plan}
						index={key}
						planId={plan.id}
						onPressSelect={ (index, state, planId) => {
							this.setState({myIndex: index, selectedPlanId: planId, selectedPlanPrice: price}, ()=> {
								console.log('selectedPlanId', this.state.selectedPlanId);
								console.log('myIndex', this.state.myIndex);
								console.log('selectedPlanPrice', this.state.selectedPlanPrice);
							})
						}}
						selectedUsers={(obj) => {
							console.log('@@@@@@@@@@yahoo selected users', obj);
							this.setState({selectedUsers: obj})
						}}
						navigator={this.props.navigator}
					/>
				);
			});
		}
	},

	onPressSubmit(){
		//this.props.onPressSubmit(this.state.selectedPlanId);

		console.log("Selected Plan ID", this.state.selectedPlanId);
		if (this.state.selectedPlanId) {
			// console.log("Selected Planxxxxx ID", this.state.selectedPlanId);
			// console.log("Selected Plan Price", this.state.selectedPlanPrice);
			// console.log("Selected Selected@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ Users", this.state.selectedUsers);
			this.props.onUnmount(this.state.selectedPlanId, this.state.selectedUsers, this.state.selectedPlanPrice);
			// console.log('@@@@@@@@Screen Transition list', this.props.screenTransitionList);
			let list = this.props.screenTransitionList;
			list = list.filter((x) => {
				return x != 16
			});
			// console.log('@@@@@@@@@@@@Screen Trans planss', list);
			if (list.length == 0) {
				let popN = this.props.popN ? this.props.popN : 1;
				this.props.navigator.popN(popN)
			}
			// console.log('@@@@@@@@@@@@on submit press 16:', this.props.popN);
		}
		else {
			Alert.alert(
				'Hey !!!',
				'Select a Plan to Proceed',
			)
		}
	},

	renderStickyHeader() {
		return (
			<MenuBar
				title={"Select Plan"} // Optional
				leftIcon={'icon-back_screen_black'}
				rightIcon={'icon-done'}// Optional
				onPressLeftIcon={() => this.props.navigator.pop()} // Optional
				onPressRightIcon={this.onPressSubmit} // Optional
			/>
		);
	},

	render() {
		let {plans} = this.state;
		return (
			<View style={{backgroundColor: 'white', flex: 1}}>
				{this.renderStickyHeader()}
				<ScrollView style={{flex: 1, marginTop: 20}}>
					{this.renderPlans(plans)}
				</ScrollView>
			</View>
		);
	},
});

let SinglePlan = React.createClass({

	getInitialState() {
		return {
			SwitchState: false,
			rating: 0,
			myIndex: {},
			selectedUsers: [],
			selectedPlanId: '',
			selectedState: this.props.selectedState,
			plans: this.props.plans,
			cardView: this.props.selectedState,

		}
	},

	onCardPress() {
		console.log('@@@@@@@@@@@onCard Press');
		// this.setState({cardView: !this.state.cardView});
	},

	renderCardDescription(type, description){
		if (type == 'brief') {
			return (
				<View>
					<View style={cardStyle.lineSeparator}/>
					<Text style={[cardBaseStyle.descriptionText, {
						flex: 3,
						flexWrap: 'wrap',
						paddingVertical: 5,
						paddingHorizontal: 15
					}]}>
						{description.substring(0, 31) + ' ...'}
					</Text>
				</View>
			);
		}
		else {
			return (
				<View>
					<View style={cardStyle.lineSeparator}/>
					<Text style={[cardBaseStyle.descriptionText, {
						flex: 3,
						flexWrap: 'wrap',
						paddingVertical: 5,
						paddingHorizontal: 15
					}]}>
						{description}
					</Text>
				</View>
			);
		}
	},

	renderSignUpFee(plan, type) {
		let color = "grey";
		let price = "Nil";
		if (type === "enabled") {
			color = "black";
			price = plan.currency + ' ' + plan.amount;
		}
		return (
			<View >
				<View style={{width: width - 120, marginHorizontal: 10}}/>
				<View style={[Style.rowWithSpaceBetween,
					{paddingVertical: 10, backgroundColor: 'rgba(200, 200, 200, 0.1)', borderBottomWidth: 0.5, borderBottomColor: 'grey'}]}>
					<Text style={[styles.cardFooter,{color: 'black'}]}>
						{'Sign Up Fee'}
					</Text>
					<Text style={[styles.cardFooter, {color: 'black'}]}>
						{price}
					</Text>
				</View>
			</View>
		);
	},

	renderFreeTrial(plan, type) {
		let color = "grey";
		let freeTrialPeriod = "Nil";
		if (type === "enabled") {
			color = "black";
			freeTrialPeriod = plan.freeTrialPeriod.countOfPeriod + ' ' + plan.freeTrialPeriod.unitOfPeriod;
		}
		return (
			<View>
				<View style={{width: width - 120, marginHorizontal: 10}}/>
				<View style={[Style.rowWithSpaceBetween,
					{paddingVertical: 10, backgroundColor: 'rgba(200, 200, 200, 0.1)', borderBottomWidth: 0.5, borderBottomColor: 'grey'}]}>
					<Text style={[styles.cardFooter]}>
						{'Free Trial'}
					</Text>
					<Text style={[styles.cardFooter]}>
						{freeTrialPeriod}
					</Text>
				</View>
			</View>
		);
	},

	renderMinSubPeriod(plan, type) {
		let minSubPeriod = (plan == null) ? 0 : plan.minSubPeriod.countOfPeriod;
		let countOfPeriod= "Nil";
		let color = "grey";
		if (minSubPeriod != 0) {
			 countOfPeriod=  plan.minSubPeriod.countOfPeriod + ' ' + plan.minSubPeriod.unitOfPeriod;
			 color = "black";
		}
		else {
			return (
				<View >
					<View style={{width: width - 120, marginHorizontal: 10}}/>
					<View style={[Style.rowWithSpaceBetween,
						{paddingVertical: 10, backgroundColor: 'rgba(200, 200, 200, 0.1)', borderBottomWidth: 0.5, borderBottomColor: 'grey'}]}>
						<Text style={[styles.cardFooter]}>
							{'Min Subscription Period'}
						</Text>
						<Text style={[styles.cardFooter]}>
							{countOfPeriod}
						</Text>
					</View>
				</View>
			);
		}

	},

	renderInvoicingCycle(plan) {
		return (
			<View>
				<View style={[cardStyle.lineSeparator]}/>
				<Text style={[styles.cardFooter, {marginLeft: 10}]}>
					{plan.freeTrialPeriod.countOfPeriod + ' ' + plan.freeTrialPeriod.unitOfPeriod + ' Invocing Cycle' }
				</Text>
			</View>
		);
	},

	renderNoOfUnits(plan) {
		return (
			<View>
				<View style={[cardStyle.lineSeparator]}/>
				<Text style={[styles.cardFooter, {marginLeft: 10}]}>
					{plan.freeTrialPeriod.countOfPeriod + ' ' + plan.freeTrialPeriod.unitOfPeriod + ' No of Units' }
				</Text>
			</View>
		);
	},

	renderFullCard() {
		var cardColor = colorArray[this.props.index];
		let plan = this.props.plan;
		let borderStyle = {
			borderColor: cardColor,
			borderTopLeftRadius: 8,
			borderTopRightRadius: 8,
		};
		let price = plan.price;
		let planName = plan.planName ? plan.planName : (plan.planType == 'oneTimeCharges' ? 'Price' : 'Free Plan' );
		price = price.amount ? price.currency + '  ' + price.amount + '   ' + plan.invoicingCylcle : 'No Price';
		return (
			<TouchableOpacity
				style={[styles.planCard, borderStyle]}
				onPress={() => {
					this.onCardPress();
					// this.setState({selectedState: !this.state.selectedState});
					this.props.onPressSelect(false, false, false);
				}}
			>
				<View style = {[styles.titleArea, {backgroundColor: cardColor, flex: 1, flexDirection: 'row'}]}>
					<View style = {{flex: 2}}/>
					<View style = {{flex: 5}}>
						<Text style={[cardBaseStyle.cardTitle, {textAlign: 'center', color: 'white', fontWeight: 'bold'}]}>
							{planName}
						</Text>
					</View>
					<View style = {{flex: 2}}>
						<View style = {{justifyContent: 'center', alignItems: 'center', alignSelf: 'center', width: 20, height: 15, borderRadius: 10, backgroundColor: cardColor=='#FFF000'? '#EDE77B' : '#7EB8F0'}}>
							<View style = {{alignSelf: 'flex-end', width: 15, height: 15, borderRadius: 7.5, backgroundColor: 'white'}}/>
						</View>
					</View>
				</View>
				
				<View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
					<View>
						<Text
							style={{fontSize: 20, paddingVertical: 10, color: 'black', fontFamily: Fonts.regFont[Platform.OS]}}>
							{ price }
						</Text>
					</View>
					<View>
					</View>
				</View>
				{plan.planDescription.length ? this.renderCardDescription('full', plan.planDescription) : <View/>}
				{plan.signupFee.amount ? this.renderSignUpFee(plan.signupFee, "enabled") : this.renderSignUpFee(plan.signupFee, "disabled")}
				{plan.freeTrialPeriod.countOfPeriod ? this.renderFreeTrial(plan, "enabled") : this.renderFreeTrial(plan, "disabled")}
				{plan.minSubPeriod.countOfPeriod ? this.renderMinSubPeriod(plan, "enabled") : this.renderMinSubPeriod(plan, "disabled")}
				{plan.noOfAllowedUsers ? this.renderUsers(plan.noOfAllowedUsers, "enabled") : this.renderUsers(plan.noOfAllowedUsers, "disabled") }

			</TouchableOpacity>
		);
	},

	renderSelectionButton() {
		return (
			<TouchableOpacity style={{
				backgroundColor: 'white',
				// borderColor: randomizer(),
				borderWidth: 0.5,
				paddingVertical: 5,
				paddingHorizontal: 15,
				borderRadius: 5
			} } onPress={() => {
			}}>
				<Text style={Style.f18}> Select </Text>
			</TouchableOpacity>
		);
	},

	renderSelectedUsers() {
		let selectedUsers = this.state.selectedUsers;
		console.log('@@@@@@@@@@@@@@@@@@@@@@@@@', selectedUsers);
		return selectedUsers.map((user, index) => {
			let profilePic = user.profilePicUrl ? {uri: user.profilePicUrl} : images.defaultProfileImage;
			if (index < 3) {
				return (
					<Image
						style={styles.userImage}
						source={profilePic}
						resizeMode={'cover'}
					/>
				);
			}

		});
	},

	onSubmitPressed(obj){

		this.props.selectedUsers(obj);
		console.log('@@@@@@@@@ NNMNMNM selected USers', obj);
		this.setState({selectedUsers: obj})

	},

	renderUsers(allowedUsers, type) {

		let selectedUsers = this.state.selectedUsers ? this.state.selectedUsers : [];

		//console.log('@@@@2XrenderUwwSer', selectedUsers);
		let addButton = <Text style={{fontSize: 30, color: 'black', fontFamily: Fonts.regFont[Platform.OS]}}>+</Text>;
		let otherUsers = <Text
			style={{fontSize: 15, color: 'black', fontFamily: Fonts.regFont[Platform.OS]}}>+{ allowedUsers - 3}</Text>;
		if (selectedUsers.length != 0) {
			let profilePic0 = selectedUsers[0] && selectedUsers[0].profilePictureURL ? {uri: selectedUsers[0].profilePictureURL} : images.defaultProfileImage;
			let profilePic1 = selectedUsers[1] && selectedUsers[1].profilePictureURL ? {uri: selectedUsers[1].profilePictureURL} : images.defaultProfileImage;
			let profilePic2 = selectedUsers[2] && selectedUsers[2].profilePictureURL ? {uri: selectedUsers[2].profilePictureURL} : images.defaultProfileImage;
			let user1 = <View>
				<Image
					style={styles.userImage2}
					source={profilePic0}
					resizeMode={'cover'}
				/>
			</View>;
			let user2 = <View style = {{left: -15}}>
				<Image
					style={styles.userImage2}
					source={profilePic1}
					resizeMode={'cover'}
				/>
			</View>;
			let user3 = <View style = {{left: -30}}>
				<Image
					style={styles.userImage2}
					source={profilePic2}
					resizeMode={'cover'}
				/>
			</View>;
			return (
				<TouchableOpacity 
					onPress={() => {
						this.props.navigator.push({
							id: 20,
							selectedUsers: selectedUsers,
							onSubmit: (obj) => this.onSubmitPressed(obj)
						})
				}}>
					<View style={{width: width - 120, marginHorizontal: 10}}/>
					<View style={{backgroundColor: 'rgba(200, 200, 200, 0.1)'}}>

						<View style={[{alignItems: 'center', paddingVertical: 10}]}>
							<Text style={[styles.cardFooter, {fontWeight: '400'}]}>
								Selected Members
							</Text>
							<View style={{alignItems: 'center', flexDirection: 'row', marginVertical: 10, marginRight: 10, }}>
								{selectedUsers[0] && user1}
								{selectedUsers[1] && user2}
								{selectedUsers[2] && user3}
								<TouchableOpacity
									// style={[styles.userImage, {
										// width: 15,
										// height: 15,
										// borderRadius: 7,
										// marginLeft: -18
									// }]}
									onPress={() => {
									selectedUsers.length < allowedUsers ? this.props.navigator.push({
										id: 10.13, onSubmit: (obj) => this.onSubmitPressed(obj)
									}) : '';
								}}>
									{selectedUsers.length < allowedUsers ? addButton : (allowedUsers > 3) && otherUsers}
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</TouchableOpacity>
			);

		}
		else {
			let color = "grey";
			 if (type === "enabled") {
				 color = "black";
			 }
			return (
				<View>
					<View style={{width: width - 120, marginHorizontal: 10}}/>
					<View style={{backgroundColor: 'rgba(200, 200, 200, 0.1)'}}>
						<TouchableOpacity
							// disabled={type === "disabled"}
							style={[Style.rowWithSpaceBetween, {alignItems: 'center', paddingVertical: 10}]}
							onPress={() => {
								this.props.navigator.push({
									id: 10.13, onSubmit: (obj) => this.onSubmitPressed(obj)
							})
						}}>
							<Text style={[styles.cardFooter, {fontWeight: '400'}]}>
								Select Members
							</Text>
							<Text style={[styles.cardFooter, {marginRight: 20, textAlign: 'center'}]}>
								+
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			);
		}


	},

	renderBriefCard() {
		var cardColor = colorArray[this.props.index];
		let plan = this.props.plan;
		let price = plan.price;
		let borderStyle = {
			borderRightColor: cardColor,
			borderLeftColor: cardColor,
			borderBottomColor: cardColor,
			borderTopLeftRadius: 8,
			borderTopRightRadius: 8,
		};
		let planName = plan.planName ? plan.planName : (plan.planType == 'oneTimeCharges' ? 'Price' : 'Free Plan' );
		price = price.amount ? price.currency + '  ' + price.amount + '   ' + plan.invoicingCylcle : 'No Price';
		return (
			<TouchableOpacity
				style={[styles.planCard, borderStyle]}
				onPress={() => {
					this.onCardPress();
					// this.setState({selectedState: !this.state.selectedState});
					this.props.onPressSelect(this.props.index, this.state.cardView, this.props.planId)
				}}
			>
				<View style = {[styles.titleArea, {backgroundColor: cardColor, flex: 1, flexDirection: 'row'}]}>
					<View style = {{flex: 2}}/>
					<View style = {{flex: 5}}>
						<Text style={[cardBaseStyle.cardTitle, {textAlign: 'center', color: 'black'}]}>
							{planName}
						</Text>
					</View>
					<View style = {{flex: 2}}>
						<View style = {{justifyContent: 'center', alignItems: 'center', alignSelf: 'center', width: 20, height: 15, borderRadius: 10, backgroundColor: '#dedfe0'}}>
							<View style = {{alignSelf: 'flex-start', width: 15, height: 15, borderRadius: 7.5, backgroundColor: 'white'}}/>
						</View>
					</View>
				</View>

				<View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
					<View>
						<Text
							style={{fontSize: 20, paddingVertical: 10, color: 'black', fontFamily: Fonts.regFont[Platform.OS]}}>
							{ price }
						</Text>
					</View>
					<View>
					</View>
				</View>
				{plan.planDescription.length ? this.renderCardDescription('brief', plan.planDescription) : <View/>}
			</TouchableOpacity>
		)
	},

	render() {
		let {plans} = this.props.plan;
		return (
			<View>
				{this.props.selectedState ? this.renderFullCard(plans) : this.renderBriefCard(plans)}
			</View>
		);
	},

});
const styles = StyleSheet.create({
	row: {
		flexDirection: 'row',
		//padding: 10,
		marginVertical: 10,
	},

	unSelectedButton: {
		backgroundColor: 'white',
		borderColor: StyleConstants.primary,
		borderWidth: 0.5,
		paddingVertical: 5,
		paddingHorizontal: 15,
		borderRadius: 5,
		alignSelf: 'flex-end',
		marginVertical: 10,
		marginHorizontal: 10
	},

	selectedButton: {
		backgroundColor: StyleConstants.primary,
		borderColor: StyleConstants.primary,
		borderWidth: 0.5,
		paddingVertical: 5,
		//  marginVertical :20,
		paddingHorizontal: 15,
		borderRadius: 5,
		alignSelf: 'flex-end',
		marginVertical: 10,
		marginHorizontal: 10
	},
	planLabel: {
		fontSize: 20,
		paddingVertical: 5,
		alignSelf: 'center',
		justifyContent: 'center',
		color: StyleConstants.primary,
		fontFamily: Fonts.regFont[Platform.OS],
		fontWeight: '400',
		//marginHorizontal: 10
	},

	userImage: {
		width: 40,
		height: 40,
		borderWidth: 1,
		borderRadius: 30,
		borderColor: 'black',
		marginTop: -5,
		marginBottom: 17,
		marginHorizontal: 20,
		alignItems: 'center',
		justifyContent: 'center',
	},

	userImage2: {
		width: 30,
		height: 30,
		borderWidth: 1,
		borderRadius: 15,
		borderColor: 'black',
		// marginTop: -5,
		// marginBottom: 17,
		// marginHorizontal: 20,
		alignItems: 'center',
		// alignSelf: 'center',
		justifyContent: 'space-around',
	},


	planCard: {
		borderWidth: 0.5,
		borderRadius: 8,
		borderColor: 'rgba(200, 200, 200, 0.5)',
		marginHorizontal: 25,
		marginVertical: 20,
		width: width - 100,
		//borderColor: StyleConstants.primary,
		justifyContent: 'center',
		alignItems: 'center',
		alignSelf: 'center',
	},
	
	titleArea:
	{
		borderWidth: 0.5,
		borderTopLeftRadius: 8,
		borderTopRightRadius: 8,
		borderColor: 'transparent',
		alignSelf: 'stretch',
		backgroundColor: StyleConstants.primary,
		justifyContent: 'center',
		alignItems: 'center',
	},

	cardDescription: {
		fontSize: 18,
		color: 'black',
		fontFamily: Fonts.regFont[Platform.OS],
		marginHorizontal: 10,
		marginBottom: 20
	},

	cardFooter: {
		fontSize: 15,
		color: 'black',
		margin: 10,
		marginHorizontal: 20,
		fontFamily: Fonts.regFont[Platform.OS],
		//marginLeft: 10,
		//marginTop: 5,
		// padding: 5,
		//marginBottom: 10
	},

	planPrice: {},

	textStyle: {
		fontSize: 20,
		color: 'black',
		fontFamily: Fonts.regFont[Platform.OS],
		//paddingVertical: 10
	},
	lineSeparator: {
		height: 0.5,
		backgroundColor: 'black',
		//  marginHorizontal:5,
		marginVertical: 5,
		//width: width - 20,
		//marginHorizontal: 10,
	},
});

export default Plans;
