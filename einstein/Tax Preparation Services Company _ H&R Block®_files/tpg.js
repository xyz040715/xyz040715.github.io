/*
    UPDATE 1/31/2019: Skip/hide the tpg__intro-screen (EP-1728)
    - In HTML template, added [v-show="step !== 2"] to "tpg__back" button
    - In appTpg data: changed "step" from 1 to 2
    - In appTpg methods: fireDTMStepCall - Changed step number from 2 to 3 in "if(self.step === 3){"
*/

Vue.component('component-bubble-checkbox', {
    model: {
        prop: 'checked',
        event: 'change'
    },
    props: {
        bubbles: Object,
        screen: String
    },
    methods: {
        sendChange: function(e){
            /* updates the bubbles array */
            this.$emit('change', e.target.checked);

            /* will be used to update the userSelections array */
            this.$emit('send-update-selections', this.screen, e.target.value, e.target.checked);
        }
    },
    template: '#template-bubble-checkbox'
})

Vue.component('component-info-btn', {
    props: {
        name: String,
        ariaExpanded: String
    },
    data: function() {
        return {
            class: 'info-btn',
            readerOpen: 'More information. Opens a popup.',
            readerClose: 'Close this popup.'
        }
    },
    methods: {
        sendNameClick: function(){
            this.$emit('send-name-click', this.name);
        }
    },
    template: '#template-info-btn'
});

/* Top level component that holds All The Things */
Vue.component('component-tpg-main', {
    components: {
        /*  https://vue-multiselect.js.org
            See the template:
            https://github.com/shentao/vue-multiselect/blob/master/src/Multiselect.vue
        */
        VueMultiselect: window.VueMultiselect.default
    },
    props: {
        step: Number,
        showInfoScreens: Object,
        stateError: Boolean,
        expertiseExpanded: Boolean,
        showRefundTransferInfo: Boolean,
        bubbles: Object,
        progressWidth: Number,
        userSelections: Object,
        priceResponse: Object,
        stateCount: Number
    },
    data: function(){
        return {
            /* for vue-multiselect */
            value: [],
            options: [
                { state: 'Alabama', abbr: 'AL'},
                { state: 'Alaska', abbr: 'AK'},
                { state: 'Arizona', abbr: 'AZ'},
                { state: 'Arkansas', abbr: 'AR'},
                { state: 'California', abbr: 'CA'},
                { state: 'Colorado', abbr: 'CO'},
                { state: 'Connecticut', abbr: 'CT'},
                { state: 'Delaware', abbr: 'DE'},
                { state: 'District of Columbia', abbr: 'DC'},
                { state: 'Florida', abbr: 'FL'},
                { state: 'Georgia', abbr: 'GA'},
                { state: 'Hawaii', abbr: 'HI'},
                { state: 'Idaho', abbr: 'ID'},
                { state: 'Illinois', abbr: 'IL'},
                { state: 'Indiana', abbr: 'IN'},
                { state: 'Iowa', abbr: 'IA'},
                { state: 'Kansas', abbr: 'KS'},
                { state: 'Kentucky', abbr: 'KY'},
                { state: 'Louisiana', abbr: 'LA'},
                { state: 'Maine', abbr: 'ME'},
                { state: 'Maryland', abbr: 'MD'},
                { state: 'Massachusetts', abbr: 'MA'},
                { state: 'Michigan', abbr: 'MI'},
                { state: 'Minnesota', abbr: 'MN'},
                { state: 'Mississippi', abbr: 'MS'},
                { state: 'Missouri', abbr: 'MO'},
                { state: 'Montana', abbr: 'MT'},
                { state: 'Nebraska', abbr: 'NE'},
                { state: 'Nevada', abbr: 'NV'},
                { state: 'New Hampshire', abbr: 'NH'},
                { state: 'New Jersey', abbr: 'NJ'},
                { state: 'New Mexico', abbr: 'NM'},
                { state: 'New York', abbr: 'NY'},
                { state: 'North Carolina', abbr: 'NC'},
                { state: 'North Dakota', abbr: 'ND'},
                { state: 'Ohio', abbr: 'OH'},
                { state: 'Oklahoma', abbr: 'OK'},
                { state: 'Oregon', abbr: 'OR'},
                { state: 'Pennsylvania', abbr: 'PA'},
                { state: 'Rhode Island', abbr: 'RI'},
                { state: 'South Carolina', abbr: 'SC'},
                { state: 'South Dakota', abbr: 'SD'},
                { state: 'Tennessee', abbr: 'TN'},
                { state: 'Texas', abbr: 'TX'},
                { state: 'Utah', abbr: 'UT'},
                { state: 'Vermont', abbr: 'VT'},
                { state: 'Virginia', abbr: 'VA'},
                { state: 'Washington', abbr: 'WA'},
                { state: 'West Virginia', abbr: 'WV'},
                { state: 'Wisconsin', abbr: 'WI'},
                { state: 'Wyoming', abbr: 'WY'}
            ]
        }
    },
    computed: {
        /* no longer rounding experience, we're using exact years
        roundedExp: function(){
            var years = parseInt(this.priceResponse.yearsOfExp);
            var roundedDown = parseInt( years/5) * 5;
            return roundedDown;
        }
        */

        /* For end of season screen | Counting down to midnight 4/15/2019 */
        /*
        tpgCountdownDays: function(){
            var future = new Date('Apr 15 2019 23:59:59');
            var now = new Date();
            var oneDay = 1000*60*60*24;

            // For testing you can value forceDate with MM/DD/YYYY: ?forceDate=04/16/2019
            var forceDate = this.getUrlParameter('forceDate');

            if (forceDate!=null ){
                var numbers = forceDate.match(/\d+/g);
                var date    = new Date(numbers[2], numbers[0]-1, numbers[1]);
                now         = date;
            }

            var countdownDays = Math.floor((future.getTime() - now.getTime()) / oneDay);
            return countdownDays;
        }
        */
    },
    methods: {
        prevClick: function(){
            this.$emit('prev-click');
        },
        nextClick: function(){
            this.$emit('next-click');
        },
        sendOpenModal: function(name){
            this.$emit('open-modal', name);
            this.$nextTick(function(){
                if(name === 'income'){
                    this.$refs.incomeDoc.focus();
                } else if(name === 'other'){
                    this.$refs.otherDoc.focus();
                } else if(name === 'about'){
                    this.$refs.aboutDoc.focus();
                }

            })
        },
        sendCloseModal: function(name){
            this.$emit('close-modal', name);

            Vue.nextTick(function(){
                $('#' + name + '-trigger').focus();
            })
        },
        sendToggleExpertise: function(){
            this.$emit('toggle-expertise');
        },
        sendToggleRefundTransferInfo: function(){
            this.$emit('toggle-refund-transfer-info');

            this.$nextTick(function(){
                if(this.showRefundTransferInfo === true){
                    this.$refs.rtPopup.focus();
                } else {
                    this.$refs.raTrigger.focus();
                }
            })

        },
        sendUpdateSelections: function(screen, value, checked){
            this.$emit('update-selections', screen, value, checked);
        },
        /*stateWithAbbreviation: function({state, abbr}){
            return state + ' (' + abbr + ')';
        },*/
        stateWithAbbreviation: function(option){
            /* DELETING ABBREVIATION to make this more accessible in IE/Edge */
            //return option.state + ' (' + option.abbr + ')';
            return option.state;
        },
        sendUpdateStates: function(value, id){
            //alert(value[0].state + ' ' + id);
            this.$emit('update-states', value, id);

            /* The current vue-multiselect template has tabindex="1" on the close buttons. That really messes up the tab order, so reset them to 0, add aria roles
            https://github.com/shentao/vue-multiselect/blob/master/src/Multiselect.vue */
            Vue.nextTick(function(){
                var $tagContainer = $('#app-tpg .multiselect__tags-wrap');
                var $tagBtns = $('#app-tpg .multiselect__tag-icon');

                $tagContainer.attr('aria-live', 'polite');
                $tagBtns.each(function(){
                    var tagName = $(this).prev('span').text();
                    $(this).attr({
                        'tabindex'  : '0',
                        'role'      : 'button',
                        'aria-label': 'Delete ' + tagName
                    }).removeAttr('aria-hidden');
                });

                /* Focus on the one that was just created - for accessibility */
                $tagBtns.last().trigger('focus');
            })
        },
        sendGetPrice: function(){
            this.$emit('submit-get-price');
        },
        sendSaveResults: function(){
            this.$emit('save-results');
        },
        sendResetForm: function(){
            this.$emit('reset-form');
        },
        /* HRB.tools can't be used because it doesn't load before Vue is ready */
        getUrlParameter: function(name) {
            name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
            var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
            var results = regex.exec(location.search);
            return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '));
        }
    },
    template: '#template-tpg-main'
});

var appTpg = new Vue({
    el: '#app-tpg',
    data: {
        /* UI data */
        //step: 1, // Skip intro screen
        step: 2,
        showInfoScreens: {
            'about': false,
            'income': false,
            'other': false
        },
        expertiseExpanded: false,
        showRefundTransferInfo: false,
        stateError: false,
        bubbles: {
            about: [
                {
                    id:         'tpgMarried',
                    value:      'married',
                    label:      'Married',
                    checked:    false,
                    certLevel:  1
                }, {
                    id:         'tpgChildren',
                    value:      'hasDependents',
                    label:      'Have kids',
                    checked:    false,
                    certLevel:  1
                }, {
                    id:         'tpgHome',
                    value:      'ownsHome',
                    label:      'Own a home',
                    checked:    false,
                    certLevel:  2
                }, {
                    id:         'tpgNone',
                    value:      'none',
                    label:      'None apply',
                    checked:    false,
                    certLevel:  0
                }
            ],
            income: [
                {
                    id:         'tpgW2',
                    value:      'w2',
                    label:      'W-2',
                    checked:    false,
                    certLevel:  0
                }, {
                    id:         'tpgContractor',
                    value:      'freelancerOrContractor',
                    label:      'Freelancer / <br>Contractor',
                    checked:    false,
                    certLevel:  3
                }, {
                    id:         'tpgSelfEmp',
                    value:      'isSelfEmployed',
                    label:      'Self employed',
                    checked:    false,
                    certLevel:  2
                }, {
                    id:         'tpgBusiness',
                    value:      'ownsBusiness',
                    label:      'Own a business',
                    checked:    false,
                    certLevel:  3
                }, {
                    id:         'tpgNone2',
                    value:      'none',
                    label:      'None apply',
                    checked:    false,
                    certLevel:  0
                }
            ],
            other: [
                {
                    id:         'tpgRetInc',
                    value:      'hasRetirementIncome',
                    label:      'Retirement <br>income',
                    checked:    false,
                    certLevel:  3

                }, {
                    id:         'tpgInv',
                    value:      'hasStockOrInvestments',
                    label:      'Own stock / <br>investments',
                    checked:    false,
                    certLevel:  3
                }, {
                    id:         'tpgRentals',
                    value:      'ownsRentalProperty',
                    label:      'Own rentals',
                    checked:    false,
                    certLevel:  4
                }, {
                    id:         'tpgOthInc',
                    value:      'hasOtherIncome',
                    label:      'Other',
                    checked:    false,
                    certLevel:  2
                }, {
                    id:     'tpgNone3',
                    value:  'none',
                    label:  'None apply',
                    checked: false,
                    certLevel:  0
                }
            ]
        },

        /* Data sent/recieved with form submissions */
        userSelections: {
            single: false,
            married: false,
            hasDependents: false,
            ownsHome: false,
            freelancerOrContractor: false,
            isSelfEmployed: false,
            ownsBusiness: false,
            hasRetirementIncome: false,
            hasStockOrInvestments: false,
            ownsRentalProperty: false,
            hasOtherIncome: false,
            payTaxPrepWithRefund: false
        },
        stateCodes: [],
        stateInformation: [],
        taxPrepInfo: {
            priceQuoteId: '',
            priceTotal: '',
            pricePerState: '',
            priceFederal: ''
        },
        taxProInfo: {
            taxProId: '',
            taxProPSID: ''
        },
        priceResponse: {
            /* Default tax pro & pricing info */
            photoUrl: 'https://taxprofinder.hrblock.com/taxproimages/36463/69193_thumbnail.jpg',
            firstName: 'Diane',
            lastName: 'Phelan',
            yearsOfExp: '18',
            certDetails: ['Enrolled Agent (EA)', 'AFSP'],
            preparerId: 'AAAAFFhH8h7GQ-yi1BJwmemPrmRTo8UIqr3cHg==',
            amEmployeeId: '69193',
            numberOfStates: '1',
            federalPrice: '49.0',
            federalSKU: 'SEG2_FDTaxPrep',
            federalCount: '1',
            statePrice: '49.0',
            stateSKU: 'SEG2_STTaxPrep',
            stateCount: '1',
            totalPrice: '',
            refundTransferFee: '34.95',
            priceQuoteId: '000000000000000000000000000000000000'
        },

        /* For form reset and backend errors */
        defaultData: {}
    },
    computed: {
        /* UI properties */
        progressWidth: function(){
            return (this.step * 16);
        },

        /* Data sent with form submissions */
        certLevel: function(){
            var maxCertLevel = 1;
            for (var screen in this.bubbles){
                var thisScreen = this.bubbles[screen];
                for (var i = 0; i < thisScreen.length; i++){
                    var thisCertLevel = thisScreen[i].certLevel;
                    if(thisScreen[i].checked && thisCertLevel > maxCertLevel){
                        maxCertLevel = thisCertLevel;
                    }
                }
            }
            return maxCertLevel;
        },
        numberOfStates: function(){
            return this.stateCount;
        },
        otpPartnerId: function(){
            return parseInt(g_partner_id);
        },
        priceGroup: function(){
            /* call external function in tpg-pricegroup.js */
            var tpgGroup = setTpgGroup('tpgGroup');
            //console.log('km tpgGroup: ' + tpgGroup);

            /* If browser doesn't support cookies/localstorage generate the priceGroup val randomly
               If value is null or isn't A/B then set new value */
            if( !tpgGroup || !(tpgGroup === "A" || tpgGroup === "B") ) {
                tpgGroup = (Math.random()) < 0.5 ? "A" : "B";
            }
            return tpgGroup;
        },
        stateCount: function(){
            return this.stateInformation.length;
        },
        defaultTotalPrice: function(){
            var defaultDataParsed = JSON.parse(this.defaultData);
            var defaultFedPrice   = parseInt(defaultDataParsed.priceResponse.federalPrice);
            var defaultStatePrice = parseInt(defaultDataParsed.priceResponse.statePrice);
            //return String((defaultFedPrice + ((this.stateCount - 1) * defaultStatePrice))) + '.0';
            return String((defaultFedPrice + ((this.stateCount - 1) * defaultStatePrice)));
        },
        pricePayload: function(){
            var pricePayload = {
                single: this.userSelections.single,
                married: this.userSelections.married,
                hasDependents: this.userSelections.hasDependents,
                ownsHome: this.userSelections.ownsHome,
                freelancerOrContractor: this.userSelections.freelancerOrContractor,
                isSelfEmployed: this.userSelections.isSelfEmployed,
                ownsBusiness: this.userSelections.ownsBusiness,
                hasRetirementIncome: this.userSelections.hasRetirementIncome,
                hasStockOrInvestments: this.userSelections.hasStockOrInvestments,
                ownsRentalProperty: this.userSelections.ownsRentalProperty,
                hasOtherIncome: this.userSelections.hasOtherIncome,
                stateCodes: this.stateCodes,
                stateCount: this.stateCount,
                certLevel: this.certLevel,
                priceGroup: this.priceGroup,
                payTaxPrepWithRefund: this.userSelections.payTaxPrepWithRefund,
                otpPartnerId: this.otpPartnerId
            }
            return pricePayload;
        },
        tcxPayload: function(){
            var tcxPayload = {
                "recordInfo": {
                    "type": "segment 2",
                    "recordVersion": "2",
                    "source": "www.hrblock.com"
                },
                "userSelections": this.userSelections,
                "numberOfStates": this.stateCount,
                "stateInformation": this.stateInformation,
                "taxProInfo": this.taxProInfo,
                "taxPrepInfo": this.taxPrepInfo
            }
            return tcxPayload;
        },
        saveResultsUrl: function(){
            var host = document.location.hostname;
            var theUrl = '';
            /* yes, partnerID is always 0 for this */
            if ( (host.indexOf("hrbcomdev")!=-1)) {
                theUrl	= "http://tcxdailybuild.hrbinc.hrblock.net/hrblock/login/LoginRegistration.hrbx?PS=Y&TaxYear=2018&Domain=TPS&userType=seg2&TaxType=TPG&HT=F&tn=TPGInterview&FV=T&showStartwithoutAccount=false&PartnerID=0";
            } else if ( (host.indexOf("hrbcomqa")!=-1)) {
                theUrl	= "https://login.tcxqa.hrblock.net/hrblock/login/LoginRegistration.hrbx?PS=Y&TaxYear=2018&Domain=TPS&userType=seg2&TaxType=TPG&HT=F&tn=TPGInterview&FV=T&showStartwithoutAccount=false&PartnerID=0";
            } else if ( (host.indexOf("scaletest")!=-1)) {
                theUrl = "https://login.lnptcx.hrblock.com/hrblock/login/loginregistration.hrbx?PS=Y&TaxYear=2018&Domain=TPS&userType=seg2&TaxType=TPG&HT=F&tn=TPGInterview&FV=T&showStartwithoutAccount=false&PartnerID=0";
            } else {
                theUrl = "https://login.taxes.hrblock.com/hrblock/login/LoginRegistration.hrbx?PS=Y&TaxYear=2018&Domain=TPS&userType=seg2&TaxType=TPG&HT=F&tn=TPGInterview&FV=T&showStartwithoutAccount=false&PartnerID=0";
            }

            return theUrl;
        },

        /* For tracking */
        dtmId: function(){
            Math.floor(Math.random() * 1000000000000);
        }
    },
    created: function(){
        /* Store default data for reset and backend errors */
        this.defaultData = JSON.stringify(this.$data);
    },
    methods: {
        /* UI methods */
        prev: function(){
            this.step--;
            this.fireDTMStepCall();
        },
        next: function(){
            this.step++;
            this.fireDTMStepCall();
        },
        openModal: function(name){
            this.showInfoScreens[name] = true;
        },
        closeModal: function(name){
            this.showInfoScreens[name] = false;
        },
        toggleExpertise: function(){
            this.expertiseExpanded = !this.expertiseExpanded;
            this.showRefundTransferInfo = false;
        },
        toggleRefundTransferInfo: function(){
            this.showRefundTransferInfo = !this.showRefundTransferInfo;
            this.expertiseExpanded = false;
        },

        /* Methods to work with data sent/received with forms */
        updateSelections: function(screen, value, checked){
            /* If this checkbox isn't "None apply," make sure it is unchecked */
            if(value.indexOf('none') === -1){
                if(checked){
                    this.bubbles[screen].filter(function(bubble){
                        return bubble.value === 'none';
                    })[0].checked = false;
                }

                /* update userSelections */
                return this.userSelections[value] = checked;

            } else {

                /* If this checkbox is "None apply," uncheck others */
                if(checked){
                    var theOthers = this.bubbles[screen].filter(function(bubble){
                        return bubble.value !== 'none';
                    });

                    for ( var i = 0; i < theOthers.length; i++){
                        theOthers[i].checked = false;
                        thisValue = theOthers[i].value;

                        /* update userSelections */
                        this.userSelections[thisValue] = false;
                    }
                }
            }

        },
        updateStates: function(value, id){
            /* NOTES for updateStates:
               ID isn't used right now, but it's there if we need it later.
               It's the ID of the text input element. */

            /* value gives you an array of objects:
               value: [
                   {abbr: "AR", state: "Arkansas"},
                   {abbr: "CA", state: "California"}
               ]
            /* stateInformation wants key:value pairs:
               { stateName: 'AK'},
               { stateName: 'CA'} */
            /* stateCodes wants to be an array of abbreviations */
            this.stateInformation = [];
            this.stateCodes = [];

            for ( var i = 0; i < value.length; i++){
                this.stateInformation.push({stateName: value[i].abbr});
                this.stateCodes.push(value[i].abbr);
            }
            /* for validation message */
            if(this.stateInformation.length){
                this.stateError = false;
            } else{
                this.stateError = true;
            }
        },
        submitGetPrice: function(e){
            var self = this;
            var dtmRuleToCall = 'tool_step';

            if(self.stateInformation.length){
                /* Go to "matching" step */
                self.step++;
                self.fireDTMStepCall();

                axios.post('/hrb-service/taxprogo/price',
                    self.pricePayload,
                    { headers: {'Content-type': 'application/json'}
                }).then(function(response){

                    var thisResponse = response.data.response;

                    /* Log service failure in dtm */
                    if (response.data.status.status.toLowerCase() == "failed")  {
                        dtmError = "problem with at least one service call|"+JSON.stringify(thisResponse.eachServiceStatus);
                        self.recordTpgError(dtmError,"results","1","000");
                    }

                    /* Save the data */
                    self.priceResponse = JSON.parse(JSON.stringify(thisResponse));
                    self.taxPrepInfo.priceQuoteId  = self.priceResponse.priceQuoteId;
                    self.taxPrepInfo.priceTotal    = self.priceResponse.totalPrice;
                    self.taxPrepInfo.pricePerState = self.priceResponse.statePrice;
                    self.taxPrepInfo.priceFederal  = self.priceResponse.federalPrice;
                    self.taxProInfo.taxProId       = self.priceResponse.amEmployeeId;
                    self.taxProInfo.taxProPSID     = self.priceResponse.preparerId;

                    /* If CBS fails but returns 0 anyway, use default pricing
                       (should be caught by back end, but just in case) */
                    if( (thisResponse.eachServiceStatus.cbsStatus == "0") && (self.priceResponse.federalPrice == null) ){
                        /* Reset price info to default */
                        self.priceResponse.federalPrice      = defaultDataParsed.priceResponse.federalPrice;
                        self.priceResponse.federalSKU        = defaultDataParsed.priceResponse.federalSKU;
                        self.priceResponse.federalCount      = defaultDataParsed.priceResponse.federalCount;
                        self.priceResponse.statePrice        = defaultDataParsed.priceResponse.statePrice;
                        self.priceResponse.stateSKU          = defaultDataParsed.priceResponse.stateSKU;
                        self.priceResponse.stateCount        = self.stateCount;
                        self.priceResponse.totalPrice        = self.defaultTotalPrice;
                        self.priceResponse.refundTransferFee = defaultDataParsed.priceResponse.refundTransferFee;
                        self.priceResponse.priceQuoteId      = defaultDataParsed.priceResponse.priceQuoteId

                        self.taxPrepInfo.priceQuoteId  = self.priceResponse.priceQuoteId;
                        self.taxPrepInfo.priceTotal    = self.priceResponse.totalPrice;
                        self.taxPrepInfo.pricePerState = self.priceResponse.statePrice;
                        self.taxPrepInfo.priceFederal  = self.priceResponse.federalPrice;
                    }

                    /* CBS, TCX, AM calls are success */
                    if( (thisResponse.eachServiceStatus.tpIdStatus      == "0") &&
                        (thisResponse.eachServiceStatus.tpDetailStatus  == "0") &&
                        (thisResponse.eachServiceStatus.cbsStatus       == "0")){
                        try {
                            HRBData.digital_data.tool_name      = "seg2";
                            HRBData.digital_data.tool_step      = "results";
                            HRBData.digital_data.tool_event     = "";
                            HRBData.digital_data.tool_lang      = "en";
                            HRBData.digital_data.tool_client_id = "hrb";

                            _satellite.track(dtmRuleToCall);
                        }catch(e){
                            console.log("DTM: call '" + dtmRuleToCall + "' failed : "  + e);
                        }

                    } else {
                        var defaultDataParsed = JSON.parse(self.defaultData);

                        /* Handle TCX did not return a recommended Tax Pro (so use default) */
                        if(thisResponse.eachServiceStatus.tpIdStatus != "0"){
                            /* Reset tax pro info to default */
                            self.priceResponse.firstName    = defaultDataParsed.priceResponse.firstName;
                            self.priceResponse.lastName     = defaultDataParsed.priceResponse.lastName;
                            self.priceResponse.yearsOfExp   = defaultDataParsed.priceResponse.yearsOfExp;
                            self.priceResponse.photoUrl     = defaultDataParsed.priceResponse.photoUrl;
                            self.priceResponse.certDetails  = defaultDataParsed.priceResponse.certDetails;
                            self.priceResponse.preparerId   = defaultDataParsed.priceResponse.preparerId;
                            self.priceResponse.amEmployeeId = defaultDataParsed.priceResponse.amEmployeeId;

                            self.taxProInfo.taxProId        = self.priceResponse.amEmployeeId;
                            self.taxProInfo.taxProPSID      = self.priceResponse.preparerId;

                            dtmError = "problem with tcx call|" + thisResponse.eachServiceStatus.tpIdMsg;
                            self.recordTpgError(dtmError,"results","1","001");
                        }

                        /* Handle CBS call failure */
                        if(thisResponse.eachServiceStatus.cbsStatus != "0"){
                            /* Reset price info to default */
                            self.priceResponse.federalPrice      = defaultDataParsed.priceResponse.federalPrice;
                            self.priceResponse.federalSKU        = defaultDataParsed.priceResponse.federalSKU;
                            self.priceResponse.federalCount      = defaultDataParsed.priceResponse.federalCount;
                            self.priceResponse.statePrice        = defaultDataParsed.priceResponse.statePrice;
                            self.priceResponse.stateSKU          = defaultDataParsed.priceResponse.stateSKU;
                            self.priceResponse.stateCount        = self.stateCount;
                            self.priceResponse.totalPrice        = self.defaultTotalPrice;
                            self.priceResponse.refundTransferFee = defaultDataParsed.priceResponse.refundTransferFee;
                            self.priceResponse.priceQuoteId      = defaultDataParsed.priceResponse.priceQuoteId

                            self.taxPrepInfo.priceQuoteId  = self.priceResponse.priceQuoteId;
                            self.taxPrepInfo.priceTotal    = self.priceResponse.totalPrice;
                            self.taxPrepInfo.pricePerState = self.priceResponse.statePrice;
                            self.taxPrepInfo.priceFederal  = self.priceResponse.federalPrice;

                            dtmError = "problem with cbs call|" + thisResponse.eachServiceStatus.cbsMsg;
                            self.recordTpgError(dtmError,"results","1","003");
                        }

                        /* If TCX returns a terminated pro, or unable to get pro details, use default pro */
                        if(thisResponse.eachServiceStatus.tpDetailStatus != "0"){
                            /* Reset tax pro info to default */
                            self.priceResponse.firstName    = defaultDataParsed.priceResponse.firstName;
                            self.priceResponse.lastName     = defaultDataParsed.priceResponse.lastName;
                            self.priceResponse.yearsOfExp   = defaultDataParsed.priceResponse.yearsOfExp;
                            self.priceResponse.photoUrl     = defaultDataParsed.priceResponse.photoUrl;
                            self.priceResponse.certDetails  = defaultDataParsed.priceResponse.certDetails;
                            self.priceResponse.preparerId   = defaultDataParsed.priceResponse.preparerId;
                            self.priceResponse.amEmployeeId = defaultDataParsed.priceResponse.amEmployeeId;

                            self.taxProInfo.taxProId        = self.priceResponse.amEmployeeId;
                            self.taxProInfo.taxProPSID      = self.priceResponse.preparerId;

                            var taxProId = thisResponse.amEmployeeId;
                            dtmError = "problem with tp details call for id " + taxProId + "|" + thisResponse.eachServiceStatus.tpDetailMsg;
                            self.recordTpgError(dtmError,"results","1","002");
                        }
                    }

                    /* After a delay (on "matching" step), show results */
                    setTimeout(function(){
                        self.step++;
                    }, 1000);

                }).catch(function(error){
                    dtmError = ".COM Service is unavailable";
                    self.recordTpgError(dtmError,"results","1","004");

                    /* Go to error screen */
                    self.step = 8;
                });
            } else {
                /* No states are selected. Show validation message. */
                this.stateError = true;
            }

        },
        saveResults: function(){
            var self = this;

            /* Send selected values to DTM */
            this.sendOmniresults();


            axios.post('/hrb-service/taxprogo/save',
                self.tcxPayload,
                { headers: {'Content-type': 'application/json'}
            }).then(function(response){

                var thisResponse = response.data.response;

                if(response.data.response.payloadId) {
                    var blockDataId = response.data.response.payloadId;
                    var saveUrl = self.saveResultsUrl + "&tpgguid=" + blockDataId;
                    window.top.location = saveUrl;
                } else {
                    dtmError = "TCX Save Service call failed. Save ET:" + thisResponse.et + " Total ET:" + response.data.status.totalEt + " msg:" + thisResponse.exceptionMessage;
                    self.recordTpgError(dtmError,"save","1","005");

                    /* Go to error screen */
                    self.step = 8;
                }
            }).catch(function(error){
                dtmError = ".COM Service is unavailable";
                self.recordTpgError(dtmError,"save","1","006");

                /* Go to error screen */
                self.step = 8;
            });
        },
        resetForm: function(){
            /* Replace data in Vue instance with that saved in defaultData (at created) */
            Object.assign(this.$data, JSON.parse(this.defaultData));

            /* Also reset the vue-multiselect component */
            this.$children[0].value = [];

            /* Save the data again into defaultData for use in next reset.
               Because defaultData resets to empty. */
            this.defaultData = JSON.stringify(this.$data);
        },

        /* For tracking */
        fireDTMStepCall: function(){
            /* Step names match last year's DTM names, as much as possible. */
            var self = this;
            var stepName = '';
            switch ( self.step ){
                case 2:
                    stepName = 'lifestyle';
                    break;
                case 3:
                    stepName = 'employment';
                    break;
                case 4:
                    stepName = 'income';
                    break;
                case 5:
                    stepName = 'states';
                    break;
                case 6:
                    stepName = 'matching';
                    break;
                /* Step 7/results is set in submitGetPrice */
            }

            //if(self.step === 2){
            // Hiding tpg__intro-screen, so now fire this when button on lifestyle screen is clicked
            if(self.step === 3){
                /* button clicked on entry screen, went to lifestyle screen */
                var dtmRuleToCall="tool_event";
                try {
                    HRBData.digital_data.tool_name= "seg2";
                    HRBData.digital_data.tool_step ="";
                    HRBData.digital_data.tool_event= "tpg_screener_start";
                    HRBData.digital_data.tool_lang = "en";
                    HRBData.digital_data.tool_client_id = "hrb";
                    console.log("on get matched with a pro", dtmRuleToCall);
                    _satellite.track(dtmRuleToCall);

                }catch(e){
                    console.log("Error: DTM call '" + dtmRuleToCall + "' failed : "  + e);
                }

                dtmRuleToCall = "tool_step";
                try {
                    HRBData.digital_data.tool_name      = "seg2";
                    HRBData.digital_data.tool_step      = stepName;
                    HRBData.digital_data.tool_event     = "";
                    HRBData.digital_data.tool_lang      = "en";
                    HRBData.digital_data.tool_client_id = "hrb";

                    _satellite.track(dtmRuleToCall);

                }catch(e){
                    console.log("DTM: call '" + dtmRuleToCall + "' failed : " + e);
                }
            } else {
                var dtmRuleToCall = "tool_step";
                try {
                    HRBData.digital_data.tool_name      = "seg2";
                    HRBData.digital_data.tool_step      = stepName;
                    HRBData.digital_data.tool_event     = "";
                    HRBData.digital_data.tool_lang      = "en";
                    HRBData.digital_data.tool_client_id = "hrb";

                    _satellite.track(dtmRuleToCall);

                }catch(e){
                    console.log("DTM: call '" + dtmRuleToCall + "' failed : " + e);
                }
            }
        },
        phoneNumberTrack: function(){
            /* track for mobile only */
            if($(window).width() < 767) {
                try {
                    var dialedNum               = "855-279-1752";
                    HRBData.digital_data.loc    = "b";
                    HRBData.digital_data.nm     = "phone number click";
                    HRBData.digital_data.office_phone_number = dialedNum;
                    _satellite.track("click_to_call_opened");
                    console.log("DTM: Call rule click_to_call_opened");
                } catch (e){
                    console.log("DTM: Call rule click : Error " + e);
                }
            }
        },
        sendOmniresults: function(){
            /* sets eVar60 */
            var payload = this.tcxPayload;
            var numberofStates  = payload.numberOfStates;
            var totalPrice      = payload.taxPrepInfo.priceTotal;
            var refundTranfer   = "";
            var userOptions     = "";
            var omniValues      = "";

            if(payload.userSelections.married) userOptions = userOptions.concat("m").concat(",");
            if(payload.userSelections.havechildren) userOptions = userOptions.concat("dep").concat(",");
            if(payload.userSelections.ownsHome) userOptions = userOptions.concat("hm").concat(",");
            if(payload.userSelections.freelancerOrContractor) userOptions = userOptions.concat("con").concat(",");
            if(payload.userSelections.ownsBusiness) userOptions = userOptions.concat("bus").concat(",");
            if(payload.userSelections.hasStockOrInvestments) userOptions = userOptions.concat("stk").concat(",");
            if(payload.userSelections.hasRetirementIncome) userOptions = userOptions.concat("ret").concat(",");
            if(payload.userSelections.ownsRentalProperty) userOptions = userOptions.concat("ren").concat(",");
            if(payload.userSelections.hasOtherIncome) userOptions = userOptions.concat("hoi").concat(",");
            if(payload.userSelections.isSelfEmployed) userOptions = userOptions.concat("emp").concat(",");

            payload.userSelections.payTaxPrepWithRefund == true ? refundTranfer = "rty" : refundTranfer = "rtn";

            omniValues = userOptions + "|" + numberofStates + "|" + refundTranfer + "|" + totalPrice;

            /*DTM Implementation - Begin*/
            var dtmRuleToCall="tool_event";
            try {
                HRBData.digital_data.tool_client_id     = "hrb";
                HRBData.digital_data.tool_name          = "seg2";
                HRBData.digital_data.tool_language      = "en";
                HRBData.digital_data.tool_event         = "tpg_screener_complete";
                HRBData.digital_data.tool_step          = "";
                HRBData.digital_data.tool_use_summary   = omniValues;

                _satellite.track(dtmRuleToCall);
            }catch(e){
                console.log("DTM: call '" + dtmRuleToCall + "' failed : "  + e);
            }
        },
        recordTpgError: function(errorMessage, toolStep, severity, errorCode){
            var self = this;
            try {
                HRBData.digital_data.tool_name          = "seg2";
                HRBData.digital_data.tool_step          = toolStep;
                HRBData.digital_data.tool_event         = "";
                HRBData.digital_data.tool_lang          = "en";
                HRBData.digital_data.tool_client_id     = "hrb";
                HRBData.digital_data.error_id           = "RE|tpg|"+errorCode;
                HRBData.digital_data.error_severity     = severity;
                HRBData.digital_data.error_description  = self.dtmId + "|" + Date.now() + "|" + errorMessage;

                if(window.console.error){
                    /* gives Akamai mPulse visibility */
                    window.console.error(HRBData.digital_data.error_id+"|"+errorMessage);
                }
                _satellite.track('record_error');
                console.log("DTM: "+HRBData.digital_data.error_description);
            }catch(e){
                if(window.console.error){
                    /* gives Akamai mPulse visibility */
                    window.console.error(HRBData.digital_data.error_id+"|"+errorMessage+"|_satellite call failed:"+e);
                }
                console.log("DTM: call '" + self.dtmRuleToCall + "' failed : "  + e);
            }
        }
    }
});



/* Vue can't access document. Vue's tab trapping doesn't work. */
$(function(){

    /* allow closing popups with Escape key */
    $(document).on('keydown', function(e){
        if(e.keyCode === 27){
            appTpg.showInfoScreens['about'] = false;
            appTpg.showInfoScreens['income'] = false;
            appTpg.showInfoScreens['other']  = false;
            appTpg.showRefundTransferInfo = false;
        }
    });

    /* Trap TAB & Shift TAB inside popup */
    var $tpgPopup = $('[class*=tpg__info-text-] div[role=document], .tpg__price-rt-popup'),
        $tpgLastBtn = $('#app-tpg .js-last-focus');

    $tpgPopup.on('keydown', function(e) {
        if ( (e.keyCode || e.which) == 9) {
            if ( e.target.nodeName === 'DIV' && e.shiftKey){
                e.preventDefault();
                $tpgLastBtn.trigger('focus');
            }

            if ( $(e.target).hasClass('js-last-focus') && !e.shiftKey ){
                e.preventDefault();
                $tpgPopup.trigger('focus');
            }
        }
    });

    /* Close Experience dropdown when clicking outside.
       Important: target the app, not document or it throws errors.
       https://stackoverflow.com/questions/43849949/jquery-tap-and-touch-so-long-action */
    $('#app-tpg').on('touchstart click', function(e) {
        if (e.handled !== true) {
            var target = $(e.target);
            var theBtn = $('.tpg__accordion-btn');
            var theList = $('#tpg__expertise-list');
            if ( !target.is(theBtn) && !target.is(theList) ) {
                appTpg.expertiseExpanded = false;
            }
            e.handled = true;
        } else {
            return false;
        }
    });

    /* Add ability to delete state tags with keyboard */
    $('#app-tpg .multiselect__tag-icon').on('keydown', function(e) {
        if ( (e.keyCode || e.which) == 13) { // Enter
            $(this).trigger('click');
        }
    });

    /* END OF SEASON SCREEN */
    $('.tpg__retail-link').on('click', function(e){
        e.preventDefault();
        openThisTool('.tpf__entry');
    });
    /* END: END OF SEASON SCREEN */

});