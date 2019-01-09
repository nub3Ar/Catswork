'use strict';
//page action js
jQuery(document).ready(function () {

	$('.modal').modal();
	$('#loading').hide();
	//no token
	if (localStorage.getItem('token_exist') == "false") {
		$('#dashboard').hide()
		$('#login').show()
		$('#create').hide()
		console.log('no')
	} else {
		//yes token, no sheet
		if (!localStorage.getItem('url')) {
			$('#login').hide()
			$('#dashboard').hide()
			$('#create').show()
			$('#sheet_iframe').hide()
			console.log("yes, no")
		}
		//yes token, yes sheet
		else {
			$('#login').hide()
			$('#dashboard').show()
			$('#create').hide()
			console.log("yes, yes")
		}
	}



	$('#sheet_iframe').attr('src', localStorage.getItem('url'))
	if (localStorage.getItem('optionArray')) {
		let optionArray = localStorage.getItem('optionArray').split(',')
		for (let i = 0; i < 14; ++i) {
			let name = '#option' + (i + 1)
			if (optionArray[i] == 'no') {
				$(name).prop('checked', false);
			}
		}
	}
})

// Authentication Functions
let authentication = (function () {
	let SCRIPT_ID = '1nPvptCpoQZKnaYCCzjs_dN4HldFucBUCpXJ9JYh0POK-cLPlenYP2KBT';
	let login_state = 2
	let signin_button, revoke_button, delete_button, delete_trigger, setting_button, create_button;


	function getAuthToken(options) {
		chrome.identity.getAuthToken({
			'interactive': options.interactive
		}, options.callback);
	}

	function getAuthTokenSilent() {
		login_state = "silent"
		getAuthToken({

			'interactive': false,
			'callback': getAuthTokenCallback,
		});
	}

	function getAuthTokenInteractive() {
		login_state = "active"
		getAuthToken({
			'interactive': true,
			'callback': getAuthTokenCallback,
		});
	}

	function getAuthTokenCallback(token) {
		// Catch chrome error if user is not authorized.
		if (chrome.runtime.lastError) {
		} else {
			Materialize.toast('Login successful!', 3000);
			localStorage.setItem('token_exist', true);
			if (localStorage.getItem('url')) {
				$('#sheet_iframe').show()
			}
			if (login_state == "active")
			{
				createSheet();
				$('#loading').show()
				setTimeout(() => {
					window.location.reload()
				}, 1000);
			}

		}
	}

	function revokeToken() {
		getAuthToken({
			'interactive': false,
			'callback': revokeAuthTokenCallback,
		});
	}

	function revokeAuthTokenCallback(current_token) {
		if (!chrome.runtime.lastError) {

			// Remove the local cached token
			chrome.identity.removeCachedAuthToken({
				token: current_token
			}, function () {});

			// Make a request to revoke token in the server
			let xhr = new XMLHttpRequest();
			xhr.open('GET', 'https://accounts.google.com/o/oauth2/revoke?token=' +
				current_token);
			xhr.send();
			// Update the user interface accordingly
			$('#loading').show().delay(1000)
			$('#loading').hide(1000)
			$('#sheet_iframe').hide();
			$('#dashboard').hide()
			$('#login').show()
			$('#create').hide()
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
		let xhr = new XMLHttpRequest();
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

	function createSheet() {
		getAuthToken({
			'interactive': false,
			'callback': createSheetCallback,
		});
	}

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
		if (response.response.result.status == 'ok') {
			console.log(response.response.result.url);
			localStorage.setItem('url', response.response.result.url);
			localStorage.setItem('id', response.response.result.id);
			Materialize.toast("Sheet Creation successful!")
			$('#loading').show()
			setTimeout(() => {
				window.location.reload()
			}, 1000);
			
		}
	}

	function userSetting() {
		getAuthToken({
			'interactive': false,
			'callback': userSettingCallback,
		});
	}

	function userSettingCallback(token) {
		let option_array = [];
		let inputs = document.getElementsByTagName('input');
		for (let index = 0; index < inputs.length; ++index) {
			if (inputs[index].getAttribute('id') && inputs[index].getAttribute('id').includes('option')) {
				if (inputs[index].checked == true) {
					option_array.push(inputs[index].value)
				} else {
					option_array.push("no")
				}
				localStorage.setItem('optionArray', option_array);
			}
		}

		post({
			'url': 'https://script.googleapis.com/v1/scripts/' + SCRIPT_ID + ':run',
			'callback': userSettingResponse,
			'token': token,
			'request': {
				'function': 'settingColumns',
				'parameters': {
					'option_array': option_array,
					'url': localStorage.getItem('url')
				}
			}
		});
	}

	function userSettingResponse(response) {
		console.log(response.response.result.status)
	}

	function deleteSheet() {
		getAuthToken({
			'interactive': false,
			'callback': deleteSheetCallback,
		});
	}

	function deleteSheetCallback(token) {
		post({
			'url': 'https://script.googleapis.com/v1/scripts/' + SCRIPT_ID + ':run',
			'callback': deleteSheetResponse,
			'token': token,
			'request': {
				'function': 'deleteSheet',
				'parameters': {
					'sheet_id': localStorage.getItem('id')
				}
			}
		});
	}

	function deleteSheetResponse(response) {
		if (response.response.result.status == 'ok') {
			Materialize.toast('Information deleted. Page reloading...', 3000);
			localStorage.removeItem('url');
			localStorage.removeItem('id');
			localStorage.removeItem('optionArray');
			$('#loading').show()
			setTimeout(() => {
				window.location.reload()
			}, 1000);

		} else {
			Materialize.toast('Deletion Error. Please Try Again', 3000);
		}
	}

	return {
		onload: function () {

			signin_button = document.querySelector('#signin');
			signin_button.addEventListener('click', getAuthTokenInteractive);

			revoke_button = document.querySelector('#revoke');
			revoke_button.addEventListener('click', revokeToken);
			revoke_button.addEventListener('click', function () {
				localStorage.setItem('token_exist', "false")
			})

			delete_trigger = document.querySelector('#deletesheet_btn');
			delete_button = document.querySelector('#deletesheet')
			delete_button.addEventListener('click', deleteSheet)

			setting_button = document.querySelector('#save_setting')
			setting_button.addEventListener('click', userSetting)

			create_button = document.querySelector('#createsheet')
			create_button.addEventListener('click', createSheet)

			// Trying to get access token without signing in, 
			// it will work if the application was previously 
			// authorized by the user.
			getAuthTokenSilent();
		}
	};
})();

window.onload = authentication.onload;