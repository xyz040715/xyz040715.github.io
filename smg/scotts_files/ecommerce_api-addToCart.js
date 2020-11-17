/**
 * @file
 */

(function ($, Drupal, drupalSettings) {
  
  var APIWidth;
  var APIHeight;
  var initialWidth;
  var pdpAPI = $("#magentoAddToCartAPI");
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
      APIWidth = 'magentoProduct-desktop-width';
      APIHeight = 'magentoProduct-desktop-height';
    }
    else {
      APIWidth = 'magentoProduct-mobile-width';
      APIHeight = 'magentoProduct-mobile-height';
    }

    initialWidth = windowSize;
  }

  function sizeChange(magentoSKU,productSize,productPrice){
    
     // Only select "tracklink" children inside bx-pager since "tracklink" class can be on many divs.
     var parent = document.querySelector('.bx-pager');
     var elems = parent.getElementsByClassName(
       "tracklink " + productSize
     );
     if (elems.length > 0) {
       elems[0].click();
     }
    
    // Updates SKU HTML element
    $(
      "div.field.field--name-field-product-primary-sku.field--type-string.field--label-hidden.field__item"
    ).text(magentoSKU);

    // Upates Price HTML element
    $('#price-box-MagentoAPI').empty();
    $('#price-box-MagentoAPI').append('$ '+productPrice);
  }

  function extraPaddingMobile() {

    // Get window size.
    var windowSize = $(window).width();

    // If mobile, apply padding to bottom.
    if (windowSize < 768) {
      // Get iframe element height.
      var calcAPIHeight = pdpAPI.height();

      // Add padding to the bottom so sticky iframe does not cover content.
      $("body").css( "padding-bottom", calcAPIHeight);
    }
    else {
      // Remove any padding that might have been set if window resized.
      $("body").css( "padding-bottom", '');
    }

  }

  function showSuccessPopUp(){
    $(
      '<div id="product-added-msg"><p>' +
      drupalSettings.scotts_magento["magentoCart-success-msg"] +
      '<a href="' +
      drupalSettings.scotts_magento['magentoCart-checkout-pg'] +
      '">' +
      drupalSettings.scotts_magento["magentoCart-success-msg-clickable"] +
      '</a></p></div>'
    )
      .insertBefore(pdpAPI)
      .delay(10000)
      .fadeOut(2000, function() {
        $(this).remove();
      });
  }

  function refreshMiniCartitemCount(itemCount){
    if(itemCount > 0){
      $('#m2_Api_Cart_Number').empty();
      $('#m2_Api_Cart_Number').append('('+itemCount+')');
    }
  }

  // Click Listener for plus 1 quantity button
  $("#minus_api").click(function(){
    if ($('#qty_api').val() > 1){
      $('#qty_api').val(parseInt($('#qty_api').val())-1);
    }
  });

   // Click Listener for plus 1 quantity button
  $("#plus_api").click(function (){
    $('#qty_api').val(parseInt($('#qty_api').val())+1);
  });

  // On change listener for product dropdown, and updates HTML
  $('#selectSizeApi').change(function(){
    var selectedSKU = $('#selectSizeApi option:selected').val();
    let products = drupalSettings.scotts_m2_api.productAttributes;
    sizeChange(selectedSKU,products[selectedSKU]['size'],products[selectedSKU]['price'])
  });

  // AJAX Post call for Add To Cart Form 
  $("#addToCartTest").click(function (){
    // Get selected Product data and set an Object
    var selectedSku =  $('#selectSizeApi option:selected').val();
    var qty = $('#qty_api').val();
    var jsonAddToCart = new Object();
    jsonAddToCart.sku = selectedSku;
    jsonAddToCart.qty = qty;
 
    // get CSRF token from drupal session
    var csrfToken = '';
    $.ajax({
      url:Drupal.url('session/token'),
      type:'get',
      dataType:'html',
      async:false,
      success:function(data){
        csrfToken = data;
      }
    });

    // Send product data to controller 
    $.ajax({
      url: '../../admin/config/services/ecommerceapi/addToCart',
      method: 'POST',
      headers: {
        'Content-Type': 'json',
        'X-CSRF-Token': csrfToken
      },
      async:false,
      data: JSON.stringify(jsonAddToCart),
      success:function(response){
        if(response != 'error'){
          refreshMiniCartitemCount(response);
          showSuccessPopUp();
        }
        
      },
      error:function(error){
        console.log(error);
      }
    });
  
    return false;
  }
  );

  $(document).ready(function() {
    if (
      typeof drupalSettings.scotts_magento !== "undefined" &&
      typeof drupalSettings.scotts_product !== "undefined" &&
      typeof drupalSettings.scotts_m2_api  !== "undefined" &&
      drupalSettings.scotts_magento["magento-link-store"] === "1" &&
      drupalSettings.scotts_locales["countryCode"] === "US" &&
      drupalSettings.scotts_magento['magento-api-active'] === '1' &&
      drupalSettings.scotts_magento['magento-TurnOff-Site-Capability'] !== '1'
    ) {
      // Configure product purchase via magento API if this product is available online.
      var availableOnline = drupalSettings.scotts_product.magentoAvailableOnline;
      
      getIframeDimensions();

      if (availableOnline === "1") {
        pdpAPI.css(
          "width",
          drupalSettings.scotts_magento[APIWidth]
        );
        pdpAPI.css(
          "height",
          drupalSettings.scotts_magento[APIHeight]
        );

        // If there is a description, place API above the product summary and benefits.
        var iFrameLocation = $(".block-field-product-summary-benefits");
        if (iFrameLocation.length) {
          pdpAPI.insertBefore(".block-field-product-summary-benefits");
        }
        // else move into the bottom of overview region so will stay in column.
        else {
          pdpAPI.appendTo(".block-region-overview");
        }

        // Get products and create dropdown options accordingly
        let products = drupalSettings.scotts_m2_api.productAttributes;
        $.each(products, function (i,product){
          $('#selectSizeApi').append($('<option>',{
            value:product.sku,
            text:product.size,
            selected:product.isDefault
          }));

          // Set the HTML with default product data
          if(product.isDefault == true){
            sizeChange(product.sku,product.size,product.price);
          }
        });
        
        // Do these LAST to prevent a frame reload during the Move above.
        pdpAPI.show();

        if (stickyAddToCart === "1") {
          pdpAPI.addClass('sticky-API');
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
            pdpAPI.css(
              "width",
              drupalSettings.scotts_magento[APIWidth]
            );
            pdpAPI.css(
              "height",
              drupalSettings.scotts_magento[APIHeight]
            );

          }

          if (stickyAddToCart === 1) {
            extraPaddingMobile();
          }

        }

      });

      
    }
  });


})(jQuery, Drupal, drupalSettings);