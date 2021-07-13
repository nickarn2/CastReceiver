const context = cast.framework.CastReceiverContext.getInstance();
const playerManager = context.getPlayerManager();
const options = new cast.framework.CastReceiverOptions();
options.maxInactivity = 3600;

// message interceptor
const CUSTOM_CHANNEL = 'urn:x-cast:comcustApp';
context.addCustomMessageListener(CUSTOM_CHANNEL, function(customEvent) {
  debugger;
  console.log("addCustomMessageListener: " + customEvent);
});

// intercept the LOAD request to be able to read in a contentId and get data
playerManager.setMessageInterceptor(
  cast.framework.messages.MessageType.LOAD,
  loadRequestData => {
    debugger;
    console.log("loadRequestData" + loadRequestData);
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
      context.sendCustomMessage('urn:x-cast:comcustAppString', JSON.stringify(event));
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
const namespaces = {CUSTOM_CHANNEL : 'JSON',
'urn:x-cast:comcustAppString' : 'STRING' };
context.start({ playbackConfig: playbackConfig,
    customNamespaces:  namespaces});        