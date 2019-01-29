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

	if (localStorage.getItem('optionArray')) {
		let optionArray = localStorage.getItem('optionArray').split(',')
		for (let i = 0; i < 14; ++i) {
			if (optionArray[i] == "no") {
				let name = '#field' + (i + 1)
				console.log(name)
				$(name).hide()
			}
		}
	}

	//Submitted notification
	$('#submit').click(function () {
		if (localStorage.getItem('first_time_user') == false) {
			$(this).prop('disabled', true).delay(1000);
			$('#submit_notif').show(1500).delay(1000);
			$('#submit_notif').hide(1500);
			$('#submit').prop('disabled', false);
		}
	})

	$('#getlinkedin').click(function () {
		if (localStorage.getItem('first_time_user')) {
			$('#step_1_b').hide(1000)
			$('#step_1_b2').show(1000).delay(1000);
			var prefill_ids = ["nam3", "firm", "email", "phone", "industry", "city", "position", "education", "source", "alternative", "linkedin", "notes", "follow-up"]
			var tutorial_array = ["Catherine Work", "CatsWork", "catswork2019@gmail.com", "(123)456-7890", "Information Services", "Greater Chicago Area", "Data Analyst", "Northwestern University", "LinkedIn", "catsworknu@gmail.com", "https://www.linkedin.com/in/catherine-work-25660117a/", "Phone Interview", "no"]
			var index = 0;
			allInputs.each(function () {
				if (prefill_ids.includes($(this).attr('id'))) {
					console.log($(this).attr('id'))
					console.log(tutorial_array[index])
					$(this).val(tutorial_array[index]);
					console.log($(this).val())
					index = index + 1;
				}
			});
			localStorage.setItem('opened_extension', true)
			chrome.tabs.update({
				url: "src/html/options.html"
			})
		}
	})

	$('#step_1_complete').click(function () {
		$('#step_1_d').hide();
		$('#step_1_b2').hide();
		$("#submit_normal").attr('class', 'submit_normal')
	})

	$('#step_2_complete').click(function () {
		$('#step_2_d').hide();
		$("#submit_normal").attr('class', 'submit_normal')
		$("#catstrack").attr('class', 'greyout');
		$("#catschat").attr('class', 'normal');
	})

	$('#step_3_complete').click(function () {
		$("#finish_tutorial").show();
	})

	$('#finish_tutorial').click(function () {
		if (localStorage.getItem('first_time_user') == 'true') {
			if (localStorage.getItem('tutorial_step') == 3) {
				localStorage.removeItem('tutorial_step')
				$("#step_3_a").hide(1000);
				$("#step_3_b").hide(1000);
				$("#tutorial_complete").show(1500).delay(200000);
				$("#tutorial_complete").hide(1500);
				localStorage.setItem('first_time_user', false)
				$("#catstrack").attr('class', 'normal');
				$("#footer").attr('class', 'normal');
				$('#finish_tutorial').hide(1000)
			}
		}
	})

	//prefilling the date
	var today = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
	$("#date").val(today);
	//adding sheet URL to the href
	$('#opensheet').attr('href', ('https://docs.google.com/spreadsheets/d/' + localStorage.getItem(localStorage.getItem('current_user'))));
	$('#deletesheet').click(function () {
		localStorage.removeItem(localStorage.getItem('current_user'));
	})



	if (localStorage.getItem('token_exist') == 'false' | !localStorage.getItem('token_exist')) {
		state = 'not logged in'
	} else {
		if (!localStorage.getItem(localStorage.getItem('current_user'))) {
			state = 'no sheet'
		} else {
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

	if (state == 'good') {

		if (localStorage.getItem('first_time_user') == 'false' | !localStorage.getItem('first_time_user')) {
			tutorial_step = 'non_first_time_user'
		} else {
			if (localStorage.getItem('tutorial_step') == 1) {
				tutorial_step = '1'
			} else if (localStorage.getItem('tutorial_step') == 2) {
				tutorial_step = '2'
			} else if (localStorage.getItem('tutorial_step') == 3) {
				tutorial_step = '3'
			} else {
				tutorial_step = 'non_first_time_user'
			}
		}
		switch (tutorial_step) {
			case ('non_first_time_user'):
				$("#linkedin_sample").hide();
				$("#step_1_a").hide();
				$("#step_1_b").hide();
				$("#step_1_b2").hide();
				$("#step_1_c").hide();
				$("#step_1_d").hide();
				$("#step_2_a").hide();
				$("#step_2_b").hide();
				$("#step_2_d").hide();
				$("#step_3_a").hide();
				$("#step_3_b").hide();
				$('#finish_tutorial').hide()
				$("#tutorial_complete").hide();

				chrome.tabs.getSelected(null, function (tab) {
					var tablink = tab.url;
					if (!tablink.includes('www.linkedin.com/in/')) {
						$('#getlinkedin').hide()

					}
				});
				break;
			case ('linkedin'):

			case ('1'):
				$("#step_1_linkedin").show();
				$("#step_1_a").hide();
				$("#step_1_b").hide();
				$("#step_1_b2").hide();
				$("#step_1_c").show();
				$("#step_1_d").hide();
				$("#step_2_a").hide();
				$("#step_2_b").hide();
				$("#step_2_d").hide();
				$("#step_3_a").hide();
				$("#step_3_b").hide();
				$("#tutorial_complete").hide();
				$("#catschat").attr('class', 'greyout');
				$("#catschat-collapse").prop('disabled', true);
				$("#footer").attr('class', 'greyout');
				$('#finish_tutorial').hide()
				$("#linkedin_sample").click(function () {
					chrome.tabs.update({
						url: "https://www.linkedin.com/in/catherine-work-25660117a/"
					})

					$('#step_1_linkedin').hide()
					$("#step_1_a").show();
					$("#step_1_b").show();
				})
				// var prefill_ids = ["nam3", "firm", "email", "phone", "industry", "city", "position", "education", "source", "alternative", "linkedin", "notes", "follow-up"]
				// var tutorial_array = ["Catherine Work", "CatsWork", "catswork2019@gmail.com", "(123)456-7890", "Information Services", "Greater Chicago Area", "Data Analyst", "Northwestern University", "LinkedIn", "catsworknu@gmail.com", "https://www.linkedin.com/in/catherine-work-25660117a/", "Phone Interview", "no"]
				// var index = 0;
				// allInputs.each(function () {
				// 	if (prefill_ids.includes($(this).attr('id'))) {
				// 		console.log($(this).attr('id'))
				// 		console.log(tutorial_array[index])
				// 		$(this).val(tutorial_array[index]);
				// 		console.log($(this).val())
				// 		index = index + 1;
				// 	}
				// });
				break;
			case ('2'):
				$("#linkedin_sample").hide();
				$('#getlinkedin').hide()
				$("#step_1_a").hide();
				$("#step_1_b").hide();
				$("#step_1_b2").hide();
				$("#step_1_c").hide();
				$("#step_1_d").hide();
				$("#step_2_a").show();
				$("#step_2_b").show();
				$("#step_2_d").hide();
				$("#step_3_a").hide();
				$("#step_3_b").hide();
				$("#tutorial_complete").hide();
				$("#catschat").attr('class', 'greyout');
				$("#catschat-collapse").attr('disabled', true);
				$("#footer").attr('class', 'greyout');
				$('#finish_tutorial').hide()
				break;
			case ('3'):
				$("#linkedin_sample").hide();
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
				$("#catstrack").attr('class', 'greyout');
				$("#footer").attr('class', 'greyout');
				$('#finish_tutorial').hide()
				break;
			default:
				$("#linkedin_sample").hide();
				$("#step_1_a").hide();
				$("#step_1_b").hide();
				$("#step_1_b2").hide();
				$("#step_1_c").hide();
				$("#step_1_d").hide();
				$("#step_2_a").hide();
				$("#step_2_b").hide();
				$("#step_2_d").hide();
				$("#step_3_a").hide();
				$("#step_3_b").hide();
				$("#tutorial_complete").hide();
				$('#finish_tutorial').hide()
				chrome.tabs.getSelected(null, function (tab) {
					var tablink = tab.url;
					if (!tablink.includes('www.linkedin.com/in/')) {
						$('#getlinkedin').hide()
					}
				});
		}
	}




});