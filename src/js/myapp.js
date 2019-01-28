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

var executionAPIExample = (function () {
	var SCRIPT_ID = '1nPvptCpoQZKnaYCCzjs_dN4HldFucBUCpXJ9JYh0POK-cLPlenYP2KBT';
	var STATE_START = 1;
	var STATE_ACQUIRING_AUTHTOKEN = 2;
	var STATE_AUTHTOKEN_ACQUIRED = 3;
	
	var state = STATE_START;

	var submit_button, tutorial_finish_button;
	var get_linkedin_button;
	var names_dict_index;
	var inputArray = [];
	var sheet_link;
	var autoFill_row = 0;

	chrome.tabs.getSelected(null,function(tab) {
		var tablink = tab.url;
		if (tablink.includes('www.linkedin.com/in/')){
			document.getElementById("getlinkedin").hide()
		}
	});


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
				disableButton(get_linkedin_button);
				break;
			case STATE_ACQUIRING_AUTHTOKEN:
				disableButton(submit_button);
				disableButton(get_linkedin_button);
				break;
			case STATE_AUTHTOKEN_ACQUIRED:
				enableButton(submit_button);
				enableButton(get_linkedin_button);
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



	function getLinkedin() {
		if (localStorage.getItem('first_time_user') == false){
			disableButton(get_linkedin_button);
			chrome.tabs.executeScript(null, {
				file: "src/js/get_linkedin.js"
			}, function(results){
			console.log(results);
			getLinkedinCallback(results)
			});
		}
	}

	function getLinkedinCallback(data) {
		// passes the array to autofill
		autoFillLinkin({"response":{ 
			"@type": "type.googleapis.com/google.apps.script.v1.ExecutionResponse", 
			"result": {"status": "ok", "info": [[data]]}
		}});
		enableButton(get_linkedin_button);
		message.innerText = '';
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
				if (inputs[index].getAttribute('type') == 'checkbox') {
					if (inputs[index].checked == true){
						inputArray.push("Yes");
					}
					else{
						inputArray.push("No");
					}
				} 
				else {
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
					'submitRow': autoFill_row,
					'url': localStorage.getItem('url')
				}
			}
		});
	}

	function submitResponse(response) {
		console.log(response)
		enableButton(submit_button);
		var inputs = document.getElementsByTagName('input');
		for (let index = 0; index < inputs.length; ++index) {
			inputs[index].value = ""
		}
		if (localStorage.getItem('first_time_user') == 'true'){
			if (localStorage.getItem('tutorial_step') == 1){
				localStorage.setItem('tutorial_step', 2)
				$("#step_1_a").hide(1000);
				$("#step_1_b").hide(1000);
				$("#step_1_c").hide(1000);
				$("#step_1_d").show(1000);
				$("#step_2_a").show(1000);
				$("#step_2_b").show(1000);
				$("#submit_normal").attr('class','greyout')
				highlightLastLine();
			}
			else if (localStorage.getItem('tutorial_step') == 2){
				localStorage.setItem('tutorial_step', 3)
				$("#step_2_a").hide(1000);
				$("#step_2_b").hide(1000);
				$("#step_2_d").show(1000);
				$("#step_3_a").show(1000);
				$("#step_3_b").show(1000);
				$("#submit_normal").attr('class','greyout')
			}
		}
		getNames();
	}
	
	function getNames() {
        getAuthToken({
            'interactive': false,
            'callback': getNamesCallback,
        });
    }

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
			names_dict_index = {}
			console.log(names_list)
			for (var i = 1; i < names_list.length; i++){
				names_dict[names_list[i]] = null
				names_dict_index[names_list[i]] = i+1
			}
			var stringified_names_dict = JSON.stringify(names_dict);	
			console.log(stringified_names_dict)
			localStorage.setItem('names', stringified_names_dict);
		}
		$('input.autocomplete').autocomplete({
			data: JSON.parse(localStorage.getItem('names'))
		});
	}

	function autoFill() {
        getAuthToken({
            'interactive': false,
            'callback': autoFillCallback,
        });
    }

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
					'row': autoFill_row
				}
			}
		});
	}

	function autoFillResponse(response) {
		console.log(response)
		if (response.response.result.status == 'ok') {
			var info_list = JSON.parse(response.response.result.info);
			var allInputs = document.getElementsByTagName('input');
			console.log(allInputs.length, info_list.length);
			console.log(info_list);

			for (var i = 0; i < allInputs.length; i++){
				if (i == 10){
					var return_date = new Date(info_list[i]);
					allInputs[i].value = return_date.toLocaleDateString("en-US")
				}
				else{
					allInputs[i].value = info_list[i]
				}

			}
			document.getElementById("submit").innerHTML = "Update <i class='material-icons right'>send</i>"
		}
		else{
			console.log("Error")
		}
	}

	function autoFillLinkin(response) {
		console.log(response)
		if (response.response.result.status == 'ok') {
			var info_list = JSON.parse(response.response.result.info);
			var allInputs = document.getElementsByTagName('input');
			console.log(allInputs.length, info_list.length);
			console.log(info_list);

			for (var i = 0; i < allInputs.length; i++){
				if (i == 10){
					var return_date = new Date(info_list[i]);
					allInputs[i].value = return_date.toLocaleDateString("en-US")
				}
				else{
					allInputs[i].value = info_list[i]
				}

			}
		}
		else{
			console.log("Error")
		}
	}

	function deleteLastLine() {
        getAuthToken({
            'interactive': false,
            'callback': deleteLastLineCallback,
        });
    }

	function deleteLastLineCallback(token) {
		//posting to google appscript
		post({
			'url': 'https://script.googleapis.com/v1/scripts/' + SCRIPT_ID + ':run',
			'callback': deleteLastLineResponse,
			'token': token,
			'request': {
				'function': 'deleteLastLine',
				'parameters': {
					'url': localStorage.getItem('url')
				}
			}
		});
	}

	function deleteLastLineResponse(response) {
		if (response.response.result.status == 'ok') {
		}
		else{
			console.log(response.response.result.status)
		}
	}

	function highlightLastLine() {
        getAuthToken({
            'interactive': false,
            'callback': highlightLastLineCallback,
        });
    }

	function highlightLastLineCallback(token) {
		//posting to google appscript
		post({
			'url': 'https://script.googleapis.com/v1/scripts/' + SCRIPT_ID + ':run',
			'callback': highlightLastLineResponse,
			'token': token,
			'request': {
				'function': 'highlightLastLine',
				'parameters': {
					'url': localStorage.getItem('url')
				}
			}
		});
	}

	function highlightLastLineResponse(response) {
		if (response.response.result.status == 'ok') {
		}
		else{
			console.log(response.response.result.status)
		}
	}

	return {
		onload: function () {
			submit_button = document.querySelector('#submit')
			submit_button.addEventListener('click', submit.bind(submit_button, true));


			tutorial_finish_button = document.getElementById('finish_tutorial')
			tutorial_finish_button.addEventListener('click', deleteLastLine);

			get_linkedin_button = document.querySelector('#getlinkedin')
			get_linkedin_button.addEventListener('click', getLinkedin.bind(get_linkedin_button, true));
			chrome.runtime.onMessage.addListener(function(request, sender) {
				if (request.action == "getSource") {
				  message.innerText = request.source;
				}
			  });

			if (localStorage.getItem('url')){
				getNames();
			}

			document.getElementById("nam3").addEventListener("blur", function(){
				var autoFill_name = document.getElementById("nam3").value;
				console.log(autoFill_name)
				if (names_dict_index[autoFill_name]){
					autoFill_row = names_dict_index[autoFill_name]
					console.log(autoFill_row)
				}
				else{
					autoFill_row = 0
				}
				autoFill();


			});
			
			// Trying to get access token without signing in, 
			// it will work if the application was previously 
			// authorized by the user.
			getAuthTokenSilent();
		}
	};
})();

window.onload = executionAPIExample.onload;


