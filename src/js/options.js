//A list of items that need to be saved
var data_tracked = [];
var tracking_method;
var preferred_name;
var gsheets_link;

//default settings
var default_tracked = ["Name", "Email", "Subject", "Date"];
var default_tracking_method = ["On-page manual tracking"];

//loading all of the default settings
function defaultOptions() {
    tracking_method = default_tracking_method;
    data_tracked = default_tracked;
}

//loading the option for user to see
function loadUseroptions() {
    defaultOptions();
    if (localStorage.tracking_method != null) {
        tracking_method = localStorage.tracking_method;
    }

    if (localStorage.data_tracked != null) {
        data_tracked = localStorage.tracking_method;
    }

    preferred_name = localStorage.preferred_name;
    gsheets_link = localStorage.gsheets_link;
}

//loading the option for backend usage
function loadBackendoptions() {
    console.log("loadBackendoptions not implemented");
}

//saving the option on the page, pass the ids of all of the fields 
function saveOptions(data_id_list) {
    console.log(data_id_list)
    for (let i = 0; i < data_id_list.length; i++) {

        field_name = data_id_list[i]
        field_value = document.getElementById(field_name).value
        localStorage[field_name] = field_value
        console.log(field_name, field_value)
        console.log(localStorage[field_name])
    }

}

//erasing all options on the page

function erase_option() {
    localStorage.clear();
    location.reload();
    console.log("all information deleted");
}


//buttons enabling
document.addEventListener('DOMContentLoaded', function () {
    var basic_info = document.getElementById('basic_info_save');
    basic_info.addEventListener('click', function () {
        saveOptions(['prefered_name', 'gsheets_link'])
        console.log("info grabbed")
    }, )
})

document.addEventListener('DOMContentLoaded', function () {
    var erase = document.getElementById('confirm_erase');
    erase.addEventListener('click', erase_option)
})


//page action js
jQuery(document).ready(function () {
    // Init Modal
    $(".modal").modal();
    $(".tooltipped").tooltip();

    //loading local storage
    $('#prefered_name').val(localStorage.prefered_name);
    $('#gsheets_link').val(localStorage.gsheets_link);
});