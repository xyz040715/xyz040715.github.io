define([
    'jquery',
     'Magento_Customer/js/customer-data'
], function($,customerData) {
    'use strict';
    return function(targetModule) {
        return targetModule.extend({
			removeAll: function () {
              var redirect = $(document.activeElement).attr('href');
              if(typeof redirect !== "undefined"){
               window.location = redirect;
		      }
            },
            onHiddenChange: function (isHidden) {
            var self = this;
            // Hide message block if needed
           if (isHidden) {
//                setTimeout(function () { 
//                    $(self.selector).hide('blind', {}, 500);
//                }, 30000);
				var mvar = $('.message-error div').html();
					if (typeof mvar !== "undefined") {
					var sections = ['cart'];
					customerData.invalidate(sections);
					customerData.reload(sections, true);
					$('.message-error div').html(mvar); 
					$('.message-error div').each(function(){
					var $this = $(this);
					var t = $this.text();
					$this.html(t.replace('&lt','<').replace('&gt', '>'));
				   }); 
			}             
           }
          }
        });
    };

});
