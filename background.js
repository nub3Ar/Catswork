function install_notice() {

    var now = new Date().getTime();
<<<<<<< HEAD
    localStorage.clear()
=======
>>>>>>> 6dd7b49c7c184c1053156a2637095aacbb5307bf
    localStorage.setItem('install_time', now);
    chrome.tabs.create({url: "src/html/options.html"});

    localStorage.setItem('first_time_user', true);
    localStorage.setItem('tutorial_step', 1);
<<<<<<< HEAD
    localStorage.setItem('token_exist', "false")
=======
>>>>>>> 6dd7b49c7c184c1053156a2637095aacbb5307bf
}
install_notice();