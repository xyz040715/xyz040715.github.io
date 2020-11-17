/**
 * @file
 */

(function ($) {
  $(document).ready(function () {
    if (typeof(drupalSettings.scotts_magento) !== 'undefined' && 
        drupalSettings.scotts_magento['magento-link-store'] === '1' && 
        drupalSettings.scotts_locales['countryCode'] === 'US' && 
        drupalSettings.scotts_magento['magento-api-active'] != '1' &&
        drupalSettings.scotts_magento['magento-TurnOff-Site-Capability'] !== '1') {
      var cartIframe = $('#magentoCartIframe');
      var headerRegion = $('#header-layout .region--inner-wrapper');
      cartIframe.css('width', drupalSettings.scotts_magento['magentoCart-desktop-width'] || '100px');
      cartIframe.css('height', drupalSettings.scotts_magento['magentoCart-desktop-height'] || '50px');
      if ('y' === $.cookie("showCart")) {
        // DRUP-2178: Only fetch/show cart AFTER an add-to-cart is clicked.
        cartIframe.show();
        cartIframe.attr('src', drupalSettings.scotts_magento['magentoCartPage-url']);
      }

      // TODO: Create block for iframe.
      headerRegion.append(cartIframe);
    }

    $(window).on("message onmessage", function (e) {
      // If cart has been clicked, then redirect to the magento cart url.
      var data = e.originalEvent.data;
      if (data === "cartClicked") {
        window.location.href = drupalSettings.scotts_magento['magentoCart-redirectUrl'];
      }
    });

  });

})(jQuery, Drupal, document);
