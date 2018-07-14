InboxSDK.load(2, 'sdk_Catworks_b73c68555a').then(function(sdk){

  sdk.Compose.registerComposeViewHandler(function(composeView){

    composeView.addButton({
      title: "Get content!",
      iconUrl: 'https://example.com/foo.png',
      onClick: function(event) {
        message = event.composeView.getHTMLContent();
        contact = event.composeView.getToRecipients();
        console.log(message.toString(), "\n");
        console.log(contact[0].name);
        console.log(contact[0].emailaddress);
      },
    });


  });

});