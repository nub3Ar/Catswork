
var info_dict = new Object;
var info_dict = {};

InboxSDK.load(2, 'sdk_Catworks_b73c68555a').then(function(sdk){

  sdk.Compose.registerComposeViewHandler(function(composeView){

    composeView.addButton({
      title: "Get my email content!",
      iconUrl: "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQxFoh469eOsZQkuPOLpZn3R6yyIExkZCxOxf4ywfeY3v330EwP3Q",
      onClick: function(event) {
        var contact = event.composeView.getToRecipients();
        var subject = event.composeView.getSubject()
        var htmlcontent= event.composeView.getHTMLContent();
        var textcontent = event.composeView.getTextContent()
        console.log(contact);
        console.log('Email Destination Name:')
        console.log(contact[0].name);
        console.log('Email Destination:')
        console.log(contact[0].emailAddress);
        console.log('Email Subject:')
        console.log(subject);
        console.log('Email Body:')
        console.log(htmlcontent);
        console.log(textcontent);
        info_dict.contact = contact
        info_dict.subject = subject
        info_dict.htmlcontent = htmlcontent
        info_dict.textcontent = textcontent
      },
    });
  });

  sdk.Compose.registerComposeViewHandler(function(composeView) {

    composeView.on('sent', function(event) {
      // message sent successfully
      console.log("Message sent successfully.");
      // print info
      console.log(info_dict.contact);
      console.log('Email Destination Name:')
      console.log(info_dict.contact[0].name);
      console.log('Email Destination:')
      console.log(info_dict.contact[0].emailAddress);
      console.log('Email Subject:')
      console.log(info_dict.subject);
      console.log('Email Body:')
      console.log(info_dict.htmlcontent);
      console.log(info_dict.textcontent);
    });
  });

  
  sdk.Conversations.registerMessageViewHandler(function(messageView){
    messageView.addAttachmentIcon({
      tooltip: "Load Email Data",
      iconUrl: "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQxFoh469eOsZQkuPOLpZn3R6yyIExkZCxOxf4ywfeY3v330EwP3Q",
      onClick: function(event) {
        var sender_email = messageView.getSender()
        var email_timestamp = messageView.getDateString()
        console.log(sender_email)
        console.log(email_timestamp)
      },
      orderHint: 0,
    });
  });

});