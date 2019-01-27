function install_notice() {

    var now = new Date().getTime();
    localStorage.clear()
    localStorage.setItem('install_time', now);

    localStorage.setItem('first_time_user', true);
    localStorage.setItem('tutorial_step', 1);
    localStorage.setItem('token_exist', "false")
    chrome.tabs.create({url: "src/html/options.html"});

    //startTimer();
}


install_notice();

// function startTimer() {
//     setInterval(displayNextImage, 1000);
// }

// function displayNextImage() {
//     x = (x === images.length - 1) ? 0 : x + 1;
//     chrome.browserAction.setIcon({path:"src/Image/catswork-favicon.png"});
// }

// chrome.runtime.onMessage.addListener(
//     function(request, sender, sendResponse) {
//         // read `newIconPath` from request and read `tab.id` from sender
//         chrome.browserAction.setIcon({
//             path: request.newIconPath,
//             tabId: sender.tab.id
//         });
//     });

