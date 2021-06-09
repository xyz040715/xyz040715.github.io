// TODO: acsfdev.*.com points to uat, else prod sites point to prod

/**
 * Darkens a hex color
 * @param {*} darkness The percent darker (0 to 1)
 * @returns rgb value string
 */
String.prototype.darken = function(darkness){
  if (!(this.length == 6 || this.length == 7)) return this;
  darkness = 1 - darkness;
  var aRgbHex = this.split('#').slice(-1).pop().match(/.{1,2}/g);
  var aRgb = [
      Math.round(parseInt(aRgbHex[0], 16) * darkness),
      Math.round(parseInt(aRgbHex[1], 16) * darkness),
      Math.round(parseInt(aRgbHex[2], 16) * darkness)
  ];
  return 'rgb(' + aRgb.join(',') + ')';
}

/**
 * Lightens a hex color
 * @param {*} lightness The percent lighter (0 to 1)
 * @returns rgb value string
 */
String.prototype.lighten = function(lightness){
  if (!(this.length == 6 || this.length == 7)) return this;
  lightness = 1 - lightness;
  var aRgbHex = this.split('#').slice(-1).pop().match(/.{1,2}/g);
  var aRgb = [
      Math.round(255 - ((255 - parseInt(aRgbHex[0], 16)) * lightness)),
      Math.round(255 - ((255 - parseInt(aRgbHex[1], 16)) * lightness)),
      Math.round(255 - ((255 - parseInt(aRgbHex[2], 16)) * lightness))
  ];
  return 'rgb(' + aRgb.join(',') + ')';
}

/**
 * Set theme colors depending on domain or PoC selected radio button
 */
let setColorTheme = function() {

  // Set mock domain from radio button
  var radioGroup = document.getElementsByName('mockDomain');
  mockDomain = '';
  for (i = 0; i < radioGroup.length; i++) {
    if (radioGroup[i].checked) mockDomain = radioGroup[i].value;
  }

  // Set domain from browser window domain
  // Note: this isn't the true domain, it strips the first subdomain, which covers all known cases for our use case
  var hostname = window.location.hostname;
  var domain = (function(){
    var result, match
    if (match = hostname.match(/([^:]+)/)) {
      if (match = match[1].match(/^[^\.]+\.(.+)$/)) result = match[1];
    }
    return result
  })();

  var colorBrandSecondary = '#444';
  var fontFamily = "'Open Sans', Verdana, Helvetica, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif";
  if (mockDomain == 'scotts' || domain == 'scotts.com') {
    colorBrandSecondary = '#15874c';
    document.documentElement.style.setProperty('--lwc-fontFamily',                fontFamily);
    document.documentElement.style.setProperty('--lwc-colorTextDefault',          '#15874c');
    document.documentElement.style.setProperty('--lwc-colorTextInverse',          'rgba(255,255,255,.9)');
    document.documentElement.style.setProperty('--sfdc-theme-color-text-dark',    '#075534');
    document.documentElement.style.setProperty('--sfdc-button-border-radius',     '4px');
  } else if (mockDomain == 'miraclegro' || domain == 'miraclegro.com') {
    colorBrandSecondary = '#FACD02';
    document.documentElement.style.setProperty('--lwc-fontFamily',                fontFamily);
    document.documentElement.style.setProperty('--lwc-colorTextDefault',          '#262626');
    document.documentElement.style.setProperty('--lwc-colorTextInverse',          'rgba(0,0,0,.9)');
    document.documentElement.style.setProperty('--sfdc-theme-color-text-dark',    '#262626');
    document.documentElement.style.setProperty('--sfdc-button-border-radius',     '4px');
  } else if (mockDomain == 'tomcat' || domain == 'tomcat.com') {
    colorBrandSecondary = '#63B54A';
    document.documentElement.style.setProperty('--lwc-fontFamily',                fontFamily);
    document.documentElement.style.setProperty('--lwc-colorTextDefault',          '#262626');
    document.documentElement.style.setProperty('--lwc-colorTextInverse',          'rgba(0,0,0,.9)');
    document.documentElement.style.setProperty('--sfdc-theme-color-text-dark',    '#262626');
    document.documentElement.style.setProperty('--sfdc-button-border-radius',     '8px');
  } else if (mockDomain == 'ortho' || domain == 'ortho.com') {
    colorBrandSecondary = '#444';
    document.documentElement.style.setProperty('--lwc-fontFamily',                '"DINNextLTPro-Regular", ' + fontFamily);
    document.documentElement.style.setProperty('--lwc-colorTextDefault',          '#444');
    document.documentElement.style.setProperty('--lwc-colorTextInverse',          'rgba(255,255,255,.9)');
    document.documentElement.style.setProperty('--sfdc-theme-color-text-dark',    '#444');
    document.documentElement.style.setProperty('--sfdc-button-border-radius',     '20px 0px');
  } else if (mockDomain == 'roundup' || domain == 'roundup.com') {
    colorBrandSecondary = '#00538c';
    document.documentElement.style.setProperty('--lwc-fontFamily',                '"Lato", ' + fontFamily);
    document.documentElement.style.setProperty('--lwc-colorTextDefault',          '#00538c');
    document.documentElement.style.setProperty('--lwc-colorTextInverse',          'rgba(255,255,255,.95)');
    document.documentElement.style.setProperty('--sfdc-theme-color-text-dark',    '#00538c');
    document.documentElement.style.setProperty('--sfdc-button-border-radius',     '.286em');
  } else if (mockDomain == 'naturescare' || domain == 'naturescare.com') {
    colorBrandSecondary = '#c1cd23';
    document.documentElement.style.setProperty('--lwc-fontFamily',                fontFamily);
    document.documentElement.style.setProperty('--lwc-colorTextDefault',          '#00355e');
    document.documentElement.style.setProperty('--lwc-colorTextInverse',          '#00355e');
    document.documentElement.style.setProperty('--sfdc-theme-color-text-dark',    '#00355e');
    document.documentElement.style.setProperty('--sfdc-button-border-radius',     '3px');
  } else if (domain == 'uc.r.appspot.com') {
    colorBrandSecondary = '#5100fd';
    document.documentElement.style.setProperty('--lwc-fontFamily',                '-apple-system, BlinkMacSystemFont, ' + fontFamily);
    document.documentElement.style.setProperty('--lwc-colorTextDefault',          '#5100fd');
    document.documentElement.style.setProperty('--lwc-colorTextInverse',          'aliceblue');
    document.documentElement.style.setProperty('--sfdc-theme-color-text-dark',    '#5100fd');
    document.documentElement.style.setProperty('--sfdc-button-border-radius',     '22px');
  } else {
    colorBrandSecondary = '#8800fd';
    document.documentElement.style.setProperty('--lwc-fontFamily',                '-apple-system, BlinkMacSystemFont, ' + fontFamily);
    document.documentElement.style.setProperty('--lwc-colorTextDefault',          '#8800fd');
    document.documentElement.style.setProperty('--lwc-colorTextInverse',          'aliceblue');
    document.documentElement.style.setProperty('--sfdc-theme-color-text-dark',    '#8800fd');
    document.documentElement.style.setProperty('--sfdc-button-border-radius',     '22px');
  }
  
  document.documentElement.style.setProperty('--lwc-colorBrandSecondary',           colorBrandSecondary);
  document.documentElement.style.setProperty('--lwc-colorBorderBrandSecondary',     colorBrandSecondary);
  document.documentElement.style.setProperty('--lwc-colorBackgroundContrastPrimary',colorBrandSecondary);
  document.documentElement.style.setProperty('--lwc-colorBrandSecondaryDarken20',   colorBrandSecondary.darken(.2));
  document.documentElement.style.setProperty('--lwc-colorBrandSecondaryDarken40',   colorBrandSecondary.darken(.4));
  document.documentElement.style.setProperty('--lwc-colorBrandSecondaryDarken60',   colorBrandSecondary.darken(.6));
  document.documentElement.style.setProperty('--lwc-colorTextDefaultDarken20',      colorBrandSecondary.darken(.2));
  document.documentElement.style.setProperty('--lwc-colorTextDefaultDarken40',      colorBrandSecondary.darken(.4));
  document.documentElement.style.setProperty('--lwc-colorTextDefaultDarken60',      colorBrandSecondary.darken(.6));
  document.documentElement.style.setProperty('--lwc-colorBrandSecondaryLighten20',  colorBrandSecondary.lighten(.2));
  document.documentElement.style.setProperty('--lwc-colorBrandSecondaryLighten40',  colorBrandSecondary.lighten(.4));
  document.documentElement.style.setProperty('--lwc-colorBrandSecondaryLighten60',  colorBrandSecondary.lighten(.6));
  document.documentElement.style.setProperty('--lwc-colorTextDefaultLighten20',     colorBrandSecondary.lighten(.2));
  document.documentElement.style.setProperty('--lwc-colorTextDefaultLighten40',     colorBrandSecondary.lighten(.4));
  document.documentElement.style.setProperty('--lwc-colorTextDefaultLighten60',     colorBrandSecondary.lighten(.6));
  document.documentElement.style.setProperty('--lwc-esColorBackgroundAlt2',         '#4d4d4d');
}

let initESW = function (gslbBaseURL) {
  embedded_svc.settings.displayHelpButton = true; //Or false
  embedded_svc.settings.language = ''; //For example, enter 'en' or 'en-US'

  embedded_svc.settings.defaultMinimizedText = 'Live Chat'; //(Defaults to Chat with an Expert)
  embedded_svc.settings.disabledMinimizedText = 'Chat Offline'; //(Defaults to Agent Offline)

  embedded_svc.settings.loadingText = 'Connecting'; //(Defaults to Loading)
  //embedded_svc.settings.storageDomain = 'yourdomain.com'; //(Sets the domain for your deployment so that visitors can navigate subdomains during a chat session)

  // Settings for Chat
  //embedded_svc.settings.directToButtonRouting = function(prechatFormData) {
  // Dynamically changes the button ID based on what the visitor enters in the pre-chat form.
  // Returns a valid button ID.
  //};
  //embedded_svc.settings.prepopulatedPrechatFields = {}; //Sets the auto-population of pre-chat form fields
  //embedded_svc.settings.fallbackRouting = []; //An array of button IDs, user IDs, or userId_buttonId
  //embedded_svc.settings.offlineSupportMinimizedText = '...'; //(Defaults to Contact Us)

  embedded_svc.settings.enabledFeatures = ['LiveAgent'];
  embedded_svc.settings.entryFeature = 'LiveAgent';

  embedded_svc.init(
      'https://scotts--uat.my.salesforce.com',
      'https://uat-hawthornegc.cs193.force.com/consumer',
      gslbBaseURL,
      '00D7e00000GL6le',
      'SMG_CS_Chat',
      {
          baseLiveAgentContentURL: 'https://c.la3-c1cs-ia4.salesforceliveagent.com/content',
          deploymentId: '5727e00000000Yt',
          buttonId: '5737e00000000kQ',
          baseLiveAgentURL: 'https://d.la3-c1cs-ia4.salesforceliveagent.com/chat',
          eswLiveAgentDevName: 'SMG_CS_Chat',
          isOfflineSupportEnabled: false
      }
  );
};

// Init ESW
if (!window.embedded_svc) {
  let s = document.createElement('script');
  s.setAttribute('src', 'https://scotts--uat.my.salesforce.com/embeddedservice/5.0/esw.min.js');
  s.onload = function () {
    initESW(null);
  };
  document.body.appendChild(s);
} else {
  initESW('https://service.force.com');
}

// Set stylesheet
let l = document.createElement('link');
l.setAttribute('rel', 'stylesheet')
l.setAttribute('type', 'text/css')
l.setAttribute('href', 'https://xyz040715.github.io/smg/consumerbot_main.css')
document.head.appendChild(l);

// Set color theme
setColorTheme();
