/**
 * Created by Shoaib on 11/10/2016.
 */
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  Alert,
  Platform,
  View,
  ScrollView,
  Switch,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {
  Style,
  StyleConstants,
  Fonts
} from '../../stylesheet/style';
import {
  subscription
} from '../../../lib/networkHandler';
import MenuBar from '../../common/MenuBar';
var {height, width} = Dimensions.get('window');

import cardStyle from '../Style';
import moment from 'moment';
import cardBaseStyle from '../Styles/cardBaseStyle';
let PlanDetails = React.createClass({
  getInitialState()
  {
    return {
      SwitchState: this.props.subscriptionStatus == 'active' ? false : true,
      plan: this.props.data,
      token: this.props.token,
      orderStatus: this.props.orderStatus,
    }
  },

  renderSignUpFee(price, plan) {
    price = price.amount ? price.currency + '  ' + price.amount + '   ' + plan.invoicingCylcle : 'No Price';
    return (
      <View style={[styles.sectionalView, Style.rowWithSpaceBetween]}>
        <Text style={styles.descriptionText}>
          Sign Up Fee
        </Text>
        <Text style={styles.descriptionText}>
          {price}
        </Text>
      </View>
    );
  },
  renderFreeTrial(period) {
    let freeTrialPeriod = period.countOfPeriod + ' ' + period.unitOfPeriod;
    return (
      <View style={[styles.sectionalView, Style.rowWithSpaceBetween]}>
        <Text style={styles.descriptionText}>
          Free Trial
        </Text>
        <Text style={styles.descriptionText}>
          {freeTrialPeriod}
        </Text>
      </View>
    );
  },
  renderMinSubPeriod(period) {
    let minSubPeriod = period.countOfPeriod + ' ' + period.unitOfPeriod;
    return (
      <View style={[styles.sectionalView, Style.rowWithSpaceBetween]}>
        <Text style={styles.descriptionText}>
          Min. Sub Period
        </Text>
        <Text style={styles.descriptionText}>
          {minSubPeriod}
        </Text>
      </View>
    );
  },
  renderInvoicingCycle(invoicingCycle) {
    return (
      <View style={[styles.sectionalView, Style.rowWithSpaceBetween]}>
        <Text style={styles.descriptionText}>
          Invoicing Cycle
        </Text>
        <Text style={styles.descriptionText}>
          {invoicingCycle}
        </Text>
      </View>
    );
  },
  renderSubscriptionPeriod(period) {
    let subPeriod = period.countOfPeriod + ' ' + period.unitOfPeriod;
    return (
      <View style={[styles.sectionalView, Style.rowWithSpaceBetween]}>
        <Text style={styles.descriptionText}>
          Subscription Period
        </Text>
        <Text style={styles.descriptionText}>
          {subPeriod}
        </Text>
      </View>
    );
  },

  renderNextRenewalDate() {
    let plan = this.state;
    if (plan.nextRenewalDate != null) {
      return (
        <View style={[styles.sectionalView, Style.rowWithSpaceBetween]}>
          <Text style={styles.descriptionText}>
            Next Renewal Date
          </Text>
          <Text style={styles.descriptionText}>
            {moment.utc(plan.nextRenewalDate).format('MMM Do YYYY')}
          </Text>
        </View>
      );
    }

  },
  renderSubscriptionEnds(){
    let plan = this.state;
    if (plan.miniSubPeriod != null) {
      return (
        <View style={[styles.sectionalView, Style.rowWithSpaceBetween]}>
          <Text style={styles.descriptionText}>
            Subscription Ends
          </Text>
          <Text style={styles.descriptionText}>
            {moment.utc(plan.miniSubPeriod).format('MMM Do YYYY')}
          </Text>
        </View>
      )
    }
  },
  renderCancelSubscription() {
    return (
      <View>
        <View style={Style.lineSeparator}/>
        <View style={[Style.rowWithSpaceBetween, {marginHorizontal: 15}]}>
          <Text style={[styles.textStyle, {color: 'red'}]}>
            Cancel Subscription
          </Text>
          <Switch
            style={{justifyContent: 'center',}}
            onValueChange={(value) => {
							if (!this.state.SwitchState) {
								subscription(this.state.token, this.props.subscriptionId, '/UnSubscribe')
									.then((resp) => {
										var array = resp;
										if (array.Errors)
											array = [];
										if (array.Message)
											array = [];

										if (!array.status) {
											Alert.alert('Sorry!!!', array.message);
										}
										else {
											this.setState({SwitchState: !this.state.SwitchState})
										}

									})
									.catch((err) => {
										console.log('service card api error,', err);
										//Alert.alert(AppConstants.ServerFailureHeading, AppConstants.ServerFailureMessage);
									})
							}
							else {
								subscription(this.state.token, this.props.subscriptionId, '/ReSubscribe')
									.then((resp) => {
										var array = resp;
										if (array.Errors)
											array = [];
										if (array.Message)
											array = [];
										
										if (!array.status) {
											Alert.alert('Sorry!!!', array.message);
										}
										else {
											this.setState({SwitchState: !this.state.SwitchState})
										}
									})
									.catch((err) => {
										console.log('service card api error,', err);
										//Alert.alert(AppConstants.ServerFailureHeading, AppConstants.ServerFailureMessage);
									})
							}
						}}

            value={this.state.SwitchState}
            onTintColor="blue"
            thumbTintColor="blue"
            tintColor="blue"
          />
        </View>
      </View>
    );
  },
  renderCardDescription(type, description){
    return (
      <View style={styles.sectionalView}>
        <Text style={styles.descriptionText}>
          {description}
        </Text>
      </View>
    );
  },
  render() {
    let plan = this.props.data ? this.props.data : [];

    if (plan) {
      return (
        <View style={{backgroundColor: 'white', flex: 1}}>
          {this.renderStickyHeader()}
          <ScrollView style={{flex: 1, marginTop: 20}}>
            {this.renderCard(plan)}
          </ScrollView>
        </View>
      );
    }

  },

  renderStickyHeader() {
    return (
      <MenuBar
        title={'Selected Plan'} // Optional
        leftIcon={'icon-back_screen_black'}
        onPressLeftIcon={() => this.props.navigator.pop()} // Optional
      />
    );
  },

  renderCard(plan) {
    let borderStyle = {
      borderColor: 'dodgerblue',
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
    };
    let planCardStyle = {
      borderWidth: 0.5,
      borderRadius: 8,
      borderColor: 'rgba(200, 200, 200, 0.5)',
      marginHorizontal: 25,
      marginVertical: 20,
      width: width - 70,
      //borderColor: StyleConstants.primary,
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
    };
    let titleArea = {
      borderWidth: 0.5,
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
      borderColor: 'transparent',
      alignSelf: 'stretch',
      backgroundColor: StyleConstants.primary,
      justifyContent: 'center',
      alignItems: 'center',
    };
    let price = plan.price;
    let planName = plan.planName ? plan.planName : (plan.planType == 'oneTimeCharges' ? 'Price' : 'Free Plan' );
    price = price.amount ? price.currency + '  ' + price.amount + '   ' + plan.invoicingCylcle : 'No Price';
    console.log('@@@@@@@@@@', plan)
    if (plan != null) {
      return (
        <View>
          <View style={[planCardStyle, borderStyle]}>
            <View style={[titleArea, {backgroundColor: 'dodgerblue', flex: 1, flexDirection: 'row'}]}>
              <View style={{flex: 2}}/>
              <View style={{flex: 5}}>
                <Text style={[cardBaseStyle.cardTitle, {textAlign: 'center', color: 'white', fontWeight: 'bold'}]}>
                  {planName}
                </Text>
              </View>
              <View style={{flex: 2}}/>
            </View>
            <Text
              style={{fontSize: 20, paddingVertical: 20, color: 'black', fontFamily: Fonts.regFont[Platform.OS]}}>
              { price }
            </Text>


          </View>
          {plan.planDescription ? this.renderCardDescription('full', plan.planDescription) : <View/>}
          {plan.signupFee.amount ? this.renderSignUpFee(plan.signupFee, "enabled") : this.renderSignUpFee(plan.signupFee, "disabled")}
          {plan.freeTrialPeriod.countOfPeriod  ? this.renderFreeTrial(plan, "enabled") : this.renderFreeTrial(plan, "disabled")}
          {plan.minSubPeriod.countOfPeriod ? this.renderMinSubPeriod(plan.minSubPeriod) : <View/>}
          {plan.invoicingCylcle ? this.renderInvoicingCycle(plan.invoicingCylcle) : <View/>}
          {plan.subscriptionPeriod.countOfPeriod ? this.renderSubscriptionPeriod(plan.subscriptionPeriod) : <View/>}
          {this.renderNextRenewalDate()}
          {this.renderSubscriptionEnds()}
          { !(this.props.groupOrder && true) && (this.props.subscriptionStatus != 'pending') && this.renderCancelSubscription()}

        </View>
      );
    }
  }

});

export default PlanDetails;
let styles = StyleSheet.create({
  textStyle: {
    fontSize: 16,
    color: 'black',
    fontFamily: Fonts.regFont[Platform.OS],
  },
  lineSeparator: {
    height: 0.7,
    backgroundColor: 'black',
    marginVertical: 5,
    width: width - 20,
    marginHorizontal: 10,
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
  descriptionText: {
    flex: 1,
    flexWrap: 'wrap',
    paddingVertical: 15,
    paddingHorizontal: 10,
    fontSize: 18,//16
    color: 'black',
    fontFamily: Fonts.regFont[Platform.OS],
  },
  sectionalView: {
    flex: 1,
    borderTopWidth: 0.5,
    marginHorizontal: 20,
    paddingVertical:10
  },
  row: {
    flexDirection: 'row',
    padding: 10,
    width: width / 4,
  },

});
