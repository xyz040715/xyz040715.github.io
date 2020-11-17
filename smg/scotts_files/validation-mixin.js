define([
   'jquery',
   'jquery/ui',
   'jquery/validate',
   'mage/translate'
], function($){
   'use strict';
       
        return function() {
            $.validator.addMethod(
                "validate-street0-extra-words",
                function(value, element) {
                    if(value.toLowerCase().includes("none") && value.trim().length == 4)
                    {
                        return false;
                    }
                    else
                    {
                        return true;
                    }
                },
                $.mage.__("Please enter a valid street address.")
            );
            
            $.validator.addMethod(
                "validate-street1-extra-words",
                function(value, element) {
                    if(value.toLowerCase().includes("none") && value.trim().length == 4)
                    {
                        return false;
                    }
                    else
                    {
                        return true;
                    }
                },
                $.mage.__("Please only include apartment or suite number, if applicable.")
            );
    }
});