function install_notice() {

    var now = new Date().getTime();
    localStorage.clear()
    localStorage.setItem('install_time', now);

    localStorage.setItem('first_time_user', true);
    localStorage.setItem('tutorial_step', 1);
    localStorage.setItem('token_exist', "false")
    chrome.tabs.create({url: "src/html/options.html"});
}
install_notice();