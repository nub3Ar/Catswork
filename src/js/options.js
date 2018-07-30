jQuery(document).ready(function () {
    // Init Modal
    $('.modal').modal();
    $('.tooltipped').tooltip();
    
}); 

function save_options(){
    var sheetsLink = document.getElementById('sheetsLink').value;
    chrome.storage.sync.set({
        GsheetsLink:sheetsLink
    },function(){
        //Updates  status
        var status = document.getElementById('status');
        status.textContent='Options saved.';
        setTimeout(function(){
            status.textContent='';

        }, 750);
    });
}


