'use strict';

//A list of items that need to be saved
var data_tracked = [];
var tracking_method;
var prefered_name;
var gsheets_link;

//default settings
var default_tracked = ["Name", "Email", "Subject", "Date"];
var default_tracking_method = ["On-page manual tracking"];

//loading all of the default settings
function defaultOptions() {
  tracking_method = default_tracking_method;
  data_tracked = default_tracked;
}

//loading the option for user to see
function loadUseroptions() {
  defaultOptions();
  chrome.storage.local.get("gsheets_link", result => {
    gsheets_link = result[Object.keys(result)[0]]
  });
  chrome.storage.local.get("prefered_name", result => {
    prefered_name = result[Object.keys(result)[0]];
  });
}



//loading the option for backend usage
function loadBackendoptions() {
  console.log("loadBackendoptions not implemented");
}



//saving the option on the page, pass the ids of all of the fields
function saveOptions(data_id_list) {
  for (let i = 0; i < data_id_list.length; i++) {
    key = data_id_list[i].toString();
    value = document.getElementById(key).value;
    var obj = {};
    obj[key] = value;
    chrome.storage.local.set(obj);
  }
}



//erasing all options on the page
function erase_option() {
  Materialize.toast('Information deleted, Please reload the page', 3000);
  chrome.storage.local.clear(function () {
    console.log("all information deleted");
  });
}



//buttons enabling
document.addEventListener("DOMContentLoaded", function () {
  var basic_info = document.getElementById("basic_info_save");
  basic_info.addEventListener("click", function () {
    saveOptions(["prefered_name", "gsheets_link"]);
    console.log("info grabbed");
  });
});


document.addEventListener("DOMContentLoaded", function () {
  var erase = document.getElementById("confirm_erase");
  erase.addEventListener("click", erase_option);
});


//Preloading needed elements
//oadUseroptions();


//page action js
jQuery(document).ready(function () {
  // Init Modal

  $(".modal").modal();
  $(".tooltipped").tooltip();

  //loading local storage
  $("#gsheets_link").val(gsheets_link)
  $("#prefered_name").val(prefered_name)

});

// Authentication Functions

var authentication = (function () {

	var SCRIPT_ID = '1nPvptCpoQZKnaYCCzjs_dN4HldFucBUCpXJ9JYh0POK-cLPlenYP2KBT';
	var STATE_START = 1;
	var STATE_ACQUIRING_AUTHTOKEN = 2;
	var STATE_AUTHTOKEN_ACQUIRED = 3;

	var state = STATE_START;

	var signin_button, revoke_button, create_button, delete_button;

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
				disableButton(delete_button);
				disableButton(create_button);
				disableButton(revoke_button);
				break;
			case STATE_ACQUIRING_AUTHTOKEN:
				disableButton(signin_button);
				disableButton(delete_button);
				disableButton(create_button);
				disableButton(revoke_button);
				break;
			case STATE_AUTHTOKEN_ACQUIRED:
				disableButton(signin_button);
				enableButton(delete_button);
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
				disableButton(create_button)
			}
		} else {
			changeState(STATE_AUTHTOKEN_ACQUIRED);
		    if(localStorage.getItem('url')){
        enableButton(create_button)
        enableButton(delete_button)
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
enableButton(delete_button);
if (response.response.result.status == 'ok') {
  sheet_link = response.response.result.doc;
  localStorage.setItem('url', sheet_link)
  document.querySelector('#opensheet').setAttribute('href', localStorage.getItem('url'))

  }
}

function deleteSheet() {
  getAuthToken({
    'interactive': false,
    'callback': deleteSheetCallback,
  });
}
  
/**
* @param {string} token
*/
function deleteSheetCallback(token) {
   post({
  'url': 'https://script.googleapis.com/v1/scripts/' + SCRIPT_ID + ':run',
  'callback': deleteSheetResponse,
  'token': token,
  'request': {
      'function': 'deleteSheet',
    }
  });
}


function deleteSheetResponse(response) {
  disableButton(delete_button);
  enableButton(create_button);
  if (response.response.result.status == 'ok') {
    localStorage.removeItem('url')
    }
  }

	return {
		onload: function () {

			signin_button = document.querySelector('#signin');
			signin_button.addEventListener('click', getAuthTokenInteractive);

			revoke_button = document.querySelector('#revoke');
      revoke_button.addEventListener('click', revokeToken);
      
			create_button = document.querySelector('#createsheet');
      create_button.addEventListener('click', createSheet);
      
      delete_button = document.querySelector('#deletesheet');
      delete_button.addEventListener('click', deleteSheet)

			// Trying to get access token without signing in, 
			// it will work if the application was previously 
			// authorized by the user.
			getAuthTokenSilent();
		}
	};
})();

window.onload = authentication.onload;
