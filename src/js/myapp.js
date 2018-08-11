var sent_info_dict = new Object;
var sent_info_dict = {};
var receive_info_dict = new Object;
var receive_info_dict = {};


function Compose_view_info() {
  InboxSDK.load(2, 'sdk_Catworks_b73c68555a').then(function (sdk) {

      sdk.Compose.registerComposeViewHandler(function (composeView) {

        composeView.addButton({
          title: "Get my email content!",
          iconUrl: "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQxFoh469eOsZQkuPOLpZn3R6yyIExkZCxOxf4ywfeY3v330EwP3Q",
          onClick: function (event) {
            sent_info_dict.contact = event.composeView.getToRecipients();
            sent_info_dict.subject = event.composeView.getSubject()
            sent_info_dict.htmlcontent = event.composeView.getHTMLContent();
            sent_info_dict.textcontent = event.composeView.getTextContent()

            console.log('Email Destination Name:')
            console.log(sent_info_dict.contact[0].name);
            console.log('Email Destination:')
            console.log(sent_info_dict.contact[0].emailAddress);
            console.log('Email Subject:')
            console.log(sent_info_dict.subject);
            console.log('Email Body - HTML')
            console.log(sent_info_dict.htmlcontent);
            console.log('Email Body - TEXT')
            console.log(sent_info_dict.textcontent);
          },
        });
      });
    })
  }

  function Send_info() {
    sdk.Compose.registerComposeViewHandler(function (composeView) {

      composeView.on('sent', function (event) {
        // message sent successfully
        console.log("Message sent successfully.");
        // print info
        console.log(sent_info_dict.contact);
        console.log('Email Destination Name:')
        console.log(sent_info_dict.contact[0].name);
        console.log('Email Destination:')
        console.log(sent_info_dict.contact[0].emailAddress);
        console.log('Email Subject:')
        console.log(sent_info_dict.subject);
        console.log('Email Body:')
        console.log(sent_info_dict.htmlcontent);
        console.log(sent_info_dict.textcontent);
      });
    });
  }

  function Conversation_info() {
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
      });
    });

  }

Compose_view_info()
Send_info()
conversation_info()