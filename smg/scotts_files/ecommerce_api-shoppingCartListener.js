/**
 * @file
 */

(function ($, Drupal, drupalSettings) {
  Drupal.behaviors.setM2CartAPI = {
    attach: function(context,settings){
      if (typeof(drupalSettings.scotts_magento) !== 'undefined' && 
               drupalSettings.scotts_magento['magento-link-store'] === '1' && 
               drupalSettings.scotts_locales['countryCode'] === 'US' && 
               drupalSettings.scotts_magento['magento-api-active'] === '1' &&
               drupalSettings.scotts_magento['magento-TurnOff-Site-Capability'] !== '1') {

        var cartAPI = $('#magentoCartAPI');
        var headerRegion = $('#header-layout .region--inner-wrapper');
       
        // Set cartAPI width and height from settings form and append it on Header
        cartAPI.css('width', drupalSettings.scotts_magento['magentoCart-desktop-width'] || '100px');
        cartAPI.css('height', drupalSettings.scotts_magento['magentoCart-desktop-height'] || '50px');
        cartAPI.attr('href', drupalSettings.scotts_magento['magentoCartPage-url-override']+'?cart='+drupalSettings.scotts_m2_api['cart_id']);
        cartAPI.show();
        headerRegion.append(cartAPI);
        // Display MiniCart count
        let itemCount = drupalSettings.scotts_m2_api['item_count'];
        if(itemCount > 0){
          $('#m2_Api_Cart_Number').append('('+itemCount+')');
        }
      }
    }
  }
})(jQuery, Drupal, drupalSettings);
