chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({color: '#3aa757'}, function() {
      console.log("The color is green.");
    });
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([{
          conditions: [new chrome.declarativeContent.PageStateMatcher({
            pageUrl: {hostEquals: 'mail.google.com/mail/'},
          })
          ],
              actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
      });
  });


function CatsworkEmailAnalyserFunction(){
    var CatsworkEmailAnalyserObject = (function(){
        var MAX_LENGTH_TEXT = 250000;

        var CheckInfo = function(text) { 
            var checklist = 0;
                return;
         }

    })();
    return CatsworkEmailAnalyserObject;
}

