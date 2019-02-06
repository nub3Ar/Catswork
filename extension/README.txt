# Catswork
All time updates should be 24-hour military time in GMT 



07/14/18 8:30
This is the basic files you need to get started. I (Barry) will add front-end features from time-to-time. 


7/22/18 9:35
Structure update for cross-referencing the documents:

Please update this structure once a change is implemented (add it to the structure or mark the changes in the tree)

7/26/18
Modified popup.js and popup.html files to improve on the Sheets authentication and data sending procedure. Added box in options.js for user to input Sheets link.

Catswork

--src
    
----css
        
--------style.css
    
----html
        
--------options.html
        
--------popup.html
    
----Image
        
--------background.jpg
    
----js
        
--------inboxsdk.js (library file)
        
--------myapp.js
        
--------popup.js

--manifest.json

--README.md

8/1/18
Added sample_support.js and background.js files to the js folder.
Added client id in manifest.json. Unable to add a working key.
Authentication of chrome identity api is working.

8/2/18
Connected popup.js file and myapp.js file. Now the extracted info from emails are stored in global variables and can be accesssed in popup.js


7/26/18, Barry: Added modal to creating profile. Trying to fix eventlistener in option page

8/7/18, Barry: added local storage in option page. Not completed and not linked to front-end yet

8/11/18, Barry:
-Change data security options in manifest to enable inline script for local storage
-File interaction between front-end and localstorage is done for gsheet and name

8/14/18, Barry£º
-Change storage option from localstorage to chrome storage for variable sharing among the files

11/29/18 Alexis and Aletta learning github