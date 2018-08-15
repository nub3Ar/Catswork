//A list of items that need to be saved
var data_tracked = [];
var tracking_method;
var prefered_name;
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
  if (
    chrome.storage.local.get(["tracking_method"], function(result) {
      console.log(result);
    }) != null
  ) {
    tracking_method = chrome.storage.local.get(["tracking_method"], function(
      result
    ) {
      console.log(result);
    });
  }

  if (
    chrome.storage.local.get(["data_tracked"], function(result) {
      console.log(result);
    }) != null
  ) {
    data_tracked = chrome.storage.local.get(["data_tracked"], function(result) {
      console.log(result);
    });
  }

  prefered_name = chrome.storage.local.get(["prefered_name"], function(result) {
    console.log(result);
  });
  gsheets_link = chrome.storage.local.get(["gsheets_link"], function(result) {
    console.log(result);
  });
}

//loading the option for backend usage
function loadBackendoptions() {
  console.log("loadBackendoptions not implemented");
}

//saving the option on the page, pass the ids of all of the fields
function saveOptions(data_id_list) {
  for (let i = 0; i < data_id_list.length; i++) {
    key = data_id_list[i].toString();
    console.log(key);
    value = document.getElementById(key).value;
    var obj = {};
    obj[key]=value;
    chrome.storage.local.set(obj);
  }
}

//erasing all options on the page

function erase_option() {
  chrome.storage.local.clear(function() {
    console.log("all information deleted");
  });
  location.reload();
}

//buttons enabling
document.addEventListener("DOMContentLoaded", function() {
  var basic_info = document.getElementById("basic_info_save");
  basic_info.addEventListener("click", function() {
    saveOptions(["prefered_name", "gsheets_link"]);
    console.log("info grabbed");
  });
});

document.addEventListener("DOMContentLoaded", function() {
  var erase = document.getElementById("confirm_erase");
  erase.addEventListener("click", erase_option);
});

//page action js
jQuery(document).ready(function() {
  // Init Modal
  $(".modal").modal();
  $(".tooltipped").tooltip();

  //loading local storage
  if (
    chrome.storage.local.get(["gsheets_link"], function(result) {
      console.log(result);
    }) != null
  ) {
    $("#gsheets_link").val(chrome.storage.local.get(["gsheets_link"]));
  }
  if (
    chrome.storage.local.get(["prefered_name"], function(result) {
      console.log(result);
    }) != null
  ) {
    $("#prefered_name").val(chrome.storage.local.get(["gsheets_link"]));
  }
});
