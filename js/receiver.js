const context = cast.framework.CastReceiverContext.getInstance();
const playerManager = context.getPlayerManager();
const options = new cast.framework.CastReceiverOptions();
options.maxInactivity = 3600;

// message interceptor
const CUSTOM_CHANNEL = "urn:x-cast:com.custApp";
context.addCustomMessageListener(CUSTOM_CHANNEL, function(customEvent) {
  // handle customEvent.
  debugger;
  context.sendCustomMessage(CUSTOM_CHANNEL, "message from receiver");
  console.log("addCustomMessageListener: " + customEvent);
});

// intercept the LOAD request to be able to read in a contentId and get data
playerManager.setMessageInterceptor(
  cast.framework.messages.MessageType.LOAD,
  loadRequestData => {
    debugger;
    console.log("loadRequestData" + loadRequestData);
    console.log("loadRequestData" + JSON.stringify(loadRequestData));
    context.sendCustomMessage(CUSTOM_CHANNEL, "message from receiver");
    return loadRequestData;
  }
);

// listen to all Core Events
playerManager.addEventListener(
  cast.framework.events.category.CORE,
  event => {
    try {
        context.sendCustomMessage(CUSTOM_CHANNEL, "message from receiver");//nn
      } catch(e) {
        console.error(Constants.APP_INFO, TAG, e);
        debugger;
    }
    try {
        context.sendCustomMessage(CUSTOM_CHANNEL, JSON.stringify(event));//nn
      } catch(e) {
        console.error(Constants.APP_INFO, TAG, e);
        debugger;
    }
    try {
        context.sendCustomMessage(CUSTOM_CHANNEL, event);//nn
      } catch(e) {
        console.error(Constants.APP_INFO, TAG, e);
        debugger;
    }
    console.log("playerManager = " + event.type);
    console.log("CastContext", "Core event: " + JSON.stringify(event));
  }
);

playerManager.addEventListener(
  cast.framework.events.EventType.PLAYER_LOAD_COMPLETE,
  () => {
    console.log("PLAYER_LOAD_COMPLETE");
  }
);

const playbackConfig = new cast.framework.PlaybackConfig();
playbackConfig.manifestRequestHandler = requestInfo => {
  console.log("requestInfo" + requestInfo);
};

playbackConfig.segmentRequestHandler = requestInfo => {
  console.log("segmentRequestHandler: " + requestInfo);
};

// Sets the player to start playback as soon as there are five seconds of
// media contents buffered. Default is 10.
playbackConfig.autoResumeDuration = 5;
context.sendCustomMessage(CUSTOM_CHANNEL, "message from receiver");
context.start({ playbackConfig: playbackConfig });
