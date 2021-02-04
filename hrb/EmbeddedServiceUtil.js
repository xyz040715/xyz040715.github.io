(function s() {
    return (
        function evaledScript() {
            $A.componentService.addLibraryInclude("js://embeddedService.embeddedServiceManager.EmbeddedServiceUtil", [], function() {
                function b() {}
                b.prototype.fontSizes = {
                    Small: "14px",
                    Medium: "16px",
                    Large: "18px"
                };
                b.prototype.DEFAULT_FONT_SIZE = "16px";
                b.prototype.getAriaLiveAnnouncer = function(a) {
                    return embedded_svc.getSidebar(a).find("ariaLiveAnnouncer")
                };
                b.prototype.mergeObjects = function(a, c) {
                    Object.getOwnPropertyNames(c).forEach(function(e) {
                        Object.defineProperty(a, e, Object.getOwnPropertyDescriptor(c, e))
                    })
                };
                b.prototype.callHelperMethod =
                    function(a, c) {
                        var e = a.getDef().getHelper(),
                            b = this.toArray(arguments);
                        b.splice(0, 2, a);
                        return e[c].apply(e, b)
                    };
                b.prototype.validateFormFields = function(a) {
                    var c = !0;
                    $A.util.isArray(a) || (a = [a]);
                    a.forEach(function(a) {
                        a.isInstanceOf("embeddedService:sidebarFormField") && (c = (a = a.validateField(a.find("formField"), c)) && c)
                    });
                    return c
                };
                b.prototype.getFieldType = function(a) {
                    switch (a) {
                        case "string":
                            return "inputText";
                        case "picklist":
                            return "inputSelect";
                        case "email":
                            return "inputEmail";
                        case "phone":
                            return "inputPhone";
                        default:
                            return "unsupported"
                    }
                };
                b.prototype.setPicklistOptionCSS = function(a) {
                    $A.util.forEach(a, function(a) {
                        a.class = "optionClass"
                    });
                    return a
                };
                b.prototype.generateFormField = function(a, c, b, d, f, g, h, k) {
                    c = {
                        type: a,
                        name: c,
                        label: b,
                        required: d,
                        readOnly: f,
                        className: c,
                        value: void 0
                    };
                    switch (a) {
                        case "inputSelect":
                            c.value = k;
                            c.picklistOptions = h;
                            c.className += " slds-style-select";
                            break;
                        default:
                            c.maxLength = g, c.className += " slds-style-inputtext"
                    }
                    return c
                };
                b.prototype.transactionStart = function(a, c) {
                    $A.metricsService.transactionStart("ltng",
                        a, {
                            context: {
                                attributes: c
                            }
                        })
                };
                b.prototype.transactionEnd = function(a, c) {
                    $A.metricsService.transactionEnd("ltng", a, {
                        context: {
                            attributes: c
                        }
                    })
                };
                b.prototype.transaction = function(a, c) {
                    $A.metricsService.transaction("ltng", a, {
                        context: {
                            attributes: c
                        }
                    })
                };
                b.prototype.mark = function(a, c) {
                    $A.metricsService.mark("ltng", a, c)
                };
                b.prototype.isTestContext = function() {
                    return 0 <= $A.getContext().mode.toLowerCase().indexOf("jstest")
                };
                b.prototype.getSafeCallback = function(a) {
                    return $A.getCallback(function() {
                        var c = !0,
                            b = embedded_svc.util.toArray(arguments);
                        b.forEach(function(a) {
                            $A.util.isComponent(a) && (c = a.isValid() && c)
                        });
                        c && a.apply(void 0, b)
                    })
                };
                b.prototype.waitForFrame = function(a, c) {
                    window.requestAnimationFrame($A.getCallback(function() {
                        (!a || a.isValid()) && c()
                    }))
                };
                b.prototype.focusAfterRender = function(a, c, b) {
                    this.waitForFrame(a, function() {
                        var d = a.getElement();
                        d && (d = d.querySelector(c)) && d.focus();
                        b && b()
                    })
                };
                b.prototype.toArray = function(a) {
                    return [].slice.call(a)
                };
                b.prototype.filterToStringArray = function(a) {
                    return !Array.isArray(a) ? (console.warn("Object is not an array: " +
                        a), []) : a.filter(function(a) {
                        return "string" === typeof a
                    })
                };
                b.prototype.isValidEntityId = function(a) {
                    return a && "string" === typeof a && (18 === a.length || 15 === a.length)
                };
                b.prototype.getKeyPrefix = function(a) {
                    if (this.isValidEntityId(a)) return a.substr(0, 3)
                };
                b.prototype.isButtonId = function(a) {
                    return "573" === this.getKeyPrefix(a)
                };
                b.prototype.isUserId = function(a) {
                    return "005" === this.getKeyPrefix(a)
                };
                b.prototype.isValidAgentWithFallbackId = function(a) {
                    return a && "string" === typeof a && /^005(\w{12}|\w{15})_573(\w{12}|\w{15})$/.test(a)
                };
                b.prototype.convertAgentWithFallbackId18To15 = function(a) {
                    return 31 === a.length ? a : a.split("_").map(function(a) {
                        return 18 === a.length ? a.substring(0, 15) : a
                    }).join("_")
                };
                b.prototype.filterFallbackRoutingValues = function(a) {
                    return !Array.isArray(a) ? (console.warn("Fallback Routing value was not an array. Returning an empty array."), []) : a.reduce(function(a, b, d) {
                        "string" !== typeof b ? console.warn("Removing fallback routing value at position " + d + " because it is not a string.") : (this.isButtonId(b) || this.isUserId(b)) &&
                            this.isValidEntityId(b) ? a.push(18 === b.length ? b.substring(0, 15) : b) : -1 !== b.indexOf("005") && -1 !== b.indexOf("573") && this.isValidAgentWithFallbackId(b) ? a.push(this.convertAgentWithFallbackId18To15(b)) : console.warn("Removing fallback routing value " + b + " because it is invalid.");
                        return a
                    }.bind(this), [])
                };
                b.prototype.getResourcesArray = function(a) {
                    return this.filterToStringArray(a).map(function(a) {
                        return $A.get("$Resource").get(a)
                    })
                };
                b.prototype.log = function(a) {
                    window && window.console && window.console.log(a)
                };
                b.prototype.logGroupStart = function(a) {
                    window.console.group ? window.console.groupCollapsed("SNAP-INS: " + a) : this.log("SNAP-INS: " + a)
                };
                b.prototype.logGroupEnd = function() {
                    window.console && window.console.group && window.console.groupEnd()
                };
                b.prototype.warn = function(a) {
                    window && window.console && window.console.warn(a)
                };
                b.prototype.error = function(a) {
                    window && (window.console && window.console.error) && (a.stack && window.console.log ? (this.logGroupStart("Error: " + a), window.console.log("Stacktrace: "), window.console.log(a.stack),
                        this.logGroupEnd()) : window.console.error(a))
                };
                b.prototype.broadcastEventToClientAndLog = function(a, b, e) {
                    try {
                        3 <= Number(e) && embedded_svc.fireEvent(a, void 0, b)
                    } catch (d) {
                        d && d.message ? this.error(d.message) : this.error(d)
                    }
                    embedded_svc.util.transaction("performance:" + a, b ? b : {})
                };
                b.prototype.startPageViewTransaction = function(a, b) {
                    $A.metricsService.transactionStart("ltng", "pageView", {
                        pageTransaction: !0,
                        context: {
                            page: {
                                location: b,
                                url: window.location.href,
                                previousPage: {
                                    location: a,
                                    url: window.location.href
                                }
                            }
                        }
                    })
                };
                b.prototype.endPageViewTransaction = function() {
                    $A.metricsService.transactionEnd("ltng", "pageView", {})
                };
                b.prototype.isChannelMenuContext = function() {
                    return Boolean(embedded_svc.menu)
                };
                b.prototype.parseLabels = function(a) {
                    var b = {},
                        e;
                    e = a.standardLabels;
                    a = a.labels;
                    e.forEach(function(a) {
                        b[a.sectionName] = b[a.sectionName] || [];
                        b[a.sectionName][a.labelName] = a.labelValue
                    });
                    a && a.forEach(function(a) {
                        b[a.sectionName][a.labelName] = a.labelValue
                    });
                    return b
                };
                b.prototype.dispatchChatHeaderEvent = function(a, b, e) {
                    if (a = embedded_svc.getSidebar(a).helper.chatHeaderPrivate) a.dispatchEvent(b,
                        e);
                    else throw Error("Chat Header library is undefined.");
                };
                b.prototype.dispatchMinimizedEvent = function(a, b, e) {
                    var d = (a = embedded_svc.getSidebar(a)) ? a.get("v.minimizedContainer") : void 0;
                    a = d ? d.helper.liveAgentLibrary.minimized : void 0;
                    d = d ? d.helper.minimizedPrivate : void 0;
                    if (a && a.getEventHandler()) a.dispatchEvent(b, e);
                    else if (d) d.dispatchEvent(b, e);
                    else throw Error("Aura and LWC Minimized Libraries are both undefined.");
                };
                b.prototype.dispatchEvent = function(a, b, e) {
                    try {
                        this.dispatchChatHeaderEvent(a, b, e),
                            this.dispatchMinimizedEvent(a, b, e)
                    } catch (d) {
                        throw Error("Error occurred firing event to either the chat header or minimized component: " + d);
                    }
                };
                return b
            });
        }
    )
})();
