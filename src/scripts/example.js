document.addEventListener('DOMContentLoaded', function () {

    document.getElementById("clickToDial").addEventListener("click", clickToDial);
    document.getElementById("addAssociation").addEventListener("click", addAssociation);
    document.getElementById("addAttribute").addEventListener("click", addAttribute);
    document.getElementById('addTransferContext').addEventListener("click", addTransferContext);
    document.getElementById('updateUserStatus').addEventListener("click", updateUserStatus);
    document.getElementById('pickupInteraction').addEventListener("click", updateInteractionState);
    document.getElementById('securePauseInteraction').addEventListener("click", updateInteractionState);
    document.getElementById('disconnectInteraction').addEventListener("click", updateInteractionState);
    document.getElementById('holdInteraction').addEventListener("click", updateInteractionState);
    document.getElementById('muteInteraction').addEventListener("click", updateInteractionState);
    document.getElementById('updateAudioConfiguration').addEventListener("click", updateAudioConfiguration);
    document.getElementById('sendCustomNotification').addEventListener("click", sendCustomNotification);

    document.getElementById('view-interactionList').addEventListener("click", setView);
    document.getElementById('view-calllog').addEventListener("click", setView);
    document.getElementById('view-newInteraction').addEventListener("click", setView);
    document.getElementById('view-callback').addEventListener("click", setView);
    document.getElementById('view-settings').addEventListener("click", setView);

    window.addEventListener("message", async function (event) {
        try {
            var message = JSON.parse(event.data);
            if (message) {
                if (message.type == "screenPop") {
                    // const { direction, name } = message?.data?.interactionId;

                    // if (direction === 'Inbound') {
                    //     // 1. create a ticket after done move to page ticket genesys

                    //     const resTicket = await axios.post('http://localhost:3000/connectx/api/genesysconnector/createTicket', { ...message?.data });

                    //     // 2. find the profile customer by phone number after done popup modal select customer
                    //     const findProfileCustomer = await axios.get(`http://localhost:3000/connectx/api/genesysconnector/findProfileCustomer?phoneNumber=${name}`);

                    //     console.log('findProfileCustomer', findProfileCustomer.data);
                    // }

                    document.getElementById("screenPopPayload").value += event.data + "\n";
                } else if (message.type == "processCallLog") {
                    document.getElementById("processCallLogPayLoad").value += event.data + "\n";
                } else if (message.type == "openCallLog") {
                    document.getElementById("openCallLogPayLoad").value += event.data + "\n";
                } else if (message.type == "interactionSubscription") {
                    // append the interaction to value

                    document.getElementById("interactionSubscriptionPayload").value += event.data + "\n";
                } else if (message.type == "userActionSubscription") {
                    document.getElementById("userActionSubscriptionPayload").value = event.data;
                } else if (message.type == "notificationSubscription") {
                    document.getElementById("notificationSubscriptionPayload").value = event.data;
                } else if (message.type == "contactSearch") {
                    document.getElementById("searchText").innerHTML = ": " + message.data.searchString;
                    sendContactSearch();
                }
            }
        } catch (error) {

        }

    });

    function clickToDial() {
        console.log('process click to dial');
        document.getElementById("softphone").contentWindow.postMessage(JSON.stringify({
            type: 'clickToDial',
            data: {
                number: '99070955491396',
                autoPlace: true,
                queueId: 'f9ef8988-d6d6-406e-90bd-2054cf9cb356' // ดึงจาก /Organizes/0DEV0rgRAndDConnectX/connector/genesys/channel/K7T55JXQ0WCDWtPcgt4A  ->> outboundQueueId
            }
        }), "*");
    }

    function addAssociation() {
        console.log('process add association');
        document.getElementById("softphone").contentWindow.postMessage(JSON.stringify({
            type: 'addAssociation',
            data: JSON.parse(document.getElementById("associationPayload").value)
        }), "*");
    }

    function addAttribute() {
        console.log('process add attribute');
        document.getElementById("softphone").contentWindow.postMessage(JSON.stringify({
            type: 'addAttribute',
            data: JSON.parse(document.getElementById("attributePayload").value)
        }), "*");
    }

    function addTransferContext() {
        console.log('process add Transfer Context');
        document.getElementById("softphone").contentWindow.postMessage(JSON.stringify({
            type: 'addTransferContext',
            data: JSON.parse(document.getElementById("transferContextPayload").value)
        }), "*");
    }

    function sendContactSearch() {
        console.log('process add Search Context');
        document.getElementById("softphone").contentWindow.postMessage(JSON.stringify({
            type: 'sendContactSearch',
            data: JSON.parse(document.getElementById("contactSearchPayload").value)
        }), "*");
    }

    function updateUserStatus() {
        console.log('process user status update');
        document.getElementById("softphone").contentWindow.postMessage(JSON.stringify({
            type: 'updateUserStatus',
            data: { id: document.getElementById("statusDropDown").value }
        }), "*");
    }

    function updateInteractionState(event) {
        console.log('process interaction state change');
        var lastInteractionPayload = JSON.parse(document.getElementById("interactionSubscriptionPayload").value);
        var interactionId;
        if (lastInteractionPayload.data.interaction.old) {
            interactionId = lastInteractionPayload.data.interaction.old.id;
        } else {
            interactionId = lastInteractionPayload.data.interaction.id;
        }
        let payload = {
            action: event.target.outerText,
            id: interactionId
        };
        document.getElementById("softphone").contentWindow.postMessage(JSON.stringify({
            type: 'updateInteractionState',
            data: payload
        }), "*");
    }

    function updateAudioConfiguration() {
        console.log('Update Audio Configuration');
        var payload = {
            call: document.getElementById('audio-call').checked,
            chat: document.getElementById('audio-chat').checked,
            email: document.getElementById('audio-email').checked,
            callback: document.getElementById('audio-callback').checked,
            message: document.getElementById('audio-message').checked,
            voicemail: document.getElementById('audio-voicemail').checked
        }
        document.getElementById("softphone").contentWindow.postMessage(JSON.stringify({
            type: 'updateAudioConfiguration',
            data: payload
        }), "*");
    }


    function setView(event) {
        console.log('process view update');
        let payload = {
            type: "main",
            view: {
                name: event.target.outerText
            }
        };
        document.getElementById("softphone").contentWindow.postMessage(JSON.stringify({
            type: 'setView',
            data: payload
        }), "*");
    }

    function sendCustomNotification() {
        console.log('Send Custom User Notification');
        var payload = {
            message: document.getElementById('customNotificationMessage').value,
            type: document.getElementById('notificationType').value,
            timeout: document.getElementById('notificationTimeout').value
        };
        document.getElementById("softphone").contentWindow.postMessage(JSON.stringify({
            type: 'sendCustomNotification',
            data: payload
        }), "*");
    }
})
