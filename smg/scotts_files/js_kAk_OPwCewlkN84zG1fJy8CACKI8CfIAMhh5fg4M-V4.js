/**
 * @file
 * TOO MANY things are being put here.  ONLY common cross-site and
 * cross-page-type actions should be put here.  Most JS should be
 * in module-specific js files.
 * Don't use JS as a crutch/bandaid to 'fix' something that should
 * really be changed/implemented via twig, etc.
 * Doing things via JS will NOT be seen by Smartling and perhaps not by DTM.
 * If not sure something should be here -- it probably shouldn't be.
 * Discuss with other team members BEFORE adding additional logic here.
 **/

(function ($, Drupal, drupalSettings) {

  "use strict";

  // Custom Scotts variables to pass to the DOM.
  drupalSettings.scotts_base = {
    config: {}
  };

  // Custom configuration settings.
  drupalSettings.scotts_base.config = {

  };

  if (drupalSettings.toolbar) {
    // Attempting to make toolbar play nice with Scotts breakpoints.
    drupalSettings.toolbar.breakpoints = {
      'toolbar.narrow': 'all',
      'toolbar.standard': 'all and (min-width: 600px)',
      'toolbar.wide': 'all and (min-width: 960px)'
    };
  }
  /**
   * Function to return active number of breakpoints.
   *
   * This function will simply return an integer value of how many active
   * breakpoints are currently in use.
   *
   * We can assume if only 1 breakpoints is active, that it IS mobile.
   *
   * Example Usage when breakpoints change:
   *
   * $(window).on('breakpointAdded breakpointRemoved', function(){
   *    if (scottsActiveBreakpoints() > 1) {
   *       // do something when we switch to a non-mobile view
   *   } else {
   *       // only 1 breakpoint, assume mobile
   *   }
   * });
   *
   * Example Usage when page loads:
   *
   * $(window).on('load ready', function(){
   *    if (scottsActiveBreakpoints() > 1) {
   *       // do something when we discover a non-mobile view
   *   } else {
   *       // only 1 breakpoint, assume mobile
   *   }
   * });
   *
   * @type function
   *
   * @return int Number of Active Breakpoints
   */
  var breakpoint;
  var scottsBreakpoints;

  var scottsActiveBreakpoints = function () {
    breakpoint = 0;
    scottsBreakpoints = drupalSettings.omega_breakpoints;

    $.each(scottsBreakpoints, function (index, object) {
      if (window.matchMedia(object.query).matches) {
        breakpoint++;
      }
    });

    // Return the active number of breakpoints.
    return breakpoint;
  };

  var scottsIsMobileBreakpoint = function (e, b) {
    // Only one breakpoint is active. Has to be mobile.
    if (scottsActiveBreakpoints() == 1) {
      return true;
    }

    // Narrow breakpoint active. Is mobile.
    if (e.type == 'breakpointAdded' && b.name == 'Narrow') {
      return true;
    }

    // Removing Normal breakpoint. Is mobile.
    if (e.type == 'breakpointRemoved' && b.name == 'Normal') {
      return true; // This IS mobile.
    }

    // Adding Normal or Wide breakpoint. Is not mobile.
    if (e.type == 'breakpointAdded' && (b.name == 'Normal' || b.name == 'Wide')) {
      return false; // This is NOT mobile.
    }

  };

  var equalHeightSections;
  var equalHeightOptions = {
    byRow: false,
    property: 'height',
    //target: null,
    remove: false
  };

  /**
   * Utilize matchHeight.js to create equal height elements.
   *
   * Provide functionality to make a set of jQuery objects the same height using matchHeight().
   *
   * @var equalHeightSections array of jQuery objects to apply matchHeight functionality
   * @see https://github.com/liabru/jquery-match-height
   * @type {{attach: Drupal.behaviors.equalizeBlockHeight.attach}}
   */
  Drupal.behaviors.equalizeBlockHeight = {
    attach: function (context, settings) {

      // Order in this list can be important for multiple pieces in a page.
      equalHeightSections = [
        $('.view-scotts-article-libraries > .view-content > .views-row'),
        // Do Images, then Titles, then whole item--product to get proper alignments.
        $('.view-scotts-product-list > .view-content > .list-item--product > .image-wrapper'),
        $('.view-scotts-product-list > .view-content > .list-item--product > .info-wrapper > .product-list-item__title'),
        $('.view-scotts-product-list > .view-content > .list-item--product'),
        $('.view-scotts-product-list-faceted > .view-content > .list-item--product > .image-wrapper'),
        $('.view-scotts-product-list-faceted > .view-content > .list-item--product > .info-wrapper > .product-list-item__title'),
        $('.view-scotts-product-list-faceted > .view-content > .list-item--product'),
        $('.view-scotts-product-categories > .view-content > .views-row > .category-wrapper'),
        $('.sub-category-grid-filter .content-wrapper .list-item--title > a'),
        // Bundle associated products.
        $('.product-bundle-associated-products-block .view-content .views-row .views-field-nothing span span'),
        // Following lines up the 3 column tile layout in both real live and when using the IPE.
        $('.scotts-three-column-tiles .layout-region--tile-1, .scotts-three-column-tiles .layout-region--tile-2, .scotts-three-column-tiles .layout-region--tile-3'),
        $('.scotts-three-column-tiles .layout-region--tile-4, .scotts-three-column-tiles .layout-region--tile-5, .scotts-three-column-tiles .layout-region--tile-6'),
        $('.scotts-three-column-tiles .layout-region--tile-7, .scotts-three-column-tiles .layout-region--tile-8, .scotts-three-column-tiles .layout-region--tile-9'),
        // Following is for teaser elements within Landing Layout 1 and 2 tiles.
        $('.scotts-landing-layout-one .layout-region--two-col .block > .content-teaser-section'),
        $('.scotts-landing-layout-one .layout-region--three-col .block > .content-teaser-section'),
        $('.scotts-landing-layout-one .layout-region--two-col .block > .content-teaser-section > .teaser-header-container'),
        $('.scotts-landing-layout-one .layout-region--three-col .block > .content-teaser-section > .teaser-header-container'),
        $('.scotts-landing-layout-one .layout-region--two-col .block > .content-teaser-section > .teaser-image'),
        $('.scotts-landing-layout-one .layout-region--three-col .block > .content-teaser-section > .teaser-image'),
        $('.scotts-landing-layout-one .layout-region--two-col .block > .content-teaser-section .field--name-field-content-teaser-synopsis'),
        $('.scotts-landing-layout-one .layout-region--three-col .block > .content-teaser-section .field--name-field-content-teaser-synopsis'),
        $('.scotts-landing-layout-two .layout-region--two-col .block > .content-teaser-section'),
        $('.scotts-landing-layout-two .layout-region--three-col .block > .content-teaser-section'),
        $('.scotts-landing-layout-two .layout-region--two-col .block > .content-teaser-section > .teaser-header-container'),
        $('.scotts-landing-layout-two .layout-region--three-col .block > .content-teaser-section > .teaser-header-container'),
        $('.scotts-landing-layout-two .layout-region--two-col .block > .content-teaser-section > .teaser-image'),
        $('.scotts-landing-layout-two .layout-region--three-col .block > .content-teaser-section > .teaser-image'),
        $('.scotts-landing-layout-two .layout-region--two-col .block > .content-teaser-section .field--name-field-content-teaser-synopsis'),
        $('.scotts-landing-layout-two .layout-region--three-col .block > .content-teaser-section .field--name-field-content-teaser-synopsis'),
        // Following is for ScottsBrands Help Center.
        $('.layout--twocol .block > .content-teaser-section'),
        // OPS Recommended Products.
        $('.block-field-scotts-related-products .field--name-field-scotts-related-products > .field__item'),
        $('.node--type-product .node--view-mode-full_width_content_product .view-scotts-related-products-content .view-content .related-product-item .related-product-item__title a'),
        $('.node--type-product .node--view-mode-full_width_content_product .view-related-bundles .view-content .related-product-item .related-product-item__title a'),
        $('.node--type-product .node--view-mode-full_width_content_product .view-related-bundles .view-content .views-row .related-product-item__title a'),
        $('.node--type-article .node--view-mode-full_width_content .related-products-module .related-product-item'),
        // Product related OPS Problems.
        $('.view-scotts-related-problems .view-content > .related-problems-item'),
        // Marquee Content Marquee/Teasers.
        $('.marquee-content--teasers .field--name-field-marquee-slides .marquee-slide > .marquee-slide--inner'),
        $('.marquee-content--marquees .field--name-field-marquee-slides > .marquee-slide'),
        // 4 Up Content Teasers.
        $('.field--name-field-content-teaser-4up-ref .four-up-teaser-wrapper > .content-teaser-section'),
        $('.product-catalog-navigation--wrapper ul.menu .slick-slide .taxonomy-term a span'),
        $('.paragraph--type--paragraph-key-features-row-item .field--name-field-paragraph-pdp-heading'),
        // Problem-Solver items - Moved from here to solver.js for performance reasons
        // Custom HTML Blocks (or anything) with the .eqh-block class applied.
        // Intentionally very generic. Shouldn't use too many of these type blocks on a page.
        $('.eqh-block')
      ];

      $(window).on('load resize', function () {
        $.each(equalHeightSections, function (index, section) {
          $(section).matchHeight(equalHeightOptions);
        });
      });

      // Ensure heights are recalculated after the live chat button loads.
      // Could be written better if LP has an after render event available w/o the setX wizardry.
      var lpHeightCalculate = setInterval(function () {
        if (typeof (lpTag) != 'undefined' && lpTag.loaded) {
          setTimeout(function () {
            $(window).trigger('resize');
            clearInterval(lpHeightCalculate);
          }, 1000);
        }
      }, 1000);

      // Ensure when IPE opens that anything in there that needed adjusted does.
      // The outer IPE wrapper.
      var ipe = $('#panels-ipe-tray');
      $(ipe).click(function () {
        $.each(equalHeightSections, function (index, section) {
          $(section).matchHeight(equalHeightOptions);
        });
      });
    }
  };

  /* MORE of next functions and actions SHOULD be changed to AVOID use
   * of Behaviors because they should ONLY happen ONCE on document.ready
   * and Behaviors main purpose is for things that need to react to
   * changes in page content via ajax updates.
   */

  /**
   * Create ability to toggle menu and search on mobile breakpoint.
   *
   * @todo: Consider a refactor for toggling Utility Menu.
   * Since we are using a simple method to toggle the search and menu for
   * mobile breakpoints, it would be easy enough, rather than the current
   * behavior for Account link (icon) on mobile that just links to /user to
   * instead also flyout the user menu with login/logout/zip links, etc.
   *
   * The consideration for above would consider that the region is above the
   * header, so it wouldn't behave exactly the same as the menu/search without
   * proper tweaking.
   *
   * @see docroot/themes/custom/scotts_base/style/scss/blocks/_main_menu.scss
   * @see docroot/themes/custom/scotts_base/templates/block/block--system-menu-block--main.html.twig
   * @see docroot/themes/custom/scotts_base/templates/menu/menu--main.html.twig
   * @type {{attach: Drupal.behaviors.mobileTriggers.attach}}
   */

  // Using .region--menu BLOCK here might be overkill, However, there could
  // be blocks with similar names 'possibly' placed in other regions so I
  // prefer to be fairly specific here.
  var searchBlock = $('.region--menu .block-scotts-search');
  var menuBlock = $('.region--menu nav.block-menu');

  $(document).ready(function () {

    // Toggle behavior for main menu.
    $('.mobile-trigger--menu').once('mobileTriggers').click(function () {

      if ($(this).hasClass('is-active')) {
        // Let's CLOSE the menu
        // Show the TOP level menu only, not sub-menus.
        $(menuBlock).hide();

        // Ensure no icons are activated.
        $('.mobile-trigger').removeClass('is-active');
      } else {
        // Let's OPEN the MENU
        // Show the TOP level menu only, not sub-menus.
        $(menuBlock).show();

        // Ensure other toggles are closed.
        $(searchBlock).hide();

        // Ensure no icons are activated.
        $('.mobile-trigger').removeClass('is-active');

        // Give this icon a class to denote it's open.
        $(this).addClass('is-active');

        // REMOVE <a> href's from expanded menu section (sub)heads if in mobile view.
        $('ul.menu--main > li.menu-item--expanded > h2 > a').removeAttr('href').css('cursor', 'pointer');
      }
    });

    // Apply accordion on expanded links.
    if ($(window).width() < 768) {
      $('.menu-item--expanded, .menu-item').off();
    }

    $('.menu-item--expanded > h2').once('menuexpand').on('click', function (evt) {
      var $parent = $(this).parents('.menu-item--expanded');
      var $item = $parent.find('.menu--main-submenu');
      if (isMobile()) {
        evt.preventDefault();
        if ($parent.hasClass('active')) {
          $parent.removeClass('active');
          hideItem($item);
        } else {
          $parent.addClass('active');
          showItem($item);
        }
      } else {
        resetMenu();
      }
    });

    var scrSize = 'wide' // screensize;.
      ,
      showItem = function (item) {
        item.slideDown(400);
        return item;
      },
      hideItem = function (item) {
        item.slideUp(400);
        return item;
      },
      isMobile = function () {
        return (scrSize == 'mobile');
      },
      resetMenu = function () {
        $('.menu-item--expanded.active').removeClass('active');
        $('.menu--main-submenu').css({
          display: ''
        });
      };

    // Toggle behavior for search block.
    $('.mobile-trigger--search').click(function () {

      if ($(this).hasClass('is-active')) {
        // Let's CLOSE the menu
        // Show the TOP level menu only, not sub-menus.
        $(searchBlock).hide();

        // Ensure no icons are activated.
        $('.mobile-trigger').removeClass('is-active');
      } else {
        // Let's OPEN the MENU
        // Show the TOP level menu only, not sub-menus.
        $(searchBlock).show();

        // Ensure other toggles are closed.
        $(menuBlock).hide();

        // Ensure no icons are activated.
        $('.mobile-trigger').removeClass('is-active');

        // Give this icon a class to denote it's open.
        $(this).addClass('is-active');
      }
    });

    // Ensure when we switch out of mobile breakpoint that menu/search
    // are displayed. If we've opened/closed the menu on mobile, then resize
    // out to a larger breakpoint, jQuery's hiding of the element overrides
    // the default CSS that sets it to display.
    // The same applies in reverse where if we've kept the menu open on
    // mobile, then scale back to a larger breakpoint, then back down to
    // the mobile breakpoint, the menu is still opened from previous
    // open toggle command. So when getting back to mobile, we want to
    // ensure the menu is closed!
    // Using breakpoint events (provided by omega.js)
    $(window).on('breakpointAdded breakpointRemoved', function (e, b) {
      // We can assume if only 1 breakpoints is active, that it IS mobile.
      // anything more than one breakpoint should now show the normal menu.
      if (!scottsIsMobileBreakpoint(e, b)) {
        // Ensure the menu is visible.
        $(menuBlock).show();

        // Ensure the search is visible.
        $(searchBlock).show();

        // Set size to 'wide'.
        scrSize = 'wide';
      } else {
        // Ensure the menu is hidden.
        $(menuBlock).hide();

        // Ensure the search is hidden.
        $(searchBlock).hide();

        // Reset menu accordions.
        resetMenu();
        // Set size to 'mobile'.
        scrSize = 'mobile';
      }

    });
  });

  /**
   * Adjust a few things that make the toolbar better to use.
   *
   * @type {{attach: Drupal.behaviors.mobileTriggers.attach}}
   */
  Drupal.behaviors.toolbarResponsiveEnhance = {
    attach: function (context, settings) {
      $(window).on('breakpointAdded breakpointRemoved', function (e, b) {
        // Let's close the open toolbar menu rather than it switching to vertical.
        if (scottsActiveBreakpoints() <= 1 || b.name == "Narrow") {
          // If we find that the Toolbar tray is open.
          if ($('#toolbar-item-administration-tray').hasClass('is-active')) {
            // Close it.
            $('#toolbar-item-administration').click();
          }
        }
      });
    }
  };

  /**
   * Product Detail page tabs.
   *
   * @see templates/layout_plugin/two-column-product.html.twig
   * @type {{attach: Drupal.behaviors.mobileTriggers.attach}}
   */
  Drupal.behaviors.productDetailTabs = {
    attach: function (context, settings) {
      var defaultTab = $('.node--type-product .product--tab-controls a.is-active').attr('data-toggle');
      $('.node--type-product .product--tabs > div.' + defaultTab).siblings().hide();

      $('.node--type-product .product--tab-controls a').click(function () {
        var referencedTab = $(this).attr('data-toggle');

        // Make sure no other tabs have the active class.
        $('.node--type-product .product--tab-controls a').not(this).removeClass('is-active');
        // Add an active class to the tab.
        $(this).addClass('is-active');

        $('.node--type-product .product--tabs > div.' + referencedTab)

          .show() // Ensure it is visible
          .siblings() // Select the siblings that should be hidden
          .hide(); // Hide those siblings.

        return false;
      });

      $(window).on('breakpointAdded breakpointRemoved', function (e, b) {
        var $blockSection = $('.product--tabs > div');
        // We can assume if only 1 breakpoints is active, that it IS mobile.
        if (scottsActiveBreakpoints() == 1) {
          // Ensure the block sections are opened, regardless of the element.style applied.
          $blockSection.show();
        } else {
          // Moving out of mobile to narrow.
          // @todo: this goes for Normal > Narrow as well as Mobile > Narrow.
          if (e.type == 'breakpointAdded' && b.name == 'Narrow') {
            $blockSection.hide();
            $('.product--tabs > .block-region-details').show();
            $('.product--tab-controls a').removeClass('is-active');
            $('.product--tab-controls a.details').addClass('is-active');
          }
        }
      });
    }
  };

  /**
   * Click functionality for product detail tab sections on mobile.
   *
   * @type {{attach: Drupal.behaviors.mobileTriggers.attach}}
   */
  Drupal.behaviors.mobileProductDetailToggle = {
    attach: function (context, settings) {

      $('.product--tabs > div .block h2').click(function () {
        // Only trigger section toggle on mobile.
        if (scottsActiveBreakpoints() == 1) {
          if ($(this).hasClass('is-active')) {
            $(this).find('.product-section-trigger').removeClass('scotts-icon-minus').addClass('scotts-icon-plus'); // Swap the icon.
            $(this).siblings().slideUp(); // Hide the sibling items.
            $(this).removeClass('is-active'); // Remove the active class.
          } else {
            $(this).find('.product-section-trigger').removeClass('scotts-icon-plus').addClass('scotts-icon-minus'); // Swap the icon.
            $(this).siblings().slideDown(); // Show the sibling items.
            $(this).addClass('is-active'); // Add the active class.
          }
        }
      });

      // Using breakpoint events (provided by omega.js)
      $(window).on('breakpointAdded breakpointRemoved', function (e, b) {
        var triggerHeader = $('.product--tabs > div .block h2');
        // We can assume if only 1 breakpoints is active, that it IS mobile.
        if (scottsActiveBreakpoints() != 1) {
          triggerHeader.siblings().show();
          triggerHeader.find('.product-section-trigger').removeClass('scotts-icon-plus').addClass('scotts-icon-minus');
          triggerHeader.removeClass('is-active');
        } else {
          triggerHeader.siblings().hide();
          triggerHeader.siblings().children().show();
          triggerHeader.find('.product-section-trigger').removeClass('scotts-icon-minus').addClass('scotts-icon-plus');
          triggerHeader.removeClass('is-active');
        }

      });
    }
  };

  /**
   * Mobile Menu functionality
   * Creates a button that will reveal the menu on click.
   *
   * @type {{attach: Drupal.behaviors.createMobileSidebarItemList.attach}}
   */
  Drupal.behaviors.createMobileSidebarItemList = {
    attach: function (context, settings) {
      $(function () {
        // Array of objects to look for to create a mobile menu from .item-list.
        var sidebarMenus = [
          $('.block-scotts-term-menu .item-list > ul'),
          $('.block-facet-widget--links .item-list > ul'),
          $('.block-facets--links .item-list > ul'),
          $('.block-region-sidebar .block-menu > ul')
        ];

        $.each(sidebarMenus, function (index, sidebarMenu) {
          $(sidebarMenu).each(function () {

            var
              activeMenuItem,
              blockHeader,
              buttonValue,
              sidebarMenuButton;
            /**
             * This needs to on most normal menus, display the active
             * menu item. For the standard Article/Product library
             * pages, by the time this menu is visible, there IS an
             * active item.
             *
             * But the case exists on facets where there aren't any
             * active items when the page is first loaded or there
             * are multiple active items. So logic should dictate
             * a different situation to use the block title,
             * or something else, including a fail safe default to
             * have some text like "click me" if there's no active
             * link, AND no block title?
             *
             * Logic interpretation:
             * - If a block title exists, use that first.
             * - If no block title, use the first active link.
             * - If neither of the above, use a default text value.
             */

            // Find the <h2> header for the block.
            blockHeader = $(this).closest('.block').children('h2');
            // Find the FIRST active menu item.
            activeMenuItem = $(this).find('.is-active:eq(0)');

            if (blockHeader.length > 0) {
              // Assign the text contained in the item.
              buttonValue = $(blockHeader).text();
            } else if (activeMenuItem.length > 0) {
              // Assign the text contained in the item.
              buttonValue = $(activeMenuItem).text();
            } else {
              // Assign a default value.
              // @todo: Change the default option to a config item so it can be manipulated more easily.
              buttonValue = 'More Options';
            }

            // Assign the item to a button.
            // $('<button class="mobile-menu--button"></button>')
            //     .prependTo($(this).closest('.item-list, .block-menu'));.
            // Find the button we've created.
            sidebarMenuButton = $(this).siblings('.mobile-menu--button');
            // Apply the markup to the button for our 'title'.
            sidebarMenuButton.html(buttonValue);

            $(window).once('mobileSidebar').on('breakpointAdded breakpointRemoved', function (e, b) {
              if (!scottsIsMobileBreakpoint(e, b)) {
                // Ensure the normal menu is visible.
                $(blockHeader).show();
                // Ensure the <h2> title is visible.
                $(sidebarMenu).show();
                // Hide button.
                $('.mobile-menu--button').hide();
              } else {
                // Ensure the normal menu is hidden.
                $(sidebarMenu).hide();
                // Ensure the <h2> title is hidden.
                $(blockHeader).hide();
                // Show button.
                $('.mobile-menu--button').show();
              }
            });
          });
        });

        // Handle the click functionality on ANY mobile-menu-button.
        $('.mobile-menu--button').once('mobilemenu').on('click', function (e) {
          $(this).siblings('ul').slideToggle('fast');
          $(this).toggleClass('open');
        });
      });
    }
  };

  /**
   * Function to clean up the IPE tray, and prevent a situation it could
   * overflow the footer enough to cover up regions.
   *
   * @type {{attach: Drupal.behaviors.panelsIPEadjuster.attach}}
   */
  Drupal.behaviors.panelsIPEadjuster = {
    attach: function (context, settings) {

      $(function () {
        // The outer IPE wrapper.
        var ipe = $('#panels-ipe-tray');
        var ipe_height = $(ipe).height();
        if (ipe.length) {
          // Apply padding to the bottom of the footer.
          $('#footer-outer-wrapper').css('padding-bottom', ipe_height);
        }

        $(ipe).click(function () {
          // Pause until the tray is finished changing.
          setTimeout(function () {
            ipe_height = $('#panels-ipe-tray').height();
            // Apply padding to the bottom of the footer.
            $('#footer-outer-wrapper').css('padding-bottom', ipe_height);
          }, 250);

        });
      });
    }
  };

  /**
   * Function to initialize jQuery.customSelect on <select> form element.
   *
   * @type {{attach: Drupal.behaviors.initCustomSelect.attach}}
   */
  Drupal.behaviors.initCustomSelect = {
    attach: function (context, settings) {
      $(function () {
        $('select').not('.hasCustomSelect').customSelect();
        $('#edit-language option, #edit-country option').each(function (_, el) {
          el._originalText = el.text;
        }).css('visibility', 'hidden');
      });
    }
  };

  /**
   * Function to adjust length of language selection on mobile.
   *
   * @type {{ attach: Drupal.behaviors.initMobileLanguageSelects.attach }}
   */
  Drupal.behaviors.initMobileLanguageSelects = {
    attach: function (context, settings) {
      $(function () {
        /*
        function reduceText(list){
        $('#edit-language option, #edit-country option')
        .each(function(_, el){
        var value = el.value;
        el.text = value.charAt(0).toUpperCase() + value.slice(1);
      })
      .trigger('render');
    }
    function resetText(list){
    $('#edit-language option, #edit-country option')
    .each(function(_, el){
    el.text = el._originalText
  })
  .trigger('render');
}

var mqlMobile = matchMedia('only screen and (max-width: 599px)');

function reduceIfMobile(mql) {
if (mql.matches) {
reduceText();
}
else {
resetText();
}
}

mqlMobile.addListener(reduceIfMobile);

reduceIfMobile(mqlMobile);
$('#edit-language option, #edit-country option').css('visibility', 'visible');
*/
      });
    }
  };

  /**
   * Function to implement desired behavior for Marquee Content node.
   *
   * @type {{attach: Drupal.behaviors.initCustomSelect.attach}}
   */
  Drupal.behaviors.marqueeContent = {
    attach: function (context, settings) {

      // On page load, give the first 'teaser' an is-active class.
      $('.marquee-content--teasers .marquee-slide:eq(0)').addClass('is-active');

      // Handle a click on the 'teasers'.
      $('.marquee-content--teasers .marquee-slide').click(function (e) {

        var $slide = $(this);
        var teaser_index = $('.marquee-content--teasers .marquee-slide').index($slide);

        if ($slide.hasClass('is-active')) {
          // If it is already the active item, follow the link on this click.
          // Using the 'duplicate' link on the marquee to handle the click event.
          // Had a hard time preventing the click event from bubbling.
          var associated_marquee_link = $('.marquee-content--marquees .marquee-slide')
            .eq(teaser_index)
            .find('.field--name-field-marquee-slide-cta-link a')
            .attr('href');
          // Go to URL.
          window.location.href = associated_marquee_link;
        } else {
          // Since this was NOT the active 'teaser', we'll adjust here and show the associated marquee.
          // Remove any other is-active classes.
          $('.marquee-content--teasers .marquee-slide').removeClass('is-active');
          // Adjust the slide to have the is-active class.
          $slide.addClass('is-active');
          // Hide the marquees.
          $('.marquee-content--marquees .marquee-slide').hide();
          // Show the right marquee.
          $('.marquee-content--marquees .marquee-slide').eq(teaser_index).show();
          return false;
        }
      });
    }
  };

  /**
   * Enable the colorbox inline functionality.
   */
  Drupal.behaviors.colorboxInline = {
    attach: function (context, drupalSettings) {
      $('[data-colorbox-inline]', context).once('colorbInline').click(function () {
        var $link = $(this);
        var settings = $.extend(drupalSettings.colorbox, {
          href: false,
          inline: true
        }, {
          href: $link.data('colorbox-inline'),
          width: $link.data('width'),
          height: $link.data('height')
        });
        $link.colorbox(settings);
      });
    }
  };

  /**
   * Enable the magnific popup functionality.
   */
  Drupal.behaviors.magnific = {
    attach: function (context, drupalSettings) {
      // If any divs/teasers exist with magnificpopup classname, setup magnific lightboxes for links
      // Use of this requires magnific lib .js to be added to page.
      // See magnific JS documentation for option details.
      var popup = $(".mcrTeaserMagnificPopup");
      if (popup.length && typeof popup.magnificPopup === "function") {
        popup.magnificPopup({
          delegate: 'a',
          type: 'iframe',
          disableOn: 700,
          removalDelay: 160,
          preloader: false,
          fixedContentPos: false,
          callbacks: {
            beforeClose: function () {
              var videoId = $('.mfp-iframe-holder').find('iframe').attr('id');

              if (videoId && YT) {
                YT.get(videoId).pauseVideo();
              }
            }
          }
        });
      }
    }
  };

})(jQuery, Drupal, drupalSettings);

/**
 * Custom Script for inner element of Page.
 */

(function ($, Drupal, document) {
  'use strict';

  // Column Height Issue Fix.
  function col_maxHeight(elem) {
    var maxHeight = 0;
    $(elem).css('height', 'auto');
    $(elem).each(function () {
      if ($(this).height() > maxHeight) {
        maxHeight = $(this).height();
      }
    });
    if ($(window).width() > 599) {
      $(elem).height(maxHeight);
    } else {
      if ($('.inner-layout-wrapper').hasClass('layout-wrapper--four-col') === true) {
        $(elem).height(maxHeight);
      } else {
        $(elem).css('height', 'auto');
      }
    }
  }

  $(document).ready(function (e) {
    col_maxHeight('.inner-layout-wrapper .layout-region--three-col .content-teaser-section .teaser-info');
    col_maxHeight('.inner-layout-wrapper .layout-region--four-col .content-teaser-section .teaser-info');
    col_maxHeight('.inner-layout-wrapper .layout-region--two-col .field--name-field-body');

    // Create ability to have search icon in form trigger search.
    // @see docroot/themes/custom/scotts_base/style/scss/blocks/_main_menu.scss
    $('.search-trigger').once('searchtrigr').click(function () {
      $(this).prev('form').submit();
    });

    // Click functionality for additional items in the product video display.
    // Let's emulate the entire .video-information div being a link
    // that triggers the click action to open the overlay/play the video.
    $('.field--name-field-product-videos .video-information').click(function () {
      $(this).siblings('.video-thumbnail').find('a:first-child').click();
    });

    // Click functionality for product "Click image to zoom" link
    // Let's emulate the entire .video-information div being a link
    // that triggers the click action to open the overlay/play the video.
    $('.zoom-info a').click(function () {
      $(this).parents('.block').children('.bx-wrapper').find('div[aria-hidden="false"] a.cboxElement').click();
    });

    /**
     * Clone the product node title to create a 'mobile' version.
     *
     * This is required as the markup order puts the main title and bullets, etc.
     * AFTER the product images. This functionality creates a duplicate that we
     * can use to hide/show the appropriate one based on breakpoint.
     *
     * @todo: This could be changed to an additional BLOCK placed in an additional full width region above the hero image/hero overview.
     */
    var productTitle = $('body.node--type-product h1.node-title').clone().addClass('mobile-title');
    $('.layout-region--hero-image').before(productTitle);

    /**
     * After content is fully displayed, smooth-scroll to any hash-specified bookmark in URL.
     * Some bookmarked content is 3rd-party inserted (BV) so not done auto by browser.
     */
    setTimeout(function() {
      if (window.location.hash) {
        // We scroll (back) to top first, cause browser jumped to anchor pos before content loaded.
        window.scrollTo(0, 0);
        var utarget = window.location.hash.split('#');
        $('html, body').animate({scrollTop: $('#'+utarget[1]).offset().top},300,'linear');
      }
    }, 250);

  });

  $(window).on('load resize', function () {
    col_maxHeight('.inner-layout-wrapper .layout-region--three-col .content-teaser-section .teaser-info');
    col_maxHeight('.inner-layout-wrapper .layout-region--four-col .content-teaser-section .teaser-info');
    col_maxHeight('.inner-layout-wrapper .layout-region--two-col .field--name-field-body');
  });

})(jQuery, Drupal, document);
;
/**
 * @file
* Custom Script for inner element of Page.
*/

(function ($, Drupal, drupalSettings) {

  "use strict";

  var $body = $('body');
  var searchFunction;
  var menuFunction;

  var addCustomHtmlToMenu = function () {
    var $menuIcon = $('.scotts-icon-menu');

    $menuIcon.append('<span></span><span></span><span></span>');
  };

  var bindClickEventToHamburguerMenu = function () {
    var $menuIcon = $('.scotts-icon-menu'),
    $mainNav = $('.menu-outer-wrapper nav[role="navigation"].navigation'),
    menuState = false;

    var bind = function () {
      $menuIcon.on('click', function () {
        menuState = menuState ? false : true;
        if (menuState) {
          $mainNav.hide();
          $mainNav.slideDown(400);
          closeSearchSection();
          addBlackOpacity();
        }
        else {
          $mainNav.show();
          $mainNav.slideUp(400);
          removeBlackOpacity();
        }
      });
    }

    var setClosed = function () {
      menuState = false;
    };

    return {
      bind: bind,
      setClosed: setClosed
    };
  };

  var activeNavItemOnHoverOverSubItems = function () {
    var $mainNav = $('.menu-outer-wrapper nav[role="navigation"].navigation'),
    $subNav = $mainNav.find('.menu--submenu');

    $subNav.on('mouseenter', function () {
      $(this).siblings('h2').find('a').addClass('active');
    }).on('mouseleave', function () {
      $(this).siblings('h2').find('a').removeClass('active');
    });
  };

  var bindClickEventSearch = function () {
    var $searchBlock = $('.block-search-block'),
    $searchBtn,
    opened;

    var bind = function () {
      opened = false;
      $searchBlock.prepend('<a href="#" class="search-btn scotts-icon-search"></a>');
      $searchBtn = $('.search-btn, .mobile-trigger--search');

      $searchBtn.on('click', function (e) {
        opened = opened ? false : true;
        e.preventDefault();
        if (!opened) {
          closeSearchSection();
        }
        else {
          closeMobileNavigation();
          $searchBlock.addClass('active');
          addBlackOpacity();
          showBorderBottomNav();
        }
      });
    };

    var setClosed = function () {
      opened = false;
    };

    return {
      bind: bind,
      setClosed: setClosed
    };
  };

  var showBorderBottomNav = function () {
    var $menuWrapper = $('.menu-outer-wrapper');
    $menuWrapper.addClass('active');
  };

  var hideBorderBottomNav = function () {
    var $menuWrapper = $('.menu-outer-wrapper');
    if (window.location.href.indexOf("user-login") === -1) {
      $menuWrapper.removeClass('active');
    }
  };

  var closeSearchSection = function () {
    var $searchBlock = $('.block-search-block');
    $searchBlock.removeClass('active');
    hideBorderBottomNav();
    searchFunction.setClosed();
    removeBlackOpacity();
  };

  var closeMobileNavigation = function () {
    var $navBtn = $('.mobile-trigger--menu'),
        $nav = $('.menu-outer-wrapper nav[role="navigation"].navigation'),
        desktopResolution = 960;

    if ($(window).width() < desktopResolution) {
      $navBtn.removeClass('is-active');
      $nav.slideUp(400);
      menuFunction.setClosed();
      removeBlackOpacity();
    }
  };

  var checkIfPageIsUserLogin = function () {
    var $menuAccount = $('.menu--account');

    if (window.location.pathname.indexOf('user-login') != -1) {
      $menuAccount.find('.menu-item a').addClass('active');
      showBorderBottomNav();
    }
  };

  var addZipCodeToLocationIcon = function () {
    var $userZip = $('.user-zip-prefix'),
    $zupSuffix = $('.user-zip-suffix'),
    zipCode = $userZip.text().replace('(','').replace('Your ZIP Code:','').trim(),
    $zipBlock = $('.block-zip-change-block');

    if (zipCode && zipCode !== 'unknown') {
      $zupSuffix.text(zipCode);
      $zupSuffix.addClass('active');
      $zipBlock.addClass('small-icon');
    }
    else {
      $zipBlock.removeClass('small-icon');
    }
  };

  var updateEditZipCodePlaceholder = function () {
    var $searchBlock = $('.block-scotts-search'),
    $zipCodeField = $searchBlock.find('#edit-keyword'),
    currentPlaceholder;

    currentPlaceholder = $zipCodeField.attr('placeholder');
    $zipCodeField.attr('placeholder', currentPlaceholder + '...');
  };

  var makeFeaturedImageClickable = function () {
    var $thumbnail = $('.views-field-field-article-thumbnail, .views-field-field-product-product-images'),
    $link;

    $thumbnail.each(function (index, elm) {
      $(elm).on('click', function (e) {
        $link = $(this).siblings('.views-field-title').find('a').attr('href');
        if ($link) {
          e.preventDefault();
          window.location.href = $link;
        }
      });
    });
  };

  var removeHTMLTagsFromFeaturedText = function () {
    var $thumbnail = $('.views-field-field-article-thumbnail, .views-field-field-product-product-images'),
    text,
    $link;

    $thumbnail.each(function (index, elm) {
      $link = $(this).siblings('.views-field-title').find('a');
      text = $link.text();
      $link.html(text);
    });
  };

  var addExtraPaddingTopToLoginContent = function () {
    var $contentOuterWrapper = $('.content-outer-wrapper');

    if (window.location.href.indexOf("user-login") != -1) {
      $contentOuterWrapper.addClass('extra-padding--top user-login');
    }
  };

  var bindEventOnZipCodeLoad = function () {
    var $userZip = $('.user-zip-prefix');
    $userZip.on('zip-code-loaded', function () {
      addZipCodeToLocationIcon();
    });
  };

  var addBlackOpacityBackOnMenuHover = function () {
    var $mainNav = $('.menu-outer-wrapper nav[role="navigation"].navigation > .menu--main > .menu-item');

    $mainNav.on('mouseenter', function () {
      hideBorderBottomNav();
      closeSearchSection();
      addBlackOpacity();
    }).on('mouseleave', function () {
      removeBlackOpacity();
    });
  };

  var removeBlackOpacity = function () {
    var $header = $('.menu-outer-wrapper');
    var $mowSibs = $header.siblings('.opacity-bg');
    $mowSibs.remove();
  };

  var addBlackOpacity = function () {
    var $header = $('.menu-outer-wrapper');
    $header.after('<div class="opacity-bg"></div>');

    $body.on('click', '.opacity-bg', function () {
      closeSearchSection();
      closeMobileNavigation();
    });
  };

  var removeClassesFromFeaturedProductAndArticle = function () {
    var $items = $('.menu--featured-products, .menu--featured-articles');
    $items.off().removeClass('menu-item');
  };

  var setSameHeightToFeaturedProductAndArticle = function () {
    var desktopResolution = 960;
    setHeight();
    $(window).resize(function () {
      setHeight();
    });
    function setHeight(){
      var $menuItems = $('.menu-outer-wrapper nav.navigation > ul.menu--main > .menu-item');
      $menuItems.each(function (index, elm) {
        var $nav = $(elm).find('> .menu--main-submenu');
        var $featured = $(elm).find('> .featured-items-nav-wrapper');
        $nav.css('min-height', 'auto');
        $featured.css('min-height', 'auto');
        var navHeight = $nav.outerHeight();
        var featuredHeight = $featured.outerHeight();

        if ($(window).width() < desktopResolution) {
          navHeight = 'auto';
          featuredHeight = 'auto';
        }

        if (navHeight > featuredHeight) {
          $nav.css('min-height', navHeight);
          $featured.css('min-height', navHeight);
        }
        else {
          $nav.css('min-height', featuredHeight);
          $featured.css('min-height', featuredHeight);
        }
      });
    }
  };

  if ($body.hasClass('nav-2018mega')) {
    addCustomHtmlToMenu();
    menuFunction = new bindClickEventToHamburguerMenu();
    menuFunction.bind();
    activeNavItemOnHoverOverSubItems();
    searchFunction = new bindClickEventSearch();
    searchFunction.bind();
    checkIfPageIsUserLogin();
    addZipCodeToLocationIcon();
    updateEditZipCodePlaceholder();
    makeFeaturedImageClickable();
    addExtraPaddingTopToLoginContent();
    removeHTMLTagsFromFeaturedText();
    bindEventOnZipCodeLoad();
    addBlackOpacityBackOnMenuHover();
    removeClassesFromFeaturedProductAndArticle();
    setSameHeightToFeaturedProductAndArticle();
  }

})(jQuery, Drupal, document);
;
/**
 * @file
* Custom Script for inner element of Page.
*/

(function ($, Drupal, document) {
  'use strict';

    var $body = $('body');

    var wrapTopFooterBlocks = function () {
      var $footerPhoneBlock = $('#block-footerphoneblock'),
      $footerContactUsBlock = $('#block-footercontactusblock'),
      $liveChat = $('#block-livechat'),
      $footerSectionTop;

      $liveChat.after('<div class="footer-section--top"></div>');
      $footerSectionTop = $('.footer-section--top');

      $footerSectionTop.append($footerPhoneBlock.detach());
      $footerSectionTop.append($footerContactUsBlock.detach());
      $footerSectionTop.append($liveChat.detach());
    };

    var wrapBottomFooterBlocks = function () {

      // Determine if CA or MX footer has been defined and if not use default (US).
      var footerMenuSelector = $('.menu--footer');

      if ($('.menu--footer-ca').length > 0) {
        footerMenuSelector = $('.menu--footer-ca');
      }
      else if ($('.menu--footer-mx').length > 0){
        footerMenuSelector = $('.menu--footer-mx');
      }

    var $blockFooter = footerMenuSelector,
        $prev = $blockFooter.prev(),
        $next = $blockFooter.next(),
        $footerSectionBottom;

    $blockFooter.after('<div class="footer-section--bottom"></div>');
    $footerSectionBottom = $('.footer-section--bottom');

    $footerSectionBottom.append($prev.detach());
    $footerSectionBottom.append($blockFooter.detach());
    $footerSectionBottom.append($next.detach());
  };

    var injectScrollToTopBtn = function () {
      var $footerSectionTop = $('.footer-section--top');
      $footerSectionTop.before('<a href="#" class="footer-section--scroll">BACK TO TOP</a>');
    };

    var injectLanguagePickerMask = function () {
      var $blockLanguages = $('.block-country-languages-block'),
          $select = $('.footer-section--bottom .form-item-country select.form-select'),
          $maskLang;

      $select.after('<div class="mask-lang-picker"></div>');
      $maskLang = $('.mask-lang-picker');

      $select.find('option').each(function (index, elm) {
        var $elm = $(elm),
            isActive = $elm.is(':selected') ? 'active' : '';

        $maskLang.prepend('<a href="#" class="lang ' + isActive + '" data-value="' + $elm.attr('value') + '">' + $elm.attr('value') + '</a>');
      });

      $maskLang.find('.lang').on('click', function (e) {
        e.preventDefault();
        var value = $(this).data('value');
        $select.find('option').removeAttr('selected');
        $select.find('option[value="' + value + '"]').attr('selected','selected').trigger('change');
      });

    };

    var scrollToTop = function () {
      var $scrollBtn = $('.footer-section--scroll');
      $scrollBtn.on('click', function (e) {
        e.preventDefault();
        $('html,body').animate({ scrollTop: 0 }, 'slow');
      });
    };

    var appendLanguageAndCountrySection = function () {
      var $footerSectionBottom = $('.footer-section--bottom'),
      $blockLanguages = $('.block-country-languages-block'),
      $selectLanguage = $('.form-item-language select'),
      $languageSection;

      if ($selectLanguage.length) {
        $footerSectionBottom.after('<div class="footer-section--language" data-action="language"><h3>CHOOSE LANGUAGE</h3><ul class="list"></ul></div>');

        $languageSection = $('.footer-section--language .list');

        $selectLanguage.find('option').each(function (index, elm) {
          var $elm = $(elm),
              isActive = $elm.is(':selected') ? 'active' : '';

          $languageSection.prepend('<li> <a href="#" class="lang ' + isActive + '" data-value="' + $elm.attr('value') + '">' + $elm.text() + '</a></li>');

        });

        $languageSection.find('.lang').on('click', function (e) {
          e.preventDefault();
          var value = $(this).data('value');
          $selectLanguage.find('option').removeAttr('selected');
          $selectLanguage.find('option[value="' + value + '"]').attr('selected','selected').trigger('change');
        });
      }
    };

    if ($body.hasClass('nav-2018mega')) {
      wrapTopFooterBlocks();
      wrapBottomFooterBlocks();
      injectScrollToTopBtn();
      injectLanguagePickerMask();
      scrollToTop();
      appendLanguageAndCountrySection();
    }
})(jQuery, Drupal, document);
;
/**
 * @file
 */

(function ($, Drupal, document) {
  "use strict";

  // SCOTTS BRAND SPECIFIC VARIABLE.
  var scottsBrand;
  if (window.location.hostname.indexOf("scotts.") > -1) {
    scottsBrand = "#block-scotts-scotts-content";
  } else if (window.location.hostname.indexOf("miraclegro") > -1) {
    scottsBrand = "#block-scotts-miraclegro-content";
  } else if (window.location.hostname.indexOf("ortho") > -1) {
    scottsBrand = "#block-scotts-ortho-content";
  } else if (window.location.hostname.indexOf("tomcatbrand") > -1) {
    scottsBrand = "#block-scotts-tomcat-content";
  } else if (window.location.hostname.indexOf("roundup") > -1) {
    scottsBrand = "#block-scotts-roundup-content";
  }

  var brandIsolation =
    "body.node--type-article " +
    scottsBrand +
    " .node--view-mode-full_width_content .article-page";
  var docSizeWidth =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;

  $(document).ready(function () {
    // HERO/MARQUEE MODULE CONDITIONAL - SHOW HERO/MARQUEE BLOCK.
    if (
      $(brandIsolation + " .block-field-article-hero").length > 0 &&
      scottsBrand != "#block-scotts-scotts-content"
    ) {
      $(brandIsolation + " .block-field-article-hero").show();
      $(brandIsolation + " .block-article-marquee-block").hide(0);
      $(brandIsolation + " .node-title").hide(0);
      $(brandIsolation + " .block-field-scotts-short-description").hide(0);
    }
    // For scotts brand, if we are showing a hero image,
    // be sure to only hide the short description, but keep showing marquee block.
    else if (
      $(brandIsolation + " .block-field-article-hero").length > 0 &&
      scottsBrand == "#block-scotts-scotts-content"
    ) {
      $(brandIsolation + " .node-title").hide(0);
      $(brandIsolation + " .block-field-scotts-short-description").hide(0);
    } else if ($(brandIsolation + " .block-field-article-hero").length < 1) {
      $(brandIsolation + " .block-article-marquee-block").show();
    }

    // HERO MODULE CONDITIONAL - OVERWRITE NEG MARGIN IF NO HERO IMAGE.
    if (
      $(brandIsolation + " .block-article-marquee-block").length < 1 &&
      $(brandIsolation + " .block-field-article-hero").length < 1
    ) {
      $(brandIsolation + " .detail-article-wrap > .detail-article-page").css(
        "margin-top",
        "0"
      );
      $(
        brandIsolation + " .detail-article-wrap > .related-products-module"
      ).css("margin-top", "0");
    }

    // TEMP RELATED ARTICLES PLACEHOLDER IMAGE ** REMOVE AFTER DESIGN REVISION.
    var scottsBrandFolder;
    if (window.location.hostname.indexOf("scotts.") > -1) {
      scottsBrandFolder = "scotts_scotts";
    } else if (window.location.hostname.indexOf("miraclegro") > -1) {
      scottsBrandFolder = "scotts_miraclegro";
    } else if (window.location.hostname.indexOf("ortho") > -1) {
      scottsBrandFolder = "scotts_ortho";
    } else if (window.location.hostname.indexOf("tomcatbrand") > -1) {
      scottsBrandFolder = "scotts_tomcat";
    } else if (window.location.hostname.indexOf("roundup") > -1) {
      scottsBrandFolder = "scotts_roundup";
    }
    // Ortho has a different related article look so use this only for non-Ortho for taller imgs.
    if (
      scottsBrandFolder !== undefined &&
      scottsBrandFolder !== "scotts_ortho"
    ) {
      if (
        $(brandIsolation + " .related-article-module .related-article-item")
        .length <= 1
      ) {
        $(
          brandIsolation +
          " .related-article-module .related-article-item .related-article-item__image img"
        ).each(function () {
          $(this).attr(
            "src",
            "/themes/custom/" +
            scottsBrandFolder +
            "/images/relatedArticle-placeholder.png"
          );
        });
      }
    }

    // ---------- END - TEMP RELATED ARTICLES PLACEHOLDER IMAGE ** REMOVE AFTER DESIGN REVISION.

    // SOCIAL MEDIA SHARING - FACEBOOK, TWITTER, GOOGLE+.
    function showSocial(a, b, c) {
      $(
          brandIsolation +
          " ." +
          a +
          ", " +
          brandIsolation +
          " ." +
          b +
          ", " +
          brandIsolation +
          " ." +
          c
        )
        .parent()
        .show();
    }

    // Get URL.
    var url = window.location.href;

    // Start facebook share
    // https://developers.facebook.com/docs/plugins/share-button/#
    // In order to use custom image need to be a little creative.
    // Generating link to pass to <a> href instead of using FB's which calls their button.
    var FBurl =
      "https://www.facebook.com/sharer/sharer.php?u=" +
      url +
      "&display=popup&ref=plugin&src=share_button";
    $("#facebook").attr("href", FBurl);
    // End facebook share
    // Start twitter share
    // https://developer.twitter.com/en/docs/twitter-for-websites/tweet-button/overview
    var twitterShare = $(
      brandIsolation + " .social-sharing-module ul #twitter"
    );
    twitterShare.click(function (e) {
      e.preventDefault();
      // Get article title and remove any whitespace from beginning and end as this will be used in tweet.
      var articleTitle = $(".node-title")
        .text()
        .trim();
      // Encode article title so it is URL safe.
      var encodedTitle = encodeURIComponent(articleTitle);
      // Create URL used to compose tweet.
      // Note: var url in this case is part of the text to go inside tweet.
      var twitterWindow = window.open(
        "https://twitter.com/intent/tweet?text=" + encodedTitle + "%20" + url,
        "twitter-popup",
        "height=350,width=600"
      );
      if (twitterWindow.focus) {
        twitterWindow.focus();
      }
      return false;
    });
    // End twitter share
    // Start Google Plus.
    var googlePlusShare = $(
      brandIsolation + " .social-sharing-module ul #googleplus"
    );
    googlePlusShare.click(function (e) {
      e.preventDefault();
      var str = url;
      var gogleURL = str.replace("dev", "com");
      var googlePlusWindow = window.open(
        "https://plus.google.com/share?url=" + gogleURL,
        "Google+",
        "menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=350,width=600"
      );
      if (googlePlusWindow.focus) {
        googlePlusWindow.focus();
      }
      return false;
    });
    // End Google Plus
    // ---------- END - SOCIAL MEDIA SHARING - FACEBOOK, TWITTER, GOOGLE+.
    // RELATED ARTICLES - RESPONSIVE SLIDER.
    $(brandIsolation + " .related-products-module .view-content").slick({
      accessibility: true,
      adaptiveHeight: true,
      dots: true,
      arrows: false,
      slidesToShow: 1,
      slidesToScroll: 1,
      centerMode: false,
      focusOnSelect: true,
      responsive: [{
          breakpoint: 9999,
          settings: "unslick"
        },
        {
          breakpoint: 950,
          settings: "unslick"
        },
        {
          breakpoint: 767,
          settings: "unslick"
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
      ]
    });

    $(brandIsolation + " .related-products-module .view-content").on(
      "swipe",
      function (event, slick, direction) {
        var equalHeightSections;
        var equalHeightOptions = {
          byRow: false,
          property: "height",
          remove: false
        };
        equalHeightSections = [
          $(brandIsolation + " .related-products-module .related-product-item")
        ];
        $.each(equalHeightSections, function (index, section) {
          $(section).matchHeight(equalHeightOptions);
        });
      }
    );

    $(window).on("resize orientationchange", function () {
      $(brandIsolation + " .related-products-module .view-content").slick(
        "resize"
      );
    });

    // ---------- END - RELATED ARTICLES - RESPONSIVE SLIDER.
  }); // ---------- END - DOC READY.

  $(window).on("load", function (e) {
    docSizeWidth =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth;

    // STICKY RELATED PRODUCTS SIDEBAR.
    if (docSizeWidth > 959) {
      $(
        brandIsolation +
        " .block-views-blockscotts-related-products-content-block-1"
      ).stick_in_parent();
    }

    // HERO TITLE DIVIDER.
    $(
      brandIsolation +
      " .hero-module .block-scotts-article.block-article-marquee-block .category-main-promo-hero-image > h2"
    ).after('<hr class="related-article-hero-divide">');

    // IE11 FIX FOR CENTERED OVERLAY.
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");
    var relatedOverlay = $(".related_article_overlay");
    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
      if (relatedOverlay.getLenth() === 1) {
        relatedOverlay.css("width", "325px");
      } else if (relatedOverlay.length === 2) {
        relatedOverlay.css("width", "320px");
      } else if (relatedOverlay.length === 3) {
        relatedOverlay.css("width", "280px");
      }
    }
  }); // ---------- END - WINDOW LOAD.

  $(window).on("resize orientationchange", function () {
    docSizeWidth =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth;

    // STICKY RELATED PRODUCTS SIDEBAR - RESPONSIVE.
    if (docSizeWidth > 959) {
      $(
        brandIsolation +
        " .block-views-blockscotts-related-products-content-block-1"
      ).stick_in_parent();
    } else if (docSizeWidth < 960) {
      // KILL STICKY RELATED PRODUCTS SIDEBAR - MOBILE ONLY.
      $(
        brandIsolation +
        " .block-views-blockscotts-related-products-content-block-1"
      ).trigger("sticky_kit:detach");
    }
  }); // ---------- END - WINDOW RESIZE.
})(jQuery, Drupal, document);
;
/**
 * @file
 */

(function ($, Drupal, document) {
  'use strict';

  var scottsBrand;
  if (window.location.hostname.indexOf("scotts\.") > -1) {
    scottsBrand = "#block-scotts-scotts-content";
  } else if (window.location.hostname.indexOf("miraclegro") > -1) {
    scottsBrand = "#block-scotts-miraclegro-content";
  } else if (window.location.hostname.indexOf("ortho") > -1) {
    scottsBrand = "#block-scotts-ortho-content";
  } else if (window.location.hostname.indexOf("tomcatbrand") > -1) {
    scottsBrand = "#block-scotts-tomcat-content";
  } else if (window.location.hostname.indexOf("roundup") > -1) {
    scottsBrand = "#block-scotts-roundup-content";
  }

  var brandIsolation = 'body.node--type-product ' + scottsBrand + ' .node--view-mode-full_width_content_product';

  $(document).ready(function () {

    var docSizeWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

    var slickSettings = {
      accessibility: true,
      adaptiveHeight: true,
      dots: true,
      arrows: false,
      infinite: false,
      slidesToShow: 1,
      slidesToScroll: 1,
      focusOnSelect: true,
      responsive: [{
          breakpoint: 9999,
          settings: "unslick"
        },
        {
          breakpoint: 950,
          settings: "unslick"
        },
        {
          breakpoint: 767,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
      ]
    };

    // HIDE SECTIONS BASED ON COUNT.
    function hideSection(container, hide) {
      $('body.node--type-product ' + scottsBrand + ' ' + container).each(function () {
        if ($(this).find(hide).length < 1) {
          $(this).hide();
        }
      })
    }

    function pdpTabClick (tab) {
      $(brandIsolation + ' .product-detail-container-tabs li').removeClass('active-tab');
      tab.addClass('active-tab');
      $(brandIsolation + ' .product-detail-container .section-outer-wrapper > div').removeClass('active');
      if (tab.attr('id') === 'product-learn-tab') {
        $(brandIsolation + ' .layout-region--detail.product-learn').addClass('active');
      } else if (tab.attr('id') === 'product-faqs-tab') {
        $(brandIsolation + ' .layout-region--faqs.product-faqs').addClass('active');
      } else if (tab.attr('id') === 'product-garden-tab') {
        $(brandIsolation + ' .layout-region--garden.product-garden').addClass('active');
      } else if (tab.attr('id') === 'product-specs-tab') {
        $(brandIsolation + ' .layout-region--specs.product-specs').addClass('active');
      }
    }

    // HERO IMAGE DETECTION.
    if ($(brandIsolation + ' .layout-region--hero .section-outer-wrapper .block-region-hero .field--name-field-asset-image img').length < 1) {
      $(brandIsolation + ' .scotts-vertical-blocks').addClass('hero-null');
    }

    // HIDE GARDENS CONTENT & TAB - SCOTTS, ORTHO, TOMCAT.
    if (scottsBrand !== '#block-scotts-miraclegro-content') {
      $(brandIsolation + ' #product-garden-tab').remove();
      $(brandIsolation + ' .layout-region--garden.product-garden').remove();
    }
    // HIDE GARDENS CONTENT & TAB - IF NOT BONNIE BUNDLE.
    if ($(brandIsolation + ' #product-type-of-bundle').attr('data-type') === '0' || $(brandIsolation + ' #product-type-of-bundle').length < 1) {
      $(brandIsolation + ' #product-garden-tab').remove();
      $(brandIsolation + ' .layout-region--garden.product-garden').remove();
    }

    // HIDE FIND A STORE - IF BONNIE BUNDLE.
    if ($(brandIsolation + ' #product-type-of-bundle').attr('data-type') === '1' || $(brandIsolation + ' #product-type-of-bundle').length > 1) {
      $(brandIsolation + ' .wtb-btn-container').addClass('hidden');
    }

    // PRODUCT OVERVIEW - WRAP CONTENT FOR RIGHT COLUMN.
    $(brandIsolation + ' .layout-region--overview.product-overview .block-region-overview').each(function () {
      $(this).find('.block-field-product-product-images ~ *').wrapAll('<span class="overview-right-column"></span>');
    })

    // TEMP RELATED ARTICLES PLACEHOLDER IMAGE ** REMOVE AFTER DESIGN REVISION.
    var scottsBrandFolder;
    if (window.location.hostname.indexOf("scotts\.") > -1) {
      scottsBrandFolder = "scotts_scotts";
    } else if (window.location.hostname.indexOf("miraclegro") > -1) {
      scottsBrandFolder = "scotts_miraclegro";
    } else if (window.location.hostname.indexOf("ortho") > -1) {
      scottsBrandFolder = "scotts_ortho";
    } else if (window.location.hostname.indexOf("tomcatbrand") > -1) {
      scottsBrandFolder = "scotts_tomcat";
    } else if (window.location.hostname.indexOf("roundup") > -1) {
      scottsBrandFolder = "scotts_roundup";
    }
    if (scottsBrandFolder !== undefined) {
      if ($(brandIsolation + ' .block-views-blockscotts-related-articles-content-block-2 .related-article-item').length <= 1) {
        $(brandIsolation + ' .block-views-blockscotts-related-articles-content-block-2 .related-article-item .related-article-item__image img').each(function () {
          $(this).attr('src', '/themes/custom/' + scottsBrandFolder + '/images/relatedArticle-placeholder.png');
        });
      }
    }

    // HERO MODULE CONDITIONAL - OVERWRITE NEG MARGIN IF NO HERO IMAGE.
    if ($(brandIsolation + ' .layout-region--hero .block-region-hero .block-entity-fieldnodefield-product-hero.block-label-hero').length < 1) {
      $(brandIsolation + ' .layout-region--overview.product-overview').css('margin-top', '0');
    }

    // RECOMMENDED PRODCUTS/BUNDLES - HIDE CONTAINER IF NO PRODUCTS
    // $(brandIsolation + ' .layout-region--recommended.product-recommended').each(function(){
    //     if ($(this).find('.block-views-blockscotts-related-products-content-block-1 .view-content .related-product-item').length < 1) {
    //         $(this).hide();
    //     }
    // })
    // RECOMMENDED PRODCUTS/BUNDLES - HIDE CONTAINER IF NO PRODUCTS && NO BUNDLES.
    hideSection('.layout-region--recommended.product-recommended', '.block-views-blockscotts-related-products-content-block-1 .view-content .related-product-item');

    // ASSOCIATED BUNDLE PRODUCTS - HIDE CONTAINER IF NO.
    hideSection('.block-views.block-views-blockproduct-bundle-assoc-products-block-1', '.views-row');

    // RELATED ARTICLES - HIDE CONTAINER IF NO ARTICLES.
    hideSection('.layout-region--related.article-related', '.related-article-item');

    // PRODUCT DETAILS (TAB SECTION)
    $(brandIsolation + ' .layout-region--detail.product-learn, .layout-region--faqs.product-faqs, .layout-region--garden.product-garden, .layout-region--specs.product-specs').addClass('product-detail-display');
    $(brandIsolation + ' .product-detail-container .product-detail-display').each(function () {
      $(this).find('.block.block-ctools-block').last().addClass('last');
    });

    // DIVIDE PRODUCT DETAILS TABS EVENLY.
    var detailTabsDivide = $(brandIsolation + ' .product-detail-container .product-detail-container-tabs ul li');
    detailTabsDivide.each(function () {
      $(this).css('width', (100 / detailTabsDivide.length) + '%');
    });

    // PRODUCT DETAILS (TAB SECTION) - TOGGLE MAIN DISPLAY.
    $(brandIsolation + ' .layout-region--detail.product-learn').addClass('active');
    $(brandIsolation + ' .product-detail-container-tabs').on('click', 'li', function () {
      pdpTabClick ($(this));
    } );

    // PRODUCT DETAILS (TAB SECTION) - OMIT PRODUCT BUNDLE TYPE ELEMENT.
    $(brandIsolation + ' .block-field-product-type-of-bundle').removeClass('block block-ctools-block');

    // PRODUCT DETAILS (TAB SECTION) - SPLIT PRODUCT DISPLAY 6+.
    $(function ($) {
      $(brandIsolation + ' .product-detail-container .product-detail-display').each(function () {
        if ($(this).find('.block-ctools-block').length > 5) {
          var num_cols = 2,
            container = $(this),
            listItem = $('.block.block-ctools-block'),
            listClass = 'product-detail-column';
          container.each(function () {
            var items_per_col = new Array(),
              items = $(this).find(listItem),
              min_items_per_col = Math.floor(items.length / num_cols),
              difference = items.length - (min_items_per_col * num_cols);
            for (var i = 0; i < num_cols; i++) {
              if (i < difference) {
                items_per_col[i] = min_items_per_col + 1;
              } else {
                items_per_col[i] = min_items_per_col;
              }
            }
            for (var i = 0; i < num_cols; i++) {
              $(this).append($('<div ></div>').addClass(listClass));
              for (var j = 0; j < items_per_col[i]; j++) {
                var pointer = 0;
                for (var k = 0; k < i; k++) {
                  pointer += items_per_col[k];
                }
                $(this).find('.' + listClass).last().append(items[j + pointer]);
              }
            }
          });
        }
      });
    })

    // LEARN/SPECS TAB LINK - expose links if TAB EXISTS.
    if( document.getElementById("product-learn-tab") && document.getElementById("learnTabLink") ){
      document.getElementById("learnTabLink").style.display = "block";
    }
    if( document.getElementById("product-specs-tab") && document.getElementById("specsTabLink") ){
      document.getElementById("specsTabLink").style.display = "block";
    }

    // PRODUCT DETAILS (TAB SECTION) - TOGGLE TABS.
    $(brandIsolation + ' .product-detail-container .section-outer-wrapper .block.block-ctools-block').on('click', function () {
      if ($(this).hasClass('active')) {
        $(this).removeClass('active');
      } else if (!$(this).hasClass('active')) {
        $('.product-detail-container .product-detail-display .block.block-ctools-block').removeClass('active');
        $(this).addClass('active');
      }
    });


    // Tab selector links - selects and jumps to appropriate tab.
    $('#learnTabLink').on('click', function () {
      var toTab = $('#product-learn-tab');
      if ( toTab ) {
        pdpTabClick(toTab);
        $('html, body').animate({scrollTop: $("#product-learn-tab").offset().top - 50}, 200);
      }
    });
    $('#specsTabLink').on('click', function () {
      var toTab = $('#product-specs-tab');
      if ( toTab ) {
        pdpTabClick(toTab);
        $('html, body').animate({scrollTop: $("#product-specs-tab").offset().top - 50}, 200);
      }
    });

    // RELATED ARTICLES - RESPONSIVE SLIDER.
    $(brandIsolation + ' .block-views.block-views-blockproduct-bundle-assoc-products-block-1 .view-content').slick(slickSettings);

    // PRODUCT BUNDLE - RESPONSIVE SLIDER.
    $(brandIsolation + ' .block-views-blockscotts-related-products-content-block-1 .view-content').slick(slickSettings);

    // RECOMMENDED PRODUCTS - RESPONSIVE SLIDER.
    $(brandIsolation + ' .block-views-blockrelated-bundles-block-1 .view-content').slick(slickSettings);

    // PRODUCT BUNDLE MODAL.
    $(scottsBrand + ' .product-bundle-associated-products-block .views-row').on('click', function () {
      $(this).find('.views-field-nothing-1').dialog({
        modal: true,
        close: function (event, ui) {
          $(this).dialog("destroy");
        },
        width: 784,
        height: 385,
        autoReposition: true,
        dialogClass: 'associated-products-modal'
      });
    })

    // CLOSE MODAL ON OVERLAY CLICK.
    $(document).on('click', '.ui-widget-overlay', function () {
      $('.ui-dialog-titlebar-close').trigger('click');
    });

    // RECOMMENDED PRODUCTS/BUNDLES
    // SLICK SLIDER - HIDE DOTS IF ONLY ONE.
    $(brandIsolation + ' .slick-slider').each(function () {
      if ($(this).find('.slick-dots > li').length <= 1) {
        $(this).find('.slick-dots').hide();
      }
    })

    // ASSOCIATED PRODUCT MODAL - HIDE SUMMARY IT NO CONTENT.
    hideSection('.product-bundle-benefits', 'p');

    // RECOMMENDED PRODUCTS/BUNDLES.
    $(brandIsolation + ' .block-region-recommended').prepend('<h2>Recommended for You</h2>');
    $(brandIsolation + ' .block-views-blockscotts-related-products-content-block-1').before('<div class="recommended-toggle"><ul><li class="rec-prod-view active-toggle">Products</li><li class="rec-bundles-view">Bundles</li></ul></div>')
    $(brandIsolation + ' .block-region-related').prepend('<h2>Related Articles</h2><p class="related-article-description">Whether you are just starting out, maintaining or troubleshooting, you’ll find advice and answers here for all your lawn care needs.</p>');
    $(brandIsolation + ' .product-recommended .block-region-recommended').on('click', '.recommended-toggle ul li', function () {
      $(brandIsolation + ' .product-recommended .block-region-recommended .recommended-toggle ul li').removeClass('active-toggle');
      $(this).addClass('active-toggle');
      if ($(this).hasClass('rec-prod-view')) {
        $(brandIsolation + ' .block-views-blockrelated-bundles-block-1').hide();
        $(brandIsolation + ' .block-views-blockscotts-related-products-content-block-1').show();
        $(brandIsolation + ' .block-views-blockscotts-related-products-content-block-1 .view-content').slick('unslick').slick('reinit');
      } else if ($(this).hasClass('rec-bundles-view')) {
        $(brandIsolation + ' .block-views-blockscotts-related-products-content-block-1').hide();
        $(brandIsolation + ' .block-views-blockrelated-bundles-block-1').show();
        $(brandIsolation + ' .block-views-blockrelated-bundles-block-1 .view-content').slick('unslick').slick('reinit');
      }
    })

    // HIDE BUNDLES TAB IF NO BUNDLES.
    if ($(brandIsolation + ' .block-views-blockrelated-bundles-block-1 .view-content .views-row').length < 1) {
      $('.recommended-toggle .rec-bundles-view').hide();
    }

    // TOP KEY FEATURES - WRAP ELEMENTS.
    $(brandIsolation + ' .block-field-product-top-key-features .field--name-field-paragraph-pdp-overlay-data > .field__item').wrapAll('<div class="top-feature-container"><div class="top-feature-wrap"></div></div>');

    // TOP KEY FEATURES - COUNT.
    if ($(brandIsolation + ' .layout-region--featured.product-featured .top-feature-container .top-feature-wrap > .field__item').length === 2) {
      $(brandIsolation + ' .layout-region--featured.product-featured .paragraph--type--product-key-features-top').addClass('feat-count-2');
    } else if ($('.layout-region--featured.product-featured .top-feature-container .top-feature-wrap > .field__item').length === 3) {
      $(brandIsolation + ' .layout-region--featured.product-featured .paragraph--type--product-key-features-top').addClass('feat-count-3');
    }

    // TOP KEY FEATURES - RESPONSIVE SLIDER.
    $(brandIsolation + ' .block-field-product-top-key-features .field--name-field-paragraph-pdp-overlay-data > .top-feature-container > .top-feature-wrap').slick(slickSettings);

    var keyFeatWidth = $(brandIsolation + ' .paragraph--type--product-key-features-top').width() - 10;
    $(brandIsolation + ' .slick-track > .field__item').css('width', keyFeatWidth);

    // ADD PARENT CLASS TO KEY FEATURES COMPONENT(S)
    function keyFeatMedia(a, b) {
      $(a).parent().addClass(b);
    }
    keyFeatMedia('.paragraph--media-position--full-width', '.key-feat-media-full-width');
    keyFeatMedia('.paragraph--media-position--left-align', '.key-feat-media-left');
    keyFeatMedia('.paragraph--media-position--right-align', '.key-feat-media-right');

    // -- Product Overview | Read More --.
    $(brandIsolation + ' .toggleSection').each(function (i, elm) {
      new ToggleSection($(elm));
    });

    /*-- END Product Overview | Read More END --*/

    // -- Products - Sub-category | Grey bar - Spacing for 7 or less items --.
    var greyBarProductsSpacing = function () {
      var x = $('.path-taxonomy .product-catalog-navigation--wrapper.item-list ul.menu .slick-slide');
      if (x.length <= 7) {
        $('.path-taxonomy .product-catalog-navigation--wrapper.item-list ul.menu').addClass('slick-none');
      }
    }

    greyBarProductsSpacing();

    /*-- Products - Sub-category | Grey bar END --*/

  })

  $(window).on("load", function (e) {

    var docSizeWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

    // KEY FEATURES SECTION HEADING DIVIDER.
    $(brandIsolation + ' .block-entity-fieldnodefield-product-bundle-section .paragraph--text-position--left > .field--name-field-paragraph-pdp-section').after('<hr class="key-feature-section-divide">');
    $(brandIsolation + ' .block-entity-fieldnodefield-product-bundle-section .paragraph--text-position--right > .field--name-field-paragraph-pdp-section').after('<hr class="key-feature-section-divide">');
    $(brandIsolation + ' .block-entity-fieldnodefield-product-bundle-section .paragraph--text-position--center > .field--name-field-paragraph-pdp-section').after('<hr class="key-feature-section-divide">');
    $(brandIsolation + ' .block-entity-fieldnodefield-product-bundle-section > h2').after('<hr class="key-feature-section-divide">');

    // IE11 FIX FOR CENTERED OVERLAY.
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");
    var relatedOverlay = $('.related_article_overlay');
    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
      if (relatedOverlay.length === 1) {
        relatedOverlay.css('width', '325px');
      } else if (relatedOverlay.length === 2) {
        relatedOverlay.css('width', '320px');
      } else if (relatedOverlay.length === 3) {
        relatedOverlay.css('width', '280px');
      }
    }

  }); // ---------- END - WINDOW LOAD.

  $(window).on('resize orientationchange', function () {

    var docSizeWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

    if (docSizeWidth < 960) {
      var keyFeatWidth = $(brandIsolation + ' .paragraph--type--product-key-features-top').width() - 10;
      $(brandIsolation + ' .slick-track > .field__item').css('width', keyFeatWidth);
    } else if (docSizeWidth > 959) {
      $(brandIsolation + ' .slick-track > .field__item').removeAttr('style');
    }

    // RESPONSIVE SLIDER - RESIZE.
    $(brandIsolation + ' .product-bundle-associated-products-block .view-content').slick('resize');
    $(brandIsolation + ' .block-field-product-top-key-features .field--name-field-paragraph-pdp-overlay-data > .top-feature-container > .top-feature-wrap').slick('resize');
    $(brandIsolation + ' .block-views-blockrelated-bundles-block-1 .view-content, body.node--type-product ' + scottsBrand + ' .block-views-blockscotts-related-products-content-block-1 .view-content').slick('resize');

    // RESPONSIVE MODAL - ADJUST & CENTER MODAL ON WINDOW RESIZE.
    $('body.node--type-product .ui-dialog').position({
      my: 'center',
      at: 'center',
      of: window
    });

  }); // ---------- END - WINDOW RESIZE.

  // Launch Video Modal whenever a user clicks the "Click here to view video" link.
  $('.watch-now a').on('click', function () {
    $(this).closest('.video-wrapper').find('.video-embed-field-launch-modal').trigger("click");
  });

})(jQuery, Drupal, document);
;
/**
 * @file
 */

(function ($, Drupal, document) {
    'use strict';

    var scottsBrand;
    if (window.location.hostname.indexOf("scotts\.") > -1) {
scottsBrand = "#block-scotts-scotts-content";}
    else if (window.location.hostname.indexOf("miraclegro") > -1) {
scottsBrand = "#block-scotts-miraclegro-content";}
    else if (window.location.hostname.indexOf("ortho") > -1) {
scottsBrand = "#block-scotts-ortho-content";}
    else if (window.location.hostname.indexOf("tomcatbrand") > -1) {
scottsBrand = "#block-scotts-tomcat-content";}
    else if (window.location.hostname.indexOf("roundup") > -1) {
scottsBrand = "#block-scotts-roundup-content";}

    var brandIsolation = 'body.node--type-product ' + scottsBrand + ' .node--view-mode-full_width_content_product';

    function getCookie(name) {
        var dc = document.cookie;
        var prefix = name + "=";
        var begin = dc.indexOf("; " + prefix);
        if (begin == -1) {
            begin = dc.indexOf(prefix);
            if (begin != 0) {
return null;
            }
        }
        else {
            begin += 2;
            var end = document.cookie.indexOf(";", begin);
            if (end == -1) {
                end = dc.length;
            }
        }
        return decodeURI(dc.substring(begin + prefix.length, end));
    }

    var zipCookie = getCookie('Drupal.visitor.zip_code');

    // Check if Time/Location/Condition component is present & Drupal zipcode cookie is set
    if ($(brandIsolation + ' #time-location-condition').length > 0 && zipCookie !== null || undefined) { // only executes if Time Location Condition is on the page.

        // Get user zip code from cookie.
        var cookie = document.cookie;
        var splitCookie = cookie.split(';');

        for (var i = 0; splitCookie.length > i; i++) {
            if (splitCookie[i].match('Drupal.visitor.zip')) {
                zipCode = splitCookie[i];
                break;
            }
        }

        var zipCode = splitCookie[i].split('=');
        var userZip = zipCode[1];

        var messageCheck;

        var tlcCondition = drupalSettings.timeLocationCondition;
        if (tlcCondition && tlcCondition.product_id && tlcCondition.display && tlcCondition.display === 1 && userZip) {

            var brandID = tlcCondition.product_id;

            var requestURL = 'https://dev.scottsmylawnapp.com';
            if (window.location.hostname.indexOf('acsftest.') >= 0) {
                requestURL = 'https://dev2.scottsmylawnapp.com';
            }
            else if (window.location.hostname.indexOf('www.') >= 0) {
                requestURL = 'https://www.scottsmylawnapp.com';
            }
            requestURL += '/LawnApp/api/services/weatherProduct?zipCode=' + userZip + '&pid=' + brandID; // Storing the json variable.

            var request = new XMLHttpRequest(); // Creating the request
            request.open('GET', requestURL); // opening new request
            request.responseType = 'json'; // setting response type so that XHR knows that the server will be returning JSON. Converts into JS object.
            request.send(); // send the request.

            request.onload = function () {
                var weather = request.response;
                if (weather.response == undefined) {
                    weather = JSON.parse(weather);
                }
                $(brandIsolation + ' #weather-bar').html('');
                $(brandIsolation + ' #use-banner').html('');
                statusHandler(weather.response.statusCode);
                messageHandler(weather.response.responseData.message);
                if (messageCheck !== undefined) {
                    showWeather(weather.response.responseData.currentWeather);
                }
            }
        }

        function statusHandler(statusCode) {
            if (statusCode == '01') {
                $(brandIsolation + ' #time-location-condition').show();
            }
        }

        function messageHandler(message) {
            if (message !== undefined) {
                $(brandIsolation + ' #use-banner').html(message);
            }
            messageCheck = message;
        }

        function showWeather(weatherBlocks) {
            for (var i = 0; i < weatherBlocks.length - 1; i++) {

                var dayContainer = document.createElement('div');
                dayContainer.className += 'day-container';
                var WB = weatherBlocks[i];

                var day = shortDay(WB.dayOfWeek);
                var raw = '<p class="day">' + '<span class="mobile">' + day.mobile + '</span>' + '<span class="desktop">' + day.desktop + '</span>' + '</p>';
                raw += '<p class="temp">' + WB.lowTemp + '° / ' + WB.highTemp + '°</p>';
                raw += '<div class="third-row">';
                raw += '<div class="scotts-product-icon ' + ((WB.precipitation === 0) ? 'scotts-bundle-icon-droplet-null' : 'scotts-bundle-icon-droplet-full') + '"></div>';
                raw += '<p class="precipitation">' + WB.precipitation + '% </p>';
                raw += '</div>' // Closing bracket for third-row div.
                raw += '<div class="inner-border"></div>';
                dayContainer.innerHTML = raw;

                var weather = document.getElementById('weather-bar');
                weather.appendChild(dayContainer);
            }

            function shortDay(dayOfWeek) {
                switch (dayOfWeek.toLowerCase()) {
                    case 'sunday':
                        return {
                            desktop: 'SUN',
                            mobile: 'S'
                        };

                        break;

                    case 'monday':
                        return {
                            desktop: 'MON',
                            mobile: 'M'
                        };

                        break;

                    case 'tuesday':
                        return {
                            desktop: 'TUES',
                            mobile: 'T'
                        };

                        break;

                    case 'wednesday':
                        return {
                            desktop: 'WED',
                            mobile: 'W'
                        };

                        break;

                    case 'thursday':
                        return {
                            desktop: 'THUR',
                            mobile: 'Th'
                        };

                        break;

                    case 'friday':
                        return {
                            desktop: 'FRI',
                            mobile: 'F'
                        };

                        break;

                    case 'saturday':
                        return {
                            desktop: 'SAT',
                            mobile: 'Sa'
                        };

                        break;

                    default:
                        return null;
                    break;
                }
            }
            function removeFirstBorder() {
                $(brandIsolation + ' .inner-border').eq(0).hide();
            }
            removeFirstBorder();
        }
    }

    setTimeout(function () {
        $(brandIsolation + ' .section-outer-wrapper #time-location-condition #weather-bar .day-container').each(function () {
            if ($(this).length > -1) {
                $(brandIsolation + ' .scotts-vertical-blocks').addClass('tlc-active');
            }
        })
    }, 1000);

})(jQuery, Drupal, document);
;
/**
 * @file
 */

(function ($, Drupal, drupalSettings) {

  "use strict";

  /**
   * Container for easy storage and retrieval of variables in the DOM.
   *
   * Configurable Javascript is available with drupalSettings (the successor to Drupal 7's Drupal.settings).
   * However, to make drupalSettings available to our JavaScript file: we have to declare a dependency on it.
   *
   * @requires drupalSettings as dependency OMEGA_SUBTHEME.libraries.yml
   * @see https://www.drupal.org/node/2274843#configurable
   * @see OMEGA_SUBTHEME/js/README.md
   * @type {{object}}
   */
  drupalSettings.scotts_scotts = {
    'config': {
      'sample_variable': true
    }
  };

  /**
   * Sample of Drupal.behaviors.
   *
   * @see https://www.drupal.org/node/2269515
   * @see OMEGA_SUBTHEME/js/README.md
   * @type {{attach: Drupal.behaviors.myCustomSubthemeBehavior.attach}}
   */
  /*Drupal.behaviors.myCustomSubthemeBehavior = {
   attach: function (context, settings) {
   $(context).find('input.css-class').once('myCustomSubthemeBehavior').each(function () {
   // Apply the myCustomSubthemeBehavior effect to the elements only once.
   });
   }
   };*/

})(jQuery, Drupal, drupalSettings);

(function ($, Drupal, document) {
  'use strict';

  $(document).ready(function (e) {

    /* Create the bxSlider carousel */
    // var artCarouselSlider = $('.bxslider').bxSlider({
    //     auto: false,
    //     autoStart: false,
    //     useCSS: false,
    //     preloadImages: 'all',
    //     mode: 'horizontal',
    //     adaptiveHeight: true,
    //     pager: true,
    //     pagerType: 'full',
    //     controls: false,
    //     slideWidth: 500,
    //     minSlides: 1,
    //     maxSlides: 5,
    //     moveSlides: 2,
    //     captions: true
    // });.
    // /*
    //     setup handlers ourselves for clicks on the header bar
    //     (as bxSlider's nextSelector.. has restricted layout. If we do this
    //     ourselves we can use any layout we want)
    //     */.
    // $("#carousel-previous").click(function() {
    //         artCarouselSlider.goToPrevSlide();
    //         return false;
    //     });
    //     $("#carousel-next").click(function() {
    //         artCarouselSlider.goToNextSlide();
    //         return false;
    //     });.

    /**
     * The following function resizes three-column articles to match the height of the tallest element.
     * The way this is done is be calculating the difference between the tallest element + a constant offset,
     * and padding the button element from the smaller columns by that pixel amount. The offset is based off
     * of the body's font size. The container offset is the difference between the outer div element that
     * contains the column, and the inner div element that contains the blocks.
     *
     * The function will dynamically resize the button padding with browser size, and scales to the mobile
     * view. Will run only on /scotts-custom-seed.
     *
     */

    // Resizes the columns to their original heights to prime
    // the columns for adjustment with respect to browser size.
    function setToOriginalHeight() {
      const urlArray = window.location.pathname.split('/');
      if (urlArray[urlArray.length - 1] !== "scotts-custom-seed") {
        return;
      }

      $('.layout-wrapper--b-three-column').each(function () {
        var $columns = $('.layout-region--three-column', this);
        for (var i = 0; i < 3; i++) {
          $columns[i].style.height = "";
          var $buttonElement = Array.prototype.slice.call($columns[i].childNodes);
          $buttonElement = Array.prototype.slice.call($buttonElement[1].children);
          $buttonElement = $buttonElement[3];
          $buttonElement.style.padding = "0px 0px 0px 0px";
        }
      });
    }

    // Resizes the columns to an equal height, based on browser size.
    function adjustColumnHeight() {

      const urlArray = window.location.pathname.split('/');
      if (urlArray[urlArray.length - 1] !== "scotts-custom-seed") {
        return;
      }

      if ($(window).width() >= 599) {
        const offset = parseInt(($("body").css('font-size')).replace(/\D/g, ""), 10);
        const containerOffset = 17.42;
        $('.layout-wrapper--b-three-column').each(function () {
          var $columns = $('.layout-region--three-column', this);
          var columnHeight = $columns.map(function () {
            return $(this).height();
          });
          var tallestColumn = Math.max.apply(Math, $columns.map(function () {
            return $(this).height();
          }).get());
          $columns.height(tallestColumn);
          var tallestColumnTrueHeight = tallestColumn - containerOffset;
          for (var i = 0; i < 3; i++) {
            columnHeight[i] = columnHeight[i] - containerOffset;
            if (columnHeight[i] !== tallestColumnTrueHeight) {
              var buttonPadding = tallestColumnTrueHeight - columnHeight[i] - offset;
              var $buttonElement = Array.prototype.slice.call($columns[i].childNodes);
              $buttonElement = Array.prototype.slice.call($buttonElement[1].children);
              $buttonElement = $buttonElement[3];
              $buttonElement.style.padding = (buttonPadding + "px 0px 0px 0px");
            }
          }
        });
      } else {
        setToOriginalHeight();
      }
    }

    // is called by an Event Listener that is triggered on resize.
    function onResize() {
      setToOriginalHeight();
      adjustColumnHeight();
    }

    $(document).ready(function () {
      adjustColumnHeight();
    });
    window.addEventListener('resize', onResize);

  });

})(jQuery, Drupal, document);
;
/**
 * @file
 */

(function ($, Drupal, drupalSettings) {

  'use strict';

  Drupal.extlink = Drupal.extlink || {};

  Drupal.extlink.attach = function (context, drupalSettings) {
    if (!drupalSettings.data.hasOwnProperty('extlink')) {
      return;
    }

    // Strip the host name down, removing ports, subdomains, or www.
    var pattern = /^(([^\/:]+?\.)*)([^\.:]{1,})((\.[a-z0-9]{1,253})*)(:[0-9]{1,5})?$/;
    var host = window.location.host.replace(pattern, '$2$3');
    var subdomain = window.location.host.replace(host, '');

    // Determine what subdomains are considered internal.
    var subdomains;
    if (drupalSettings.data.extlink.extSubdomains) {
      subdomains = '([^/]*\\.)?';
    }
    else if (subdomain === 'www.' || subdomain === '') {
      subdomains = '(www\\.)?';
    }
    else {
      subdomains = subdomain.replace('.', '\\.');
    }

    // Build regular expressions that define an internal link.
    var internal_link = new RegExp('^https?://' + subdomains + host, 'i');

    // Extra internal link matching.
    var extInclude = false;
    if (drupalSettings.data.extlink.extInclude) {
      extInclude = new RegExp(drupalSettings.data.extlink.extInclude.replace(/\\/, '\\'), 'i');
    }

    // Extra external link matching.
    var extExclude = false;
    if (drupalSettings.data.extlink.extExclude) {
      extExclude = new RegExp(drupalSettings.data.extlink.extExclude.replace(/\\/, '\\'), 'i');
    }

    // Extra external link CSS selector exclusion.
    var extCssExclude = false;
    if (drupalSettings.data.extlink.extCssExclude) {
      extCssExclude = drupalSettings.data.extlink.extCssExclude;
    }

    // Extra external link CSS selector explicit.
    var extCssExplicit = false;
    if (drupalSettings.data.extlink.extCssExplicit) {
      extCssExplicit = drupalSettings.data.extlink.extCssExplicit;
    }

    // Find all links which are NOT internal and begin with http as opposed
    // to ftp://, javascript:, etc. other kinds of links.
    // When operating on the 'this' variable, the host has been appended to
    // all links by the browser, even local ones.
    // In jQuery 1.1 and higher, we'd use a filter method here, but it is not
    // available in jQuery 1.0 (Drupal 5 default).
    var external_links = [];
    var mailto_links = [];
    $('a:not(.' + drupalSettings.data.extlink.extClass + ', .' + drupalSettings.data.extlink.mailtoClass + '), area:not(.' + drupalSettings.data.extlink.extClass + ', .' + drupalSettings.data.extlink.mailtoClass + ')', context).each(function (el) {
      try {
        var url = '';
        if (typeof this.href == 'string') {
          url = this.href.toLowerCase();
        }
        // Handle SVG links (xlink:href).
        else if (typeof this.href == 'object') {
          url = this.href.baseVal;
        }
        if (url.indexOf('http') === 0
          && ((!internal_link.test(url) && !(extExclude && extExclude.test(url))) || (extInclude && extInclude.test(url)))
          && !(extCssExclude && $(this).is(extCssExclude))
          && !(extCssExclude && $(this).parents(extCssExclude).length > 0)
          && !(extCssExplicit && $(this).parents(extCssExplicit).length < 1)) {
          external_links.push(this);
        }
        // Do not include area tags with begin with mailto: (this prohibits
        // icons from being added to image-maps).
        else if (this.tagName !== 'AREA'
          && url.indexOf('mailto:') === 0
          && !(extCssExclude && $(this).parents(extCssExclude).length > 0)
          && !(extCssExplicit && $(this).parents(extCssExplicit).length < 1)) {
          mailto_links.push(this);
        }
      }
      // IE7 throws errors often when dealing with irregular links, such as:
      // <a href="node/10"></a> Empty tags.
      // <a href="http://user:pass@example.com">example</a> User:pass syntax.
      catch (error) {
        return false;
      }
    });

    if (drupalSettings.data.extlink.extClass !== '0' && drupalSettings.data.extlink.extClass !== '') {
      Drupal.extlink.applyClassAndSpan(external_links, drupalSettings.data.extlink.extClass);
    }

    if (drupalSettings.data.extlink.mailtoClass !== '0' && drupalSettings.data.extlink.mailtoClass !== '') {
      Drupal.extlink.applyClassAndSpan(mailto_links, drupalSettings.data.extlink.mailtoClass);
    }

    if (drupalSettings.data.extlink.extTarget) {
      // Apply the target attribute to all links.
      $(external_links).filter(function () {
        // Filter out links with target set if option specified.
        return !(drupalSettings.data.extlink.extTargetNoOverride && $(this).is('a[target]'));
      }).attr({ target: '_blank' });

      // Add noopener and noreferrer rel attributes to combat phishing.
      $(external_links).attr('rel', function (i, val) {
        // If no rel attribute is present, create one with the values noopener and noreferrer.
        if (val === null || typeof val === 'undefined') {
          return 'noopener noreferrer';
        }
        // Check to see if rel contains noopener or noreferrer. Add what doesn't exist.
        if (val.indexOf('noopener') > -1 || val.indexOf('noreferrer') > -1) {
          if (val.indexOf('noopener') === -1) {
            return val + ' noopener';
          }
          if (val.indexOf('noreferrer') === -1) {
            return val + ' noreferrer';
          }
          // Both noopener and noreferrer exist. Nothing needs to be added.
          else {
            return val;
          }
        }
        // Else, append noopener and noreferrer to val.
        else {
          return val + ' noopener noreferrer';
        }
      });
    }

    if (drupalSettings.data.extlink.extNofollow) {
      $(external_links).attr('rel', function (i, val) {
        // when the link does not have a rel attribute set it to 'nofollow'.
        if (val === null || typeof val === 'undefined') {
          return 'nofollow';
        }
        var target = 'nofollow';
        // Change the target, if not overriding follow.
        if (drupalSettings.data.extlink.extFollowNoOverride) {
          target = 'follow';
        }
        if (val.indexOf(target) === -1) {
          return val + ' nofollow';
        }
        return val;
      });
    }

    Drupal.extlink = Drupal.extlink || {};

    // Set up default click function for the external links popup. This should be
    // overridden by modules wanting to alter the popup.
    Drupal.extlink.popupClickHandler = Drupal.extlink.popupClickHandler || function () {
      if (drupalSettings.data.extlink.extAlert) {
        return confirm(drupalSettings.data.extlink.extAlertText);
      }
    };

    $(external_links).click(function (e) {
      return Drupal.extlink.popupClickHandler(e, this);
    });
  };

  /**
   * Apply a class and a trailing <span> to all links not containing images.
   *
   * @param {object[]} links
   *   An array of DOM elements representing the links.
   * @param {string} class_name
   *   The class to apply to the links.
   */
  Drupal.extlink.applyClassAndSpan = function (links, class_name) {
    var $links_to_process;
    if (drupalSettings.data.extlink.extImgClass) {
      $links_to_process = $(links);
    }
    else {
      var links_with_images = $(links).find('img').parents('a');
      $links_to_process = $(links).not(links_with_images);
    }
    if (class_name !== '0') {
      $links_to_process.addClass(class_name);
    }
    var i;
    var length = $links_to_process.length;
    for (i = 0; i < length; i++) {
      var $link = $($links_to_process[i]);
      if (class_name === drupalSettings.data.extlink.mailtoClass) {
        $link.append('<span class="' + class_name + '" aria-label="' + drupalSettings.data.extlink.mailtoLabel + '"></span>');
      }
      else {
        $link.append('<span class="' + class_name + '" aria-label="' + drupalSettings.data.extlink.extLabel + '"></span>');
      }
    }
  };

  Drupal.behaviors.extlink = Drupal.behaviors.extlink || {};
  Drupal.behaviors.extlink.attach = function (context, drupalSettings) {
    // Backwards compatibility, for the benefit of modules overriding extlink
    // functionality by defining an "extlinkAttach" global function.
    if (typeof extlinkAttach === 'function') {
      extlinkAttach(context);
    }
    else {
      Drupal.extlink.attach(context, drupalSettings);
    }
  };

})(jQuery, Drupal, drupalSettings);
;
(function ($, Modernizr, Drupal, drupalSettings, window) {

  "use strict";

  drupalSettings.omega.currentBreakpoints = {
    'All' : true
  };

  var breakpoints;
  var breakpointMatch;

  Drupal.behaviors.omegaBreakpoint = {
    attach: function (context, settings) {
      // return if not viewing on screen
      if (!window.matchMedia('only screen').matches) {
        return;
      }
      breakpoints = drupalSettings.omega_breakpoints;
      breakpointMatch = false;

      // Handle the intial load
      $(window).on('load', function() {
        $.each(breakpoints, function() {
        	if (window.matchMedia(this.query).matches) {
            breakpointMatch = true;
            drupalSettings.omega.currentBreakpoints[this.name] = true;
            $.event.trigger('breakpointAdded', {name: this.name, query: this.query});
          }
          else {
            drupalSettings.omega.currentBreakpoints[this.name] = false;
            // don't trigger the event since it is on page load, just rely on setting it to false above.
            //$.event.trigger('breakpointRemoved', {breakpoint: this.name, query: this.query});
          }
        });
      });

      // handle resize events
      $(window).on('resize', function(){
        $.each(breakpoints, function() {
        	if (window.matchMedia(this.query).matches) {
        	  breakpointMatch = true;
            // if it wasn't already active
            if (drupalSettings.omega.currentBreakpoints[this.name] != true) {
              drupalSettings.omega.currentBreakpoints[this.name] = true;
              $.event.trigger('breakpointAdded', {name: this.name, query: this.query});
            }
          }
          else {
            // if it was already active
            if (drupalSettings.omega.currentBreakpoints[this.name] == true) {
              drupalSettings.omega.currentBreakpoints[this.name] = false;
              $.event.trigger('breakpointRemoved', {name: this.name, query: this.query});
            }
          }
        });

        // must be mobile or something shitty like IE8
        if (!breakpointMatch) {
          breakpointMatch = false;
          drupalSettings.omega.currentBreakpoints['all'] = true;
        }
      });
    }
  };

  // @todo - need to use some LocalStorage to keep the indicator open/closed based on last setting.
  Drupal.behaviors.indicatorToggle = {
    attach: function (context, settings) {

      $('#indicator-toggle').on('click', function() {
        if ($(this).hasClass('indicator-open')) {
          $(this).removeClass('indicator-open').addClass('indicator-closed');
          $('#omega-screen--indicator').animate({
            opacity: 0.25,
            right: '-280'
          }, 500, function() {
            // Animation complete.
          });
        }
        else {
          $(this).removeClass('indicator-closed').addClass('indicator-open');
          $('#omega-screen--indicator').animate({
            opacity: 1,
            right: '0',
            //height: "toggle"
          }, 250, function() {
            // Animation complete.
          });

        }
        return false;
      });
    }
  };

  Drupal.behaviors.attachIndicatorData = {
    attach: function (context, settings) {
      // grab the wrapper element to manipulate
      var oScreen = $('#omega-screen--indicator');
      var screenWidth;
      var breakpointText;

      $(window).on('load resize', function(){
        screenWidth = $(this).width();
        var layout = drupalSettings.omega.activeLayout;
        oScreen.find('.screen-size .data').html(screenWidth + 'px');
        oScreen.find('.screen-layout .data').html(layout);
        oScreen.find('.theme-name .data').html(drupalSettings.omega.activeTheme);
      });

      // if a breakpiont has been added or removed, change the text
      $(window).on('breakpointAdded breakpointRemoved', function(e, b){
        breakpointText = [];
        $.each(breakpoints, function() {
          if (drupalSettings.omega.currentBreakpoints[this.name] == true) {
            breakpointText.push(this.name);
            var text = breakpointText.join(', ');
            oScreen.find('.screen-query .data').html(text);
          }
        });
      });
    }
  };

  /**
   * Toolbar methods of Backbone objects.
   */
  Drupal.omega = {

    // A hash of View instances.
    views: {},

    // A hash of Model instances.
    models: {},


  };

})(jQuery, Modernizr, Drupal, drupalSettings, window);
;
/**
 * bxSlider v4.2.1d
 * Copyright 2013-2017 Steven Wanderski
 * Written while drinking Belgian ales and listening to jazz
 * Licensed under MIT (http://opensource.org/licenses/MIT)
 */
!function(t){var e={mode:"horizontal",slideSelector:"",infiniteLoop:!0,hideControlOnEnd:!1,speed:500,easing:null,slideMargin:0,startSlide:0,randomStart:!1,captions:!1,ticker:!1,tickerHover:!1,adaptiveHeight:!1,adaptiveHeightSpeed:500,video:!1,useCSS:!0,preloadImages:"visible",responsive:!0,slideZIndex:50,wrapperClass:"bx-wrapper",touchEnabled:!0,swipeThreshold:50,oneToOneTouch:!0,preventDefaultSwipeX:!0,preventDefaultSwipeY:!1,ariaLive:!0,ariaHidden:!0,keyboardEnabled:!1,pager:!0,pagerType:"full",pagerShortSeparator:" / ",pagerSelector:null,buildPager:null,pagerCustom:null,controls:!0,nextText:"Next",prevText:"Prev",nextSelector:null,prevSelector:null,autoControls:!1,startText:"Start",stopText:"Stop",autoControlsCombine:!1,autoControlsSelector:null,auto:!1,pause:4e3,autoStart:!0,autoDirection:"next",stopAutoOnClick:!1,autoHover:!1,autoDelay:0,autoSlideForOnePage:!1,minSlides:1,maxSlides:1,moveSlides:0,slideWidth:0,shrinkItems:!1,onSliderLoad:function(){return!0},onSlideBefore:function(){return!0},onSlideAfter:function(){return!0},onSlideNext:function(){return!0},onSlidePrev:function(){return!0},onSliderResize:function(){return!0},onAutoChange:function(){return!0}};t.fn.bxSlider=function(n){if(0===this.length)return this;if(this.length>1)return this.each(function(){t(this).bxSlider(n)}),this;var s={},o=this,r=t(window).width(),a=t(window).height();if(!t(o).data("bxSlider")){var l=function(){t(o).data("bxSlider")||(s.settings=t.extend({},e,n),s.settings.slideWidth=parseInt(s.settings.slideWidth),s.children=o.children(s.settings.slideSelector),s.children.length<s.settings.minSlides&&(s.settings.minSlides=s.children.length),s.children.length<s.settings.maxSlides&&(s.settings.maxSlides=s.children.length),s.settings.randomStart&&(s.settings.startSlide=Math.floor(Math.random()*s.children.length)),s.active={index:s.settings.startSlide},s.carousel=s.settings.minSlides>1||s.settings.maxSlides>1,s.carousel&&(s.settings.preloadImages="all"),s.minThreshold=s.settings.minSlides*s.settings.slideWidth+(s.settings.minSlides-1)*s.settings.slideMargin,s.maxThreshold=s.settings.maxSlides*s.settings.slideWidth+(s.settings.maxSlides-1)*s.settings.slideMargin,s.working=!1,s.controls={},s.interval=null,s.animProp="vertical"===s.settings.mode?"top":"left",s.usingCSS=s.settings.useCSS&&"fade"!==s.settings.mode&&function(){for(var t=document.createElement("div"),e=["WebkitPerspective","MozPerspective","OPerspective","msPerspective"],i=0;i<e.length;i++)if(void 0!==t.style[e[i]])return s.cssPrefix=e[i].replace("Perspective","").toLowerCase(),s.animProp="-"+s.cssPrefix+"-transform",!0;return!1}(),"vertical"===s.settings.mode&&(s.settings.maxSlides=s.settings.minSlides),o.data("origStyle",o.attr("style")),o.children(s.settings.slideSelector).each(function(){t(this).data("origStyle",t(this).attr("style"))}),d())},d=function(){var e=s.children.eq(s.settings.startSlide);o.wrap('<div class="'+s.settings.wrapperClass+'"><div class="bx-viewport"></div></div>'),s.viewport=o.parent(),s.settings.ariaLive&&!s.settings.ticker&&s.viewport.attr("aria-live","polite"),s.loader=t('<div class="bx-loading" />'),s.viewport.prepend(s.loader),o.css({width:"horizontal"===s.settings.mode?1e3*s.children.length+215+"%":"auto",position:"relative"}),s.usingCSS&&s.settings.easing?o.css("-"+s.cssPrefix+"-transition-timing-function",s.settings.easing):s.settings.easing||(s.settings.easing="swing"),s.viewport.css({width:"100%",overflow:"hidden",position:"relative"}),s.viewport.parent().css({maxWidth:u()}),s.children.css({float:"horizontal"===s.settings.mode?"left":"none",listStyle:"none",position:"relative"}),s.children.css("width",h()),"horizontal"===s.settings.mode&&s.settings.slideMargin>0&&s.children.css("marginRight",s.settings.slideMargin),"vertical"===s.settings.mode&&s.settings.slideMargin>0&&s.children.css("marginBottom",s.settings.slideMargin),"fade"===s.settings.mode&&(s.children.css({position:"absolute",zIndex:0,display:"none"}),s.children.eq(s.settings.startSlide).css({zIndex:s.settings.slideZIndex,display:"block"})),s.controls.el=t('<div class="bx-controls" />'),s.settings.captions&&k(),s.active.last=s.settings.startSlide===f()-1,s.settings.video&&o.fitVids(),"none"===s.settings.preloadImages?e=null:("all"===s.settings.preloadImages||s.settings.ticker)&&(e=s.children),s.settings.ticker?s.settings.pager=!1:(s.settings.controls&&C(),s.settings.auto&&s.settings.autoControls&&T(),s.settings.pager&&b(),(s.settings.controls||s.settings.autoControls||s.settings.pager)&&s.viewport.after(s.controls.el)),null===e?g():c(e,g)},c=function(e,i){var n=e.find('img:not([src=""]), iframe').length,s=0;if(0===n)return void i();e.find('img:not([src=""]), iframe').each(function(){t(this).one("load error",function(){++s===n&&i()}).each(function(){(this.complete||""==this.src)&&t(this).trigger("load")})})},g=function(){if(s.settings.infiniteLoop&&"fade"!==s.settings.mode&&!s.settings.ticker){var e="vertical"===s.settings.mode?s.settings.minSlides:s.settings.maxSlides,i=s.children.slice(0,e).clone(!0).addClass("bx-clone"),n=s.children.slice(-e).clone(!0).addClass("bx-clone");s.settings.ariaHidden&&(i.attr("aria-hidden",!0),n.attr("aria-hidden",!0)),o.append(i).prepend(n)}s.loader.remove(),m(),"vertical"===s.settings.mode&&(s.settings.adaptiveHeight=!0),s.viewport.height(p()),o.redrawSlider(),s.settings.onSliderLoad.call(o,s.active.index),s.initialized=!0,s.settings.responsive&&t(window).on("resize",U),s.settings.auto&&s.settings.autoStart&&(f()>1||s.settings.autoSlideForOnePage)&&L(),s.settings.ticker&&O(),s.settings.pager&&z(s.settings.startSlide),s.settings.controls&&q(),s.settings.touchEnabled&&!s.settings.ticker&&X(),s.settings.keyboardEnabled&&!s.settings.ticker&&t(document).keydown(B)},p=function(){var e=0,n=t();if("vertical"===s.settings.mode||s.settings.adaptiveHeight)if(s.carousel){var o=1===s.settings.moveSlides?s.active.index:s.active.index*x();for(n=s.children.eq(o),i=1;i<=s.settings.maxSlides-1;i++)n=o+i>=s.children.length?n.add(s.children.eq(i-1)):n.add(s.children.eq(o+i))}else n=s.children.eq(s.active.index);else n=s.children;return"vertical"===s.settings.mode?(n.each(function(i){e+=t(this).outerHeight()}),s.settings.slideMargin>0&&(e+=s.settings.slideMargin*(s.settings.minSlides-1))):e=Math.max.apply(Math,n.map(function(){return t(this).outerHeight(!1)}).get()),"border-box"===s.viewport.css("box-sizing")?e+=parseFloat(s.viewport.css("padding-top"))+parseFloat(s.viewport.css("padding-bottom"))+parseFloat(s.viewport.css("border-top-width"))+parseFloat(s.viewport.css("border-bottom-width")):"padding-box"===s.viewport.css("box-sizing")&&(e+=parseFloat(s.viewport.css("padding-top"))+parseFloat(s.viewport.css("padding-bottom"))),e},u=function(){var t="100%";return s.settings.slideWidth>0&&(t="horizontal"===s.settings.mode?s.settings.maxSlides*s.settings.slideWidth+(s.settings.maxSlides-1)*s.settings.slideMargin:s.settings.slideWidth),t},h=function(){var t=s.settings.slideWidth,e=s.viewport.width();if(0===s.settings.slideWidth||s.settings.slideWidth>e&&!s.carousel||"vertical"===s.settings.mode)t=e;else if(s.settings.maxSlides>1&&"horizontal"===s.settings.mode){if(e>s.maxThreshold)return t;e<s.minThreshold?t=(e-s.settings.slideMargin*(s.settings.minSlides-1))/s.settings.minSlides:s.settings.shrinkItems&&(t=Math.floor((e+s.settings.slideMargin)/Math.ceil((e+s.settings.slideMargin)/(t+s.settings.slideMargin))-s.settings.slideMargin))}return t},v=function(){var t=1,e=null;return"horizontal"===s.settings.mode&&s.settings.slideWidth>0?s.viewport.width()<s.minThreshold?t=s.settings.minSlides:s.viewport.width()>s.maxThreshold?t=s.settings.maxSlides:(e=s.children.first().width()+s.settings.slideMargin,t=Math.floor((s.viewport.width()+s.settings.slideMargin)/e)||1):"vertical"===s.settings.mode&&(t=s.settings.minSlides),t},f=function(){var t=0,e=0,i=0;if(s.settings.moveSlides>0){if(!s.settings.infiniteLoop){for(;e<s.children.length;)++t,e=i+v(),i+=s.settings.moveSlides<=v()?s.settings.moveSlides:v();return i}t=Math.ceil(s.children.length/x())}else t=Math.ceil(s.children.length/v());return t},x=function(){return s.settings.moveSlides>0&&s.settings.moveSlides<=v()?s.settings.moveSlides:v()},m=function(){var t,e,i;s.children.length>s.settings.maxSlides&&s.active.last&&!s.settings.infiniteLoop?"horizontal"===s.settings.mode?(e=s.children.last(),t=e.position(),S(-(t.left-(s.viewport.width()-e.outerWidth())),"reset",0)):"vertical"===s.settings.mode&&(i=s.children.length-s.settings.minSlides,t=s.children.eq(i).position(),S(-t.top,"reset",0)):(t=s.children.eq(s.active.index*x()).position(),s.active.index===f()-1&&(s.active.last=!0),void 0!==t&&("horizontal"===s.settings.mode?S(-t.left,"reset",0):"vertical"===s.settings.mode&&S(-t.top,"reset",0)))},S=function(e,i,n,r){var a,l;s.usingCSS?(l="vertical"===s.settings.mode?"translate3d(0, "+e+"px, 0)":"translate3d("+e+"px, 0, 0)",o.css("-"+s.cssPrefix+"-transition-duration",n/1e3+"s"),"slide"===i?(o.css(s.animProp,l),0!==n?o.on("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd",function(e){t(e.target).is(o)&&(o.off("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd"),A())}):A()):"reset"===i?o.css(s.animProp,l):"ticker"===i&&(o.css("-"+s.cssPrefix+"-transition-timing-function","linear"),o.css(s.animProp,l),0!==n?o.on("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd",function(e){t(e.target).is(o)&&(o.off("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd"),S(r.resetValue,"reset",0),F())}):(S(r.resetValue,"reset",0),F()))):(a={},a[s.animProp]=e,"slide"===i?o.animate(a,n,s.settings.easing,function(){A()}):"reset"===i?o.css(s.animProp,e):"ticker"===i&&o.animate(a,n,"linear",function(){S(r.resetValue,"reset",0),F()}))},w=function(){for(var e="",i="",n=f(),o=0;o<n;o++)i="",s.settings.buildPager&&t.isFunction(s.settings.buildPager)||s.settings.pagerCustom?(i=s.settings.buildPager(o),s.pagerEl.addClass("bx-custom-pager")):(i=o+1,s.pagerEl.addClass("bx-default-pager")),e+='<div class="bx-pager-item"><a href="" data-slide-index="'+o+'" class="bx-pager-link">'+i+"</a></div>";s.pagerEl.html(e)},b=function(){s.settings.pagerCustom?s.pagerEl=t(s.settings.pagerCustom):(s.pagerEl=t('<div class="bx-pager" />'),s.settings.pagerSelector?t(s.settings.pagerSelector).html(s.pagerEl):s.controls.el.addClass("bx-has-pager").append(s.pagerEl),w()),s.pagerEl.on("click touchend","a",I)},C=function(){s.controls.next=t('<a class="bx-next" href="">'+s.settings.nextText+"</a>"),s.controls.prev=t('<a class="bx-prev" href="">'+s.settings.prevText+"</a>"),s.controls.next.on("click touchend",P),s.controls.prev.on("click touchend",E),s.settings.nextSelector&&t(s.settings.nextSelector).append(s.controls.next),s.settings.prevSelector&&t(s.settings.prevSelector).append(s.controls.prev),s.settings.nextSelector||s.settings.prevSelector||(s.controls.directionEl=t('<div class="bx-controls-direction" />'),s.controls.directionEl.append(s.controls.prev).append(s.controls.next),s.controls.el.addClass("bx-has-controls-direction").append(s.controls.directionEl))},T=function(){s.controls.start=t('<div class="bx-controls-auto-item"><a class="bx-start" href="">'+s.settings.startText+"</a></div>"),s.controls.stop=t('<div class="bx-controls-auto-item"><a class="bx-stop" href="">'+s.settings.stopText+"</a></div>"),s.controls.autoEl=t('<div class="bx-controls-auto" />'),s.controls.autoEl.on("click",".bx-start",M),s.controls.autoEl.on("click",".bx-stop",y),s.settings.autoControlsCombine?s.controls.autoEl.append(s.controls.start):s.controls.autoEl.append(s.controls.start).append(s.controls.stop),s.settings.autoControlsSelector?t(s.settings.autoControlsSelector).html(s.controls.autoEl):s.controls.el.addClass("bx-has-controls-auto").append(s.controls.autoEl),D(s.settings.autoStart?"stop":"start")},k=function(){s.children.each(function(e){var i=t(this).find("img:first").attr("title");void 0!==i&&(""+i).length&&t(this).append('<div class="bx-caption"><span>'+i+"</span></div>")})},P=function(t){t.preventDefault(),s.controls.el.hasClass("disabled")||(s.settings.auto&&s.settings.stopAutoOnClick&&o.stopAuto(),o.goToNextSlide())},E=function(t){t.preventDefault(),s.controls.el.hasClass("disabled")||(s.settings.auto&&s.settings.stopAutoOnClick&&o.stopAuto(),o.goToPrevSlide())},M=function(t){o.startAuto(),t.preventDefault()},y=function(t){o.stopAuto(),t.preventDefault()},I=function(e){var i,n;e.preventDefault(),s.controls.el.hasClass("disabled")||(s.settings.auto&&s.settings.stopAutoOnClick&&o.stopAuto(),i=t(e.currentTarget),void 0!==i.attr("data-slide-index")&&(n=parseInt(i.attr("data-slide-index")))!==s.active.index&&o.goToSlide(n))},z=function(e){var i=s.children.length;if("short"===s.settings.pagerType)return s.settings.maxSlides>1&&(i=Math.ceil(s.children.length/s.settings.maxSlides)),void s.pagerEl.html(e+1+s.settings.pagerShortSeparator+i);s.pagerEl.find("a").removeClass("active"),s.pagerEl.each(function(i,n){t(n).find("a").eq(e).addClass("active")})},A=function(){if(s.settings.infiniteLoop){var t="";0===s.active.index?t=s.children.eq(0).position():s.active.index===f()-1&&s.carousel?t=s.children.eq((f()-1)*x()).position():s.active.index===s.children.length-1&&(t=s.children.eq(s.children.length-1).position()),t&&("horizontal"===s.settings.mode?S(-t.left,"reset",0):"vertical"===s.settings.mode&&S(-t.top,"reset",0))}s.working=!1,s.settings.onSlideAfter.call(o,s.children.eq(s.active.index),s.oldIndex,s.active.index)},D=function(t){s.settings.autoControlsCombine?s.controls.autoEl.html(s.controls[t]):(s.controls.autoEl.find("a").removeClass("active"),s.controls.autoEl.find("a:not(.bx-"+t+")").addClass("active"))},q=function(){1===f()?(s.controls.prev.addClass("disabled"),s.controls.next.addClass("disabled")):!s.settings.infiniteLoop&&s.settings.hideControlOnEnd&&(0===s.active.index?(s.controls.prev.addClass("disabled"),s.controls.next.removeClass("disabled")):s.active.index===f()-1?(s.controls.next.addClass("disabled"),s.controls.prev.removeClass("disabled")):(s.controls.prev.removeClass("disabled"),s.controls.next.removeClass("disabled")))},H=function(){o.startAuto()},W=function(){o.stopAuto()},L=function(){s.settings.autoDelay>0?setTimeout(o.startAuto,s.settings.autoDelay):(o.startAuto(),t(window).focus(H).blur(W)),s.settings.autoHover&&o.hover(function(){s.interval&&(o.stopAuto(!0),s.autoPaused=!0)},function(){s.autoPaused&&(o.startAuto(!0),s.autoPaused=null)})},O=function(){var e,i,n,r,a,l,d,c,g=0;"next"===s.settings.autoDirection?o.append(s.children.clone().addClass("bx-clone")):(o.prepend(s.children.clone().addClass("bx-clone")),e=s.children.first().position(),g="horizontal"===s.settings.mode?-e.left:-e.top),S(g,"reset",0),s.settings.pager=!1,s.settings.controls=!1,s.settings.autoControls=!1,s.settings.tickerHover&&(s.usingCSS?(r="horizontal"===s.settings.mode?4:5,s.viewport.hover(function(){i=o.css("-"+s.cssPrefix+"-transform"),n=parseFloat(i.split(",")[r]),S(n,"reset",0)},function(){c=0,s.children.each(function(e){c+="horizontal"===s.settings.mode?t(this).outerWidth(!0):t(this).outerHeight(!0)}),a=s.settings.speed/c,l="horizontal"===s.settings.mode?"left":"top",d=a*(c-Math.abs(parseInt(n))),F(d)})):s.viewport.hover(function(){o.stop()},function(){c=0,s.children.each(function(e){c+="horizontal"===s.settings.mode?t(this).outerWidth(!0):t(this).outerHeight(!0)}),a=s.settings.speed/c,l="horizontal"===s.settings.mode?"left":"top",d=a*(c-Math.abs(parseInt(o.css(l)))),F(d)})),F()},F=function(t){var e,i,n,r=t||s.settings.speed,a={left:0,top:0},l={left:0,top:0};"next"===s.settings.autoDirection?a=o.find(".bx-clone").first().position():l=s.children.first().position(),e="horizontal"===s.settings.mode?-a.left:-a.top,i="horizontal"===s.settings.mode?-l.left:-l.top,n={resetValue:i},S(e,"ticker",r,n)},N=function(e){var i=t(window),n={top:i.scrollTop(),left:i.scrollLeft()},s=e.offset();return n.right=n.left+i.width(),n.bottom=n.top+i.height(),s.right=s.left+e.outerWidth(),s.bottom=s.top+e.outerHeight(),!(n.right<s.left||n.left>s.right||n.bottom<s.top||n.top>s.bottom)},B=function(t){var e=document.activeElement.tagName.toLowerCase();if(null==new RegExp(e,["i"]).exec("input|textarea")&&N(o)){if(39===t.keyCode)return P(t),!1;if(37===t.keyCode)return E(t),!1}},X=function(){s.touch={start:{x:0,y:0},end:{x:0,y:0}},s.viewport.on("touchstart MSPointerDown pointerdown",Y),s.viewport.on("click",".bxslider a",function(t){s.viewport.hasClass("click-disabled")&&(t.preventDefault(),s.viewport.removeClass("click-disabled"))})},Y=function(t){if("touchstart"===t.type||0===t.button)if(s.controls.el.addClass("disabled"),s.working)s.controls.el.removeClass("disabled");else{s.touch.originalPos=o.position();var e=t.originalEvent,i=void 0!==e.changedTouches?e.changedTouches:[e],n="function"==typeof PointerEvent;if(n&&void 0===e.pointerId)return;s.touch.start.x=i[0].pageX,s.touch.start.y=i[0].pageY,s.viewport.get(0).setPointerCapture&&(s.pointerId=e.pointerId,s.viewport.get(0).setPointerCapture(s.pointerId)),s.originalClickTarget=e.originalTarget||e.target,s.originalClickButton=e.button,s.originalClickButtons=e.buttons,s.originalEventType=e.type,s.hasMove=!1,s.viewport.on("touchmove MSPointerMove pointermove",R),s.viewport.on("touchend MSPointerUp pointerup",Z),s.viewport.on("MSPointerCancel pointercancel",V)}},V=function(t){t.preventDefault(),S(s.touch.originalPos.left,"reset",0),s.controls.el.removeClass("disabled"),s.viewport.off("MSPointerCancel pointercancel",V),s.viewport.off("touchmove MSPointerMove pointermove",R),s.viewport.off("touchend MSPointerUp pointerup",Z),s.viewport.get(0).releasePointerCapture&&s.viewport.get(0).releasePointerCapture(s.pointerId)},R=function(t){var e=t.originalEvent,i=void 0!==e.changedTouches?e.changedTouches:[e],n=Math.abs(i[0].pageX-s.touch.start.x),o=Math.abs(i[0].pageY-s.touch.start.y),r=0,a=0;s.hasMove=!0,3*n>o&&s.settings.preventDefaultSwipeX?t.preventDefault():3*o>n&&s.settings.preventDefaultSwipeY&&t.preventDefault(),"touchmove"!==t.type&&t.preventDefault(),"fade"!==s.settings.mode&&s.settings.oneToOneTouch&&("horizontal"===s.settings.mode?(a=i[0].pageX-s.touch.start.x,r=s.touch.originalPos.left+a):(a=i[0].pageY-s.touch.start.y,r=s.touch.originalPos.top+a),S(r,"reset",0))},Z=function(e){e.preventDefault(),s.viewport.off("touchmove MSPointerMove pointermove",R),s.controls.el.removeClass("disabled");var i=e.originalEvent,n=void 0!==i.changedTouches?i.changedTouches:[i],r=0,a=0;s.touch.end.x=n[0].pageX,s.touch.end.y=n[0].pageY,"fade"===s.settings.mode?(a=Math.abs(s.touch.start.x-s.touch.end.x))>=s.settings.swipeThreshold&&(s.touch.start.x>s.touch.end.x?o.goToNextSlide():o.goToPrevSlide(),o.stopAuto()):("horizontal"===s.settings.mode?(a=s.touch.end.x-s.touch.start.x,r=s.touch.originalPos.left):(a=s.touch.end.y-s.touch.start.y,r=s.touch.originalPos.top),!s.settings.infiniteLoop&&(0===s.active.index&&a>0||s.active.last&&a<0)?S(r,"reset",200):Math.abs(a)>=s.settings.swipeThreshold?(a<0?o.goToNextSlide():o.goToPrevSlide(),o.stopAuto()):S(r,"reset",200)),s.viewport.off("touchend MSPointerUp pointerup",Z),s.viewport.get(0).releasePointerCapture&&s.viewport.get(0).releasePointerCapture(s.pointerId),!1!==s.hasMove||0!==s.originalClickButton&&"touchstart"!==s.originalEventType||t(s.originalClickTarget).trigger({type:"click",button:s.originalClickButton,buttons:s.originalClickButtons})},U=function(e){if(s.initialized)if(s.working)window.setTimeout(U,10);else{var i=t(window).width(),n=t(window).height();r===i&&a===n||(r=i,a=n,o.redrawSlider(),s.settings.onSliderResize.call(o,s.active.index))}},j=function(t){var e=v();s.settings.ariaHidden&&!s.settings.ticker&&(s.children.attr("aria-hidden","true"),s.children.slice(t,t+e).attr("aria-hidden","false"))},Q=function(t){return t<0?s.settings.infiniteLoop?f()-1:s.active.index:t>=f()?s.settings.infiniteLoop?0:s.active.index:t};return o.goToSlide=function(e,i){var n,r,a,l,d=!0,c=0,g={left:0,top:0},u=null;if(s.oldIndex=s.active.index,s.active.index=Q(e),!s.working&&s.active.index!==s.oldIndex){if(s.working=!0,void 0!==(d=s.settings.onSlideBefore.call(o,s.children.eq(s.active.index),s.oldIndex,s.active.index))&&!d)return s.active.index=s.oldIndex,void(s.working=!1);"next"===i?s.settings.onSlideNext.call(o,s.children.eq(s.active.index),s.oldIndex,s.active.index)||(d=!1):"prev"===i&&(s.settings.onSlidePrev.call(o,s.children.eq(s.active.index),s.oldIndex,s.active.index)||(d=!1)),s.active.last=s.active.index>=f()-1,(s.settings.pager||s.settings.pagerCustom)&&z(s.active.index),s.settings.controls&&q(),"fade"===s.settings.mode?(s.settings.adaptiveHeight&&s.viewport.height()!==p()&&s.viewport.animate({height:p()},s.settings.adaptiveHeightSpeed),s.children.filter(":visible").fadeOut(s.settings.speed).css({zIndex:0}),s.children.eq(s.active.index).css("zIndex",s.settings.slideZIndex+1).fadeIn(s.settings.speed,function(){t(this).css("zIndex",s.settings.slideZIndex),A()})):(s.settings.adaptiveHeight&&s.viewport.height()!==p()&&s.viewport.animate({height:p()},s.settings.adaptiveHeightSpeed),!s.settings.infiniteLoop&&s.carousel&&s.active.last?"horizontal"===s.settings.mode?(u=s.children.eq(s.children.length-1),g=u.position(),c=s.viewport.width()-u.outerWidth()):(n=s.children.length-s.settings.minSlides,g=s.children.eq(n).position()):s.carousel&&s.active.last&&"prev"===i?(r=1===s.settings.moveSlides?s.settings.maxSlides-x():(f()-1)*x()-(s.children.length-s.settings.maxSlides),u=o.children(".bx-clone").eq(r),g=u.position()):"next"===i&&0===s.active.index?(g=o.find("> .bx-clone").eq(s.settings.maxSlides).position(),s.active.last=!1):e>=0&&(l=e*parseInt(x()),g=s.children.eq(l).position()),void 0!==g&&(a="horizontal"===s.settings.mode?-(g.left-c):-g.top,S(a,"slide",s.settings.speed)),s.working=!1),s.settings.ariaHidden&&j(s.active.index*x())}},o.goToNextSlide=function(){if((s.settings.infiniteLoop||!s.active.last)&&!0!==s.working){var t=parseInt(s.active.index)+1;o.goToSlide(t,"next")}},o.goToPrevSlide=function(){if((s.settings.infiniteLoop||0!==s.active.index)&&!0!==s.working){var t=parseInt(s.active.index)-1;o.goToSlide(t,"prev")}},o.startAuto=function(t){s.interval||(s.interval=setInterval(function(){"next"===s.settings.autoDirection?o.goToNextSlide():o.goToPrevSlide()},s.settings.pause),s.settings.onAutoChange.call(o,!0),s.settings.autoControls&&!0!==t&&D("stop"))},o.stopAuto=function(t){s.autoPaused&&(s.autoPaused=!1),s.interval&&(clearInterval(s.interval),s.interval=null,s.settings.onAutoChange.call(o,!1),s.settings.autoControls&&!0!==t&&D("start"))},o.getCurrentSlide=function(){return s.active.index},o.getCurrentSlideElement=function(){return s.children.eq(s.active.index)},o.getSlideElement=function(t){return s.children.eq(t)},o.getSlideCount=function(){return s.children.length},o.isWorking=function(){return s.working},o.redrawSlider=function(){s.children.add(o.find(".bx-clone")).outerWidth(h()),s.viewport.css("height",p()),s.settings.ticker||m(),s.active.last&&(s.active.index=f()-1),s.active.index>=f()&&(s.active.last=!0),s.settings.pager&&!s.settings.pagerCustom&&(w(),z(s.active.index)),s.settings.ariaHidden&&j(s.active.index*x())},o.destroySlider=function(){s.initialized&&(s.initialized=!1,t(".bx-clone",this).remove(),s.children.each(function(){void 0!==t(this).data("origStyle")?t(this).attr("style",t(this).data("origStyle")):t(this).removeAttr("style")}),void 0!==t(this).data("origStyle")?this.attr("style",t(this).data("origStyle")):t(this).removeAttr("style"),t(this).unwrap().unwrap(),s.controls.el&&s.controls.el.remove(),s.controls.next&&s.controls.next.remove(),s.controls.prev&&s.controls.prev.remove(),s.pagerEl&&s.settings.controls&&!s.settings.pagerCustom&&s.pagerEl.remove(),t(".bx-caption",this).remove(),s.controls.autoEl&&s.controls.autoEl.remove(),clearInterval(s.interval),s.settings.responsive&&t(window).off("resize",U),s.settings.keyboardEnabled&&t(document).off("keydown",B),t(this).removeData("bxSlider"),t(window).off("blur",W).off("focus",H))},o.reloadSlider=function(e){void 0!==e&&(n=e),o.destroySlider(),l(),t(o).data("bxSlider",this)},l(),t(o).data("bxSlider",this),this}}}(jQuery);
;
/**
 * @file
 */

(function ($, Drupal, drupalSettings) {

    "use strict";

    /**
     * Default slideshow options.
     *
     * @type {object}
     *
     * @prop {int} [slideshowTransitionAfter=8000]
     */

    drupalSettings.scotts_base_slideshow = $.extend({
            slideshowTransitionAfter: 8000 // Default transition speed.
        },
        drupalSettings.scotts_base_slideshow
    );

    /**
     * Custom behavior to implement a slideshow for a Marquee Panel.
     *
     * @see: http://bxslider.com/options
     * @see: scotts_base_preprocess_node()
     * @type {{attach: Drupal.behaviors.scotts_marquee_panel.attach}}
     */

    Drupal.behaviors.scottsSlideshow = {
        attach: function (context, settings) {
            var transitionSpeed = parseInt(drupalSettings.scotts_base_slideshow.slideshowTransitionAfter, 10);
            var bxSliderOpts = {
                pagerCustom: '.marquee-pager',
                controls: false, // If true, "Next" / "Prev" controls will be added.
                autoControls: true, // If true, "Start" / "Stop" controls will be added.
                autoControlsCombine: true, // When slideshow is playing only "Stop" control is displayed and vice-versa.
                auto: true, // Slides will automatically transition.
                autoHover: true, // Auto show will pause when mouse hovers over slider.
                mode: 'fade',
                speed: 500, // Actual speed BETWEEN transition start and end.
                pause: transitionSpeed, // The actual time a slide is paused before next slide.
                onSliderLoad: function () {
                    $('.bx-controls').appendTo('.marquee-pager--inner');
                }
            };

            $('.marquee-slider').each(function () {
                if (!$(this).hasClass('init-marquee-slider')) {
                    $(this).addClass('init-marquee-slider');
                }
                var $marqueeSlider = $(this).bxSlider(bxSliderOpts);

                // Handle functionality to pause slideshow on manual interaction.
                $('.marquee-pager .slideshow-link').on('click', function () {
                    $marqueeSlider.stopAuto();
                });
            });

        }
    };
})(jQuery, Drupal, drupalSettings);
;
/**
 * @file
 */

(function ($) {

    // In desktop view, active slide should take up this much width while
    // inactive slides will divide up remaining space.
    var activeWidthDesktop = '80%';

    // In mobile, set height of inactive slides while
    // active slide will be it's full height.
    var inactiveHeightMobile = '80px';

    // Get the number of 'inactive slides'.
    var inactiveSlideCnt = $('.slide-inactive').length;

    // Calculate width of inactive slides for desktop layout.
    var inactiveWidthDesktop = (20 / inactiveSlideCnt) + '%';

    var initialWidth;

    function accordionLayout() {
        // Get window size.
        var windowSize = $(window).width();

        // If desktop apply horizontal layout otherwise to vertical layout.
        if (windowSize > 600) {
            $('.slide-active').css('width', activeWidthDesktop);
            $('.slide-inactive').css('width', inactiveWidthDesktop);

            // Make edge text container fill inactive slide space while keeping
            // the active slides edge text container equal to the inactive ones.
            var inactiveSlideWidth = $('.slide-inactive').width();
            $('.accordion-edge-text').css('width', inactiveSlideWidth);
        }
        else {
            $('.slide-inactive').css('height', inactiveHeightMobile);
            // Remove any desktop width that might have been set.
            $('.accordion-edge-text').css('width', '');
        }

        initialWidth = windowSize;
    }

    $(document).ready(function () {

        // Once page is loaded set the layout.
        accordionLayout();

        // Logic to slide images based on their layout when clicked.
        $('.slider-container .slide').click(function (e) {
            // If clicked element does not have the class 'active' then proceed.
            if (!$(this).hasClass('slide-active')) {
                // Get window size.
                var currentWindowSize = $(window).width();

                // If window is greater than 600 open and close slides horizontally.
                if (currentWindowSize > 600) {
                    e.preventDefault();

                    // Expand slide that was clicked and collapse any sibling that was open.
                    $(this).animate({width: activeWidthDesktop}, 'normal', 'linear').siblings().animate({width: inactiveWidthDesktop}, 'normal', 'linear');
                    // Add 'active' or 'inactive' classes so we can styling them differently aad have more finite control.
                    $(this).removeClass('slide-inactive').addClass('slide-active').siblings().removeClass('slide-active').addClass('slide-inactive');
                }
                // Otherwise open and close slides vertically.
                else {
                    e.preventDefault();

                    // Figure out the height of img in mobile since can't use %'s.
                    var getImgHeight = $('div.slide-asset img', this).css('height');

                    $(this).animate({height: getImgHeight}, 'normal', 'linear').siblings().animate({height: inactiveHeightMobile}, 'normal', 'linear');
                    $(this).removeClass('slide-inactive').addClass('slide-active').siblings().removeClass('slide-active').addClass('slide-inactive');
                }
            }
        });

    });

    $(window).resize(function () {

        var currentWidth = $(window).width();

        // Resize edge text contain if desktop.
        if (currentWidth > 600) {
            var currentInactiveSlideWidth = $('.slide-inactive').width();
            $('.accordion-edge-text').css('width', currentInactiveSlideWidth);
        }

        // If the widow increases or decreases past the breakpoint then adjust layout.
        if ((initialWidth > 600 && currentWidth < 600 && currentWidth < initialWidth) ||
            (initialWidth < 600 && currentWidth > 600 && currentWidth > initialWidth)) {

            // Set new initial width.
            initialWidth = currentWidth;

            // Hide image slider until new layout applied.
            $('.slider-container').css('visibility', 'hidden');

            // Remove any styling set before and start clean.
            $('.slide-active, .slide-inactive').removeAttr('style');

            // Get new Layout.
            accordionLayout();

            // Display Slider again.
            $('.slider-container').removeAttr('style');
        }

    });

})(jQuery, Drupal, document);
;
/**
 * @file
 */

(function ($) {

    // If sticky bar is on the page, do the following...
    if ($('.block-sticky-bar')[0]) {
        var initialWidth;

        // Scroll Behavior Value
        var scrollBehaviorSetting = drupalSettings.sticky_bar.scroll_behavior;

        // Element Selectors
        var stickyBarDiv = $('.block-sticky-bar');
        var menuDiv = $('.menu-outer-wrapper');

        function scrollAlwaysSticky() {
            // Get window size.
            var windowSize = $(window).width();

            // If desktop, display under menu otherwise stick to the bottom.
            if (windowSize > 960) {
                stickyBarDiv.insertAfter($('.menu-layout'));
                stickyBarDiv.addClass('sticky-bar-desktop');

                // Calculate how far to push main content down so Sticky Bar does not over it.
                var menuHeight = menuDiv.outerHeight();
                var stickyBarHeight = stickyBarDiv.outerHeight();
                var contentOffset = menuHeight + stickyBarHeight;
                $('.node--type-landing-page .content-outer-wrapper').css('padding-top', contentOffset);

                // Remove padding-bottom set in mobile.
                $('.node--type-landing-page .footer-outer-wrapper').css('padding-bottom', '');
            }
            else {
                stickyBarDiv.addClass('sticky-bar-mobile');

                var stickyBarMobileHeight = stickyBarDiv.outerHeight();

                // Calculate how far to push footer content up so Sticky Bar does not over it.
                $('.node--type-landing-page .footer-outer-wrapper').css('padding-bottom', stickyBarMobileHeight);

                // Remove padding-top set in desktop.
                $('.node--type-landing-page .content-outer-wrapper').css('padding-top', '');
            }

            initialWidth = windowSize;
        }

        function scrollCollision() {
            // Get window size.
            var windowSize = $(window).width();

            // Get height and position.
            var menuHeight = menuDiv.outerHeight();
            var stickyBarPosition = stickyBarDiv.offset().top;

            // If desktop, display under menu otherwise stick to the bottom.
            if (windowSize > 960) {

                // Scroll listener.
                $(window).scroll(function() {

                    // get current position of mmenu from it's bottom.
                    var menuPosition = menuDiv.offset().top + menuHeight;

                    // If sticky has "collided" / scrolled pass menu, make it sticky to the bottom of menu.
                    if (menuPosition >= stickyBarPosition) {
                        // Apply position fixed.
                        stickyBarDiv.css({position: 'fixed', top: menuHeight, left: '0', 'z-index': '100'});
                        stickyBarDiv.addClass('sticky-bar-desktop');
                    }
                    // Else if you scroll under the menu.
                    else {
                        // Remove fixed positioning.
                        stickyBarDiv.css({position: '', top: '', left: '', 'z-index': ''});
                        stickyBarDiv.removeClass('sticky-bar-desktop');
                    }
                });

                // Remove padding-bottom set in mobile.
                $('.node--type-landing-page .footer-outer-wrapper').css('padding-bottom', '');
            }
            else {
                stickyBarDiv.addClass('sticky-bar-mobile');

                var stickyBarMobileHeight = stickyBarDiv.outerHeight();

                // Calculate how far to push footer content up so Sticky Bar does not over it.
                $('.node--type-landing-page .footer-outer-wrapper').css('padding-bottom', stickyBarMobileHeight);
            }

            initialWidth = windowSize;
        }

        $(document).ready(function () {

            // Once page is loaded, position the Sticky Bar.
            switch (scrollBehaviorSetting) {
                case 'scroll_always_sticky':
                    scrollAlwaysSticky();
                    break;
                case 'scroll_collision':
                    scrollCollision();
                    break;
                default:
                    // Do not want a scroll behavior.
            }

        });

        $(window).resize(function () {

            var currentWidth = $(window).width();

            // If the widow increases or decreases past the breakpoint then adjust layout.
            // Test 1: Desktop to Mobile.
            // Test 2: Mobile to Desktop.
            // Test 3: Re-sized but still under Mobile breakpoint. (Recalculate how far to push footer content up.)
            if ((initialWidth > 960 && currentWidth < 960 && currentWidth < initialWidth) ||
                (initialWidth < 960 && currentWidth > 960 && currentWidth > initialWidth) ||
                (initialWidth < 960 && currentWidth < 960)) {

                // Set new initial width.
                initialWidth = currentWidth;

                // Hide sticky bar until new positioning can be applied and remove any classes set before to start clean.
                stickyBarDiv.css('visibility', 'hidden').removeClass('sticky-bar-mobile', 'sticky-bar-desktop');

                // Get new Position.
                switch (scrollBehaviorSetting) {
                    case 'scroll_always_sticky':
                        scrollAlwaysSticky();
                        break;
                    case 'scroll_collision':
                        scrollCollision();
                        break;
                    default:
                    // Do not want a scroll behavior.
                }

                // Display Sticky Bar again.
                stickyBarDiv.css('visibility', '');
            }

        });
    }

})(jQuery, Drupal, document);
;
/**
 * Custom Script for infinity template.
 * This will add a margin to the bottom of populated rows.
 */
(function ($, Drupal, document) {
    'use strict';

    $(document).ready(function () {
        jQuery('.infinity-spacer-p').each(function () {
            if (this.childElementCount && this.children[0].clientHeight > 0) {
                var txt1 = jQuery("<div></div>");
                txt1.css("clear", "both");
                txt1.css("margin-bottom", "10px");
                this.after(txt1[0]);
            }
            ;
        });
    });

})(jQuery, Drupal, document);
;
/*! jquery.cookie v1.4.1 | MIT */
!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):"object"==typeof exports?a(require("jquery")):a(jQuery)}(function(a){function b(a){return h.raw?a:encodeURIComponent(a)}function c(a){return h.raw?a:decodeURIComponent(a)}function d(a){return b(h.json?JSON.stringify(a):String(a))}function e(a){0===a.indexOf('"')&&(a=a.slice(1,-1).replace(/\\"/g,'"').replace(/\\\\/g,"\\"));try{return a=decodeURIComponent(a.replace(g," ")),h.json?JSON.parse(a):a}catch(b){}}function f(b,c){var d=h.raw?b:e(b);return a.isFunction(c)?c(d):d}var g=/\+/g,h=a.cookie=function(e,g,i){if(void 0!==g&&!a.isFunction(g)){if(i=a.extend({},h.defaults,i),"number"==typeof i.expires){var j=i.expires,k=i.expires=new Date;k.setTime(+k+864e5*j)}return document.cookie=[b(e),"=",d(g),i.expires?"; expires="+i.expires.toUTCString():"",i.path?"; path="+i.path:"",i.domain?"; domain="+i.domain:"",i.secure?"; secure":""].join("")}for(var l=e?void 0:{},m=document.cookie?document.cookie.split("; "):[],n=0,o=m.length;o>n;n++){var p=m[n].split("="),q=c(p.shift()),r=p.join("=");if(e&&e===q){l=f(r,g);break}e||void 0===(r=f(r))||(l[q]=r)}return l};h.defaults={},a.removeCookie=function(b,c){return void 0===a.cookie(b)?!1:(a.cookie(b,"",a.extend({},c,{expires:-1})),!a.cookie(b))}});;
(function ($, Drupal, window) {
    var lastZip = 'unk';

    Drupal.behaviors.userZipBehavior = {
        attach: function (context, settings) {
            var zip = $.cookie('Drupal.visitor.zip_code');
            var show_all = $.cookie('Drupal.visitor.show_all_products');
            var language = drupalSettings.path.currentLanguage;
            // Adjust drupal internal to our langcode.
            language = (language === 'en') ? 'en-us' : language;

            if (typeof zip === 'undefined' || zip === 'null') {
                // Current (first, cached) page didnt set zip. Get it.
                this.setZip(context, settings, language);
                zip = $.cookie('Drupal.visitor.zip_code');
            }
            else if (typeof zip != 'undefined' && zip != lastZip) {
                // Restore proper prior zip on country flip/flops.
                if (typeof zip != 'undefined' && typeof language != 'undefined') {
                    var langZip = $.cookie('Drupal.visitor.zip_code_' + language);
                    if (typeof langZip != 'undefined' && langZip.length && zip != langZip) {
                        zip = langZip;
                        $.cookie('Drupal.visitor.zip_code', zip, {path: '/'});
                    }
                }
                if (typeof zip !== 'undefined' && zip !== 'null') {
                    this.updateUserZip(context, settings, zip);
                    // Fill in changeZip form entry if present and empty (!validate error).
                    var zipEntry = document.getElementById("edit-zip-code")
                    if (zipEntry && zipEntry.value == "") {
                      zipEntry.value = zip;
                    }
                    if (show_all !== 'true') {
                      this.updateProductZip(context, settings, zip);
                    }
                    lastZip = zip;
                }
            }
            this.updateZipLinks();

            // Prevent browser validation bubbles from showing.
            $('#edit-zip-code').attr("step", "any");
        },
        updateZipLinks: function() {
            var _href = $('.user-zip-link').attr('href');
            var zip_link = $('.zip-link');
            zip_link.attr('href', _href + "?destination=" + window.location.pathname);
        },
        updateUserZip: function (context, settings, zip) {
            var prefix_text = Drupal.t('Your ZIP Code: @zip (', {'@zip': zip});
            var change_text = Drupal.t('Change');
            $(context).find('.user-zip-prefix').once('userZipBehaviorP').text(prefix_text);
            $(context).find('.user-zip-link').once('userZipBehaviorL').text(change_text);
            $(context).find('.user-zip-suffix').once('userZipBehaviorS').text(')');
            $(context).find('.user-zip-prefix').trigger('zip-code-loaded');
        },
        updateProductZip: function (context, settings, zip) {
            var prefix_text = Drupal.t('Showing products recommended for ZIP code : @zip (', {'@zip': zip});
            $(context).find('.product-zip-prefix').once('userZipBehavior').text(prefix_text);
            $(context).find('.user-zip-prefix').trigger('zip-code-loaded');
        },
        setZip: function (context, settings, langcode) {
            // Force server to lookup/set zip cookie.
            $.get((langcode ? "/"+langcode : "") + "/zip?_format=json", function (data) {
                // Response should have ALREADY (re)set zip cookies.
                cookZip = $.cookie('Drupal.visitor.zip_code');
                var dataZip = null;
                if (typeof data != 'undefined' && typeof data.zip != 'undefined' && data.zip !== 'null' && data.zip !== null) {
                  dataZip = data.zip;
                }
                if (typeof cookZip != 'undefined' && typeof dataZip != 'undefined') {
                    if (cookZip != dataZip) {
                        console.log('JS setZip response mismatch: cookie:' + cookZip + ' vs data:' + dataZip);
                    }
                    Drupal.behaviors.userZipBehavior.updateUserZip(context, settings, cookZip);
                    Drupal.behaviors.userZipBehavior.updateProductZip(context, settings, cookZip);
                }
            });
        }
    };

})(jQuery, Drupal, window);
;
