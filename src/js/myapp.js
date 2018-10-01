'use strict';

/*
 * Based on: 
 * Identity example in Chrome Apps Samples 
 * https://github.com/GoogleChrome/chrome-app-samples/tree/master/samples/identity 
 * https://github.com/GoogleChrome/chrome-app-samples/blob/master/LICENSE
 *
 * GDE Sample: Chrome extension Google APIs by Abraham's 
 * https://github.com/GoogleDeveloperExperts/chrome-extension-google-apis
 * https://github.com/GoogleDeveloperExperts/chrome-extension-google-apis/blob/master/LICENSE
 */
inputArray = {}
var inputDictionary = {}

var executionAPIExample = (function () {

	//var SCRIPT_ID='1nPvptCpoQZKnaYCCzjs_dN4HldFucBUCpXJ9JYh0POK-cLPlenYP2KBT'; // Apps Script script id
	var SCRIPT_ID = '1nPvptCpoQZKnaYCCzjs_dN4HldFucBUCpXJ9JYh0POK-cLPlenYP2KBT';
	var STATE_START = 1;
	var STATE_ACQUIRING_AUTHTOKEN = 2;
	var STATE_AUTHTOKEN_ACQUIRED = 3;

	var state = STATE_START;

	var signin_button, xhr_button, revoke_button, exec_info_div, exec_data, exec_result, create_button, feedback_button, submit_button;

	function disableButton(button) {
		button.setAttribute('disabled', 'disabled');
	}

	function enableButton(button) {
		button.removeAttribute('disabled');
	}

	function changeState(newState) {
		state = newState;
		switch (state) {
			case STATE_START:
				enableButton(signin_button);
				disableButton(submit_button);
				disableButton(xhr_button);
				disableButton(create_button);
				disableButton(feedback_button);
				disableButton(revoke_button);
				break;
			case STATE_ACQUIRING_AUTHTOKEN:
				sampleSupport.log('Acquiring token...');
				disableButton(signin_button);
				disableButton(submit_button);
				disableButton(create_button);
				disableButton(xhr_button);
				disableButton(feedback_button);
				disableButton(revoke_button);
				break;
			case STATE_AUTHTOKEN_ACQUIRED:
				disableButton(signin_button);
				enableButton(submit_button);
				enableButton(create_button);
				disableButton(xhr_button);
				enableButton(feedback_button);
				enableButton(revoke_button);
				break;
		}
	}
	/**
	 * Get users access_token.
	 *
	 * @param {object} options
	 *   @value {boolean} interactive - If user is not authorized ext, should auth UI be displayed.
	 *   @value {function} callback - Async function to receive getAuthToken result.
	 */
	function getAuthToken(options) {
		sampleSupport.log('accessing identity API...')
		chrome.identity.getAuthToken({
			'interactive': options.interactive
		}, options.callback);
	}

	/**
	 * Get users access_token in background with now UI prompts.
	 */
	function getAuthTokenSilent() {
		sampleSupport.log('Getting silently...');
		getAuthToken({

			'interactive': false,
			'callback': getAuthTokenCallback,
		});
	}

	/**
	 * Get users access_token or show authorize UI if access has not been granted.
	 */
	function getAuthTokenInteractive() {
		sampleSupport.log('Getting interactively...');
		getAuthToken({
			'interactive': true,
			'callback': getAuthTokenCallback,
		});
	}

	/**
	 * Handle response from authorization server.
	 *
	 * @param {string} token - Google access_token to authenticate request with.
	 */
	function getAuthTokenCallback(token) {
		// Catch chrome error if user is not authorized.
		if (chrome.runtime.lastError) {
			sampleSupport.log('No token aquired');
			changeState(STATE_START);
		} else {
			sampleSupport.log('Token acquired');
			changeState(STATE_AUTHTOKEN_ACQUIRED);
		}
	}

	/**
	 * Calling the Execution API script.
	 */
	function sendDataToExecutionAPI() {
		disableButton(xhr_button);
		xhr_button.className = 'loading';
		getAuthToken({
			'interactive': false,
			'callback': sendDataToExecutionAPICallback,
		});
	}

	/**
	 * Calling the Execution API script callback.
	 * @param {string} token - Google access_token to authenticate request with.
	 */
	function sendDataToExecutionAPICallback(token) {
		sampleSupport.log('Sending data to Execution API script');
		post({
			'url': 'https://script.googleapis.com/v1/scripts/' + SCRIPT_ID + ':run',
			'callback': executionAPIResponse,
			'token': token,
			'request': {
				'function': 'setData',
				'parameters': {
					'data': JSON.parse(exec_data.value)
				}
			}
		});
	}

	// function sendDataToExecutionAPICallback(token) {
	// 	sampleSupport.log('Sending data to Execution API script');
	// 	post({	'url': 'https://script.googleapis.com/v1/scripts/' + SCRIPT_ID + ':run',
	// 			'callback': executionAPIResponse,
	// 			'token': token,
	// 			'request': {'function': 'submitForm',			
	// 						'parameters': {'data': inputArray}}
	// 		}); 
	// }

	/**
	 * Handling response from the Execution API script.
	 * @param {Object} response - response object from API call
	 */
	function executionAPIResponse(response) {
		sampleSupport.log(response);
		enableButton(xhr_button);
		xhr_button.classList.remove('loading');
		var info;
		if (response.response.result.status == 'ok') {
			info = 'Data has been entered into <a href="' + response.response.result.doc + '" target="_blank"><strong>this sheet</strong></a>';
		} else {
			info = 'Error...';
		}
		exec_result.innerHTML = info;
	}

	/**
	 * Revoking the access token.
	 */
	function revokeToken() {
		exec_result.innerHTML = '';
		getAuthToken({
			'interactive': false,
			'callback': revokeAuthTokenCallback,
		});
	}

	/**
	 * Revoking the access token callback
	 */
	function revokeAuthTokenCallback(current_token) {
		if (!chrome.runtime.lastError) {

			// Remove the local cached token
			chrome.identity.removeCachedAuthToken({
				token: current_token
			}, function () {});

			// Make a request to revoke token in the server
			var xhr = new XMLHttpRequest();
			xhr.open('GET', 'https://accounts.google.com/o/oauth2/revoke?token=' +
				current_token);
			xhr.send();

			// Update the user interface accordingly
			changeState(STATE_START);
			sampleSupport.log('Token revoked and removed from cache. ' +
				'Check chrome://identity-internals to confirm.');
		}

	}

	/**
	 * Make an authenticated HTTP POST request.
	 *
	 * @param {object} options
	 *   @value {string} url - URL to make the request to. Must be whitelisted in manifest.json
	 *   @value {object} request - Execution API request object
	 *   @value {string} token - Google access_token to authenticate request with.
	 *   @value {function} callback - Function to receive response.
	 */
	function post(options) {
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4 && xhr.status === 200) {
				// JSON response assumed. Other APIs may have different responses.
				options.callback(JSON.parse(xhr.responseText));
			} else if (xhr.readyState === 4 && xhr.status !== 200) {
				sampleSupport.log('post ' + xhr.readyState + xhr.status + xhr.responseText);
			}
		};
		xhr.open('POST', options.url, true);
		// Set standard Google APIs authentication header.
		xhr.setRequestHeader('Authorization', 'Bearer ' + options.token);
		sampleSupport.log(options.request);
		xhr.send(JSON.stringify(options.request));
	}

	function submit() {
		getAuthToken({
			'interactive': true,
			'callback': submitCallback,
		});
	}

	//submission button:
	//1. clears the previous inputs because the data will be saved
	//2. store all nputs into an array
	function submitCallback() {
		localStorage.clear()
		inputs = document.getElementsByTagName('input');
		for (index = 0; index < inputs.length; ++index) {
			if (inputs[index].getAttribute('id')) {
				console.log("here");
				if (inputs[index].getAttribute('type') == 'checkbox' && inputs[index].checked == true) {
					inputDictionary[inputs[index].getAttribute('id')] = "yes";
				} else {
					inputDictionary[inputs[index].getAttribute('id')] = inputs[index].value;
				}
			}
		}
	}



	function createSheet() {
		getAuthToken({
			'interactive': true,
			'callback': createSheetCallback,
		});
	}

	function createSheetCallback(token) {
		post({
			'url': 'https://script.googleapis.com/v1/scripts/' + SCRIPT_ID + ':run',
			'callback': executionAPIResponse,
			'token': token,
			'request': {
				'function': 'createGoogleSheetWithHeading',
			}
		});
	}

	function feedback() {
		getAuthToken({
			'interactive': true,
			'callback': feedbackCallback,
		});
	}

	function feedbackCallback(token) {
		post({
			'url': 'https://script.googleapis.com/v1/scripts/' + SCRIPT_ID + ':run',
			'callback': executionAPIResponse,
			'token': token,
			'request': {
				'function': 'feedbackEmail',
				'parameters': {}
			}
		});
	}

	return {
		onload: function () {
			signin_button = document.querySelector('#signin');
			signin_button.addEventListener('click', getAuthTokenInteractive);

			xhr_button = document.querySelector('#getxhr');
			xhr_button.addEventListener('click', sendDataToExecutionAPI.bind(xhr_button, true));

			revoke_button = document.querySelector('#revoke');
			revoke_button.addEventListener('click', revokeToken);

			exec_info_div = document.querySelector('#exec_info');
			exec_data = document.querySelector('#exec_data');
			exec_result = document.querySelector('#exec_result')

			submit_button = document.querySelector('#submit')
			submit_button.addEventListener('click', submit);

			create_button = document.querySelector('#createsheet');
			create_button.addEventListener('click', createSheet);

			feedback_button = document.querySelector('#feedback');
			feedback_button.addEventListener('click', feedback);

			// Trying to get access token without signing in, 
			// it will work if the application was previously 
			// authorized by the user.
			getAuthTokenSilent();
		}
	};
})();

window.onload = executionAPIExample.onload;