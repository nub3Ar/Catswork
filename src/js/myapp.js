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
var inputArray = []
var sheet_link;

var executionAPIExample = (function () {

	var SCRIPT_ID = '1nPvptCpoQZKnaYCCzjs_dN4HldFucBUCpXJ9JYh0POK-cLPlenYP2KBT';
	var STATE_START = 1;
	var STATE_ACQUIRING_AUTHTOKEN = 2;
	var STATE_AUTHTOKEN_ACQUIRED = 3;

	var state = STATE_START;

	var signin_button, revoke_button, create_button, submit_button;

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
				disableButton(create_button);
				disableButton(revoke_button);
				break;
			case STATE_ACQUIRING_AUTHTOKEN:
				disableButton(signin_button);
				disableButton(submit_button);
				disableButton(create_button);
				disableButton(revoke_button);
				break;
			case STATE_AUTHTOKEN_ACQUIRED:
				disableButton(signin_button);
				disableButton(submit_button);
				enableButton(create_button);
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
		chrome.identity.getAuthToken({
			'interactive': options.interactive
		}, options.callback);
	}

	/**
	 * Get users access_token in background with now UI prompts.
	 */
	function getAuthTokenSilent() {
		getAuthToken({

			'interactive': false,
			'callback': getAuthTokenCallback,
		});
	}

	/**
	 * Get users access_token or show authorize UI if access has not been granted.
	 */
	function getAuthTokenInteractive() {
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
			changeState(STATE_START);
			if(localStorage.getItem('url')){
				enableButton(submit_button)
				disableButton(create_button)
			}
		} else {
			changeState(STATE_AUTHTOKEN_ACQUIRED);
		    if(localStorage.getItem('url')){
				enableButton(submit_button)
				disableButton(create_button)
			}
		}
	}
	
	/**
	 * Revoking the access token.
	 */
	function revokeToken() {
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
			} else if (xhr.readyState === 4 && xhr.status !== 200) {}
		};
		xhr.open('POST', options.url, true);
		// Set standard Google APIs authentication header.
		xhr.setRequestHeader('Authorization', 'Bearer ' + options.token);
		xhr.send(JSON.stringify(options.request));
	}

	function submit() {
        disableButton(submit_button);
        getAuthToken({
            'interactive': false,
            'callback': submitCallback,
        });
    }

	//submission button:
	//1. clears the previous inputs because the data will be saved
	//2. store all nputs into an array
	function submitCallback(token) {
		inputArray = [];
		var inputs = document.getElementsByTagName('input');
		for (let index = 0; index < inputs.length; ++index) {
			if (inputs[index].getAttribute('id')) {
				if (inputs[index].getAttribute('type') == 'checkbox' && inputs[index].checked == true) {
					inputArray.push("yes");
				} else {
					inputArray.push(inputs[index].value);
				}
			}
			localStorage.removeItem(inputs[index].getAttribute('id'));
		}
		//posting to google appscript
		post({
			'url': 'https://script.googleapis.com/v1/scripts/' + SCRIPT_ID + ':run',
			'callback': submitResponse,
			'token': token,
			'request': {
				'function': 'submit',
				'parameters': {
					'data': [inputArray],
					'url': localStorage.getItem('url')
				}
			}
		});
	}

	function submitResponse(response) {
        enableButton(submit_button);
    }

	function createSheet() {
        getAuthToken({
            'interactive': false,
            'callback': createSheetCallback,
        });
    }
	/**
	* @param {string} token
	*/
    function createSheetCallback(token) {
        post({
            'url': 'https://script.googleapis.com/v1/scripts/' + SCRIPT_ID + ':run',
            'callback': createSheetResponse,
            'token': token,
            'request': {
                'function': 'createSheet',
            }
        });
    }

    function createSheetResponse(response) {
		disableButton(create_button);
		enableButton(submit_button);
		if (response.response.result.status == 'ok') {
			sheet_link = response.response.result.doc;
			localStorage.setItem('url', sheet_link)
			document.querySelector('#opensheet').setAttribute('href', localStorage.getItem('url'))

		}
    }


	function deleteSheet(){
		localStorage.removeItem('url')
	}


	return {
		onload: function () {

			signin_button = document.querySelector('#signin');
			signin_button.addEventListener('click', getAuthTokenInteractive);

			revoke_button = document.querySelector('#revoke');
			revoke_button.addEventListener('click', revokeToken);

			submit_button = document.querySelector('#submit')
			submit_button.addEventListener('click', submit.bind(submit_button, true));

			create_button = document.querySelector('#createsheet');
			create_button.addEventListener('click', createSheet);


			// Trying to get access token without signing in, 
			// it will work if the application was previously 
			// authorized by the user.
			getAuthTokenSilent();
		}
	};
})();

window.onload = executionAPIExample.onload;