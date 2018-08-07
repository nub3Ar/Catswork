//A list of items that need to be saved 
var data_tracked = []
var tracking_method
var preferred_name
var gsheets_link

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


//saving the option on the page
function saveOptions () {
    console.log("saveOptions not implemented")
}


//erasing all options on the page

function erase_option()
{
    foreach (item in localStorage){
        localStorage.removeItem(item);
    }
    location.reload()
    console.log("all information deleted")
}







//page action js
jQuery(document).ready(function () {
    // Init Modal
    $('.modal').modal();
    $('.tooltipped').tooltip();
});