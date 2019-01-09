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
	$('#submit').click(function() {
		if (localStorage.getItem('first_time_user') == false){
			$(this).prop('disabled', true).delay(1000);
			$('#submit_notif').show(1500).delay(1000);
			$('#submit_notif').hide(1500);
			$('#submit').prop('disabled', false);
		}
	})

	$('#step_1_complete').click(function() {
		$('#step_1_d').hide(1000);
	})

	$('#step_2_complete').click(function() {
		$('#step_2_d').hide(1000);
	})

	$('#step_3_complete').click(function() {
		if (localStorage.getItem('first_time_user') == 'true'){
			if (localStorage.getItem('tutorial_step') == 3){
				localStorage.removeItem('tutorial_step')
				$("#step_3_a").hide(1000);
				$("#step_3_b").hide(1000);
				$("#tutorial_complete").show(1500).delay(1000);
				$("#tutorial_complete").hide(1500);
				localStorage.setItem('first_time_user', false)
			}
		}	
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

	if (state = 'good'){

		if (localStorage.getItem('first_time_user') == 'false' | !localStorage.getItem('first_time_user')){
			tutorial_step = 'non_first_time_user'
		}
	
		else{
			if (localStorage.getItem('tutorial_step') == 1){
				tutorial_step = '1'
			}
			else if (localStorage.getItem('tutorial_step') == 2){
				tutorial_step = '2'
			}
			else if (localStorage.getItem('tutorial_step') == 3){
				tutorial_step = '3'
			}
			else{
				tutorial_step = 'non_first_time_user'
			}
		}
		switch (tutorial_step) {
			case ('non_first_time_user'):
				$("#step_1_a").hide();
				$("#step_1_b").hide();
				$("#step_1_c").hide();
				$("#step_1_d").hide();
				$("#step_2_a").hide();
				$("#step_2_b").hide();
				$("#step_2_d").hide();
				$("#step_3_a").hide();
				$("#step_3_b").hide();
				$("#tutorial_complete").hide();
				break;
			case ('1'):
				$("#step_1_a").show();
				$("#step_1_b").show();
				$("#step_1_c").show();
				$("#step_1_d").hide();
				$("#step_2_a").hide();
				$("#step_2_b").hide();
				$("#step_2_d").hide();
				$("#step_3_a").hide();
				$("#step_3_b").hide();
				$("#tutorial_complete").hide();
				var prefill_ids = ["nam3", "firm", "email", "phone", "industry", "city", "position", "education", "source", "alternative", "linkedin", "notes", "follow-up"]
				var tutorial_array = ["Catswork NU","CatsWork","catsworknu@gmail.com","(123)456-7899","Tech","Evanston","Server","NU","Career Fair","None","https://www.linkedin.com/company/catswork/","Friendly","no"]
				var index = 0;
				allInputs.each(function () {
					if (prefill_ids.includes($(this).attr('id'))){
						console.log($(this).attr('id'))
						console.log(tutorial_array[index])
						$(this).val(tutorial_array[index]);
						console.log($(this).val())
						index = index + 1;
					}
				});	
				break;
			case ('2'):
				$("#step_1_a").hide();
				$("#step_1_b").hide();
				$("#step_1_c").hide();
				$("#step_1_d").hide();
				$("#step_2_a").show();
				$("#step_2_b").show();
				$("#step_2_d").hide();
				$("#step_3_a").hide();
				$("#step_3_b").hide();
				$("#tutorial_complete").hide();
			break;
			case ('3'):
				$("#step_1_a").hide();
				$("#step_1_b").hide();
				$("#step_1_c").hide();
				$("#step_1_d").hide();
				$("#step_2_a").hide();
				$("#step_2_b").hide();
				$("#step_2_d").hide();
				$("#step_3_a").show();
				$("#step_3_b").show();
				$("#tutorial_complete").hide();
			default:
				$("#step_1_a").hide();
				$("#step_1_b").hide();
				$("#step_1_c").hide();
				$("#step_1_d").hide();
				$("#step_2_a").hide();
				$("#step_2_b").hide();
				$("#step_2_d").hide();
				$("#step_3_a").hide();
				$("#step_3_b").hide();
				$("#tutorial_complete").hide();
		}
	}

	


});