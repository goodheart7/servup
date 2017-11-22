import React, {Component} from 'react';
import {AsyncStorage, Alert} from 'react-native';

import DummyContactList from './DummyContactList';
//import
const serverBaseURL = 'http://52.72.219.6:44301/';
const tokenUrl = 'http://52.72.219.6:44302/connect/token';
const API_VERSION = 'Api/v1/';
const apiPrefix = 'Api/v1/';
const Onboarding = 'Onboarding/';
const TermsOfUse = 'TermsOfUse/';

const ProfileCard = 'ProfileCard/';
const UpdateProfile = 'UpdateProfile';
const GetProfile = 'GetProfile';
const Users = 'Users/';
const ViewOtherUserProfile = 'ViewOtherUserProfile/'
const cards = 'spcards';
const TPinS = 'savetpin';
const TPinV = 'verifytpin';
const userVar = 'user/';
//const coverVar = 'coverpic/';
const getLines = 'GetLines';
const AddNewLine = 'AddNewLine';
const Contacts = 'Contacts/';
//const syncAddressBookAPI = 'AddressBook';
const addContactAPI = 'AddContactInAddressBook';
const removeContactAPI = 'RemoveInAddressBook';
const ignoreSuggestionListAPI = 'Suggestions/Ignore';
const getSuggestionListAPI = 'GetSuggestionList';
const getInviteListAPI = 'Invitations/InviteList';
const getInvitationListAPI = 'Invitations';
const addUserRelationAPI = 'AddUserRelation';
const inviteFriendAPI = 'InviteFriend';
const getRelationsAPI = 'GetRelations';
const relations = 'Relations/';
//const checkUserExistenceAPI = ''
const acceptUserRelationAPI = 'AcceptUserRelation';
const cancelSentRequestAPI = 'CancelRequestSent';
const rejectUserRelationAPI = 'RejectUserRelation';
const blockUserRelationAPI = 'BlockUserRelation';
const unfriendRelationAPI = 'Unfriend';
const getFriendRequestsAPI = 'Received';
const getSentFriendRequestsAPI = 'CheckFriendRequestConfirmation';
const RegisterAppUserAPI = 'Register';
const verificationPath = 'VerifyPIN';
const resendPinAPI = '/ResendPin';
const ForgotPassword = '/ForgotPassword';
const VerifyForgotPasswordPin = 'VerifyForgotPasswordPin';
const ResetPassword = 'ResetPassword';
const users = '/users';
const EmailTermsAndConditionsAPI = 'TermsAndConditions/';


const chatApiUrl = 'http://servup.io/api/v1';//'http://ec2-52-90-113-143.compute-1.amazonaws.com:8000/api/v1';
const chats = '/chats';
const posts = '/posts';
const view = '/view';
const post = '/post';
const GetPublicId = 'GetPublicId';
const profileCard = 'ProfileCard/';
//const apiPrefix = 'Api/v1/';
const serviceCards = 'ServiceCards/';
var FileUpload = require('NativeModules').FileUpload;
var formurlencoded = require('form-urlencoded');

//============================================================================================================
//                                        LOG IN MODULE
//============================================================================================================
let checkServerHealth = () => {
	return fetch(serverBaseURL)
}

let sendNumberForRegistration = function (number) {
	let url = serverBaseURL + apiPrefix + Users + number + '/Pin';
	console.log('sendNumberFor Registration Url :', url);
	return fetch(url,
	{
		method: 'GET',
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json"
		},
		//	body: JSON.stringify({lineNo: number})
	})
	.then((resp) => resp.json())
	.then((resp) => {
		console.log('@@@@@@@@@@@@@@@@@FindUserAndGeneratePinIfNotExist/', resp)
		return resp;
	})
}

let sendPinForRegistration = function (number, pin) {
	let stringifiedBody = JSON.stringify({mobileNumber: number, PIN: pin});
	console.log(" sendPinForRegistration String: " + stringifiedBody);
	let url = serverBaseURL + apiPrefix + Users + number + '/Pin/' + pin + '/Verify';
	console.log(" sendPinForRegistration Resenad PIN URL", url);
	return fetch(url,
	{
		method: 'POST',
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json"
		},
		body: stringifiedBody
	})
	.then((resp) => resp.json())
	.then((resp) => {
		console.log('resp ' + JSON.stringify(resp));
		return resp;
	})
}

let resendPin = function (number) {
	let stringifiedBody = JSON.stringify(serverBaseURL + apiPrefix + Users + number + resendPinAPI);
	let url = serverBaseURL + apiPrefix + Users + number + resendPinAPI;
	console.log("Resend PIN String: ", url);
	return fetch(url,
	{
		method: 'POST',
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json"
		},
		body: stringifiedBody
	})
	.then((resp) => {
		console.log('resp of ResendPIN' + JSON.stringify(resp));
		return resp;
	})
}

let registerAppUser = function (number, pass, email, name) {
	let stringifiedBody = JSON.stringify({
		mobileNumber: number,
		password: pass,
		email: email,
		isTermsAndConditionsAgreed: true,
		name: name,
	});
	console.log("RegisterAppUser stringifiedBody: " + stringifiedBody);

	return fetch(serverBaseURL + apiPrefix + Users + RegisterAppUserAPI,
	{
		method: 'POST',
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json"
		},
		body: stringifiedBody
	})
	.then((resp) => resp.json())
	.then((resp) => {
		var token = resp.access_token;
		console.log('RegisterAppUser call response is ' + JSON.stringify(token));
		return token;
	})
}

let getPaymentMethods = function (token) {
	let thisFunc = getPaymentMethods;
	let url = serverBaseURL + apiPrefix + Users + 'Settings/PaymentMethods';
	console.log('@@@@@@@@@@@@@@ AddCustomerPaymentMethod', url)
	return fetch(url,
	{
		method: 'GET',
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
			"Authorization": "Bearer " + token
		},
	})
	.then((resp) => {
		return tokenRefreshMiddleware(resp, token)
	})
	.then((refSt) => {
		if (refSt.status)
			return thisFunc.call(this, arguments);
		else
			return refSt.jsonObj;
	})
	.catch((error) => {
		console.log('Error: ', error);
	});
}

let forgotPassword = function (mobileNumber) {
	let url = serverBaseURL + apiPrefix + Users + mobileNumber + ForgotPassword;
	console.log('@@@@@@@@@@@forgotPassword', url);
	return fetch(url,
	{
		method: 'GET',
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json"
		},
		//	body: formurlencoded(stringifiedBody)
	})
	.then((resp) => {
		console.log('forgotPassword call response is: ' + JSON.stringify(resp));
		return resp;
	})
}

let forgotPasswordPin = function (mobileNumber, pin) {
	let url = serverBaseURL + apiPrefix + Users + mobileNumber + '/PasswordPin/' + pin + '/Verify';
	console.log('@@@@@@@@@@@forgotPasswordPin Url', url);
	return fetch(url,
	{
		method: 'GET',
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json"
		},
		//body: JSON.stringify({mobileNumber: mobileNumber, forgotPasswordPIN: pin})
	})
	.then((resp) => {
		console.log('forgotPasswordPin call response is: ' + JSON.stringify(resp));
		return resp;
	})
}

let resetPassword = function (mobileNumber, pin, password) {

	let url = serverBaseURL + apiPrefix + Users + mobileNumber + ResetPassword;
	console.log('@@@@@@@@@@@@@@@@@@@@@@ resetPassword URL', url);
	return fetch(url,
		{
			method: 'POST',
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/json"
			},
			body: JSON.stringify({forgotPasswordPIN: pin, newPassword: password})
		})
		.then((resp) => {
			console.log('forgotPasswordPin call response is: ' + JSON.stringify(resp));
			return resp;
		})
}

let getUserProfile = function (token) {
	let thisFunc = getUserProfile;
	console.log('@@@token', token);
	let url = serverBaseURL + apiPrefix + Users + 'Profile';
	console.log('@@@@@@@@@@@@@@@@@getUserPRofile URL', url);
	return fetch(url, {
		method: 'GET',
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
			"Authorization": "Bearer " + token
		},
	})
	.then((resp) => {
		return tokenRefreshMiddleware(resp, token)
	})
	.then((refSt) => {
		if (refSt.status)
			return thisFunc.call(this, arguments);
		else
			return refSt.jsonObj;
	})
	.catch((error) => {
		console.log('Error: ', error);
	});
}

let updateUserProfile = function (token, obj) {
	let thisFunc = updateUserProfile;
	let url = serverBaseURL + apiPrefix + Users + 'Profile';
	console.log('@@@@@@@@@@@@@@@@@updateUserProfile URL', url);
	console.log('@@@@@@@@@@@@@@@@@@@@@@@@updateUserProfie obj', obj);
	return fetch(url,
	{
		method: 'PUT',
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
			"Authorization": "Bearer " + token
		},
		body: JSON.stringify(obj)
	})
	.then((resp) => {
		return tokenRefreshMiddleware(resp, token)
	})
	.then((refSt) => {
		if (refSt.status)
			return thisFunc.call(this, arguments);
		else
			return refSt.jsonObj;
	})
	.catch((error) => {
		console.log('Error: ', error);
	});
}

let postDisplayPicture = function (token, DP) {
	let thisFunc = postDisplayPicture;
	console.log('@@@@@@@@@@@@@@@@@@@@DP', JSON.stringify(DP));
	let url = serverBaseURL + apiPrefix + Users + 'Profile/Picture';
	console.log('@@@@@@@@@@@@@@@@@postDisplayPictureURL', url);
	let image = JSON.stringify({base64Pic: DP});
	console.log('@@@@@@@@@@@@@@@@@postDisplayPictureURL image', image);
	return fetch(url, {
		method: 'PUT',
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
			"Authorization": 'Bearer ' + token
		},
		body: image
	})
	.then((resp) => {
		return tokenRefreshMiddleware(resp, token)
	})
	.then((refSt) => {
		if (refSt.status)
			return thisFunc.call(this, arguments);
		else
			return refSt.jsonObj;
	})
	.catch((error) => {
		console.log('Error: ', error);
	});
}

let postCoverPicture = function (token, DP) {
	let thisFunc = postCoverPicture;
	var firstResponder;
	console.log('@@@@@@@@@@@@@@@@@@@@DP', JSON.stringify(DP));
	let url = serverBaseURL + apiPrefix + Users + 'Profile/CoverPicture';
	console.log('@@@@@@@@@@@@@@@@@postCoverPicture URL', url);
	return fetch(url, {
		method: 'PUT',
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
			"Authorization": 'Bearer ' + token
		},
		body: JSON.stringify({base64Pic: DP})
	})
	.then((responseJson) => {
		console.log(responseJson);
		return responseJson;
	})
	.catch((error) => {
		console.log('networkHandler() -- postCoverPicture() : ', error);
	});
}

let postAddress = function (token, object) {
	let thisFunc = postAddress;
	var firstResponder;
	console.log('@@@@@@@@@@@@@@@postAddressOBJ', object);
	let url = serverBaseURL + apiPrefix + Users + 'Profile/Addresses';
	console.log('@@@@@@@@@@@@@@@@@postAddress URL', url);
	return fetch(url, {
		method: 'POST',
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
			"Authorization": 'Bearer ' + token
		},
		body: JSON.stringify(object)
	})
	.then((responseJson) => {
		console.log('@@@@@@@@@@@@@@@postaddresspost', responseJson);
	})
	.catch((error) => {
		console.log('networkHandler() -- postAddress() : ', error);
	});
}

let deleteAddress = function (token, id) {
	let thisFunc = deleteAddress;
	var firstResponder;
	let url = serverBaseURL + apiPrefix + Users + 'Profile/Addresses/' + id;
	console.log('@@@@@@@@@@@@@@@@@deleteAddress', url);
	return fetch(url, {
		method: 'DELETE',
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
			"Authorization": 'Bearer ' + token
		}
	})
	.then((responseJson) => {
		responseJson
	})
	.catch((error) => {
		console.log('networkHandler() -- deleteAddress() : ', error);
	});
}

let updateAddress = function (token, object, addressId) {
	let thisFunc = updateAddress;
	var firstResponder;
	let url = serverBaseURL + apiPrefix + Users + 'Profile/Addresses/' + addressId;
	console.log('@@@@@@@@@@@@@@@@@updateAddress URL', url);
	return fetch(url, {
		method: 'PUT',
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
			"Authorization": 'Bearer ' + token
		},
		body: JSON.stringify(object)
	})
	.then((responseJson) => {
		responseJson
	})
	.catch((error) => {
		console.log('networkHandler() -- updateAddress() : ', error);
	});
}

let verifyPassword = function (username, password) {

	var client_id = 'servup_mobile_app';
	var grant_type = 'password';
	var scope = 'offline_access consumer';
	let stringifiedBody = {
		username: username,
		password: password,
		grant_type: grant_type,
		client_id: client_id,
		scope: scope
	};
	console.log("String: " + formurlencoded(stringifiedBody) + '\nSending to: ' + tokenUrl);
	return fetch(tokenUrl,
	{
		method: 'POST',
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
			"Accept": "application/json"
		},
		body: formurlencoded(stringifiedBody)
	})
	.then((resp) => {
		console.log('verifyPassword call response is: ' + JSON.stringify(resp));
		return resp
	})
}

let sendByEmail = function (email) {
//  console.log("email is: " + serverBaseURL + apiPrefix + EmailTermsAndConditionsAPI + email);
	let url = serverBaseURL + apiPrefix + TermsOfUse + 'email/' + email;
	console.log('@@@@@@@@@@@@@@sendBy Email URL', url);
	return fetch(url,
	{
		method: 'POST',
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json"
		},
		//	body: JSON.stringify({email: email})
	})
	.then((resp) => {
		return resp
	})
}

let getTOC = function () {
	let url = serverBaseURL + apiPrefix + TermsOfUse + 'consumer';
	console.log('@@@@@@@@@@@@@@getTOC  URL', url);
	return fetch(url,
	{
		method: 'GET',
	})
	.then((resp) => {
		return tokenRefreshMiddleware(resp, token)
	})
	.then((refSt) => {
		if (refSt.status)
			return thisFunc.call(this, arguments);
		else
			return refSt.jsonObj;
	})
	.catch((error) => {
		console.log('Error: ', error);
	});
}

let getPrivacyPolicy = function () {
	let url = serverBaseURL + apiPrefix + 'PrivacyPolicy';
	console.log('@@@@@@@@@@@@@@getPrivacyPolicy', url);
	return fetch(url,
	{
		method: 'GET',
	})
	.then((resp) => {
		return tokenRefreshMiddleware(resp, token)
	})
	.then((refSt) => {
		if (refSt.status)
			return thisFunc.call(this, arguments);
		else
			return refSt.jsonObj;
	})
	.catch((error) => {
		console.log('Error: ', error);
	});
}

//============================================================================================================
//                                        CONTACTS MODULE
//============================================================================================================

let syncAddressBook = function (token, contacts) {
	let thisFunc = syncAddressBook;
	let stringifiedBody = JSON.stringify(contacts);
	// console.log("@@@@@@@@@@@@ contacts", contacts);
	return fetch(serverBaseURL + apiPrefix + 'AddressBook/' + Contacts + 'Sync',
	{
		method: 'POST',
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
			"Authorization": "Bearer " + token
		},
		body: stringifiedBody
	})
	.then((resp) => {
		return tokenRefreshMiddleware(resp, token)
	})
	.then((refSt) => {
		if (refSt.status)
			return thisFunc.call(this, arguments);
		else
			return refSt.jsonObj;
	})
	.catch((error) => {
		console.log('Error: ', error);
	});
}

let addContact = function (token, contacts) {
	let thisFunc = addContact;
	let stringifiedBody = JSON.stringify(contacts);
	console.log("addContact stringifiedBody: " + stringifiedBody);
	let url = serverBaseURL + apiPrefix + 'AddressBook/' + Contacts + 'Add'
	console.log('Add Contacts URL', url);
	return fetch(url,
	{
		method: 'POST',
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
			"Authorization": "Bearer " + token
		},
		body: stringifiedBody
	})
	.then((resp) => {
		console.log('addContact call response is ' + JSON.stringify(resp));
		return resp;
	})
}

let getRelations = function (token) {
	let thisFunc = getRelations;
	var firstResponder;
	let url = serverBaseURL + apiPrefix + Contacts + 'Relations';
	console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@ getRelations url', url);
	return fetch(url,
	{
		method: 'GET',
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
			"Authorization": "Bearer " + token
		},
	})
	.then((resp) => {
		return tokenRefreshMiddleware(resp, token)
	})
	.then((refSt) => {
		if (refSt.status)
			return thisFunc.call(this, arguments);
		else
			return refSt.jsonObj;
	})
	.catch((error) => {
		console.log('Error: ', error);
	});
}

let updateRelationship = function (friendId, name,token) {
	let thisFunc = updateRelationship;
	let url = serverBaseURL + apiPrefix + Contacts + 'Relations/'+friendId+'/Group/'+name;
	console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@updateRelationship url', url);
	return fetch(url,
	{
		method: 'PUT',
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
			"Authorization": "Bearer " + token
		},
	})
	.then((resp) => {
		return tokenRefreshMiddleware(resp, token)
	})
	.then((refSt) => {
		if (refSt.status)
			return thisFunc.call(this, arguments);
		else
			return refSt.jsonObj;
	})
	.catch((error) => {
		console.log('Error: ', error);
	});
};

let changeRelationRequest = function (friendId, groupName,token, status) {
	let thisFunc = changeRelationRequest;
	var firstResponder;
	let url = serverBaseURL + apiPrefix + Contacts + 'Relations/'+friendId+'/Group/'+groupName+'/State/'+status;
	console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@updateRelationship url', url);
	return fetch(url,
	{
		method: 'PUT',
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
			"Authorization": "Bearer " + token
		},
	})
	.then((resp) => {
	  console.log('@@@@@@ changeRelationRequest', resp);
		return tokenRefreshMiddleware(resp, token)
	})
	.then((refSt) => {
		if (refSt.status)
			return thisFunc.call(this, arguments);
		else
			return refSt.jsonObj;
	})
	.catch((error) => {
		console.log('Error: ', error);
	});
};

let getSentFriendRequests = function (token) {
	let thisFunc = getSentFriendRequests;
	let url = serverBaseURL + apiPrefix + Contacts + relations + 'IsConfirmed';
	console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@ getSentFriendRequestsAPI url', url);
	return fetch(url,
	{
		method: 'GET',
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
			"Authorization": "Bearer " + token
		},
	})
	.then((resp) => {
		return tokenRefreshMiddleware(resp, token)
	})
	.then((refSt) => {
		if (refSt.status)
			return thisFunc.call(this, arguments);
		else
			return refSt.jsonObj;
	})
	.catch((error) => {
		console.log('Error: ', error);
	});
}

let removeContact = function (token, contacts) {
	let thisFunc = removeContact;
	let stringifiedBody = JSON.stringify(contacts);
	console.log("removeContact stringifiedBody: " + stringifiedBody);
	let url = serverBaseURL + apiPrefix + 'AddressBook/' + Contacts + 'Remove';
	console.log('Remove Contacts URL', url);

	return fetch(url,
	{
		method: 'DELETE',
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
			"Authorization": "Bearer " + token
		},
		body: stringifiedBody
	})
	.then((resp) => {
		console.log('removeContact call response is ' + JSON.stringify(resp));
		return resp;
	})
}

let ignoreSuggestionList = function (token, contacts) {
	let thisFunc = ignoreSuggestionList;
	let req = [];
	req.push(contacts);
	let stringifiedBody = JSON.stringify(req);
	console.log("ignoreSuggestionList stringifiedBody: " + stringifiedBody);
	let url = serverBaseURL + apiPrefix + Contacts + ignoreSuggestionListAPI;
	console.log('@@@@@@@@@@@@@@@@@@@@Ignore Suggestion List', url);
	return fetch(url,
	{
		method: 'POST',
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
			"Authorization": "Bearer " + token
		},
		body: stringifiedBody
	})
	.then((resp) => {
		console.log('ignoreSuggestionList call response is ' + JSON.stringify(resp));
		return resp;
	})
}

let getInvitationList = function (token) {
	let thisFunc = getInvitationList;
	let url = serverBaseURL + apiPrefix + Contacts + 'Invite';
	console.log('@@@@@@@@@@@@@@@@@@@@get Invitation List URL', url);
	//console.log ('@@@@@@@@@@@@@@@@@@getInvitationList called ');
	return fetch(url,
	{
		method: 'GET',
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
			"Authorization": "Bearer " + token
		},
	})
	.then((resp) => {
		return tokenRefreshMiddleware(resp, token)
	})
	.then((refSt) => {
		if (refSt.status)
			return thisFunc.call(this, arguments);
		else
			return refSt.jsonObj;
	})
	.catch((error) => {
		console.log('Error: ', error);
	});
}

let addUserRelation = function (token, contacts) {
	let thisFunc = addUserRelation;
	var firstResponder;
	var contactList = [];
	contactList.push(contacts);
	let stringifiedBody = JSON.stringify(contactList);
	console.log("addUserRelation stringifiedBody: " + stringifiedBody);
	let url = serverBaseURL + apiPrefix + Contacts + relations + 'Add';
	console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@ addUserRelations API url', url);
	return fetch(url,
	{
		method: 'POST',
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
			"Authorization": "Bearer " + token
		},
		body: stringifiedBody
	})
	.then((resp) => {
		console.log('addUserRelation call response is ' + JSON.stringify(resp));
		return resp;
	})
}

let cancelSentRequest = function (token, publicId) {
	let thisFunc = cancelSentRequest;
	var firstResponder;
	let stringifiedBody = JSON.stringify(publicId);
	let req = [];
	req.push(publicId);
	req = JSON.stringify(req);
	console.log("cancelSentRequest stringifiedBody: " + stringifiedBody);
  console.log("cancelSentRequest stringifiedBody: ", req);
	let url = serverBaseURL + apiPrefix + Contacts + relations + 'Cancel';
	console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@ cancelSentRequestAPI url', url);
	return fetch(url,
	{
		method: 'POST',
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
			"Authorization": "Bearer " + token
		},
		body: req
	})
	.then((resp) => {
		console.log('cancelSentRequest call response is' , resp);
		return resp;
	})
}

let acceptUserRelation = function (token, contacts) {
	let thisFunc = acceptUserRelation;
	var firstResponder;
	let stringifiedBody = JSON.stringify(contacts);
	console.log("acceptUserRelation stringifiedBody: " + stringifiedBody);
	let url = serverBaseURL + apiPrefix + Contacts + relations + 'Accept';
	console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@ acceptUserRelations API url', url);
	return fetch(url,
	{
		method: 'POST',
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
			"Authorization": "Bearer " + token
		},
		body: stringifiedBody
	})
	.then((resp) => {
		console.log('acceptUserRelation call response is ' + JSON.stringify(resp));
		return resp;
	})
}

let blockUserRelation = function (token, publicId) {
	let thisFunc = blockUserRelation;
	var firstResponder;
	let stringifiedBody = "[" + JSON.stringify(publicId) + "]";
	console.log("blockUserRelation stringifiedBody: " + stringifiedBody);
	let url = serverBaseURL + apiPrefix + Contacts + relations + 'Block';
	console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@ blockUserRelations API url', url);
	return fetch(url,
	{
		method: 'POST',
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
			"Authorization": "Bearer " + token
		},
		body: stringifiedBody
	})
	

}

let unfriendRelation = function (token, publicId) {
	let thisFunc = unfriendRelation;
	var firstResponder;
	let stringifiedBody = "[" + JSON.stringify(publicId) + "]";
	console.log("unfriendRelation stringifiedBody: " + stringifiedBody);
	let url = serverBaseURL + apiPrefix + Contacts + relations + 'Unfriend';
	console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@ unfriendUserRelations API url', url);
	return fetch(url,
	{
		method: 'POST',
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
			"Authorization": "Bearer " + token
		},
		body: stringifiedBody
	})
}

let rejectUserRelation = function (token, publicId) {
	let thisFunc = rejectUserRelation;
	var firstResponder;
	let stringifiedBody = JSON.stringify(publicId);
	console.log("rejectUserRelation stringifiedBody: " + stringifiedBody);
	let url = serverBaseURL + apiPrefix + Contacts + relations + 'Reject';
	console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@ addUserRelations API url', url);
	return fetch(url,
	{
		method: 'POST',
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
			"Authorization": "Bearer " + token
		},
		body: stringifiedBody
	})
	.then((resp) => {
		console.log('rejectUserRelation call response is ' + JSON.stringify(resp));
		return resp;
	})
}

let getSuggestionList = function (token) {
	let thisFunc = getSuggestionList;
	let url = serverBaseURL + apiPrefix + Contacts + 'Suggestions';
	console.log('@@@@@@@@@@@@@@@@@@@@get Suggestion List', url);
	return fetch(url,
	{
		method: 'GET',
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
			"Authorization": "Bearer " + token
		},
	})
	.then((resp) => {
		return tokenRefreshMiddleware(resp, token)
	})
	.then((refSt) => {
		if (refSt.status)
			return thisFunc.call(this, arguments);
		else
			return refSt.jsonObj;
	})
	.catch((error) => {
		console.log('Error: ', error);
	});
}

let getInviteList = function (token) {
	let thisFunc = getInviteList;
	let url = serverBaseURL + apiPrefix + Contacts + 'Invited';
	console.log('@@@@@@@@@@@@@@@@@@@@get Invite List', url);
	return fetch(url,
	{
		method: 'GET',
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
			"Authorization": "Bearer " + token
		},
	})
	.then((resp) => {
		return tokenRefreshMiddleware(resp, token)
	})
	.then((refSt) => {
		if (refSt.status)
			return thisFunc.call(this, arguments);
		else
			return refSt.jsonObj;
	})
	.catch((error) => {
		console.log('Error: ', error);
	});
}

let getFriendRequests = function (token) {
	let thisFunc = getFriendRequests;
	let url = serverBaseURL + apiPrefix + Contacts + relations + 'Received';
	console.log('@@@@@@@@@@@@@@@@@@@@getFriendRequests List', url);

	return fetch(url,
	{
		method: 'GET',
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
			"Authorization": "Bearer " + token
		},
	})
	.then((resp) => {
		return tokenRefreshMiddleware(resp, token)
	})
	.then((refSt) => {
		if (refSt.status)
			return thisFunc.call(this, arguments);
		else
			return refSt.jsonObj;
	})
	.catch((error) => {
		console.log('Error: ', error);
	});
}

let inviteFriend = function (token, number) {
	let thisFunc = inviteFriend;
	//console.log('@@@@@@@@@@@invite obj', number);
	let url = serverBaseURL + apiPrefix + Contacts + 'Invite';
	console.log('@@@@@@@@@@@@@@@@@@@@Invite Friend URL', url);
	return fetch(url, {
		method: 'POST',
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
			"Authorization": "Bearer " + token
		},
		body: JSON.stringify(number)
	})
	.then ((resp) => {
		return tokenRefreshMiddleware(resp, token)
	})
	.then((refSt) => {
		if (refSt.status)
			return thisFunc.call(this, arguments);
		else
			return refSt.jsonObj;
	})
	.catch((error) => {
		console.log('Error: ', error);
	});
}

//============================================================================================================
//                                        User APIs
//============================================================================================================
let spFollowers = function (token, spId, numberOfFollowers, offset) {
	let thisFunc = spFollowers;
	return fetch(serverBaseURL + apiPrefix + 'SP/Followers/'+spId + '?limit=' + numberOfFollowers + '&offset='+ offset,
	{
		method: 'GET',
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json;charset=utf-8;",
			"Authorization": "Bearer " + token
		},
	})
	.then((resp) => {
		return tokenRefreshMiddleware(resp, token)
	})
	.then((refSt) => {
		if (refSt.status)
			return thisFunc.call(this, arguments);
		else
			return refSt.jsonObj;
	})
	.catch((error) => {
		console.log('Error: ', error);
	});
};

let followSP = function (token, spPublicId) {
	let thisFunc = followSP;
	var firstResponder;
	let url = serverBaseURL + apiPrefix + Users + 'Follow/SP/' + spPublicId;
	console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@ fallowSP API url', url);
	return fetch(url,
		{
			method: 'POST',
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/json",
				"Authorization": "Bearer " + token
			},
			body: spPublicId
		})
}

let unfollowSP = function (token, spPublicId) {
	let thisFunc = unfollowSP;
	var firstResponder;
	let url = serverBaseURL + apiPrefix + Users + 'UnFollow/SP/' + spPublicId;
	console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@ unfallowSP API url', url);
	return fetch(url,
		{
			method: 'POST',
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/json",
				"Authorization": "Bearer " + token
			},
			body: spPublicId
		})
}
//============================================================================================================
//                                        ORDERS MODULE
//============================================================================================================

let placeOrder = function (token, orderObject) {
	let thisFunc = placeOrder;
	console.log('@@@@@@@@@@@@place order body', orderObject);

	let bodyText = JSON.stringify(orderObject);
//  console.log('@@@@@@@@@@@@body', bodyText);
	let url = serverBaseURL + apiPrefix + 'Orders';
	console.log('@@@@@@@@@@@placeOrder Url:', url)
	return fetch(url,
	{
		method: 'POST',
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
			"Authorization": "Bearer " + token
		},
		body: bodyText,
	})
	.then((resp) => {
		return tokenRefreshMiddleware(resp, token)
	})
	.then((refSt) => {
		if (refSt.status)
			return thisFunc.call(this, arguments);
		else
			return refSt.jsonObj;
	})
	.catch((error) => {
		console.log('Error: ', error);
	});
}

let groupOrder = function (token, orderId, subscriptionId, orderObject) {
	let thisFunc = groupOrder;
	let bodyText = JSON.stringify(orderObject);
	console.log('@@@@@@@@@@@@body', bodyText);
	let url = serverBaseURL + apiPrefix + 'Group/Orders/' + orderId + '/Subscriptions/' + subscriptionId;
	console.log('@@@@@@@@@@@placeOrder Url:', url)
	return fetch(url,
	{
		method: 'PUT',
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
			"Authorization": "Bearer " + token
		},
		body: bodyText,
	})
	.then((resp) => {
		return tokenRefreshMiddleware(resp, token)
	})
	.then((refSt) => {
		if (refSt.status)
			return thisFunc.call(this, arguments);
		else
			return refSt.jsonObj;
	})
	.catch((error) => {
		console.log('Error: ', error);
	});
}

let orderPayment = function (token, transactionId, paymentMethodId) {
	let thisFunc = orderPayment;
	let url = serverBaseURL + apiPrefix + 'Orders' + '/' + transactionId + '/Pay/' + paymentMethodId;
	console.log('@@@@@@@@@@url', url);
	return fetch(url,
	{
		method: 'PUT',
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
			"Authorization": "Bearer " + token
		},
	})
	.then((resp) => {
		return tokenRefreshMiddleware(resp, token)
	})
	.then((refSt) => {
		if (refSt.status)
			return thisFunc.call(this, arguments);
		else
			return refSt.jsonObj;
	})
	.catch((error) => {
		console.log('Error: ', error);
	});
}

let refundOrder = function (token, orderId) {
	let thisFunc = refundOrder;
	let url = serverBaseURL + apiPrefix + 'Orders/' + orderId + '/Refund';
	return fetch(url,
	{
		method: 'PUT',
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
			"Authorization": "Bearer " + token
		},
	})
	.then((resp) => {
		return tokenRefreshMiddleware(resp, token)
	})
	.then((refSt) => {
		if (refSt.status)
			return thisFunc.call(this, arguments);
		else
			return refSt.jsonObj;
	})
	.catch((error) => {
		console.log('Error: ', error);
	});
}

//============================================================================================================
//                                        CARDS MODULE
//============================================================================================================


let makePurchasePrivate = function (token, subscriptionId, flag) {
	let thisFunc = makePurchasePrivate;
	let url = serverBaseURL + apiPrefix + 'Subscriptions/' + subscriptionId + '/PrivatePurchase/' + flag;
	console.log('@@@@@@@@@@@@ url', url);
	return fetch(url,
	{
		method: 'PUT',
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
			"Authorization": "Bearer " + token
		},
	})
	.then((resp) => {
		return tokenRefreshMiddleware(resp, token)
	})
	.then((refSt) => {
		if (refSt.status)
			return thisFunc.call(this, arguments);
		else
			return refSt.jsonObj;
	})
	.catch((error) => {
		console.log('Error: ', error);
	});
}

let cancelSubscription = function (token, subscriptionId) {
	let thisFunc = cancelSubscription;
	let url = serverBaseURL + apiPrefix + 'Subscriptions/' + subscriptionId + '/SubUnsub'
	return fetch(url,
	{
		method: 'PUT',
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
			"Authorization": "Bearer " + token
		},
	})
	.then((resp) => {
		return tokenRefreshMiddleware(resp, token)
	})
	.then((refSt) => {
		if (refSt.status)
			return thisFunc.call(this, arguments);
		else
			return refSt.jsonObj;
	})
	.catch((error) => {
		console.log('Error: ', error);
	});
}

let getPaymentHistory = function (token, subscriptionId) {
	let url = serverBaseURL + apiPrefix + 'Subscriptions/' + subscriptionId + '/Payments/History';
	return fetch(url,
	{
		method: 'GET',
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json;charset=utf-8;",
			"Authorization": "Bearer " + token
		},
	})
	.then((resp) => {
		return tokenRefreshMiddleware(resp, token)
	})
	.then((refSt) => {
		if (refSt.status)
			return thisFunc.call(this, arguments);
		else
			return refSt.jsonObj;
	})
	.catch((error) => {
		console.log('Error: ', error);
	});
}

let getSavedCards = function (token, numberOfCards) {
	let thisFunc = getSavedCards;
	let url = serverBaseURL + apiPrefix + serviceCards + 'Saved?limit='+ numberOfCards + '&offset=0';
	console.log('getSavedCards Url', url);
	return fetch(url,
	{
		method: 'GET',
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json;charset=utf-8;",
			"Authorization": "Bearer " + token
		},
	})
	.then((resp) => {
		return tokenRefreshMiddleware(resp, token)
	})
	.then((refSt) => {
		if (refSt.status)
			return thisFunc.call(this, arguments);
		else
			return refSt.jsonObj;
	})
	.catch((error) => {
		console.log('Error: ', error);
	});
}

let getTimelineCards = function (token, numberOfCards) {
	let thisFunc = getTimelineCards;
	return fetch(serverBaseURL + apiPrefix + serviceCards + '?limit=' + numberOfCards + '&offset=0',
	{
		method: 'GET',
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json;charset=utf-8;",
			"Authorization": "Bearer " + token
		},
	})
	.then((resp) => {
		return tokenRefreshMiddleware(resp, token)
	})
	.then((refSt) => {
		if (refSt.status)
			return thisFunc.call(this, arguments);
		else
			return refSt.jsonObj;
	})
	.catch((error) => {
		console.log('Error: ', error);
	});
}

let getRelatedCards = function (token, cardId) {
	let thisFunc = getRelatedCards;
	return fetch(serverBaseURL + apiPrefix + serviceCards + cardId + '/RelatedCards',
	{
		method: 'GET',
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json;charset=utf-8;",
			"Authorization": "Bearer " + token
		},
	})
	.then((resp) => {
		return tokenRefreshMiddleware(resp, token)
	})
	.then((refSt) => {
		if (refSt.status)
			return thisFunc.call(this, arguments);
		else
			return refSt.jsonObj;
	})
	.catch((error) => {
		console.log('Error: ', error);
	});
}

let getCompanyCards = function (token, cardId, spId) {
	let thisFunc = getCompanyCards;
	let url = serverBaseURL + apiPrefix + serviceCards + cardId + '/SP/' + spId;
	console.log('@@@@@@@@@@Company Cards URL', url);
	return fetch(url,
	{
		method: 'GET',
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json;charset=utf-8;",
			"Authorization": "Bearer " + token
		},
	})
	.then((resp) => {
		return tokenRefreshMiddleware(resp, token)
	})
	.then((refSt) => {
		if (refSt.status)
			return thisFunc.call(this, arguments);
		else
			return refSt.jsonObj;
	})
	.catch((error) => {
		console.log('Error: ', error);
	});
}

let getDetailCard = function (token, cardId) {
	let thisFunc = getDetailCard;
	let url = serverBaseURL + apiPrefix + serviceCards + cardId;
	console.log('@@@@@@@@@@@@@@getDetailCard url', url);
	return fetch(url,
	{
		method: 'GET',
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json;charset=utf-8;",
			"Authorization": "Bearer " + token
		},
	})
	.then((resp) => {
		//console.log('@@@@@@ detailedCard Resp', resp.json());
		return tokenRefreshMiddleware(resp, token)
	})
	.then((refSt) => {
		if (refSt.status)
			return thisFunc.call(this, arguments);
		else
			return refSt.jsonObj;
	})
	.catch((error) => {
		console.log('Error: ', error);
	});
}

let getServiceCard = function (token, cardId) {
	let thisFunc = getServiceCard;
	return fetch(serverBaseURL + apiPrefix + 'Subscriptions' + '/' + cardId,
	{
		method: 'GET',
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json;charset=utf-8;",
			"Authorization": "Bearer " + token
		},
	})
	.then((resp) => {
		return tokenRefreshMiddleware(resp, token)
	})
	.then((refSt) => {
		if (refSt.status)
			return thisFunc.call(this, arguments);
		else
			return refSt.jsonObj;
	})
	.catch((error) => {
		console.log('Error: ', error);
	});
}

let getGroupSubscription = function (token, subId) {
	let thisFunc = getGroupSubscription;
	let url = serverBaseURL + apiPrefix + 'Group/Subscriptions/' + subId;
	console.log('@@@@@@@@Group Sub URL :', url);
	return fetch(url,
	{
		method: 'GET',
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json;charset=utf-8;",
			"Authorization": "Bearer " + token
		},
	})
	.then((resp) => {
		return tokenRefreshMiddleware(resp, token)
	})
	.then((refSt) => {
		if (refSt.status)
			return thisFunc.call(this, arguments);
		else
			return refSt.jsonObj;
	})
	.catch((error) => {
		console.log('Error: ', error);
	});
}

let getReviews = function (token, cardId) {
	let thisFunc = getReviews;
	return fetch(serverBaseURL + apiPrefix + serviceCards + cardId + '/Reviews',
	{
		method: 'GET',
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json;charset=utf-8;",
			"Authorization": "Bearer " + token
		},
	})
	.then((resp) => {
		return tokenRefreshMiddleware(resp, token)
	})
	.then((refSt) => {
		if (refSt.status)
			return thisFunc.call(this, arguments);
		else
			return refSt.jsonObj;
	})
	.catch((error) => {
		console.log('Error: ', error);
	});
}

let postReviews = function (token, cardId, review) {
	let thisFunc = postReviews;
	let url = serverBaseURL + apiPrefix + serviceCards + cardId + '/Reviews';
	console.log('@@@@@@@@@@@@@@@@post reviews url', url);
	return fetch(url,
	{
		method: 'POST',
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
			"Authorization": "Bearer " + token
		},
		body: JSON.stringify(review),
	})
	.then((resp) => {
		return tokenRefreshMiddleware(resp, token)
	})
	.then((refSt) => {
		if (refSt.status)
			return thisFunc.call(this, arguments);
		else
			return refSt.jsonObj;
	})
	.catch((error) => {
		console.log('Error: ', error);
	});
}

let saveCard = function (token, cardId) {
	let thisFunc = saveCard;
	let url = serverBaseURL + apiPrefix + serviceCards + cardId + '/Save';
	console.log("saveCard Url :", url);
	return fetch(url,
	{
		method: 'POST',
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json;charset=utf-8;",
			"Authorization": "Bearer " + token
		},
	})
	.then((resp) => {
		return tokenRefreshMiddleware(resp, token)
	})
	.then((refSt) => {
		if (refSt.status)
			return thisFunc.call(this, arguments);
		else
			return refSt.jsonObj;
	})
	.catch((error) => {
		console.log('Error: ', error);
	})
}

let hideCard = function (token, cardId) {
	let thisFunc = hideCard;
	let url = serverBaseURL + apiPrefix + serviceCards + cardId + '/Hide';
	console.log("saveCard Url :", url);
	return fetch(url,
	{
		method: 'PUT',
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json;charset=utf-8;",
			"Authorization": "Bearer " + token
		},
	})
	.then((resp) => {
		return tokenRefreshMiddleware(resp, token)
	})
	.then((refSt) => {
		if (refSt.status)
			return thisFunc.call(this, arguments);
		else
			return refSt.jsonObj;
	})
	.catch((error) => {
		console.log('Error: ', error);
	})
}

let unLikeCard = function (token, cardId) {
	let thisFunc = unLikeCard;
	let url = serverBaseURL + apiPrefix + serviceCards + cardId + '/Unlike';
	console.log("Unlike Url :", url);
	return fetch(url,
	{
		method: 'PUT',
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json;charset=utf-8;",
			"Authorization": "Bearer " + token
		},
	})
	.then((resp) => {
		return tokenRefreshMiddleware(resp, token)
	})
	.then((refSt) => {
		if (refSt.status)
			return thisFunc.call(this, arguments);
		else
			return refSt.jsonObj;
	})
	.catch((error) => {
		console.log('Error:', error);
	})
}

let getLikedCards = function (token, cardId) {
	let thisFunc = getLikedCards;
	return fetch(serverBaseURL + apiPrefix + 'ServiceCards/Saved',
	{
		method: 'GET',
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json;charset=utf-8;",
			"Authorization": "Bearer " + token
		},
	})
	.then((resp) => {
		return tokenRefreshMiddleware(resp, token)
	})
	.then((refSt) => {
		if (refSt.status)
			return thisFunc.call(this, arguments);
		else
			return refSt.jsonObj;
	})
	.catch((error) => {
		console.log('networkHandler() -- getLikedCards() : ', error);
	});
}

let getActiveCards = function (token, numberOfCards) {
	let thisFunc = getActiveCards;
	// token = token+'S';
	return fetch(serverBaseURL + apiPrefix + 'Subscriptions?limit='+ numberOfCards + '&offset=0',
	{
		method: 'GET',
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json;charset=utf-8;",
			"Authorization": "Bearer " + token
		},
	})
	.then((resp) => {
		return tokenRefreshMiddleware(resp, token)
	})
	.then((refSt) => {
		if (refSt.status)
			return thisFunc.call(this, arguments);
		else
			return refSt.jsonObj;
	})
	.catch((error) => {
		console.log('networkHandler() -- getActiveCards() : ', error);
	});
}

let subscription = function (token, subscriptionId, action) {
	let thisFunc = subscription;
	let url = serverBaseURL + apiPrefix + 'Subscriptions/' + subscriptionId + action;
	console.log('@@@@@@@@@@@@@@@@@@@@@ url', url);
	return fetch(url,
	{
		method: 'GET',
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json;charset=utf-8;",
			"Authorization": "Bearer " + token
		},
	})
	.then((resp) => {
		return tokenRefreshMiddleware(resp, token)
	})
	.then((refSt) => {
		if (refSt.status)
			return thisFunc.call(this, arguments);
		else
			return refSt.jsonObj;
	})
	.catch((error) => {
		console.log('subunsub() -- getActiveCards() : ', error);
	});
}
//============================================================================================================
//                                        Notifications
//============================================================================================================
let updateNotificationSetting = function (token, object) {
	let thisFunc = updateNotificationSetting;
	let url = serverBaseURL + apiPrefix + Users + 'Settings/Notifications/consumer';
	console.log('=================updateNotificationSetting url==========', url);
	return fetch(url, {
		method: 'PUT',
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
			"Authorization": 'Bearer ' + token
		},
		body: JSON.stringify(object)
	})
	.then((response) => {
		return tokenRefreshMiddleware(response, token)
	})
	.then((refSt) => {
		if (refSt.status)
			return thisFunc.call(this, arguments);
		else
			return refSt.jsonObj;
	})
	.catch((error) => {
		console.log('networkHandler() -- setDefaultAddress() : ', error);
	});
}

let markReadNotification = function (token, id) {
	let thisFunc = markReadNotification;
	let url = serverBaseURL + API_VERSION + 'Notifications/' + id + '/MarkRead';
	console.log('@@@@@@@@@@@@mark Read Notification URL', url)
	return fetch(url, {
		method: 'PUT',
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
			"Authorization": 'Bearer ' + token
		}
	})
	.then((response) => {
		return response;
	})
	.catch((error) => {
		console.log('networkHandler() -- markReadNotification() : ', error);
	});
}

let getNotificationCounters = function (token) {
	let thisFunc = getNotificationCounters;
	let url = serverBaseURL + API_VERSION + 'Users/Notifications/Counters';
	console.log('@@@@@@@@@@@@getNotification URL', url)
	return fetch(url, {
		method: 'GET',
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
			"Authorization": 'Bearer ' + token
		}
	})
	.then((response) => {
		return tokenRefreshMiddleware(response, token)
	})
	.then((refSt) => {
		if (refSt.status)
			return thisFunc.call(this, arguments);
		else
			return refSt.jsonObj;
	})
	.catch((error) => {
		console.log('networkHandler() -- markReadNotification() : ', error);
	});
}

let readNotifications = function (token, type) {
	let thisFunc = readNotifications;
	let url = serverBaseURL + API_VERSION + 'Notifications/Reset/' + type;
	console.log('@@@@@@@@@@@@getNotification URL', url)
	return fetch(url, {
		method: 'PUT',
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
			"Authorization": 'Bearer ' + token
		}
	})
	.then((response) => {
		return tokenRefreshMiddleware(response, token)
	})
	.then((refSt) => {
		if (refSt.status)
			return thisFunc.call(this, arguments);
		else
			return refSt.jsonObj;
	})
	.catch((error) => {
		console.log('networkHandler() -- markReadNotification() : ', error);
	});
}

//============================================================================================================
//                                        CHATS MODULE
//============================================================================================================

let getRecentChats = function (token) {
	let url = chatApiUrl + chats;
	return fetch(url,
	{
		method: 'GET',
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
			"access_token": token
		}
	})
	.then((response) => {
		console.log('@@@@@ get recent chats', response);
		return tokenRefreshMiddleware(response, token)
	})
	.then((refSt) => {
		if (refSt.status)
			return thisFunc.call(this, arguments);
		else
			return refSt.jsonObj;
	})
	.catch((error) => {
		console.log('networkHandler() -- getRecentChats() : ', error);
	});
}

let startChatWithOtherPerson = function (secondPersonId, token) {
	let url = chatApiUrl + chats + '/' + Users + secondPersonId;
	return fetch(url,
	{
		method: 'POST',
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
			"access_token": token
		}//,
		// body: JSON.stringify({ somedata: somevalue })
	})
	.then((response) => {
		return tokenRefreshMiddleware(response, token)
	})
	.then((refSt) => {
		if (refSt.status)
			return thisFunc.call(this, arguments);
		else
			return refSt.jsonObj;
	})
	.catch((error) => {
		console.log('networkHandler() -- startChatWithOtherPerson() : ', error);
	});
}

let requestSupportOnACard = function (cardId, spUserId, token) {
	let url = chatApiUrl + '/cards/' + cardId + '/support';
	console.log('@@@@@@@@@@@@@@ @@Support on Cards', url);
	console.log('@@@@@@@@@@@@@@@@Support on Cards ID', cardId);
	console.log('@@@@@@@@@@@@@@@@Support on Cards spId', spUserId);
	console.log('@@@@@@@@@@@@@@@@Support on Cards token', token);
	return fetch(url,
	{
		method: 'POST',
		headers: {
			"Content-Type": "application/json",
			"access_token": token
		},
		body: JSON.stringify(spUserId)
	})
	.then((response) => {
		return tokenRefreshMiddleware(response, token)
	})
	.then((refSt) => {
		if (refSt.status)
			return thisFunc.call(this, arguments);
		else
			return refSt.jsonObj;
	})
	.catch((error) => {
		console.log('@@@@@Support error : ', error);
	});
}

//TODO: need to rename this function more understandable  getAllPostOfChat
let getAllPostOfChatWithPerson = function (chatGroupId, token) {
	let url = chatApiUrl + chats + '/' + chatGroupId + posts;
	return fetch(url,
	{
		method: 'GET',
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
			"access_token": token
		}//,
		// body: JSON.stringify({ somedata: somevalue })
	})
	.then((response) => {
		return tokenRefreshMiddleware(response, token)
	})
	.then((refSt) => {
		if (refSt.status)
			return thisFunc.call(this, arguments);
		else
			return refSt.jsonObj;
	})
	.catch((error) => {
		console.log('networkHandler() -- getAllPostOfChatWithPerson() : ', error);
	});
}

let markChatAsRead = function (chatGroupId, token) {
	let url = chatApiUrl + chats + '/' + chatGroupId + view;
	return fetch(url,
	{
		method: 'POST',
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
			"access_token": token
		}
	})
	.then((response) => {
		return tokenRefreshMiddleware(response, token)
	})
	.then((refSt) => {
		if (refSt.status)
			return thisFunc.call(this, arguments);
		else
			return refSt.jsonObj;
	})
	.catch((error) => {
		console.log('networkHandler() -- markChatAsRead() : ', error);
	});
}

let createAPostInChat = function (chatGroupId, token, newMessage) {
	let url = chatApiUrl + chats + '/' + chatGroupId + post;
	return fetch(url,
	{
		method: 'POST',
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
			"access_token": token
		},
		body: JSON.stringify({message: newMessage})
	})
	.then((response) => {
		return tokenRefreshMiddleware(response, token)
	})
	.then((refSt) => {
		if (refSt.status)
			return thisFunc.call(this, arguments);
		else
			return refSt.jsonObj;
	})
	.catch((error) => {
		console.log('networkHandler() -- createAPostInChat() error : ', error);
	});
}

let createAPostWithTypeInChat = function (chatGroupId, token, type, message) {
	let thisFunc = createAPostWithTypeInChat;
	let url = chatApiUrl + '/chats/' + chatGroupId + '/post-type/' + type + post
	// console.log(url);

	return fetch(url, {
		method: 'POST',
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
			"access_token": token
		},
		body: JSON.stringify({message: message})
	})
	.then((response) => {
		return tokenRefreshMiddleware(response, token)
	})
	.then((refSt) => {
		if (refSt.status)
			return thisFunc.call(this, arguments);
		else
			return refSt.jsonObj;
	})
	.catch((error) => {
		console.log('networkHandler() -- createAPostWithTypeInChat() : ', error);
	});
}

let getPublicIdAgaintUserToken = function (token) {
	let thisFunc = getPublicIdAgaintUserToken;
	let url = serverBaseURL + API_VERSION + 'Users/Id';
	return fetch(url,
	{
		method: 'GET',
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
			"Authorization": 'Bearer ' + token
		}
	})
	.then((response) => {
		return tokenRefreshMiddleware(response, token)
	})
	.then((refSt) => {
		if (refSt.status)
			return thisFunc.call(this, arguments);
		else
			return refSt.jsonObj;
	})
	.catch((error) => {
		console.log('networkHandler() -- getPublicIdAgaintUserToken() Error: ', error);
	});
}


//============================================================================================================
//                                        CHATS MODULE
//============================================================================================================


/*let sendByEmailPP = function (email) {
 console.log("email is: " + serverBaseURL + apiPrefix + Onboarding + EmailTermsAndConditions + email);
 return fetch(serverBaseURL + apiPrefix + Onboarding + EmailTermsAndConditions + email,
 {
 method: 'POST',
 headers: {
 "Accept": "application/json",
 "Content-Type": "application/json"
 },
 //	body: JSON.stringify({email: email})
 })
 .then((resp) => {
 return resp
 })
 }*/

let getOtherUserProfile = function (token, publicId) {
	let thisFunc = getOtherUserProfile;
	let url = serverBaseURL + apiPrefix + Users + 'ViewOtherConsumer/' + publicId;
	console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@ url', url);
	return fetch(url,
	{
		method: 'GET',
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
			"Authorization": "Bearer " + token
		},
	})
	.then((resp) => {
		return tokenRefreshMiddleware(resp, token)
	})
	.then((refSt) => {
		if (refSt.status)
			return thisFunc.call(this, arguments);
		else
			return refSt.jsonObj;
	})
	.catch((error) => {
		console.log('Error: ', error);
	});
}

let getBusinessProfile = function (token, spPublicId) {
	let thisFunc = getBusinessProfile;
	let url = serverBaseURL + apiPrefix + 'SP/BusinessProfiles/Other/' + spPublicId;
	console.log('@@@getBusinessProfil URL ', url);
	return fetch(url,
	{
		method: 'GET',
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
			"Authorization": "Bearer " + token
		},
	})
	.then((resp) => {
		return tokenRefreshMiddleware(resp, token)
	})
	.then((refSt) => {
		if (refSt.status)
			return thisFunc.call(this, arguments);
		else
			return refSt.jsonObj;
	})
	.catch((error) => {
		console.log('Error: ', error);
	});
}

/*let getCoverPic = function (token, UserID) {
 UserID = UserID + '/';
 console.log("\n full address is: " + serverBaseURL + apiPrefix + userVar + UserID);
 return fetch(serverBaseURL + apiPrefix + userVar + UserID,
 {
 method: 'GET',
 headers: {
 "Content-Type": "application/x-www-form-urlencoded",
 "x-access-token": token
 },
 })
 .then((resp) => {
 return resp.json()
 })
 }

 let getProfilePic = function (token, UserID) {
 UserID = UserID + '/';
 console.log("\n full address is: " + serverBaseURL + apiPrefix + userVar + UserID);
 return fetch(`${serverBaseURL}${apiPrefix}${userVar}${UserID}`,
 {
 method: 'GET',
 headers: {
 "Content-Type": "application/x-www-form-urlencoded",
 "x-access-token": token
 },
 })
 .then((resp) => {
 return resp.json()
 })
 }*/

let getUserSubscribedCards = function (token, UserID) {
	UserID = UserID + '/';
	// console.log ("Network Handler Called.\n full address is: " + `${serverBaseURL}${apiPrefix}${userVar}${UserID}${cards}?page=1`);
	return fetch(`${serverBaseURL}${apiPrefix}${userVar}${UserID}${cards}?page=1`,
		{
			method: 'GET',
			headers: {
				"x-access-token": token
			},
		})
		.then((resp) => {
			return resp.json()
		})
}

//============================================================================================================
//                                        SETTINGS MODULE
//============================================================================================================


let setDefaultAddress = function (token, object) {
	let thisFunc = setDefaultAddress;
	console.log('@@@@@@@@@@@@', object);
	let url = serverBaseURL + apiPrefix + Users + 'Profile/Addresses';
	console.log('@@@@@@@@@ set default url', url);
	return fetch(url, {
		method: 'PUT',
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
			"Authorization": 'Bearer ' + token
		},
		body: JSON.stringify(object)
	})
	.then((responseJson) => {
		return tokenRefreshMiddleware(respJson, token)
	})
	.then((refSt) => {
		if (refSt.status)
			return thisFunc.call(this, arguments);
		else
			return refSt.jsonObj;
	})
	.catch((error) => {
		console.log('networkHandler() -- setDefaultAddress() : ', error);
	});
}

let setDefaultPaymentMethod = function (token, id) {
	let thisFunc = setDefaultPaymentMethod;
	let url = serverBaseURL + apiPrefix + Users + 'Settings/PaymentMethods/' + id + '/SetDefault';
	console.log('@@@@@@@@@@@@@@ setDefaultPaymentMethod', url)
	return fetch(url, {
		method: 'PUT',
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
			"Authorization": 'Bearer ' + token
		}
	})
	.then((response) => {
		// console.log(response);
		return response
	})
	.catch((error) => {
		console.log('networkHandler() -- setDefaultAddress() : ', error);
	});
}

let changePassword = function (token, object) {
	let thisFunc = changePassword;
	let url = serverBaseURL + apiPrefix + Users + 'ChangePassword';
	console.log('@@@@@@@@Change Password URL', url);
	return fetch(url, {
		method: 'PUT',
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
			"Authorization": 'Bearer ' + token
		},
		body: JSON.stringify(object)
	})
	.then((resp) => {
		return tokenRefreshMiddleware(resp, token)
	})
	.then((refSt) => {
		if (refSt.status)
			return thisFunc.call(this, arguments);
		else
			return refSt.jsonObj;
	})
	.catch((error) => {
		console.log('networkHandler() -- setDefaultAddress() : ', error);
	});
}

let addInterests = function (token, object) {
	let thisFunc = addInterests;
	object = JSON.stringify(object);
	console.log('Sending interest', object);
	let url = serverBaseURL + API_VERSION + 'Users/Interests';
	// console.log('@@@@@@@@add Interests URL', url);
	return fetch(url, {
		method: 'PUT',
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
			"Authorization": 'Bearer ' + token
		},
		body: object,
	})
	.then((response) => {
		console.log('Log for add interests', response);
		return tokenRefreshMiddleware(response, token)
	})
	.then((refSt) => {
		if (refSt.status)
			return thisFunc.call(this, arguments);
		else
			return refSt.jsonObj;
	})
	.catch((error) => {
		console.log('networkHandler() -- addInterests : ', error);
	});
}

let AddCustomerPaymentMethod = function (token, object) {
	let thisFunc = AddCustomerPaymentMethod;
	let url = serverBaseURL + apiPrefix + Users + 'Settings/PaymentMethods';
	console.log('@@@@@@@@@@@@@@ AddCustomerPaymentMethod', url)
	return fetch(url, {
		method: 'POST',
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
			"Authorization": 'Bearer ' + token
		},
		body: JSON.stringify(object)
	})
	.then((responseJson) => {
		// console.log('object', object);
		// console.log(responseJson);
		return responseJson;
	})
	.catch((error) => {
		console.log('networkHandler() -- AddCustomerPaymentMethod() : ', error);
	});
}

let getUserAddresses = function (UserID, token, UserPhoneNumber) {
	UserPhoneNumber = '923008423238';
	console.log('hello');
	console.log('URL IS : ' + `${serverBaseURL}${apiPrefix}${userVar}${UserID}/${UserPhoneNumber}/addresses`);
	return fetch(`${serverBaseURL}${apiPrefix}${userVar}${UserID}/${UserPhoneNumber}/addresses`,
		{
			method: 'GET',
			headers: {
				"x-access-token": token
			},
		})
	.then((resp) => {
		return tokenRefreshMiddleware(resp, token)
	})
	.then((refSt) => {
		if (refSt.status)
			return thisFunc.call(this, arguments);
		else
			return refSt.jsonObj;
	})
		.catch((error) => {
			console.log('Error: ', error);
		});
}

let createUserAddresses = function (UserID, token, UserPhoneNumber, obj) {
	UserPhoneNumber = '923008423238';
	return fetch(`${serverBaseURL}${apiPrefix}${userVar}${UserID}/${UserPhoneNumber}/addresses`,
	{
		method: 'POST',
		headers: {
			"x-access-token": token,
			"Content-Type": "application/json"
		},
		body: JSON.stringify(obj)
	})
	.then((resp) => {
		//	console.log('upload:'+ resp);
		return resp
	})
	.catch((error) => {
		console.log('Error: ', error);
	});
}

let updateUserAddresses = function (UserID, token, UserPhoneNumber, obj) {
	UserPhoneNumber = '923008423238';
	return fetch(`${serverBaseURL}${apiPrefix}${userVar}${UserID}/${UserPhoneNumber}/addresses`,
	{
		method: 'PATCH',
		headers: {
			"x-access-token": token,
			"Content-Type": "application/json"
		},
		body: JSON.stringify(obj)
	})
	.then((resp) => {
		//	console.log('upload:'+ resp);
		return resp
	})
	.catch((error) => {
		console.log('Error: ', error);
	});
}

let removePayementMethod = function (token, id) {
	let thisFunc = removePayementMethod;
	let url = serverBaseURL + apiPrefix + Users + 'Settings/PaymentMethods/' + id;
	console.log('@@@@@@@@@@@@@@ setDefaultPaymentMethod', url)
	return fetch(url, {
		method: 'DELETE',
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
			"Authorization": 'Bearer ' + token
		}
	})
	.then((response) => {
		return tokenRefreshMiddleware(response, token)
	})
	.then((refSt) => {
		if (refSt.status)
			return thisFunc.call(this, arguments);
		else
			return refSt.jsonObj;
	})
	.catch((error) => {
		console.log('networkHandler() -- setDefaultAddress() : ', error);
	});
}


/*
 let getUserLines = function (token) {
 return fetch(serverBaseURL + apiPrefix + Onboarding + getLines,
 {
 method: 'GET',
 headers: {
 "Accept": "application/json",
 "Content-Type": "application/json",
 "Authorization": "Bearer " + token
 },
 })
 .then((response) => response.json())
 .then((resp) => {
 console.log(resp);
 return resp;
 })
 .catch((error) => {
 console.log('networkHandler() -- getUserLines() : ', error);
 });
 }
 let postUserLine = function (token, number) {
 return fetch(serverBaseURL + apiPrefix + Onboarding + AddNewLine,
 {
 method: 'POST',
 headers: {
 "Accept": "application/json",
 "Content-Type": "application/json",
 "Authorization": "Bearer " + token
 },
 body: JSON.stringify({mobileNumber: number})
 })
 .then((resp) => {
 return resp;
 });
 }

 let subscribeToBuyCard = function (token, cardID, tpin, paymentMethod, quantity, size, colors) {
 return fetch(serverBaseURL + apiPrefix + spcards + "/" + cardID + "subscribe",
 {
 method: 'POST',
 headers: {
 "Content-Type": "application/json",
 "x-access-token": token
 },
 body: JSON.stringify({tpin: tpin, paymentMethod: paymentMethod, quantity: quantity, size: size, colors: colors})
 })
 .then((resp) => {
 return resp.json()
 })
 }

 let getUserWithoutPhone = function (token, UserID) {
 UserID = UserID + '/';
 console.log("\n full address is: " + serverBaseURL + apiPrefix + userVar + UserID);
 return fetch(serverBaseURL + apiPrefix + userVar + UserID,
 {
 method: 'GET',
 headers: {
 "Content-Type": "application/x-www-form-urlencoded",
 "x-access-token": token
 },
 })
 .then((resp) => {
 return resp.json()
 })
 }
 let getUserTelcoPlans = function (UserID, token, UserPhoneNumber) {
 UserPhoneNumber = '923008423238';
 //	console.log('TELCO URL IS : '+`${serverBaseURL}${apiPrefix}${userVar}${UserID}/${UserPhoneNumber}/prepaid/plans`);
 return fetch(`${serverBaseURL}${apiPrefix}${userVar}${UserID}/${UserPhoneNumber}/prepaid/plans`,
 {
 method: 'GET',
 headers: {
 "x-access-token": token
 },
 })
 .then((resp) => {
 //	console.log('upload:'+ resp);
 return resp.json()
 })
 }

 let getUserWalletsBalance = function (UserID, token, UserPhoneNumber) {
 UserPhoneNumber = '923008423238';
 //	console.log('TELCO URL IS : '+`${serverBaseURL}${apiPrefix}${userVar}${UserID}/${UserPhoneNumber}/wallets/balance`);
 return fetch(`${serverBaseURL}${apiPrefix}${userVar}${UserID}/${UserPhoneNumber}/wallets/balance`,
 {
 method: 'GET',
 headers: {
 "x-access-token": token
 },
 })
 .then((resp) => {
 //	console.log('upload:'+ resp);
 return resp.json()
 })
 }

 let getUserWallets = function (UserID, token, UserPhoneNumber) {
 UserPhoneNumber = '923008423238';
 //	console.log('TELCO URL IS : '+`${serverBaseURL}${apiPrefix}${userVar}${UserID}/${UserPhoneNumber}/wallets/balance`);
 return fetch(`${serverBaseURL}${apiPrefix}${userVar}${UserID}/${UserPhoneNumber}/wallets`,
 {
 method: 'GET',
 headers: {
 "x-access-token": token
 },
 })
 .then((resp) => {
 //	console.log('upload:'+ resp);
 return resp.json()
 })
 }

 let topupUserWalletCredit = function (UserID, token, UserPhoneNumber, obj) {
 UserPhoneNumber = '923008423238';
 //	console.log('TELCO URL IS : '+`${serverBaseURL}${apiPrefix}${userVar}${UserID}/${UserPhoneNumber}/${connectionType}/balance`);
 return fetch(`${serverBaseURL}${apiPrefix}${userVar}${UserID}/${UserPhoneNumber}/wallet/balance/topup`,
 {
 method: 'POST',
 headers: {
 "x-access-token": token,
 "Content-Type": "application/json"
 },
 body: JSON.stringify(obj)
 })
 .then((resp) => {
 //	console.log('upload:'+ resp);
 return resp
 })
 }

 let topupUserLineCredit = function (UserID, token, UserPhoneNumber, connectionType, obj) {
 UserPhoneNumber = '923008423238';
 //	console.log('TELCO URL IS : '+`${serverBaseURL}${apiPrefix}${userVar}${UserID}/${UserPhoneNumber}/${connectionType}/balance`);
 return fetch(`${serverBaseURL}${apiPrefix}${userVar}${UserID}/${UserPhoneNumber}/${connectionType}/balance/topup`,
 {
 method: 'POST',
 headers: {
 "x-access-token": token,
 "Content-Type": "application/json"
 },
 body: JSON.stringify(obj)
 })
 .then((resp) => {
 //	console.log('upload:'+ resp);
 return resp
 })
 }

 let getUserLineCreditInformation = function (UserID, token, UserPhoneNumber, connectionType) {
 UserPhoneNumber = '923008423238';
 //	console.log('TELCO URL IS : '+`${serverBaseURL}${apiPrefix}${userVar}${UserID}/${UserPhoneNumber}/${connectionType}/balance`);
 return fetch(`${serverBaseURL}${apiPrefix}${userVar}${UserID}/${UserPhoneNumber}/${connectionType}/balance`,
 {
 method: 'GET',
 headers: {
 "x-access-token": token
 },
 })
 .then((resp) => {
 //	console.log('upload:'+ resp);
 return resp.json()
 })
 }
 */

let subscribeToCard = function (token, cardID, obj) {
	console.log('URL IS : ' + `${serverBaseURL}${apiPrefix}${cards}/${cardID}/subscribe`);
	return fetch(`${serverBaseURL}${apiPrefix}${cards}/${cardID}/subscribe`,
		{
			method: 'POST',
			headers: {
				"x-access-token": token,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(obj)
		})
		.then((resp) => {
			//	console.log('response: ' + resp);
			return resp.json()
		})
}

let getCards = function (page, token) {
	var page = page || 1;
	return fetch(serverBaseURL + apiPrefix + cards + "?page=" + page,
		{
			method: 'GET',
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				"x-access-token": token,
			},
		})
		.then((resp) => {
			return resp.json()
		})
}

let saveTpin = function (token, pin) {
	var respStatus = null;
	return fetch(serverBaseURL + apiPrefix + TPinS,
		{
			method: 'POST',
			headers: {
				"Content-Type": "application/json",
				"x-access-token": token
			},
			body: JSON.stringify({tpin: pin})
		})
		.then((resp) => {
			respStatus = resp.status;
			return resp.json();
		})
		.then((respJson) => {
			return Promise.resolve({
				status: respStatus,
				json: respJson
			})
		})
}

let verifyTpin = function (token, pin) {
	var respStatus = null;
	return fetch(serverBaseURL + apiPrefix + TPinV,
		{
			method: 'POST',
			headers: {
				"Content-Type": "application/json",
				"x-access-token": token
			},
			body: JSON.stringify({tpin: pin})
		})
		.then((resp) => {
			respStatus = resp.status;
			return resp.text()
		})
		.then((bodyText) => {
			console.log(bodyText, respStatus);
			if (respStatus !== 200)
				return Promise.reject({status: respStatus, body: bodyText});
			return Promise.resolve({status: respStatus, body: bodyText});
		})
}

let getRefreshToken = function(refToken)
{
	let fetchParams = { 
		method: 'POST',
		headers: {"Content-Type": "application/json", "Accept": 'application/json'},
		body: JSON.stringify({
			'client_id': 'servup_mobile_app',
			'grant_type': 'refresh_token',
			'refresh_token': refToken
		})
	};
	return fetch (tokenUrl, fetchParams)
	.then ((response)=> {
		console.log('New refresh token is', response);
		return response.json()
	})
	.done();
}

let tokenRefreshMiddleware = function(firstResponder, token)
{
	if (firstResponder.status == '401')
	{
		AsyncStorage.getItem('UserRefreshToken')
		.then ((refToken) => {
			return getRefreshToken(refToken)
		})
		.then ((newRefreshToken) => {
			return AsyncStorage.setItem('UserRefreshToken', JSON.stringify(newRefreshToken.refresh_token))
		})
		.then ((saved) => {
			return Promise.resolve({status: true, jsonObj: null})
		})
		.catch((err)=> {
			console.log('refresh token error', err);
			return Alert('An error occured. Please try again.');
		})
	}
	else
	{
		return firstResponder.json().then((FR) => {
			return Promise.resolve ({status: false, jsonObj: FR});
		});
	}
}


export {checkServerHealth as checkServ};
export {sendNumberForRegistration as registerNum};
export {sendPinForRegistration as registerPin};
export {registerAppUser};
export {resendPin};
export {verifyPassword};
export {forgotPassword};
export {forgotPasswordPin};
export {resetPassword};
export {getUserProfile};
export {getOtherUserProfile};
export {syncAddressBook};
export {getGroupSubscription};
export {addContact};
export {subscription};
export {removeContact};
export {ignoreSuggestionList};
export {getSuggestionList};
export {getFriendRequests};
export {cancelSentRequest};
export {acceptUserRelation};
export {blockUserRelation};
export {unfriendRelation};
export {rejectUserRelation};
export {getInviteList};
export {getInvitationList};
export {inviteFriend};
export {addUserRelation};
export {getRelations};
export {groupOrder};
export {updateUserProfile};
export {getSentFriendRequests};
export {readNotifications};
export {removePayementMethod};
export {getPrivacyPolicy};
export {unLikeCard};
//export {getUserLines};
//export {postUserLine};
export {getRecentChats};
export {startChatWithOtherPerson};
export {getAllPostOfChatWithPerson};
export {markChatAsRead};
export {createAPostInChat};
export {getPublicIdAgaintUserToken};
export {postDisplayPicture};
export {postCoverPicture};
export {postAddress};
export {deleteAddress};
export {updateAddress};
export {setDefaultAddress};
export {AddCustomerPaymentMethod};
export {setDefaultPaymentMethod};
export {getLikedCards};
export {getActiveCards};
export {changePassword};
export {addInterests};
export {updateNotificationSetting};
export {markReadNotification};
export {createAPostWithTypeInChat};
export {getNotificationCounters};
export {getSavedCards}
export {getTimelineCards};
export {getPaymentMethods};
export {saveCard};
export {getDetailCard};
export {getRelatedCards};
export {getReviews};
export {postReviews};
export {getServiceCard};
export {placeOrder};
export {orderPayment};
export {getPaymentHistory};
export {refundOrder};
export {makePurchasePrivate};
export {cancelSubscription};
export {getCompanyCards};
export {getUserSubscribedCards as getUserSubscribedCards};
export {getUserAddresses as getUserAddresses};
//export {sendByEmailPP as sendByEmailPP};
export {sendByEmail as sendByEmailPP};
//export {topupUserLineCredit as topupUserLineCredit};
//export {getUserLineCreditInformation as getUserLineCreditInformation};
//export {getUserWalletsBalance as getUserWalletsBalance};
//export {topupUserWalletCredit as topupUserWalletCredit};
//export {getUserWallets as getUserWallets};
export {updateUserAddresses as updateUserAddresses};
export {createUserAddresses as createUserAddresses};
export {subscribeToCard as subscribeToCard};
//export {getUserTelcoPlans as getUserTelcoPlans};
export {getCards as getCards};
//export {getProfilePic as getProfilePic};
//export {getCoverPic as getCoverPic};
export {followSP}
export {unfollowSP}
export {saveTpin as saveTpin};
export {getBusinessProfile}
export {getTOC};
export {hideCard};
export {changeRelationRequest};
export {requestSupportOnACard};
export {updateRelationship};
export {verifyTpin as verifyTpin};
export {spFollowers};
//export {getUserWithoutPhone as getUserWithoutPhone};
//export {subscribeToBuyCard as subscribeToBuyCard};
