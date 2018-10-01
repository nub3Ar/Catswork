

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
	


});