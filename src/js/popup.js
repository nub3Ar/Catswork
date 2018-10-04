//----------------------------------------------------------------------------------------------------------
//Barry's UI/UX, strictly use for front-end features

//Front-End JQuery
jQuery(document).ready(function () {
	//modal and datepicker
	var date = new Date();
	var monthNames = ["January", "February", "March", "April", "May", "June",
		"July", "August", "September", "October", "November", "December"
	];
	$(".datepicker").pickadate({
		format: 'dd/mm/yyyy',
		closeOnSelect: true,
		selectMonths: true,
		selectYears: 5,
	});


	//disabling user interaction until authentification (most button logics are in myapp.js)
	$('#submit_notif').hide();

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
		allInputs.each(function (input) {
			if ($(this).attr("id") != "date") {
				$(this).val("")
			}
		})
		$(this).prop('disabled', true).delay(1000);
		$('#submit_notif').show(1500).delay(1000);
		$('#submit_notif').hide(1500);
		$('#submit').prop('disabled', false);

	})




	//prefilling the date
	var today = date.getDate() + " " + monthNames[date.getMonth()] + " ," + date.getFullYear();
	$("#date").val(today);

	//adding sheet URL to the href
	$('#opensheet').attr('href', localStorage.getItem('url'));

});