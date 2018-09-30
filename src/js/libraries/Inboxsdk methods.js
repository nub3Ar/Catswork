//Initialize Global variables for storage of extracted data
//Two dictionaries: sent_info_dict & receive_info_dict
var sent_info_dict = new Object;
var sent_info_dict = {};
var receive_info_dict = new Object;
var receive_info_dict = {};
sent_info_dict.contact = [{'emailAddress': '', 'name': ''}, '']
sent_info_dict.time = ''
sent_info_dict.name = ''
sent_info_dict.company = ''
sent_info_dict.position = ''
sent_info_dict.note = ''
receive_info_dict.sender = ''
receive_info_dict.receivetime = ''

//Global variable for storing the current selected text
var selected_text = ''

console.log(localStorage.prefered_name)


// newdiv = document.createElement('div');   //create a div
// newdiv.id = 'newid';                      //add an id
// body.appendChild(newdiv);                 //append to the doc.body
// body.insertBefore(newdiv,body.firstChild) //OR insert it

// var HTML_status_bar = document.getElementById("status_bar")
// var HTML_status_bar2 = document.getElementById("#status_bar")
// console.log(HTML_status_bar)
// console.log(HTML_status_bar2)
// document.getElementById("test").innerHTML = "changed"
// console.log(document.getElementById("test").innerHTML)

// All functions using InboxSDK api
InboxSDK.load(2, 'sdk_Catworks_b73c68555a').then(function (sdk) {
  // ComposeView Modifier
  sdk.Compose.registerComposeViewHandler(function (composeView) {

      composeView.addButton({
          title: "Email Destination",
          iconUrl: "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQxFoh469eOsZQkuPOLpZn3R6yyIExkZCxOxf4ywfeY3v330EwP3Q",
          onClick: function (event) {
            if (typeof event.composeView.getToRecipients()[0] != "undefined"){
              sent_info_dict.contact = event.composeView.getToRecipients();
            }

            console.log('Email Destination:')
            console.log(sent_info_dict.contact[0].emailAddress);

            var curr_time = Date()
            var curr_time_array = curr_time.toString().split(" ")
            sent_info_dict.time = curr_time_array.splice(1,4).join(' ')



            console.log('Current Time:')
            console.log(sent_info_dict.time);
            //sent_info_dict.subject = event.composeView.getSubject()
            //sent_info_dict.htmlcontent = event.composeView.getHTMLContent();
            //sent_info_dict.textcontent = event.composeView.getTextContent()

            // console.log('Email Destination Name:')
            // console.log(sent_info_dict.contact[0].name);
      
            // console.log('Email Subject:')
            // console.log(sent_info_dict.subject);
            // console.log('Email Body - HTML')
            // console.log(sent_info_dict.htmlcontent);
            // console.log('Email Body - TEXT')
            // console.log(sent_info_dict.textcontent);
          },
      });

      composeView.addButton({
        title: "Name",
        iconUrl: chrome.extension.getURL("src/Image/name-button.jpg"),
        onClick: function (event) {
          sent_info_dict.name = composeView.getSelectedBodyText()
          console.log('Name:')
          console.log(sent_info_dict.name);
        },
      });

      composeView.addButton({
        title: "Company",
        iconUrl: "https://ibb.co/jqGdkz",
        onClick: function (event) {
          sent_info_dict.company = composeView.getSelectedBodyText()
          console.log('Company:')
          console.log(sent_info_dict.company);
        },
      });

      composeView.addButton({
        title: "Position",
        iconUrl: chrome.extension.getURL("src/Image/CatsWork_logo.png"),
        onClick: function (event) {
          sent_info_dict.position = composeView.getSelectedBodyText()
          console.log('Position:')
          console.log(sent_info_dict.position);
        },
      });

      composeView.addButton({
        title: "Note",
        iconUrl: "/src/Image/note-button.jpg",
        onClick: function (event) {
          sent_info_dict.note = composeView.getSelectedBodyText()
          console.log('Note:')
          console.log(sent_info_dict.note);
        },
      });
  });

  // Functions to be run after an email is successfully sent
  sdk.Compose.registerComposeViewHandler(function (composeView) {

      composeView.on('sent', function (event) {
        // message sent successfully
        console.log("Message sent successfully.");
        // print info
        // console.log(sent_info_dict.contact);
        // console.log('Email Destination Name:')
        // console.log(sent_info_dict.contact[0].name);
        console.log('Email Destination:')
        console.log(sent_info_dict.contact[0].emailAddress);
        // console.log('Email Subject:')
        // console.log(sent_info_dict.subject);
        // console.log('Email Body:')
        // console.log(sent_info_dict.htmlcontent);
        // console.log(sent_info_dict.textcontent);
      });
  });

  // Build Status Bar in ComposeView
  sdk.Compose.registerComposeViewHandler(function (composeView) {

    var status_bar = composeView.addStatusBar({
      height: 60,
      orderHint: 0
    });

    var name_button = document.createElement("button")
    name_button.innerHTML = 'Name'
    var company_button = document.createElement("button")
    company_button.innerHTML = 'Company'
    var position_button = document.createElement("button")
    position_button.innerHTML = 'Position'
    var note_button = document.createElement("button")
    note_button.innerHTML = 'Note'

    function set_button_format(button){
      button.onmouseenter = function (event) {
        selected_text = composeView.getSelectedBodyText()
      }
      button.style.backgroundColor = '#4d90fe'
      button.style.height = '36px'
      button.style.width = '72px'
      button.style.textAlign = 'center'
      button.style.lineHeight = '36px'
      button.style.color = 'white'
      button.style.textDecoration = 'none'
      button.style.fontFamily = 'Roboto'
      button.style.fontWeight = '700'
      button.style.fontSize = '11px'
      button.style.margin = '5px'
      button.style.borderRadius = '3px'
      button.style.border = '1px solid #4d90fe'
    }

    set_button_format(name_button)
    set_button_format(company_button)
    set_button_format(position_button)
    set_button_format(note_button)

    name_button.onclick = function (event) {    
      sent_info_dict.name = selected_text
      selected_text = ''
      //sent_info_dict.position = composeView.getSelectedBodyText()
      console.log('Name:')
      console.log(sent_info_dict.name);
    }

    company_button.onclick = function (event) {
      sent_info_dict.company = selected_text
      selected_text = ''
      //sent_info_dict.company = composeView.getSelectedBodyText()
      console.log('Company:')
      console.log(sent_info_dict.company);
    }

    position_button.onclick = function (event) {
      sent_info_dict.position = selected_text
      selected_text = ''
      //sent_info_dict.position = composeView.getSelectedBodyText()
      console.log('Position:')
      console.log(sent_info_dict.position);
    }

    note_button.onclick = function (event) {
      sent_info_dict.note = selected_text
      selected_text = ''
      //sent_info_dict.position = composeView.getSelectedBodyText()
      console.log('Note:')
      console.log(sent_info_dict.note);
    }

    status_bar.el.appendChild(name_button)
    status_bar.el.appendChild(company_button)
    status_bar.el.appendChild(position_button)
    status_bar.el.appendChild(note_button)

    // name_button = "<button style = 'background-color: #4d90fe; height: 28px; width: 74px; text-align: center; line-height: 28px; color: white; text-decoration: none; font-family: Helvetica; font-weight: 700; font-size: 11px; margin: 5px; border-radius: 3px; border: 1px solid #4d90fe;'>Name</button>"
    // company_button = "<button style = 'background-color: #4d90fe; height: 28px; width: 74px; text-align: center; line-height: 28px; color: white; text-decoration: none; font-family: Helvetica; font-weight: 700; font-size: 11px; margin: 5px; border-radius: 3px; border: 1px solid #4d90fe;'>Company</button>"
    // position_button = "<button style = 'background-color: #4d90fe; height: 28px; width: 74px; text-align: center; line-height: 28px; color: white; text-decoration: none; font-family: Helvetica; font-weight: 700; font-size: 11px; margin: 5px; border-radius: 3px; border: 1px solid #4d90fe;'>Position</button>"
    //status_bar.el.innerHTML = name_button + company_button + position_button
    
    // function present(){
    //   document.getElementById('test').innerHTML = "changed text";
    //   console.log(document.getElementById('test').innerHTML)
    // }
    // present();
    // var HTML_status_bar = document.getElementById("status_bar")
    // var HTML_status_bar2 = document.getElementById("#status_bar")
    // console.log(HTML_status_bar)
    // console.log(HTML_status_bar2)
    // document.getElementById("test").innerHTML = "changed"
    // console.log(document.getElementById("test").innerHTML)

    // var HTML_status_bar = document.getElementById("signin")
  });

  // MessageView Modifier (Received email info extraction)
  sdk.Conversations.registerMessageViewHandler(function (messageView) {
      messageView.addAttachmentIcon({
        tooltip: "Load Email Data",
        iconUrl: "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQxFoh469eOsZQkuPOLpZn3R6yyIExkZCxOxf4ywfeY3v330EwP3Q",
        onClick: function (event) {
          receive_info_dict.sender = messageView.getSender()
          receive_info_dict.receivetime = messageView.getDateString()
          console.log('Sender:')
          console.log(receive_info_dict.sender)
          console.log('Receiving Time:')
          console.log(receive_info_dict.receivetime)
        },
        orderHint: 0,
        
        })
  })

  sdk.Conversations.registerThreadViewHandler(function (threadView){
      var side_bar_HTML = document.createElement("div")
      side_bar_HTML.innerHTML = ''
      threadView.addSidebarContentPanel({
        el: side_bar_HTML,
        title: 'Data Panel',
        iconUrl: "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQxFoh469eOsZQkuPOLpZn3R6yyIExkZCxOxf4ywfeY3v330EwP3Q",
        appName: 'Data Panel app',
        appIconUrl: "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQxFoh469eOsZQkuPOLpZn3R6yyIExkZCxOxf4ywfeY3v330EwP3Q",
        id : 'data_panel'
      })
  })
})
