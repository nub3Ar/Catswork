'use strict';

var inputArray = {};

//----------------------------------------------------------------------------------------------------------
//Barry's UI/UX

//Front-End JQuery
jQuery(document).ready(function () {
	//modal and datepicker
	var date = new Date();
	var monthNames = ["January", "February", "March", "April", "May", "June",
		"July", "August", "September", "October", "November", "December"
	];
	$(".datepicker").pickadate({
		selectMonths: true,
		selectYears: 15,
	});

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

	//prefilling the date
	var today = date.getDate() + " " + monthNames[date.getMonth()] + " ," + date.getFullYear();
	$("#date").val(today);

	//submission button:
	//1. clears the previous inputs because the data will be saved
	//2. store all nputs into an array
	$("#submit").click(function () {
		localStorage.clear();
		$(":input").each(function (input) {
			console.log($(this).attr("id"), $(this).val());
			if ($(this).attr('id')) {
				if ($(this).attr('type') == 'checkbox' && $(this).prop('checked')) {
					console.log("here")
					inputArray[$(this).attr("id")] = "yes";
				} else {
					inputArray[$(this).attr("id")] = $(this).val();
				}
			}
		});
	});

});