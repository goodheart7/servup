
const BASE_URL = 'http://52.72.219.6:44301/';
const VERSION = 'Api/v1/';

const URL = BASE_URL + VERSION;

let get = (token, apiEndPoint) => {
  let url = URL + apiEndPoint
	console.log('@@@networkSecurity--> get URL:',url);
	return fetch(url, {
		method: 'GET',
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
			"Authorization": "Bearer "+ token
		},
	})
  .then((response) => response.json())
  .then((responseJson) => { return responseJson; })
  .catch((error) => {
    console.log('lib get.js: ', error);
  });
};

export default get;
