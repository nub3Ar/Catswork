function install_notice() {

    var now = new Date().getTime();
    localStorage.setItem('install_time', now);
    chrome.tabs.create({url: "src/html/options.html"});

    localStorage.setItem('first_time_user', true);
    localStorage.setItem('tutorial_step', 1);
    localStorage.setItem('token_exist', "false")
}
install_notice();