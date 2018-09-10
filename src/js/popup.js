var inputArray = {};

//Front-End JQuery
jQuery(document).ready(function () {
	//modal and datepicker
	$(".modal").modal();
	$(".datepicker").pickadate({
		selectMonths: true,
		selectYears: 15
	});

	//autosaving all of the inputs
	var allInputs = $(":input");
	allInputs.each(function (input) {
		$(this).blur(function (input) {
			localStorage.setItem($(this).attr("id"), $(this).val());
		});
		//autoloading all previous inputs from last session
		$(this).val(localStorage.getItem($(this).attr("id")));
	});

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