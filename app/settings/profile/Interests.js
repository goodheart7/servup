import React, {
	Component,
} from 'react';

import {
	TouchableOpacity,
	StyleSheet,
	Text,
	View,
	Dimensions,
	Platform,
	ListView,
	Image,
	AsyncStorage,
} from 'react-native';

import _ from 'lodash';

var TitleBar = require('../../common/TitleBar');
var NavBar = require('../../common/NavBar');
import MenuBar from '../../common/MenuBar';

import {get} from '../../../lib/rest';
import {addInterests} from '../../../lib/networkHandler';

import {
	Style,
	StyleConstants,
	Fonts
} from '../../stylesheet/style';
const {height, width} = Dimensions.get('window');

import InterestCategory from './components/InterestCategory';

var ds = new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2})
var listOfInterests = [];

export default class Interests extends Component {

	constructor(props) {
		super(props);
		this.state = {
			submitBtn: true,
			interests: ds.cloneWithRows([]),
			listOfInterests: [],
			selectedListOfInterests: [],
		}
		this.renderInterests = this.renderInterests.bind(this);
		this.handleOnPressInterestItem = this.handleOnPressInterestItem.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	componentDidMount() {
		let selectedInterests = [];
		let interestsList = [];
		AsyncStorage.getItem("UserToken")
			.then((token) => {
				this.setState({token})
				return token;
			})
			.then((token) => {
				return get(token, 'Users/Interests');
			})
			.then((res) => {

				if (!res.Message || !res.Errors) {
					res.map((interest, i) => {
						interest.interests.map((singleInterest, index) => {
							if (singleInterest.status) {
								selectedInterests.push(singleInterest.interestName);
							}
						})
						if (selectedInterests.length) {
							var obj = {
								categoryName: interest.categoryName,
								interests: selectedInterests
							}
							interestsList.push(obj);
							selectedInterests = [];
						}
					})
					console.log('@@@@@@@@@@@@@@ interest response', res);
					console.log('@@@@@@@@@@@@@@ interest list', interestsList);
					this.setState({
						interests: this.state.interests.cloneWithRows(res),
						listOfInterests: res
					});
				}
			})
			.catch((error) => {
				console.log('Error: ', error);
			});
	}

	componentWillUnmount() {
		listOfInterests = [];
	}

	handleOnPressInterestItem(obj) {
		//console.log('@@@@@@@@@@@@@@@@@@@@ obj', obj);
		let interests = this.state.listOfInterests;
//    console.log('@@@@@@@@ bef sel ist', interests);
		var newInterests = interests.map((interest, index) => {

			if (interest.categoryName == obj.categoryName) {
	//      console.log('@@@@@ first if', interest.categoryName);
				interest.interests.map((intName, index) => {
					if (intName.interestName == obj.interest) {
						console.log('@@@@@ 2nd if', intName.interestName);
						intName.status = obj.status;
					}
				})
				return interest;
			}
			else {
				return interest;
			}
		});
	 // console.log('@@@@@@@@ sel ist', newInterests);

		//interests = interests.filter((interest)=>{ return interest.categoryName!= obj.categoryName && interest.})
		/*if (obj.status) { // if it is true add it
		 console.log('@@@@@@@@@@@@@@@@@@@@ list is empty');
		 // if listOfInterests is empty
		 if (listOfInterests.length === 0 || listOfInterests.length === null) {
		 listOfInterests = [ {
		 categoryName: obj.categoryName,
		 interests: obj.interest }
		 ];
		 } else {
		 console.log('@@@@@@@@@@@@@@@@@@@@ list is not empty');
		 // Add Item In list Of category That already exists
		 listOfInterests.map((item, i) => {
		 if (item.categoryName === obj.categoryName) {
		 // console.log('old category');
		 listOfInterests[i].interests.push(obj.interest[0]);
		 }
		 });

		 // Add Category Along With First Item In obj If Category does not exist
		 let x = _.find(listOfInterests, (o) => { return o.categoryName === obj.categoryName });
		 if (x === undefined) {
		 listOfInterests = [
		 ...listOfInterests ,
		 { categoryName: obj.categoryName, interests: obj.interest }
		 ];
		 }
		 }

		 } else {
		 // remove it
		 listOfInterests.map((item, i) => {
		 if (item.categoryName === obj.categoryName) {
		 // console.log('something needs to be removed from' , item.categoryName);
		 // console.log(obj.interest);
		 let index = item.interests.indexOf(obj.interest['0']);
		 if ( index > -1 ) { listOfInterests[i].interests.splice(index, 1) }
		 }
		 })
		 }*/

		this.setState({selectedListOfInterests: newInterests});

	}

	onSubmit() {
		let {token} = this.state;
		let interests = this.state.selectedListOfInterests;
		let selInterest = [];
		interests.map((interest, index) => {
			let interestsList = [];
			interest.interests.map((interestItem, index) => {
				if (interestItem.status) {
					interestsList.push(interestItem.interestName);
				}
			});
			let obj = {
				categoryName: interest.categoryName,
				interests: interestsList,
			};
			selInterest.push(obj);
		});

		/*  _.forEach(interests, (res) => {
		 res.interests = _.filter(res.interests, (intr)=>{
		 return !!intr.status;
		 })
		 })*/
	 // console.log('@@@@@@@@@@@@@@@@@@=================>', selInterest);
		if (this.props.props)
		{
			if (this.props.props.interestSelected)
				this.props.props.interestSelected.call();
		}
		addInterests(token, selInterest)
			.then((val) => {
				console.log('@@@@@@@@@@@@@@@@@@ val', val);
				if (val === 'OK') {
					get(token, 'Users/Interests')
						.then((res) => {
							// console.log(res);
							if (!res.Message || !res.Errors) {
								this.setState({
									interests: this.state.interests.cloneWithRows(res)
								});

							}

						})
				}
				this.props.navigator.pop();
			});
	}

	renderInterests(rowData, sectionID, rowID) {
		let {navigator} = this.props;
		return (
			<InterestCategory
				{...rowData}
				onPressItem={this.handleOnPressInterestItem}
			/>
		);
	}

	render() {
		let {navigator} = this.props;
		let {interests, submitBtn} = this.state;
		return (
			<View style={styles.container}>

				<MenuBar
					// color = {'red'} // Optional By Default 'black'
					title={'Interests'} // Optional
					leftIcon={'icon-back_screen_black'}
					rightIcon={'icon-done'} // Optional
					// disableLeftIcon = {true} // Optional By Default false
					//	disableRightIcon = {submitBtn} // Optional By Default false
					onPressLeftIcon={() => {
						navigator.pop()
					}} // Optional
					onPressRightIcon={this.onSubmit} // Optional
				/>

				<ListView
					ref='list'
					style={styles.wrapper}
					dataSource={interests}
					renderRow={this.renderInterests}
					enableEmptySections={true}
					bounces={false}
				/>

				<NavBar navigator={this.props.navigator}/>
			</View>
		);
	}

}


const styles = StyleSheet.create({

	container: {
		flex: 1,
		backgroundColor: 'white',
	},

	wrapper: {
		flex: 1,
	}

});
