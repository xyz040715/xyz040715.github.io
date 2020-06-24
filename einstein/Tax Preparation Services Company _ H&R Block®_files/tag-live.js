(function(networkId) {
var cacheLifetimeDays = 14;

var customDataWaitForConfig = [
  { on: function() { return Invoca.Client.parseCustomDataField("adobe_id", "Last", "URLParam", ""); }, paramName: "adobe_id", fallbackValue: null },
  { on: function() { return Invoca.Client.parseCustomDataField("brand", "Last", "URLParam", ""); }, paramName: "brand", fallbackValue: null },
  { on: function() { return Invoca.Client.parseCustomDataField("calling_page", "Last", "JavascriptDataLayer", "location.href"); }, paramName: "calling_page", fallbackValue: null },
  { on: function() { return Invoca.Client.parseCustomDataField("campaignid", "Last", "URLParam", ""); }, paramName: "campaignid", fallbackValue: null },
  { on: function() { return Invoca.Client.parseCustomDataField("gclid", "Last", "URLParam", ""); }, paramName: "gclid", fallbackValue: null },
  { on: function() { return Invoca.Client.parseCustomDataField("invoca_destination_friendly_name", "Unique", "URLParam", ""); }, paramName: "invoca_destination_friendly_name", fallbackValue: null },
  { on: function() { return Invoca.Client.parseCustomDataField("invsrc", "Last", "URLParam", ""); }, paramName: "invsrc", fallbackValue: null },
  { on: function() { return Invoca.Client.parseCustomDataField("KeywordID", "Last", "URLParam", ""); }, paramName: "KeywordID", fallbackValue: null },
  { on: function() { return Invoca.Client.parseCustomDataField("kpid", "Last", "URLParam", ""); }, paramName: "kpid", fallbackValue: null },
  { on: function() { return Invoca.Client.parseCustomDataField("location_name", "Last", "URLParam", ""); }, paramName: "location_name", fallbackValue: null },
  { on: function() { return Invoca.Client.parseCustomDataField("msclkid", "Last", "URLParam", ""); }, paramName: "msclkid", fallbackValue: null },
  { on: function() { return Invoca.Client.parseCustomDataField("office", "Last", "URLParam", ""); }, paramName: "office", fallbackValue: null },
  { on: function() { return Invoca.Client.parseCustomDataField("omnisource", "Last", "URLParam", ""); }, paramName: "omnisource", fallbackValue: null },
  { on: function() { return Invoca.Client.parseCustomDataField("otppartnerid", "Last", "URLParam", ""); }, paramName: "otppartnerid", fallbackValue: null },
  { on: function() { return Invoca.Client.parseCustomDataField("utm_medium", "Last", "URLParam", ""); }, paramName: "utm_medium", fallbackValue: function() { return Invoca.PNAPI.currentPageSettings.poolParams.utm_medium || null; } },
  { on: function() { return Invoca.Client.parseCustomDataField("utm_source", "Last", "URLParam", ""); }, paramName: "utm_source", fallbackValue: function() { return Invoca.PNAPI.currentPageSettings.poolParams.utm_source || null; } }
];

var defaultCampaignId = "578667";

var destinationSettings = {
  paramName: "invoca_detected_destination",
  matchLocalNumbers: false,
  matchTollFreeNumbers: false
};

var numbersToReplace = null;

var organicSources = true;

var reRunAfter = 500;

var requiredParams = {"invsrc":"*"};

var resetCacheOn = [];

var waitFor = 0;

var customCodeIsSet = (function() {
  Invoca.Client.customCode = function(options) {
   try {

//needed for initial 2 second delay on SQL search
setTimeout(function() {
  Invoca.PNAPI.run(); 
  }, 2000);

//needed for Adobe Analytics
options.integrations.adobeAnalytics = {
  username: "A78D3BC75245AD7C0A490D4D@AdobeOrg",
  paramName: "adobe_id",
  timeout: 0
};
 

//need additional event listener for clicking through pages   

   
return options;

   } catch (e) {
     Invoca.PNAPI.warn("Custom code block failed: " + e.message);
   }
  };

  return true;
})();

var generatedOptions = {
  autoSwap:            true,
  cookieDays:          cacheLifetimeDays,
  country:             "US",
  defaultCampaignId:   defaultCampaignId,
  destinationSettings: destinationSettings,
  disableUrlParams:    ['entry_page'],
  doNotSwap:           ["800-472-5625"],
  maxWaitFor:          waitFor,
  networkId:           networkId || null,
  numberToReplace:     numbersToReplace,
  organicSources:      organicSources,
  poolParams:          {},
  reRunAfter:          reRunAfter,
  requiredParams:      requiredParams,
  resetCacheOn:        resetCacheOn,
  waitForData:         customDataWaitForConfig
};

Invoca.Client.startFromWizard(generatedOptions);

})(1746);
