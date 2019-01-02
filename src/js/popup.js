//----------------------------------------------------------------------------------------------------------
//UI/UX, strictly use for front-end features

//Front-End JQuery
jQuery(document).ready(function () {
	//Front-end features
	var date = new Date();
	var monthNames = ["January", "February", "March", "April", "May", "June",
		"July", "August", "September", "October", "November", "December"
	];
	$(".datepicker").pickadate({
		format: 'mm/dd/yyyy',
		closeOnSelect: true,
		selectMonths: true,
		selectYears: 5,
	});

	$('input.autocomplete').autocomplete({
		data: JSON.parse(localStorage.getItem('names'))
	});

		//disabling user interaction until authentification (most button logics are in myapp.js)
	$('#submit_notif').hide();
	$('#create_notif').hide()


		//autosaving all of the inputs
	var allInputs = $(":input");
	allInputs.each(function (input) {
		$(this).blur(function (input) {
			if ($(this).attr("class") != "datepicker") {
				localStorage.setItem($(this).attr("id"), $(this).val());
			}
		});
		//autoloading all previous inputs from last session
		$(this).val(localStorage.getItem($(this).attr("id")));
	});

	if (localStorage.getItem('optionArray')){
		let optionArray = localStorage.getItem('optionArray').split(',')
		for (let i = 0; i<14; ++i){
			if(optionArray[i] == "no"){
				let name = '#field'+(i+1)
				console.log(name)
				$(name).hide()
			}
		}
	}

	//Submitted notification
	$('#submit').click(function () {
		$(this).prop('disabled', true).delay(1000);
		$('#submit_notif').show(1500).delay(1000);
		$('#submit_notif').hide(1500);
		$('#submit').prop('disabled', false);

	})

	//prefilling the date
	var today = (date.getMonth()+1) + '/' + date.getDate() + '/' + date.getFullYear();
	$("#date").val(today);
	//adding sheet URL to the href
	$('#opensheet').attr('href', localStorage.getItem('url'));
	$('#deletesheet').click(function () {
		localStorage.removeItem('url');
	})



	if (localStorage.getItem('token_exist') == 'false' | !localStorage.getItem('token_exist')){
		state = 'not logged in'
	}
	else{
		if (!localStorage.getItem('url')){
			state = 'no sheet'
		}
		else{
			state = 'good'
		}
	}
	switch (state) {
		case ('not logged in'):
			$("#log_in").show();
			$("#createsheet").hide();
			$("#catswork").hide();
			$("#bottom_tools").hide();
			break;
		case ('no sheet'):
			$("#log_in").hide();
			$("#createsheet").show();
			$("#catswork").hide();
			$("#bottom_tools").hide();
			break;
		default:
			$("#log_in").hide();
			$("#createsheet").hide();
	}


});