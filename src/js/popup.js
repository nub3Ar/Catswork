jQuery(document).ready(function () {
	$(".modal").modal();
	$('.datepicker').pickadate({
		selectMonths: true,
		selectYears: 15
	});

	var allInputs = $(":input");
	allInputs.each(function (input) {
		$(this).blur(function (input) {
			localStorage.setItem($(this).attr('id'), $(this).val());
			console.log("hello")
		})
		$(this).val(localStorage.getItem($(this).attr('id')))
	})

	$('#submit').click(function () {
		localStorage.clear()
	})


});