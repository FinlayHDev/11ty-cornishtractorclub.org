(function ($) {
  'use strict';

  // Sticky Menu

  $(window).scroll(function () {
    if ($('.navigation').offset().top > 100) {
      $('.navigation').addClass('nav-bgg');
    } else {
      $('.navigation').removeClass('nav-bgg');
    }
  });


  // Background-images
  $('[data-background]').each(function () {
    $(this).css({
      'background-image': 'url(' + $(this).data('background') + ')'
    });
  });

  // venobox popup
  $('.venobox').venobox();

  // dropdown menu
  var mobileWidth = 992;
  var navcollapse = $('.navbar .dropdown');
  $(window).on('resize', function () {
    navcollapse.children('.dropdown-menu').hide();
  });
  navcollapse.hover(function () {
    if ($(window).innerWidth() >= mobileWidth) {
      $(this).children('.dropdown-menu').stop(true, false, true).slideToggle(250);
    }
  });

  // Progress Bar
  $(window).on('load', function () {
    $('.progress-bar').each(function () {
      var width = $(this).data('percent');
      $(this).css({
        'transition': 'width 3s'
      });
      $(this).appear(function () {
        $(this).css('width', width + '%');
        $(this).find('.count').countTo({
          from: 0,
          to: width,
          speed: 3000,
          refreshInterval: 50
        });
      });
    });
  });

  // Shuffle js filter and masonry
  var containerEl = document.querySelector('.shuffle-wrapper');
  if (containerEl) {
    var Shuffle = window.Shuffle;
    var myShuffle = new Shuffle(document.querySelector('.shuffle-wrapper'), {
      itemSelector: '.shuffle-item',
      buffer: 1
    });

    jQuery('input[name="shuffle-filter"]').on('change', function (evt) {
      var input = evt.currentTarget;
      if (input.checked) {
        myShuffle.filter(input.value);
      }
    });
  }

  // video iframe load
  $('.play-icon i').on('click', function () {
    var video = '<iframe allowfullscreen src="' + $(this).attr('data-video') + '"></iframe>';
    $(this).replaceWith(video);
  });


  // Accordions
  $('.collapse').on('shown.bs.collapse', function () {
    $(this).parent().find('.ti-plus').removeClass('ti-plus').addClass('ti-minus');
  }).on('hidden.bs.collapse', function () {
    $(this).parent().find('.ti-minus').removeClass('ti-minus').addClass('ti-plus');
  });


  // clients logo slider
  $('.client-logo-slider').slick({
    infinite: true,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    dots: false,
    arrows: false,
    responsive: [{
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 400,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  });


  // testimonial slider
  var containerEl2 = document.querySelector('#slider');
  if (containerEl2) {
    window.slider = $('#slider').cardSlider({
      slideClass: 'slide',
      delay: 300,
      transition: 'ease'
    });
  }

  // banner slider
  $('.banner-slider').slick({
    dots: false,
    arrows: false,
    autoplay: true,
    infinite: true,
    speed: 500,
    fade: true,
    cssEase: 'linear',
  });

  // hero alert
  // Hide all hero-alert containers when the "close" button is clicked
  $('.hero-alert .close').click(function() {
    $('.hero-alert').hide();
  });

  // current year
  document.addEventListener('DOMContentLoaded', function () {
    var yearElement = document.getElementById('currentYear');
    if (yearElement) {
      var currentYear = new Date().getFullYear();
      yearElement.textContent = currentYear;
    }
  });


})(jQuery);
