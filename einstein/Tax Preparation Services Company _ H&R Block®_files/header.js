/* Site nav script
   ---------------
   $-prefixed vars indicate jQuery object
*/



/* Immediately Invoked Function Expression */
(function(){

    var isMobile            = Modernizr.mq('(max-width: 60.9375em)');   // boolean
    var $mainNav            = $('.main-header__nav');                   // nav element
    var $mobileOffers       = $('.main-header__offers');                // at top of mobile nav
    var $mobileOffersNoteTrigger = $('a[aria-controls^="offer__note-"]'); // disclaimer link
    var $mobileOffersNoteTarget  = $('.main-header [id^="offer__note-"], .main-header [id^="offer__note-"] *');     // popup disclaimer + contents
    var $mobileOffersNote   = $('.main-header [id^="offer__note-"]');
    var $mobileNavBtn       = $('.mobile-nav__trigger');                // hamburger
    var $productsSubmenuBtn = $('button[aria-controls="submenu__products"]');
    var $toolsSubmenuBtn    = $('button[aria-controls="submenu__tools"]');
    var $submenuBtns        = $productsSubmenuBtn.add($toolsSubmenuBtn);
    var $submenuWrap        = $('.submenu');
    var $submenus           = $('[id^="submenu__"]');                   // all submenus, including under icon buttons
    var $headerBtns         = $('.main-header__btns button[class*="main-header__"]');           // locations, signin, search
    var transitionEnd       = 'webkitTransitionEnd otransitionend oTransitionEnd transitionend';
    var appendedInputButton = {                                         // adobe search autocomplete
        account: "sp1004c6a7",
        searchDomain: "http://sp1004c6a7.guided.ss-omtrdc.net/",
        inputElement: "input#appendedInputButton",
        inputFormElement: "form#searchForm1",
        delay: 300,
        minLength: 3,
        maxResults: 10,
        browserAutocomplete: false,
        queryCaseSensitive: false,
        startsWith: false,
        searchOnSelect: true,
        header: "",
        footer: ""
    };
    var vertPos             = ''; // to set position when opening/closing mobile nav



    /* DO WHEN PAGE LOADS */
    initialPageState();

    /* Refresh zoomed page on touch devices:
       Try to prevent a previously zoomed page from appearing ugly on refresh. */
    zoomPosition(1200);

    /* Set up auto-complete for site search */
    try {
        $(appendedInputButton.inputElement).AdobeAutocomplete(appendedInputButton);
    } catch (e) {
        HRB.tools.log("error: auto-complete for #appendedInputButton: " + e);
    }
    /* END: DO WHEN PAGE LOADS */



    /* HANDLE EVENTS */
    /* Double tap zoom on mobile devices:
       Prevent the top nav from displaying badly. */
    $(window).on('touchstart', function(e){
        var t2 = e.timeStamp,
            t1 = $(this).data('lastTouch') || t2,
            dt = t2 - t1,
            fingers = e.originalEvent.touches.length;
        $(this).data('lastTouch', t2);
        if (!dt || dt > 500 || fingers > 1) {return;} // not double-tap

        /* When zoomed, switch fixed nav position to absolute for touch devices */
        zoomPosition(200);
    });


    /* Resize:
       - Restore initial page state.
       - Switch the main nav to absolute position if the page is zoomed. */
    var resizeTimer;
    var windowWidth = $(window).width();

    $(window).on('resize',function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if (windowWidth !== $(window).width()) {
                windowWidth = $(window).width();
                /* Reset isMobile after resize, then restore page state. */
                isMobile = Modernizr.mq('(max-width: 60.9375em)');
                initialPageState();

                // CALL ZOOM FUNCTION?
            }
        }, 200);
    });

    /* Hamburger nav button */
    $mobileNavBtn.on('click', function(){
        if( $mobileNavBtn.attr('aria-expanded') === 'true' ){
            closeMobileNav();
        } else {
            openMobileNav();
        }
    });

    /* Header buttons: locations, signin, search */
    $headerBtns.on('click', function(e) {
        e.stopImmediatePropagation();
        var $thisBtn = $(this);
        var isOpen = $thisBtn.attr('aria-expanded');

        if (isOpen === 'true') {
            /* close this one */
            $thisBtn.attr('aria-expanded', 'false');
        } else {
            if(isMobile){
                /* close other submenus under icon buttons first */
                $headerBtns.attr('aria-expanded', 'false');
            } else {
                /* Close all submenus, including main nav */
                closeDesktopNav();
            }
            /* open this one */
            $thisBtn.attr('aria-expanded', 'true');

            /* Normal click track using data-track doesn't fire because another function has to return false on click to handle both touchstart and click */
            try {
                var trackingObj = JSON.parse( $thisBtn.attr('data-track') );
                HRBData.digital_data.loc = trackingObj.loc;
                HRBData.digital_data.nm = trackingObj.nm;
                HRB.analytics.callRule("regular_click")
            } catch(e){}
        }
    });

    /* Main nav buttons (hidden until focused) that open submenus - desktop only.
       They're always hidden in mobile nav. */
    $submenuBtns.on('click', function(e){
        e.stopImmediatePropagation();
        var $thisBtn = $(this);
        var isOpen = $thisBtn.attr('aria-expanded');

        /* Close all submenus first */
        closeDesktopNav();

        if(isOpen === 'false'){
            var thisSubmenuList = '#' + $thisBtn.attr('aria-controls');
            $thisBtn.attr('aria-expanded', 'true');
            $(thisSubmenuList).removeAttr('hidden');
        }
    });

    /* Main nav links that open submenus on hover.
       The hover function should only work for screen widths that don't show the mobile nav. */

    /* Don't let the submenu link touch event bubble up, or the link won't work. */
    $submenus.find('a').on('touchstart', function(e){
        e.stopImmediatePropagation();
    });

    var hoverTimer;
    $submenuBtns.closest('li').on({
        mouseenter: function() {
            if(!isMobile){ // wide screens only
                clearTimeout(hoverTimer);

                var $thisLi  = $(this);
                var $thisBtn = $thisLi.find('button[aria-controls^="submenu__"]');
                var isOpen   = $thisBtn.attr('aria-expanded');

                hoverTimer = setTimeout(function() {
                    if (isOpen === 'false') {
                        /* Close all submenus first */
                        closeDesktopNav();

                        var thisSubmenuList = '#' + $thisBtn.attr('aria-controls');
                        $thisBtn.attr('aria-expanded', 'true');
                        $(thisSubmenuList).removeAttr('hidden');
                    }
                }, 250);
            }
        },
        mouseleave: function() {
            if(!isMobile){ // wide screens only
                clearTimeout(hoverTimer);

                var $thisLi  = $(this);
                var $thisBtn = $thisLi.find('button[aria-controls^="submenu__"]');
                var isOpen   = $thisBtn.attr('aria-expanded');

                hoverTimer = setTimeout(function() {
                    if (isOpen === 'true') {
                        closeDesktopNav();
                    }
                }, 750);
            }
        },
        touchstart: function(e){
            if(!isMobile){ // wide screens only (tablets, for example)
                e.preventDefault();

                var $thisLi  = $(this);
                var $thisBtn = $thisLi.find('button[aria-controls^="submenu__"]');
                var isOpen   = $thisBtn.attr('aria-expanded');

                if(isOpen === 'true'){
                    var navLinkHref = $thisBtn.siblings('a').attr('href');
                    window.location = navLinkHref;
                } else {
                    /* Close all submenus first */
                    closeDesktopNav();

                    var thisSubmenuList = '#' + $thisBtn.attr('aria-controls');
                    $thisBtn.attr('aria-expanded', 'true');
                    $(thisSubmenuList).removeAttr('hidden');
                }
            }
        }
    });
     setTimeout(function(){
                clickClose();
          }, 3000);
    function clickClose() {
           
                $(document).on('touchstart click', function(e) {
            if (e.navHandled !== true) {
                var $autocomplete = $('ul.ui-autocomplete, ul.ui-autocomplete *');
                var target = $(e.target);

                if (
                    !target.is($mobileOffers) &&
                    !target.is($mobileOffers.find('*')) &&
                    !target.is($mobileOffersNoteTarget) &&
                    !target.is($mainNav) &&
                    !target.is($mainNav.find('*')) &&
                    !target.is($headerBtns) &&
                    !target.is($submenuWrap) &&
                    !target.is($submenus) &&
                    !target.is($submenus.find('*')) &&
                    !target.is($mobileNavBtn) &&
                    !target.is($autocomplete)
                ) {
                    initialPageState();
                }
                e.navHandled = true;
            } else {
                return false;
            }
        });
   
    }
    /* Close desktop or mobile nav when clicking outside */
    
    /* Find an office search */
    $('#submenu__fao .fao__search-btn').on('click', function(e){
        e.preventDefault();

        var newZip = $('#submenu__fao #fao__zip').val();

        if (newZip === "") {
            $('#submenu__fao .mdl-textfield').addClass('is-invalid');
            $('#submenu__fao .fao__zip-msg').removeClass('hide');

            $('#submenu__fao #fao__zip').on('blur', function(){
                if( $(this).val() !== ""){
                    $('#submenu__fao .mdl-textfield').removeClass('is-invalid');
                    $('#submenu__fao .fao__zip-msg').addClass('hide');
                }
            });
        } else {
            if ((window.location.href.indexOf("search3") > -1) || (window.location.href.indexOf("stage.hr") > -1)) {
                    var officeListLink = 'https://www.hrblock.com/tax-offices/local-offices/#!/en/office-list/' + newZip;
                } else {
                    var officeListLink = 'https://' + location.hostname + '/tax-offices/local-offices/#!/en/office-list/' + newZip;
                     $('.main-header__fao').attr('aria-expanded', 'false');
                     setTimeout(function(){
                        clickClose();
                  }, 3000);
                }

            window.location = officeListLink;
        }
    });
    /* End: Find an office */

    /* Mobile offer disclaimers */
    $mobileOffersNoteTrigger.on('click', function(){
        var $link = $(this);
        var isClosed = $link.attr('aria-expanded') === 'false';

        /* Close all, so that only one is open at a time */
        closeOfferNotes();

        /* Open this one */
        if(isClosed){
            var thisNoteNumber = $link.text();
            $link.attr('aria-expanded', 'true');
            $('#offer__note-' + thisNoteNumber).fadeIn().trigger('focus');
        }
    });
    $('.offer__note-close').on('click', function(){
        closeOfferNotes();
    });
    $(document).on('touchstart click', function(e) {
        if (e.offerHandled !== true) {
            var target = $(e.target);

            if ( !target.is($mobileOffersNoteTrigger) && !target.is($mobileOffersNote) && !target.is($mobileOffersNoteTarget) ) {
                closeOfferNotes();
            }
            e.offerHandled = true;
        } else {
            return false;
        }
    }).on('keydown', function(e){
        /* Allow closing popup with Escape key. 27 = escape */
        if(e.keyCode === 27){
            closeOfferNotes();
        }
        /*  Trap tabs. 9 = tab */
        if ( (e.keyCode || e.which) == 9) {
            var $closeBtn = $('.offer__note-close');

            if ( $(e.target).is($mobileOffersNote) && e.shiftKey ){
                e.preventDefault();
                $closeBtn.trigger('focus');
            }

            if ( $(e.target).is($closeBtn) && !e.shiftKey ){
                e.preventDefault();
                $mobileOffersNote.trigger('focus');
            }
        }

    });

    /* END: HANDLE EVENTS */



    /* FUNCTIONS */
    function openMobileNav() {
        $mainNav.add($mobileOffers).removeAttr('hidden'); /* Was hidden from screen readers. */
        $mobileNavBtn.attr('aria-expanded', 'true');
        $mobileNavBtn.children().html("Close site navigation");

        /* Scroll lock: disable body scroll, persist scrolling for nav. */
        vertPos = $(document).scrollTop();
        $('body').css({
            position: 'fixed',
            top: '-' + vertPos + 'px'
        });

        var overflowHorz = $mobileOffers[0].scrollWidth - $mobileOffers.width();
        $mobileOffers.on('touchmove', function(){
            if(overflowHorz > 0){
                return true;
            } else {
                return false;
            }
        });
    }
    function closeMobileNav() {
        $mobileNavBtn.attr('aria-expanded', 'false');
        $mobileNavBtn.children().html("Site navigation");
        /* Wait until the CSS transition finishes, then hide the left nav from screen readers */
        $mainNav.on(transitionEnd, function(){
            $mainNav.add($mobileOffers).attr('hidden', true);
            $mainNav.off(transitionEnd);
        });
        $headerBtns.attr('aria-expanded', 'false');

        /* Restore scroll position when closing mobile nav */
        /* vertPos is defined way up at the top, set in openMobileNav. This way it preserves the value. Otherwise, if I try to check body top here, iOS always says it's 0px. */
        var vertScroll = Math.abs( parseInt(vertPos) );

        /* Restore from fixed position if mobile nav was open AND there's no fixed position app open (ex: TPG) */
        var noFixedAppOpen = $('html.show-fixed-app').length == 0;
        if(noFixedAppOpen){
            $('body').removeAttr('style');
        }

        if( $.isNumeric(vertScroll) ){ // not 'auto' or 'inherit'
            $(document).scrollTop( vertScroll );
        }
    }
    function closeDesktopNav() {
        $headerBtns.add($productsSubmenuBtn).add($toolsSubmenuBtn).attr('aria-expanded', 'false');
        $submenus.attr('hidden', true);
    }
    function zoomPosition(delay){
        setTimeout(function(){
            var zoom = document.documentElement.clientWidth / window.innerWidth;
            //alert('zoom: ' + zoom);

            if (zoom > 1) {
                /* flag in order to switch nav position to absolute for touch devices */
                $('html').addClass('is-tap-zoomed');
            } else if (zoom <= 1) {
                /* and remove flag when it goes back to 100% */
                $('html').removeClass('is-tap-zoomed');
            }
        }, delay);
    }
    /* Close mobile offer disclaimer */
    function closeOfferNotes(){
        $mobileOffersNote.fadeOut(200);
        $('a[aria-controls^="offer__note-"][aria-expanded="true"]')
            .trigger('focus')
            .attr('aria-expanded', 'false');
    }
    function initialPageState() {
        /* For all screen sizes: */
        $mobileNavBtn.attr('aria-expanded', 'false');
        $headerBtns.attr('aria-expanded', 'false');
        /* Hide main nav, mobile offers, & submenus from screen readers */
        $mainNav.add($submenus).add($mobileOffers).attr('hidden', true);
        /* Remove the touchmove handler added in openMobileNav
           so it won't keep firing if page is resized to desktop layout */
        $mainNav.add($mobileOffers).off('touchmove');
        /* Hide jQuery UI autocomplete search drop down.
           This is extra measure, because jQuery UI doesn't always close this
           on touchstart/scroll for phones */
        $('.ui-menu.ui-autocomplete').css('display', 'none');

        /* Restore from fixed position if mobile nav was open AND there's no fixed position app open (ex: TPG) */
        var noFixedAppOpen = $('html.show-fixed-app').length == 0;
        if(noFixedAppOpen){
            $('body').removeAttr('style');
        }

        if(isMobile){
            /* Hide the submenu buttons from screen readers */
            $submenuBtns.attr({
                'hidden': false,
                'aria-expanded': 'true'
            });

            /* Expand correct mobile submenu, but leave the buttons hidden. */
            // var mobilePagePath = window.location.pathname;
            // if ( mobilePagePath.match( '^/$|filing-options-and-products|\/tax-offices\/|\/online-tax-filing\/|\/tax-software\/|\/financial-services\/' ) ){

            //     $productsSubmenuBtn.attr('aria-expanded', 'true');
            //     var productsSubmenuList = '#' + $productsSubmenuBtn.attr('aria-controls');
            //     $(productsSubmenuList).removeAttr('hidden');

            //     $toolsSubmenuBtn.attr('aria-expanded', 'false');
            // }
            // if ( mobilePagePath.match( 'tax-center|\/get-answers\/|\/taxes\/|\/tax-offices\/tax-prep\/|\/tax-calculator\/|\/w-4-calculator\/|\/tax-prep-checklist\/' ) ){

            //     $productsSubmenuBtn.attr('aria-expanded', 'false');

            //     $toolsSubmenuBtn.attr('aria-expanded', 'true');
            //     var toolsSubmenuList = '#' + $toolsSubmenuBtn.attr('aria-controls');
            //     $(toolsSubmenuList).removeAttr('hidden');
            // }
        } else {
            /* Show top nav */
            $mainNav.removeAttr('hidden');

            /* Make the submenu buttons available (remove hidden attribute).
               Now, they can be visible on focus.
               Make sure expanded is false, which hides submenus */
            $submenuBtns.attr('aria-expanded', 'false').removeAttr('hidden');

            /* Hide any mobile offers disclaimers that might be open */
            $mobileOffersNoteTrigger.attr('aria-expanded', 'false');
            $mobileOffersNote.hide();
        }
    }
    /* END: FUNCTIONS */
})();




/* Open mobile offer disclaimer */

/* Close mobile offer disclaimer */
function closeOfferNotes(){
    $('[id^="offer__note-"]').fadeOut(200);
    $('a[aria-controls^="offer__note-"][aria-expanded="true"]').trigger('focus');
    $('[aria-controls^="offer__note-"]').attr('aria-expanded', 'false');
}