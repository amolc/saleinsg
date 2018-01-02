(function($) {
    "use strict";
    $('.fadeInOnLoad').css('opacity', 0);
    $('#loading').on('click', function() {
        $("#loading").fadeOut();
    });
    $(window).load(function() {
        $("#loading").fadeOut();
        $("#loading .object").delay(100).fadeOut("slow");
        $('.fadeInOnLoad').delay(100).fadeTo("slow", 1);
        bodyScrollAnimation()
    })

    function bodyScrollAnimation() {
        var scrollAnimate = $('body').data('scroll-animation');
        if (scrollAnimate === true) {
            new WOW({
                mobile: false
            }).init()
        }
    }
    $('body').scrollspy({
        target: '#main-navbar',
        offset: 100
    });
    $('nav a[href^="#"]:not([href="#"]), .back_to_top, .explore').on('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top - 70
        }, 1500);
        event.preventDefault();
    });
    $(window).scroll(function() {
        var scroll = $(window).scrollTop();
        if (scroll >= 99) {
            $(".navbar-default").addClass("is-scrolling");
        } else {
            $(".navbar-default").removeClass("is-scrolling");
        }
    });
    $(window).scroll(function() {
        if ($(window).scrollTop() > 1000) {
            $('.back_to_top').fadeIn('slow');
        } else {
            $('.back_to_top').fadeOut('slow');
        }
    });
    if ($('#BGVideo').length) {
        $("#BGVideo").mb_YTPlayer();
    }
    if ($('.video').length) {
        $('.video').magnificPopup({
            type: 'iframe',
            iframe: {
                markup: '<div class="mfp-iframe-scaler">' + '<div class="mfp-close"></div>' + '<iframe class="mfp-iframe" frameborder="0" allowfullscreen></iframe>' + '</div>',
                patterns: {
                    youtube: {
                        index: 'youtube.com/',
                        id: 'v=',
                        src: '//www.youtube.com/embed/%id%?autoplay=1'
                    },
                    vimeo: {
                        index: 'vimeo.com/',
                        id: '/',
                        src: '//player.vimeo.com/video/%id%?autoplay=1'
                    },
                    gmaps: {
                        index: '//maps.google.',
                        src: '%id%&output=embed'
                    }
                },
                srcAction: 'iframe_src',
            }
        });
    }
    if ($('a[href="#product-choose"]').length) {
        $('a[href="#product-choose"]').magnificPopup({
            type: 'inline',
            mainClass: 'mfp-fade',
            midClick: true
        });
    }
    $('.gallery').each(function() {
        $('.gallery').magnificPopup({
            delegate: 'a',
            type: 'image',
            gallery: {
                enabled: true
            },
            mainClass: 'mfp-fade'
        });
    });
    if ($('.quanity').length) {
        $('.quanity').TouchSpin({
            verticalbuttons: true,
            verticalupclass: 'glyphicon glyphicon-plus',
            verticaldownclass: 'glyphicon glyphicon-minus'
        });
    }
    if ($('.selectpicker').length) {
        $('.selectpicker').selectpicker();
    }
    $('.feature-note .plus-icon .plus').on('click', function() {
        if ($(this).parents('.feature-note').hasClass('show-cont')) {
            $(this).parents('.feature-note').removeClass('show-cont')
        } else {
            $(this).parents('.feature-note').addClass('show-cont')
        }
    });
    $('.flip-contact-box').on('click', function() {
        if (!$('.flip-box-container').hasClass('show-form')) {
            $('.flip-box-container').addClass('show-form')
        }
    });
    $('.js-close-flip').on('click', function() {
        $('.flip-box-container').removeClass('show-form');
    });
    if ($.fn.validator) {
        $.validator.setDefaults({
            highlight: function(element) {
                $(element).closest('.form-group').addClass('has-error');
            },
            unhighlight: function(element) {
                $(element).closest('.form-group').removeClass('has-error');
            },
            errorPlacement: function(error, element) {}
        });
    }
    if ($.fn.validator) {
        $("#paypal-regn").validate({
            rules: {
                first_name: "required",
                last_name: "required",
                email: {
                    required: true,
                    email: true
                },
                os0: "required",
                quantity: "required",
                agree: "required"
            },
            messages: {
                first_name: "Your first name",
                last_name: "Your last name",
                email: "We need your email address",
                os0: "Choose your Pass",
                quantity: "How many seats",
                agree: "Please accept our terms and privacy policy"
            },
            submitHandler: function(form) {
                $("#reserve-btn").attr("disabled", true);
                form.submit();
            }
        });
    }
    var dataexitpopuop = $('body').data('exit-modal');
    if ($('#exit-modal').length && dataexitpopuop === true) {
        var _ouibounce = ouibounce($('#exit-modal')[0], {
            aggressive: true,
            timer: 0,
            callback: function() {}
        });
        $('body').on('click', function() {
            $('#exit-modal').hide();
        });
        $('#exit-modal .modal-footer').on('click', function() {
            $('#exit-modal').hide();
        });
        $('#exit-modal .exit-modal').on('click', function(e) {
            e.stopPropagation();
        });
    }
})(jQuery);



    /* <![CDATA[ */
    var _gaq = _gaq || [];
    _gaq.push(['_setAccount', 'UA-111765056-1']);
    _gaq.push(['_trackPageview']);

    (function() {
        var ga = document.createElement('script');
        ga.type = 'text/javascript';
        ga.async = true;
        ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(ga, s);
    })();

    (function(b) {
        (function(a) {
            "__CF" in b && "DJS" in b.__CF ? b.__CF.DJS.push(a) : "addEventListener" in b ? b.addEventListener("load", a, !1) : b.attachEvent("onload", a)
        })(function() {
            "FB" in b && "Event" in FB && "subscribe" in FB.Event && (FB.Event.subscribe("edge.create", function(a) {
                _gaq.push(["_trackSocial", "facebook", "like", a])
            }), FB.Event.subscribe("edge.remove", function(a) {
                _gaq.push(["_trackSocial", "facebook", "unlike", a])
            }), FB.Event.subscribe("message.send", function(a) {
                _gaq.push(["_trackSocial", "facebook", "send", a])
            }));
            "twttr" in b && "events" in twttr && "bind" in twttr.events && twttr.events.bind("tweet", function(a) {
                if (a) {
                    var b;
                    if (a.target && a.target.nodeName == "IFRAME") a: {
                        if (a = a.target.src) {
                            a = a.split("#")[0].match(/[^?=&]+=([^&]*)?/g);
                            b = 0;
                            for (var c; c = a[b]; ++b)
                                if (c.indexOf("url") === 0) {
                                    b = unescape(c.split("=")[1]);
                                    break a
                                }
                        }
                        b = void 0
                    }
                    _gaq.push(["_trackSocial", "twitter", "tweet", b])
                }
            })
        })
    })(window);
    /* ]]> */
    $('.open-popup-link').magnificPopup({
      type:'inline',
      midClick: true // allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source.
    });
