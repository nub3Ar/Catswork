//----------------------------------------------------------------------------------------------------------
//Barry's UI/UX, strictly use for front-end features

//Front-End JQuery
jQuery(document).ready(function () {
	//modal and datepicker
	if (!localStorage.getItem('token_exist')){
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
			$("catswork").hide();
			break;
		case ('no sheet'):
			$("#log_in").hide();
			$("#createsheet").show();
			$("catswork").hide();
			break;
		default:
			$("#log_in").hide();
			$("#createsheet").hide();
			var date = new Date();
			var monthNames = ["January", "February", "March", "April", "May", "June",
				"July", "August", "September", "October", "November", "December"
				];


			// $('#name').change(function () {
			// 	const value = $('#name').val()
			// 	const results = DATALIST.filter(function (element) {
			// 	return element.includes(value)
			// 	})
			// 	const html = results.map(function (element) {
			// 	return <div>${element}</div>
			// 	}).join('')
			// 	('#div#results').html(html)
			// })

			$(".datepicker").pickadate({
				format: 'mm/dd/yyyy',
				closeOnSelect: true,
				selectMonths: true,
				selectYears: 5,
			});

			//disabling user interaction until authentication (most button logics are in myapp.js)
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

			//Submitted notification
			$('#submit').click(function () {
				$(this).prop('disabled', true).delay(1000);
				$('#submit_notif').show(1500).delay(1000);
				$('#submit_notif').hide(1500);
				$('#submit').prop('disabled', false);

			})

			//prefilling the date
			var today = monthNames[date.getMonth()] + " " + date.getDate() + " ," + date.getFullYear();
			$("#date").val(today);

			//adding sheet URL to the href
			$('#opensheet').attr('href', localStorage.getItem('url'));

			// $('#deletesheet').click(function () {
			// 	localStorage.removeItem('url');
			// })

			}

});