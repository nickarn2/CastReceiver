const context = cast.framework.CastReceiverContext.getInstance();
const playerManager = context.getPlayerManager();

const CUSTOM_CHANNEL = 'urn:x-cast:comcustApp';
context.addCustomMessageListener(CUSTOM_CHANNEL, function(customEvent) {
  console.log("comcustApp Listener: " + JSON.stringify(customEvent));
});
context.addCustomMessageListener('urn:x-cast:comcustAppString', function(customEvent) {
  console.log("comcustAppString Listener: " + JSON.stringify(customEvent));
});

// intercept the LOAD request to be able to read in a contentId and get data
playerManager.setMessageInterceptor(
  cast.framework.messages.MessageType.LOAD,
  loadRequestData => {
    console.log("loadRequestData" + JSON.stringify(loadRequestData));
    return loadRequestData;
  }
);

// listen to all Core Events
playerManager.addEventListener(
  cast.framework.events.category.CORE,
  event => {
    try {
        context.sendCustomMessage('urn:x-cast:comcustApp', JSON.stringify(event));
      } catch(e) {
        console.error(Constants.APP_INFO, TAG, e);
        debugger;
    }
    try {
        context.sendCustomMessage('urn:x-cast:comcustApp', {
            type: 'status',
            message: 'Playing'
        });
      } catch(e) {
        console.error(Constants.APP_INFO, TAG, e);
        debugger;
    }
    try {
        context.sendCustomMessage('urn:x-cast:comcustApp', JSON.stringify(event));
      } catch(e) {
        console.error(Constants.APP_INFO, TAG, e);
        debugger;
    }

    console.log("playerManager = " + event.type);
    console.log("CastContext", "Core event: " + JSON.stringify(event));
  }
);

const playbackConfig = new cast.framework.PlaybackConfig();
playbackConfig.manifestRequestHandler = requestInfo => {
  console.log("requestInfo" + requestInfo);
};
playbackConfig.segmentRequestHandler = requestInfo => {
  console.log("segmentRequestHandler: " + requestInfo);
};
playbackConfig.autoResumeDuration = 5;
const namespaces = {'urn:x-cast:comcustApp' : 'JSON',
                    'urn:x-cast:comcustAppString' : cast.framework.system.MessageType.JSON };//'STRING' does not work
context.start({ playbackConfig: playbackConfig,
                customNamespaces: namespaces});        