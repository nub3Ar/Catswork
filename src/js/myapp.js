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

	var submit_button;

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
				disableButton(submit_button);
				localStorage.setItem('token_exist', false)
				break;
			case STATE_ACQUIRING_AUTHTOKEN:
				disableButton(submit_button);
				break;
			case STATE_AUTHTOKEN_ACQUIRED:
				disableButton(submit_button);
				localStorage.setItem('token_exist', true)
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
			}
		} else {
			changeState(STATE_AUTHTOKEN_ACQUIRED);
		    if(localStorage.getItem('url')){
				enableButton(submit_button)
			}
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

		localStorage.removeItem('array');
		localStorage.setItem('array', inputArray)
		//posting to google appscript
		post({
			'url': 'https://script.googleapis.com/v1/scripts/' + SCRIPT_ID + ':run',
			'callback': submitResponse,
			'token': token,
			'request': {
				'function': 'submit',
				'parameters': {
					'data': [inputArray],
					'submitRow': autofill_row,
					'url': localStorage.getItem('url')
				}
			}
		});
	}

	function submitResponse(response) {
        enableButton(submit_button);
	}
	
	function getNames() {
        getAuthToken({
            'interactive': false,
            'callback': getNamesCallback,
        });
    }

	//submission button:
	//1. clears the previous inputs because the data will be saved
	//2. store all nputs into an array
	function getNamesCallback(token) {
		//posting to google appscript
		post({
			'url': 'https://script.googleapis.com/v1/scripts/' + SCRIPT_ID + ':run',
			'callback': getNamesResponse,
			'token': token,
			'request': {
				'function': 'getNames',
				'parameters': {
					'url': localStorage.getItem('url')
				}
			}
		});
	}

	function getNamesResponse(response) {
		if (response.response.result.status == 'ok') {
			var names_list = response.response.result.names_array;
			var names_dict = {};
			console.log(names_list)
			for (var i = 1; i < names_list.length; i++){
				names_dict[names_list[i]] = i+1;
			}
			var stringified_names_dict = JSON.stringify(names_dict);	
			console.log(stringified_names_dict)
			localStorage.setItem('names', stringified_names_dict);
		}
	}

	function autoFill() {
        getAuthToken({
            'interactive': false,
            'callback': autoFillCallback,
        });
    }

	//submission button:
	//1. clears the previous inputs because the data will be saved
	//2. store all nputs into an array
	function autoFillCallback(token) {
		//posting to google appscript
		post({
			'url': 'https://script.googleapis.com/v1/scripts/' + SCRIPT_ID + ':run',
			'callback': autoFillResponse,
			'token': token,
			'request': {
				'function': 'autoFill',
				'parameters': {
					'url': localStorage.getItem('url'),
					'row': autofill_row
				}
			}
		});
	}

	function autoFillResponse(response) {
		if (response.response.result.status == 'ok') {
			var info_list = response.response.result.info;
			var allInputs = document.getElementsByTagName('input');
			for (var i = 0; i < allInputs; i++){
				allInputs[i].value = info_list[i]
				document.getElementById("submit").innerHTML = "Update <i class='material-icons right'>send</i>"
			}
		}
	}

	return {
		onload: function () {
			submit_button = document.querySelector('#submit')
			submit_button.addEventListener('click', submit.bind(submit_button, true));

			if (localStorage.getItem('url')){
				getNames();
			}

			document.getElementById("nam3").blur(function(){
				autoFill();
				autoFill_name = document.getElementById("nam3").value;
				if (JSON.parse(localStorage.getItem("names"))[autoFill_name]){
					autoFill_row = JSON.parse(localStorage.getItem("names"))[autoFill_name]
				}
				autofill_row = 0

			});
			
			// Trying to get access token without signing in, 
			// it will work if the application was previously 
			// authorized by the user.
			getAuthTokenSilent();
		}
	};
})();

window.onload = executionAPIExample.onload;