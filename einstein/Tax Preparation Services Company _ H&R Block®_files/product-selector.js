/* Product Selector FY19 */

Vue.component('component-prd-bubble-checkbox', {
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

            /* will be used to handle the "None apply" button */
            this.$emit('send-handle-none', e.target.id, e.target.checked);
        }
    },
    template: '#template-prd-bubble-checkbox'
});



Vue.component('component-prd-recommendation', {
    props: {
        recOnlineProduct: Object
    },
    computed: {
        recFederalData: function(){
            return '{"pid":"' + this.recOnlineProduct.federalPid + '","lb":false}'
        },
        recStateData: function(){
            return '{"pid":"' + this.recOnlineProduct.statePid + '","lb":false}'
        },
        recStartNowData: function(){
            return '{"loc":"b","nm":"' + this.recOnlineProduct.federalPid + '-start-now","pd":"true","linkname":"product app ' + this.recOnlineProduct.productName + '","pid":"' + this.recOnlineProduct.federalPid + '","type":"sn"}'
        },
        recLearnMoreData: function(){
            return '{"loc":"b","nm":"product app lm ' + this.recOnlineProduct.productName + '"}'
        }
    },
    methods: {

    },
    template: '#template-prd-recommendation'
});



/* Component that holds other components */
Vue.component('component-prd-main', {
    props: {
        step: Number,
        choiceDiy: Boolean,
        choiceRetail: Boolean,
        choiceTaxProReview: Boolean,
        choiceInOffice: Boolean,
        choiceTaxProGo: Boolean,
        bubbles: Array,
        progressWidth: Number,
        recOnlineProduct: Object,
        inRefundAdvancePromoPeriod: Boolean
    },
    computed: {
        tpgFederalPrice: function(){
            return HRBData.config.tpgPrice.federal;
        },
        retailFederalPrice: function(){
            return HRBData.config.retailPrice.federal;
        },
        retailStatePrice: function(){
            return HRBData.config.retailPrice.state;
        }
    },
    methods: {
        sendDiy: function(){
            this.$emit('send-diy');
        },
        sendRetail: function(){
            this.$emit('send-retail');
        },
        sendTprTrue: function(){
            this.$emit('send-tpr-true');
        },
        sendTprFalse: function(){
            this.$emit('send-tpr-false');
        },
        sendHandleNone: function(id, checked){
            this.$emit('handle-none', id, checked);
        },
        sendTpgTrue: function(){
            this.$emit('send-tpg-true');
        },
        sendTpgFalse: function(){
            this.$emit('send-tpg-false');
        },
        prevClick: function(){
            this.$emit('prev-click');
        },
        nextClick: function(){
            this.$emit('next-click');
        },
        sendResetForm: function(){
            this.$emit('reset-form');
            this.value = [];
        }
    },
    template: '#template-prd-main'
});



/* The top level Vue instance */
var appPrd = new Vue({
    el: '#app-prd',
    data: {
        /* UI data */
        step: 1,
        choiceDiy: false,
        choiceRetail: false,
        choiceTaxProReview: false,
        choiceInOffice: false,
        choiceTaxProGo: false,
        bubbles: [
            {
                id:         'prdChildren',
                label:      'Have <br class="show-small">kids',
                checked:    false
            }, {
                id:         'prdHome',
                label:      'Own a <br class="show-small">home',
                checked:    false
            }, {
                id:         'prdHsa',
                label:      'Have <br class="show-small">an HSA',
                checked:    false
            }, {
                id:         'prdContractor',
                label:      'Freelancer / <br>Contractor',
                checked:    false
            }, {
                id:         'prdInv',
                label:      'Have <br class="show-small">investments',
                checked:    false
            }, {
                id:         'prdRentals',
                label:      'Own <br class="show-small">rentals',
                checked:    false
            }, {
                id:         'prdSelfEmp',
                label:      'Self <br class="show-small">employed',
                checked:    false
            }, {
                id:         'prdBusiness',
                label:      'Own a <br class="show-small">business',
                checked:    false
            }, {
                id:         'prdNone',
                label:      'None <br class="show-small">apply',
                checked:    false
            }
        ],

        /* For recommendation */
        onlineFree: {
            federalPid: '201',
            statePid:   '202',
            productName:'free',
            productPage:'/online-tax-filing/free-online-tax-filing/'
        },
        onlineDeluxe: {
            federalPid: '204',
            statePid:   '205',
            productName:'deluxe',
            productPage:'/online-tax-filing/deluxe-online-tax-filing/'
        },
        onlinePremium: {
            federalPid: '32',
            statePid:   '192',
            productName:'premium',
            productPage:'/online-tax-filing/premium-online-tax-filing/'
        },
        onlineSelfEmp: {
            federalPid: '47',
            statePid:   '48',
            productName:'selfemployed',
            productPage:'/online-tax-filing/self-employed-online-tax-filing/'
        },
        onlineTpr: {
            federalPid: '50',
            statePid:   '51',
            productName:'taxproreview',
            productPage:'/online-tax-filing/tax-pro-review/'
        },

        /* For reset */
        defaultData: {}
    },
    computed: {
        /* UI properties */
        progressWidth: function(){
            return (this.step * 25);
        },

        /* For recommendation */
        todayMS: function(){
            var todayDate = new Date();
            var todayMS = todayDate.getTime();

            /* For testing, change date with URL query: ?forceDate="00-00-0000" */
            var forceDate = this.getUrlParameter('forceDate');
            if (forceDate !== null && forceDate !== '') {
                var numbers = forceDate.match(/\d+/g);
                var date = new Date(numbers[2], numbers[0] - 1, numbers[1]);
                todayMS = date.getTime();
            }

            return todayMS;
        },
        inMoreZeroPromoPeriod: function(){
            var inMoreZeroPromoPeriod = false;

            /* More Zero Promo: ??? to ??? */
            /* TO BE DETERMINED - SET DATES AND UNCOMMENT LINE UNDER if(ownHome) */
            var moreZeroBeginMS = Date.parse('12/01/2018');
            var moreZeroEndMS   = Date.parse('03/31/2019');

            if (this.todayMS >= moreZeroBeginMS && this.todayMS <= moreZeroEndMS) {
                inMoreZeroPromoPeriod = true;
            }

            return inMoreZeroPromoPeriod;
        },
        inRefundAdvancePromoPeriod: function(){
            var inRefundAdvancePromoPeriod = false;

            /* Refund Advance Promo: 01/04/2019 to 02/28/2019 */
            var refundAdvanceBeginMS = Date.parse('01/04/2019');
            var refundAdvanceEndMS   = Date.parse('02/28/2019');

            if (this.todayMS >= refundAdvanceBeginMS && this.todayMS <= refundAdvanceEndMS){
                inRefundAdvancePromoPeriod = true;
            }

            return inRefundAdvancePromoPeriod;
        },
        recOnlineProduct: function(){
            var haveKids = this.bubbles.filter(function(bubble){
                return bubble.id === 'prdChildren';
            })[0].checked;
            var ownHome = this.bubbles.filter(function(bubble){
                return bubble.id === 'prdHome';
            })[0].checked;
            var haveHsa = this.bubbles.filter(function(bubble){
                return bubble.id === 'prdHsa';
            })[0].checked;
            var isContractor = this.bubbles.filter(function(bubble){
                return bubble.id === 'prdContractor';
            })[0].checked;
            var haveInvestments = this.bubbles.filter(function(bubble){
                return bubble.id === 'prdInv';
            })[0].checked;
            var ownRentals = this.bubbles.filter(function(bubble){
                return bubble.id === 'prdRentals';
            })[0].checked;
            var selfEmployed = this.bubbles.filter(function(bubble){
                return bubble.id === 'prdSelfEmp';
            })[0].checked;
            var ownBusiness = this.bubbles.filter(function(bubble){
                return bubble.id === 'prdBusiness';
            })[0].checked;


            /* Default: Free */
            var thisRecommendation = this.onlineFree;

            if(haveKids){
                thisRecommendation = this.onlineFree;
            }
            if(ownHome){
                //if (this.inMoreZeroPromoPeriod){
                    //thisRecommendation = this.onlineFree;
                //} else {
                    thisRecommendation = this.onlineDeluxe;
                //}
            }
            if(haveHsa){
                thisRecommendation = this.onlineDeluxe;
            }
            if(isContractor || haveInvestments || ownRentals) {
                thisRecommendation = this.onlinePremium;
            }
            if(selfEmployed || ownBusiness){
                thisRecommendation = this.onlineSelfEmp;
            }
            if(this.choiceTaxProReview){
                thisRecommendation = this.onlineTpr;
            }
            return thisRecommendation;
        }
    },
    created: function(){
        /* Store default data for reset */
        this.defaultData = JSON.stringify(this.$data);
    },
    methods: {
        setDiy: function(){
            this.choiceDiy = true;
            this.step++;
            this.fireDTMStepCall('yep');

            /* then all retail choices are false */
            this.choiceRetail = false;
            this.choiceInOffice = false;
            this.choiceTaxProGo = false;
        },
        setRetail: function(){
            this.choiceRetail = true;
            this.step++;
            this.fireDTMStepCall('not quite');

            /* then all retail choices are false */
            this.choiceDiy = false;
            this.choiceTaxProReview = false;
        },
        setTprTrue: function(){
            this.choiceTaxProReview = true;
            this.next();
        },
        setTprFalse: function(){
            this.choiceTaxProReview = false;
            this.step++;
            this.fireDTMStepCall('no');
        },
        handleNone: function(id, checked){
            /* If this checkbox isn't "None apply," make sure it is unchecked */
            if(id !== 'prdNone'){
                if(checked){
                    this.bubbles.filter(function(bubble){
                        return bubble.id === 'prdNone';
                    })[0].checked = false;
                }

            } else {

                /* If this checkbox is "None apply," uncheck others */
                if(checked){
                    var theOthers = this.bubbles.filter(function(bubble){
                        return bubble.id !== 'prdNone';
                    });
                    for ( var i = 0; i < theOthers.length; i++){
                        theOthers[i].checked = false;
                    }
                }
            }
        },
        setTpgTrue: function(){
            this.choiceTaxProGo = true;
            this.step++;
            this.fireDTMStepCall('no');
        },
        setTpgFalse: function(){
            this.choiceTaxProGo = false;
            this.step++;
            this.fireDTMStepCall('yes');
        },
        prev: function(){
            this.step--;
            this.fireDTMStepCall('back');
        },
        next: function(){
            this.step++;
            this.fireDTMStepCall('yes next');

            var self = this;
            
            Vue.nextTick(function(){
                
                /* Refresh pricing, since data-product value wasn't there on page load */
                HRB.products.displayPricing();
                
                /* If next() is called outside Vue (home page hero), 2x stars are written unless we check */
                var noStars = $('#bv-' + self.recOnlineProduct.productName + ' .star-box').length === 0;
                /* The script in hrb.js really wants a jQuery reference to element here. */
                if(noStars){
                    HRB.ui.BVratings.writeRatings( $('#app-prd [data-bvrating-id]') );
                }
            });
        },
        resetForm: function(){
            Object.assign(this.$data, JSON.parse(this.defaultData));
            
            /* Store it again for next reset */
            this.defaultData = JSON.stringify(this.$data);
        },
        getUrlParameter: function(name) {
            name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
            var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
            var results = regex.exec(location.search);
            return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
        },

        /* For tracking */
        fireDTMStepCall: function(btn){
            var self = this;
            var stepName = '';
            switch ( self.step ){
                case 2:
                    if(self.choiceDiy){ 
                        stepName = 'tpr or online';
                    } else if(self.choiceRetail){
                        stepName = 'office or tpg';
                    }
                    break;
                case 3:
                    if(self.choiceDiy && !self.choiceTaxProReview){
                        stepName = 'about';
                    } else if(self.choiceTaxProReview) {
                        stepName = 'tpr';
                    } else if(self.choiceRetail && self.choiceTaxProGo){
                        stepName = 'tpg';
                    } else if(self.choiceRetail && !self.choiceTaxProGo){
                        stepName = 'office';
                    }
                    break;
                case 4: 
                    if(self.recOnlineProduct.federalPid === '201' && !self.choiceTaxProReview){
                        stepName = 'free';
                    } else if(self.recOnlineProduct.federalPid === '204' && !self.choiceTaxProReview){
                        stepName = 'deluxe';
                    } else if(self.recOnlineProduct.federalPid === '32' && !self.choiceTaxProReview){
                        stepName = 'premium';
                    } else if(self.recOnlineProduct.federalPid === '47' && !self.choiceTaxProReview){
                        stepName = 'selfemployed';
                    }
                    break;
            }
            
            try {
                HRBData.digital_data.virtual_page_name = stepName;
                HRBData.digital_data.loc = "omni";
                HRBData.digital_data.nm = btn;
                _satellite.track('vpage_global');
            }catch(e){
                console.log("DTM: call vpage_global failed: " + e);
            }
        }
    }
});