/**
 * @file
 */

(function($) {

  var iframeWidth;
  var iframeHeight;
  var initialWidth;
  var pdpIframe = $("#iframeMagentoAddToCart");
  var stickyAddToCart;
  try {
    stickyAddToCart = drupalSettings.scotts_magento["sticky-add-to-cart"];
  } catch (err) {
    stickyAddToCart = 0;
  }

  function getIframeDimensions() {
    // Get window size.
    var windowSize = $(window).width();
    // Based on window size, apply desktop or mobile dimensions.
    if (windowSize > 768) {
      iframeWidth = 'magentoProduct-desktop-width';
      iframeHeight = 'magentoProduct-desktop-height';
    }
    else {
      iframeWidth = 'magentoProduct-mobile-width';
      iframeHeight = 'magentoProduct-mobile-height';
    }

    initialWidth = windowSize;
  }

  var reloadMiniCart = function() {
    if ("y" === $.cookie("showCart")) {
      // Cart already showing.
      // Hackishly force iframe to reload due to same-origin policy.
      // Need to reload iframe cart to show correct cart totals.
      $("#magentoCartIframe").attr("src", function(i, src) {
        // this.show();
        return src;
      });
    } else {
      // DRUP-2178: Cart not yet showing. Do first fetch of and show it.
      $.cookie("showCart", "y", { path: "/" });
      var cartIframe = $("#magentoCartIframe");
      cartIframe.attr(
        "src",
        drupalSettings.scotts_magento["magentoCartPage-url"]
      );
      cartIframe.show();
    }
  };

  function extraPaddingMobile() {

    // Get window size.
    var windowSize = $(window).width();

    // If mobile, apply padding to bottom.
    if (windowSize < 768) {
      // Get iframe element height.
      var calcIframeHeight = pdpIframe.height();

      // Add padding to the bottom so sticky iframe does not cover content.
      $("body").css( "padding-bottom", calcIframeHeight);
    }
    else {
      // Remove any padding that might have been set if window resized.
      $("body").css( "padding-bottom", '');
    }

  }

  $(document).ready(function() {
    if (
      typeof drupalSettings.scotts_magento !== "undefined" &&
      typeof drupalSettings.scotts_product !== "undefined" &&
      drupalSettings.scotts_magento["magento-link-store"] === "1" &&
      drupalSettings.scotts_locales["countryCode"] === "US" &&
      drupalSettings.scotts_magento['magento-api-active'] != '1' &&
      drupalSettings.scotts_magento['magento-TurnOff-Site-Capability'] !== '1'
    ) {
      // Configure product purchase via magento iframe if this product is available online.
      var availableOnline =drupalSettings.scotts_product.magentoAvailableOnline;

      getIframeDimensions();

      if (availableOnline === "1") {
        pdpIframe.css(
          "width",
          drupalSettings.scotts_magento[iframeWidth]
        );
        pdpIframe.css(
          "height",
          drupalSettings.scotts_magento[iframeHeight]
        );

        // If there is a description, place iframe above the product summary and benefits.
        var iFrameLocation = $(".block-field-product-summary-benefits");
        if (iFrameLocation.length) {
          pdpIframe.insertBefore(".block-field-product-summary-benefits");
        }
        // else move into the bottom of overview region so will stay in column.
        else {
          pdpIframe.appendTo(".block-region-overview");
        }

        // Do these LAST to prevent a frame reload during the Move above.
        pdpIframe.show();
        pdpIframe.attr(
          "src",
          drupalSettings.scotts_magento["magentoProductPage-url"] +
          "?sku=" +
          drupalSettings.scotts_product.magentoProductId
        );

        if (stickyAddToCart === "1") {
          pdpIframe.addClass('sticky-iframe');
          extraPaddingMobile();
        }
      }

      $(window).resize(function () {

        var currentWidth = $(window).width();

        // If the widow increases or decreases past the specific product page breakpoint then adjust width.
        if ((initialWidth > 768 && currentWidth < 768 && currentWidth < initialWidth) ||
          (initialWidth < 768 && currentWidth > 768 && currentWidth > initialWidth)) {

          getIframeDimensions();

          // Get new Width.
          if (availableOnline === "1") {
            pdpIframe.css(
              "width",
              drupalSettings.scotts_magento[iframeWidth]
            );
            pdpIframe.css(
              "height",
              drupalSettings.scotts_magento[iframeHeight]
            );

          }

          if (stickyAddToCart === 1) {
            extraPaddingMobile();
          }

        }

      });

      $(window).on("message onmessage", function(e) {
        var data = e.originalEvent.data;

        // If buy now button has been clicked, show success message.
        if (data && (data.event === "productAdded" || data === "productAdded")) {
          if (data.dataLayer) {
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push(JSON.parse(data.dataLayer));
          }
          // Track this event for Dynamic Tag Manager.
          window.parent.postMessage(
            JSON.stringify({
              messageType: "DTM",
              key: "product_added_to_cart",
              value: "",
              product_sku: [drupalSettings.scotts_product.magentoProductId]
            }),
            "*"
          );

          reloadMiniCart();

          // Show success message to user.
          $(
            '<div id="product-added-msg"><p>' +
            drupalSettings.scotts_magento["magentoCart-success-msg"] +
            '<a href="' +
            drupalSettings.scotts_magento['magentoCart-checkout-pg'] +
            '">' +
            drupalSettings.scotts_magento["magentoCart-success-msg-clickable"] +
            '</a></p></div>'
          )
            .insertBefore("#iframeMagentoAddToCart")
            .delay(10000)
            .fadeOut(2000, function() {
              $(this).remove();
            });

          // DRUP-2235 if selecting a different size in addToCart iframe, try switching to image associated to that size
        } else if (data && data.event === "sizeChange") {

          // Only select "tracklink" children inside bx-pager since "tracklink" class can be on many divs.
          var parent = document.querySelector('.bx-pager');
          var elems = parent.getElementsByClassName(
            "tracklink " + data.data.size
          );
          if (elems.length > 0) {
            elems[0].click();
          }

          $(
            "div.field.field--name-field-product-primary-sku.field--type-string.field--label-hidden.field__item"
          ).text(data.data.magentoSku);
        } else if (data && data.event === "cartUpdated") {
          // If not an add but still needs to update datalayer
          if (data.dataLayer) {
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push(JSON.parse(data.dataLayer));
          }
          reloadMiniCart();
        }
      });
    }
  });

})(jQuery, Drupal, document);
