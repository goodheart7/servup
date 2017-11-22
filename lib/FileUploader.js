import React, { Component } from 'react';
import {
	StyleSheet,
	View,
	DeviceEventEmitter,
	NativeModules,
	Platform,
} from 'react-native';

var RNUploader = require('react-native-uploader');

let uploader = function(fileArray, uploadUrl, headersObject, method) {
	DeviceEventEmitter.addListener('RNUploaderProgress', (data)=>{
		let bytesWritten = data.totalBytesWritten;
		let bytesTotal   = data.totalBytesExpectedToWrite;
		let progress     = data.progress;

		console.log( "upload progress: " + progress + "%");
	});

	// let files = [
	// 	{
	// 		name: 'file[]',
	// 		filename: 'image1.png',
	// 		filepath: 'assets-library://....',  // image from camera roll/assets library
	// 		filetype: 'image/png',
	// 	},
	// 	{
	// 		name: 'file[]',
	// 		filename: 'image2.gif',
	// 		filepath: "data:image/gif;base64,R0lGODlhEAAQAMQAAORHHOVSKudfOulrSOp3WOyDZu6QdvCchPGolfO0o/XBs/fNwfjZ0frl3/zy7////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAkAABAALAAAAAAQABAAAAVVICSOZGlCQAosJ6mu7fiyZeKqNKToQGDsM8hBADgUXoGAiqhSvp5QAnQKGIgUhwFUYLCVDFCrKUE1lBavAViFIDlTImbKC5Gm2hB0SlBCBMQiB0UjIQA7",
	// 		filetype: 'image/gif',
	// 	},
	// ];
	let files = fileArray;

	let opts = {
		url: uploadUrl,
		files: files, 
		method: method,                             // optional: POST or PUT
		headers: headersObject,  // optional
		// headers: { 'Accept': 'application/json' },  // optional
		// params: { 'user_id': 1 },                   // optional
	};

	RNUploader.upload( opts, (err, response) => {
		if( err ){
			console.log('Uploader error:', err);
			return;
		}
	
		let status = response.status;
		let responseString = response.data;
		let json = JSON.parse( responseString );

		console.log('upload complete with status ' + status);
		console.log('message ' + responseString);
	});
}

export {uploader};