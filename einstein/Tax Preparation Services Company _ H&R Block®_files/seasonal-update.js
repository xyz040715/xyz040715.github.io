$(document).ready(function () {

	var urls = ['/tax-offices/extended-tax-services/tax-audit/audit-support.html',
		'/financial-services/emerald-advanced-lending-credit/', '/offers/refund-advance/'
	];
	var url = window.location.pathname;
	var options = true;

	for (var uIndex = 0; uIndex < urls.length; uIndex++) {
		if (url.indexOf(urls[uIndex]) > -1) {
			options = false;
			break;
		}
	}
	/*for home page*/
	var home = false;
	/* Removed EA check box from Home Page
	if (url == '/') {
		home = true;
	}*/


	function updateCaption() {
		var caption = 'Find an office';
		caption = 'Make A Tax Appointment';
		if (tpfType == "EAP") {
			caption = 'Make An Emerald Advance Appointment';
		} else if (tpfType == "IFL") {
			caption = 'Find an office';
		} else if (tpfType == "1040ez") {
			caption = 'Make An EZ Appointment';
		} else if (tpfType == "HALFOFF") {
			caption = 'Make An Appointment';
		} else if (tpfType == "AUDIT") {
			caption = 'Make An Appointment';
		} else if (tpfType == 'SMALLBUSINESS') {
			caption = 'Make An Appointment';
		} else if (tpfType == 'BA') {
			caption = 'Make An Appointment';
		} else if (tpfType == 'DROPOFF') {
			caption = 'Make An Appointment';
		}
		//caption = 'Make A Tax Appointment';
		$('.ct-caption').text(caption);
		$('.ct-caption').data('caption', caption);
	}
	/*TPF Tool Filter Check box*/
	/**Add any type of filters like DEFAULT, EAP, EAFF , 1040ez, IFL etc **/

	function update(obj) {
		var group = ".tpf__entry input:checkbox[name='" + obj.attr("name") + "']";
		$(group).attr("checked", false);
		try {
			componentHandler.upgradeDom();
			$(group).each(function (index) {
				console.log(index + ": " + $(this).attr('id'));
				document.querySelector('.tpf__entry .mdl-js-checkbox.' + $(this).attr('id')).MaterialCheckbox.uncheck();
			});

			document.querySelector('.tpf__entry .mdl-js-checkbox.' + obj.attr("id")).MaterialCheckbox.check();
		} catch (e) {
			console.log("Material UI checkbox failed : " + e);
		}
	}

	function updateFilter(obj) {
		obj.attr("checked", true);
		update(obj);
		if (obj.attr("id") == "ea") {
			tpfType = "EAP";
		} else if (obj.attr("id") == "ez") {
			tpfType = "1040ez";
		} else if (obj.attr("id") == "ra") {
			tpfType = "IFL";
		} else if (obj.attr("id") == "halfoff") {
			tpfType = "HALFOFF";
		} else {
			tpfType = "DEFAULT";
		}
		updateCaption();

	}

	$(".tpf__entry .mdl-checkbox__input").on('click', function (e) {
		var obj = $(this);
		if (obj.is(":checked")) {
			updateFilter(obj);
		} else {
			// update(obj);
			tpfType = "DEFAULT";
			updateCaption();
		}
		console.log('You have chosen : ' + tpfType);
	});


	/* $('.appt-filter').on('click', function(e) {
           $('.tpf__entry header').addClass('hide');
           var filterType = $(this).data('filter-type');
           if (filterType == 'default') {
               $('.tpf__entry header').removeClass('hide');
               updateFilter($(".tpf__entry .ct-checkboxes #tax"));
           }else {
				$('.tpf__entry header').removeClass('hide');
               updateFilter($(".tpf__entry header #"+filterType));
           }
		  
       });   
	    */

	if (tpfType == "ITIN" || tpfType == "SL" || tpfType == "DROPOFF" || options == false) {
		//No check box
	} /*else if (tpfType == "DEFAULT") {
		$('.tpf__entry').removeClass("tpf--ra");
	}*/ else {

		if (tpfType == "IFL") {
			$('.tpf__entry').addClass("tpf--ra");
			updateFilter($(".tpf__entry .mdl-checkbox__input#ra"));
		}

		if (tpfType == "EAP") {
			$('.tpf__entry').addClass("tpf--ea");
			updateFilter($(".tpf__entry .mdl-checkbox__input#ea"));
		}
		if (home) {
			$('.tpf__entry').addClass("tpf--ea");
			updateFilter($(".tpf__entry .mdl-checkbox__input#ea"));
			$('.tpf__entry').addClass("tpf--tax-prep");
			updateFilter($(".tpf__entry .mdl-checkbox__input#tax"));
		}
		/**Multiple check box**/
		if (tpfType != "DEFAULT") {
			$('.tpf__entry').addClass("tpf--tax-prep");
			//updateFilter($(".tpf__entry .mdl-checkbox__input#tax"));
		}

	}

	updateCaption();
});