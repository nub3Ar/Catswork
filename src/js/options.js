

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

document.getElementById('save').addEventListener('click',save_options)
