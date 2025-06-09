var contactSearchCallback;

window.Framework = {
  config: {
    name: "ExampleGitHubApp",
    clientIds: {
      "mypurecloud.jp": "3ecbf614-c544-4abe-87af-882653d05410",
    },
    customInteractionAttributes: [
      "PT_URLPop",
      "PT_SearchValue",
      "PT_TransferContext",
    ],
    settings: {
      embedWebRTCByDefault: true,
      hideWebRTCPopUpOption: false,
      enableCallLogs: true,
      enableTransferContext: true,
      dedicatedLoginWindow: false,
      hideCallLogSubject: true,
      hideCallLogContact: false,
      hideCallLogRelation: false,
      searchTargets: ["people", "queues", "frameworkcontacts"],
      callControls: [
        "pickup",
        "hold",
        "mute",
        "transfer",
        "disconnect",
        "record",
        // "securePause",
        // "dtmf",
        // "scheduleCallback",
        // "flag",
        // "requestAfterCallWork",
      ],

      theme: {
        primary: "#006cfd",
        text: "#ffffff",
        notification: {
          success: {
            primary: "#CCE5FF",
            text: "#004085",
          },
          error: {
            primary: "#f8D7DA",
            text: "#721C24",
          },
        },
      },
    },
  },

  initialSetup: function () {
    window.PureCloud.subscribe([
      {
        type: "Interaction",
        callback: function (category, interaction) {
          // alert("Interaction Subscription: " + category + " - " + interaction);

          console.log("custom===============> event ======> initialSetup", {
            category,
            interaction,
          });
          window.parent.postMessage(
            JSON.stringify({
              type: "interactionSubscription",
              data: { category: category, interaction: interaction },
            }),
            "*",
          );
        },
      },
      {
        type: "UserAction",
        callback: function (category, data) {
          // alert(
          //   "User Action Subscription: " +
          //     category +
          //     " - " +
          //     JSON.stringify(data),
          // );
          console.log("custom===============> event ======> initialSetup =====> UserAction", {
            category,
            data,
          });
          window.parent.postMessage(
            JSON.stringify({
              type: "userActionSubscription",
              data: { category: category, data: data },
            }),
            "*",
          );
        },
      },
      {
        type: "Notification",
        callback: function (category, data) {
          alert(
            "Notification Subscription: " +
              category +
              " - " +
              JSON.stringify(data),
          );
          window.parent.postMessage(
            JSON.stringify({
              type: "notificationSubscription",
              data: { category: category, data: data },
            }),
            "*",
          );
        },
      },
    ]);

    window.addEventListener("message", function (event) {
      try {
        var message = JSON.parse(event.data);
        console.log("custom===============> event ======> message", {
          message,type: message?.type,
        });
        // console.log('event Messageeeeeee', message);

        alert("event Messageeeeeee: " + event.data);
        if (message) {
          if (message.type == "clickToDial") {
            window.PureCloud.clickToDial(message.data);
          } else if (message.type == "addAssociation") {
            window.PureCloud.addAssociation(message.data);
          } else if (message.type == "addAttribute") {
            window.PureCloud.addCustomAttributes(message.data);
          } else if (message.type == "addTransferContext") {
            window.PureCloud.addTransferContext(message.data);
          } else if (message.type == "sendContactSearch") {
            if (contactSearchCallback) {
              contactSearchCallback(message.data);
            }
          } else if (message.type == "updateUserStatus") {
            window.PureCloud.User.updateStatus(message.data);
          } else if (message.type == "updateInteractionState") {
            window.PureCloud.Interaction.updateState(message.data);
          } else if (message.type == "setView") {
            window.PureCloud.User.setView(message.data);
          } else if (message.type == "updateAudioConfiguration") {
            window.PureCloud.User.Notification.setAudioConfiguration(
              message.data,
            );
          } else if (message.type == "sendCustomNotification") {
            window.PureCloud.User.Notification.notifyUser(message.data);
          }
        }
      } catch {
        //ignore if you can not parse the payload into JSON
      }
    });
  },
  screenPop: function (searchString, interaction) {
    console.log("custom===============> custom ======> screenPop", {
      searchString,
      interaction,
    });
    window.parent.postMessage(
      JSON.stringify({
        type: "screenPop",
        data: { searchString: searchString, interactionId: interaction },
      }),
      "*",
    );
  },
  processCallLog: function (
    callLog,
    interaction,
    eventName,
    onSuccess,
    onFailure,
  ) {
    console.log("custom===============> event ======> processCallLog", {
      callLog,
      interaction,
      eventName,
      onSuccess,
      onFailure,
    });
    window.parent.postMessage(
      JSON.stringify({
        type: "processCallLog",
        data: {
          callLog: callLog,
          interactionId: interaction,
          eventName: eventName,
        },
      }),
      "*",
    );
    var success = true;
    if (success) {
      onSuccess({
        id: callLog.id || Date.now(),
      });
    } else {
      onFailure();
    }
  },
  openCallLog: function (callLog, interaction) {
    console.log("custom===============> event ======> openCallLog", {
      callLog,
      interaction,
    });
    window.parent.postMessage(
      JSON.stringify({
        type: "openCallLog",
        data: { callLog: callLog, interaction: interaction },
      }),
      "*",
    );
  },
  contactSearch: function (searchString, onSuccess, onFailure) {
    console.log("custom===============> event ======> contactSearch", {
      searchString,
      onSuccess,
    });

    contactSearchCallback = onSuccess;
    window.parent.postMessage(
      JSON.stringify({
        type: "contactSearch",
        data: { searchString: searchString },
      }),
      "*",
    );
  },
};
