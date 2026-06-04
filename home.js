gsap.registerPlugin(ScrollTrigger);

// Matter JS Code
function hidefloatcharacter() {
  const floatElement = document.querySelector('.home-hero_drag_floating-list');
  if (floatElement) {
    floatElement.style.display = 'none';
  }
  console.log("float is hidden");
}
// Draggable for Hero Section
function recthit(rectone, recttwo) {
  var r1 = $(rectone);
  var r2 = $(recttwo);
  var r1x = r1.offset().left;
  var r1w = r1.width();
  var r1y = r1.offset().top;
  var r1h = r1.height();
  var r2x = r2.offset().left;
  var r2w = r2.width();
  var r2y = r2.offset().top;
  var r2h = r2.height();
  if (
    r1y + r1h < r2y ||
    r1y > r2y + r2h ||
    r1x > r2x + r2w ||
    r1x + r1w < r2x
  ) {
    return false;
  } else {
    return true;
  }
}

// DRAG AND DROP CODE
let draggableItem = $("[hero-drag]");
let dropzone = $("[hero-drop]");
let dropzoneTop = dropzone.offset().top;
let dropzoneLeft = dropzone.offset().left;
setTimeout(() => {
  dropzoneTop = dropzone.offset().top;
  dropzoneLeft = dropzone.offset().left;
}, 400);

let dropped = true;
let animating = false;
let windowWidth = $(window).width();
let zIndex = 3;

// Mouse down and up
draggableItem.on("mousedown touchstart", function () {
  zIndex = zIndex + 1;
  $(this).css("z-index", zIndex);
  if (!$("body").hasClass("finished")) {
    $(this).addClass("pressed");
  }
  dropped = false;
});
draggableItem.on("mouseup touchend", function () {
  $(this).removeClass("pressed");
  dropped = true;
});

;
(function splitFinishedText() {
  /* 
  const split = new SplitType(".home-hero_drag_text.is-finished", {
    types: "chars",
    tagName: "span",
  });
  */

  gsap.set($('.home-hero_drag-finished, .home-hero_drag-finished .char'), {
    opacity: 0,
    autoAlpha: 0
  })
})();

function checkDraggableIsFinished() {
  const droppedItems = draggableItem.filter('.dropped').length;

  if (droppedItems == draggableItem.length) {
    clearInterval(checkOverlapInterval);

    gsap.set($('.home-hero_drag-finished'), {
      opacity: 1,
      autoAlpha: 1
    })
    hidefloatcharacter()
    setTimeout(function () {
      const currentHeading = $('.home-hero_drag_char-list, .home-hero_drag_floating-list');
      const newHeadingChars = $('.home-hero_drag-finished .char');

      const currentHeadingChars = [currentHeading.find('.home-hero_drag_char:nth-child(1)'),
      currentHeading.find('.home-hero_drag_char:nth-child(2)'), currentHeading.find(
        '.home-hero_drag_char:nth-child(3)'), currentHeading.find(
          '[hero-drop="1"], [hero-drag="1"]'), currentHeading.find(
            '[hero-drop="2"], [hero-drag="2"]'), currentHeadingChar6 = currentHeading.find(
              '[hero-drop="3"], [hero-drag="3"]'), currentHeading.find(
                '[hero-drop="4"], [hero-drag="4"]')
      ];

      let headingTL = gsap.timeline({
        defaults: {
          duration: 0.3,
          ease: "back.out(1.4)",
        }
      });

      currentHeadingChars.reverse().map((el, i) => {
        let stagger = 0.1 * i;

        headingTL
          .to(el, {
            y: '25vh',
            opacity: 0,
            autoAlpha: 0,
            ease: "back.out(1.4)",
          }, stagger)
      })
      /*
      .to(newHeadingChars, {
        opacity: 1,
        autoAlpha: 1,
        ease: "back.out(1.4)",
      })
      */

      $(newHeadingChars.get().reverse()).each((i, el) => {
        let number = i + 1;
        let stagger = 0.05 * i;

        headingTL
          .to(el, {
            opacity: 1,
            autoAlpha: 1,
            ease: "back.out(1.4)",
          }, stagger)
      })
    }, 250)
  }
}

// Check for overlap every 100 ms
let checkOverlapInterval = window.setInterval(function () {
  draggableItem.each(function () {
    let currentDrag = $(this);
    let dragAttr = currentDrag.attr("hero-drag");
    let correspondingDropzone = $(`[hero-drop='${dragAttr}']`);

    if (recthit(correspondingDropzone, currentDrag)) {
      currentDrag.addClass("intersect");
      if (dropped == true) {
        currentDrag.addClass("dropped");
        snap(currentDrag, correspondingDropzone);
        currentDrag.draggable("disable");

        $("body").addClass("finished");

        checkDraggableIsFinished()
      }
    } else {
      currentDrag.removeClass("intersect");
    }
  }); // end each
}, 100);

function snap(draggableObject, correspondingDropzone) {
  draggableObject.removeAttr("style");
  let draggableTop = draggableObject.offset().top;
  let draggableLeft = draggableObject.offset().left;
  let dropzoneTop = correspondingDropzone.offset().top;
  let dropzoneLeft = correspondingDropzone.offset().left;
  draggableObject.css("left", dropzoneLeft - draggableLeft);
  draggableObject.css("top", dropzoneTop - draggableTop);
}

window.onresize = function (event) {
  dropzoneTop = dropzone.offset().top;
  dropzoneLeft = dropzone.offset().left;
  if (windowWidth !== $(window).width()) {
    draggableItem.removeAttr("style");
    windowWidth = $(window).width();
  }
  let snappedObject = $(".draggable.dropped");
  if (snappedObject.length) {
    let dragAttr = snappedObject.attr("hero-drag");
    let correspondingDropzone = $(`[hero-drop='${dragAttr}']`);
    snap(snappedObject, correspondingDropzone);
  }
};

draggableItem.draggable();

//Draggable Mission
/* 
$(function () {
function missionDraggable() {
if ($(window).width() >= 992) {
  $(".mission_item").draggable("enable");
} else {
  $(".mission_item").draggable("disable");
}
}

$(".mission_item").draggable({
containment: ".mission_draggable-boundry",
start: function (event, ui) {
  $(this).addClass("dragging");
},
stop: function (event, ui) {
  $(this).removeClass("dragging");
},
});

$(window).on("resize", missionDraggable);
missionDraggable();
});
*/

//Spread Animation Mission
function getViewportSize() {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

var initialViewportSize = getViewportSize();
var viewportWidth = initialViewportSize.width;

$(function () {
  function animate(image, index = 2) {
    if (!image) return;

    const imgDuration = 1.2;
    const imgEase = 'back.out(1.5)';

    if (index === 0) {
      gsap.to(image, {
        rotation: -9,
        xPercent: 74,
        yPercent: -10,
        duration: imgDuration,
        ease: imgEase
      });
    } else if (index === 1) {
      gsap.to(image, {
        rotation: 12,
        xPercent: -54,
        yPercent: -10,
        duration: imgDuration,
        ease: imgEase
      });
    } else if (index === 2) {
      gsap.to(image, {
        rotation: 4,
        xPercent: -112,
        yPercent: 50,
        duration: imgDuration,
        ease: imgEase
      });
    } else if (index === 3) {
      gsap.to(image, {
        rotation: -8,
        xPercent: -10,
        yPercent: 52,
        duration: imgDuration,
        ease: imgEase
      });
    } else if (index === 4) {
      gsap.to(image, {
        rotation: 9,
        xPercent: 110,
        yPercent: 64,
        duration: imgDuration,
        ease: imgEase
      });
    }
  }

  const initialize = () => {
    const images = gsap.utils.toArray(".mission_item");
    images.forEach((image, index) => {
      image.classList.remove("is-1", "is-2", "is-3", "is-4", "is-5")
      gsap.set(image, {
        rotation: 0,
        xPercent: 0,
        yPercent: 0,
      });
    });
  }

  const createScrollTrigger = () => {
    return ScrollTrigger.create({
      trigger: ".mission_list",
      start: "top 85%",

      onEnter: () => {
        console.log('entered');
        const images = gsap.utils.toArray(".mission_item");
        images.forEach((image, index) => {
          animate(image, index)
        });
      }
    });
  }

  ScrollTrigger.matchMedia({
    "(min-width: 992px)": function () {
      initialize();
      const scrollTrigger = createScrollTrigger();
    },
    "(max-width: 991px)": function () {
      const images = gsap.utils.toArray(".mission_item");
      images.forEach((image, index) => {
        image.classList.remove("is-1", "is-2", "is-3", "is-4", "is-5")
        gsap.to(image, {
          rotation: 0,
          xPercent: 0,
          yPercent: 0,
        });
      });
    },
    "all": function () {
      initialize();
    }
  });
});

//Journey Timeline
function journeyTl() {
  $(".section_journey").each(function (index) {
    let wrap = $(this);
    let inner = $(this).find(".journey_timeline-track-wrapper");
    let track = $(this).find(".journey_timeline-track");

    // create main horizontal scroll timeline
    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrap,
        start: "5% top",
        end: "98% bottom",
        scrub: true,
      },
      defaults: { ease: "none", duration: 1 },
    });
    tl.to(track, { xPercent: -100 });

    // create main horizontal scroll timeline
    let jrProgress = gsap.timeline({
      scrollTrigger: {
        trigger: wrap,
        start: "top top",
        end: "98% bottom",
        scrub: 1,
      },
      defaults: { ease: "none", duration: 1 },
    });
    jrProgress
      .to(".journey_progress-bar", { width: "100%" })
      .to(".journey_progress-in", { xPercent: -50 }, 0);

    // create main horizontal scroll timeline
    let jrDots = gsap.timeline({
      scrollTrigger: {
        trigger: wrap,
        start: "top top",
        end: "98% bottom",
        scrub: 0.6,
      },
      defaults: { ease: "none", duration: 1 },
    });
    jrDots
      .from(".journey_progress-dot", {
        backgroundColor: "#06586F",
        borderColor: "#06586F",
        scale: 0.5,
        stagger: 0.1,
        duration: 0.1,
      })
      .from(
        ".journey_year-wrapper", { color: "#93C4D3", stagger: 0.1, duration: 0.1 },
        0
      );

    // get container left position
    function containerLeft() {
      return inner.offset().left + "px";
    }
    // get container right position
    function containerRight() {
      return inner.offset().left + inner.innerWidth() + "px";
    }
  });
}

//CTA QR Hover
function ctaQR() {
  let ctaQRTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".cta_qr-wrapper",
      start: "top center",
      end: "bottom top",
      scrub: false,
      toggleActions: "play none none none"
    },
    defaults: {
      duration: 0.6,
      ease: "back.out(1.2)",
    }
  });

  ctaQRTl.from(".cta_qr-text .char", {
    y: "80%",
    opacity: 0,
    stagger: { amount: 0.4, from: "random" },
  });

  // $(".cta_qr").on("mouseenter", function () {
  //   ctaQRTl.timeScale(1).play();
  // });

  // $(".cta_qr").on("mouseleave", function () {
  //   ctaQRTl.timeScale(1.4).reverse();
  // });
}

//Footer Interaction
function footerInt() {
  let footerIntTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".footer_component",
      start: "60% bottom",
      end: "bottom bottom",
      scrub: true,
    },
  });

  footerIntTl.from(".footer_humdrum .char", {
    opacity: 0,
    stagger: {
      amount: 0.4,
      from: "random",
    },
  });
}

function giftInteraction() {
  let allGiftTl = {}
  let missionSection = $(document).find('.section_mission');

  const initialize = (wrapper, innerWrapper, missionLabels, clearLabels, index) => {
    innerWrapper.removeClass('loaded');
    allGiftTl[index] = null;

    gsap.set(clearLabels, { clearProps: true });

    let giftTl = gsap.timeline({
      defaults: {
        duration: 0.6,
        ease: "back.out(1.4)",
      },
      paused: true,
    });

    gsap.set(missionLabels, { opacity: 1 });

    giftTl.to(wrapper, { color: "#f06", ease: "power2.out", duration: 0.5 }, 0);

    $(missionLabels.get().reverse()).each((i, el) => {
      let number = i + 1;
      let stagger = 0.075 * i;

      giftTl
        .from($(el), {
          y: 0,
          yPercent: 0,
          x: 0,
          xPercent: 0,
          rotate: 0,
          opacity: 0,
        }, stagger)
        .from($(el).children(), {
          y: 0,
          yPercent: 0,
          x: 0,
          xPercent: 0,
          rotate: 0,
          opacity: 0,
        }, stagger)
    });

    innerWrapper.addClass('loaded');

    allGiftTl[index] = giftTl;

    return giftTl;
  }

  const animate = () => {
    $(".h-mission-labels-wrapper").off();

    $(".h-mission-labels-wrapper").each(function (index) {
      let wrapper = $(this);
      let innerWrapper = $(this).find('.h-mission-labels');
      let missionLabels = $(this).find('.h-mission-label');
      let clearLabels = $(this).find('.h-mission-label, .h-mission-label_image');

      /* if (giftTl) {
        giftTl.progress(0).kill();
      } */

      let giftTl = initialize(wrapper, innerWrapper, missionLabels, clearLabels);

      $(wrapper).on("mouseenter", function () {
        const index = $(".h-mission-labels-wrapper").index($(this));

        $(this).css('z-index', 9);
        giftTl.timeScale(1).play();
        // missionSection.css('overflow', 'visible');
      });

      $(wrapper).on("mouseleave", function () {
        const index = $(".h-mission-labels-wrapper").index($(this));

        $(this).css('z-index', '');
        giftTl.timeScale(2).reverse();
        /*
        giftTl.timeScale(2).reverse().then(() => {
          missionSection.css('overflow', 'hidden');
        });
        */
      });
    });
  }

  animate()

  ScrollTrigger.matchMedia({
    "(min-width: 992px)": function () {
      animate();
    },
    "(max-width: 991px)": function () {
      animate();
    },
  });
}

//Profile Interaction
function updateProfileBoxes() {
  const profileRadios = document.querySelectorAll(".profiles_radio");

  profileRadios.forEach((radio) => {
    const parentItem = radio.closest(".profiles_box-item");

    if (radio.classList.contains("w--redirected-checked")) {
      parentItem.classList.add("is-active");
    } else {
      parentItem.classList.remove("is-active");
    }
  });
}

//Profile box highlight
function triggerUpdateProfileBoxes() {
  updateProfileBoxes();
  setTimeout(updateProfileBoxes, 20);
  setTimeout(updateProfileBoxes, 40);
}

document.addEventListener("click", (event) => {
  if (event.target.matches(".profiles_radio")) {
    triggerUpdateProfileBoxes();
  }
});

function scrollAnimations() {

  $("[data-scroll-anim='element']").each(function () {
    let heroAnimTl = gsap.timeline({
      defaults: {
        duration: 1
      },
      scrollTrigger: {
        trigger: this,
        start: "top 75%",
        end: "bottom top",
        scrub: false,
        toggleActions: "play none none none"
      }
    }).from(this, { opacity: 0 });
  });

}

//auto open first faq on pagelaod
function autoOpenFaq() {
  const firstFaqQuestion = document.querySelector(".faq_question");
  if (firstFaqQuestion) {
    firstFaqQuestion.click();
  }
}

function pageload() {
  gsap.fromTo(".page-wrapper", { opacity: 0, duration: 0.65 })
}

//call gsap animations function
giftInteraction();
footerInt();
updateProfileBoxes();

autoOpenFaq();
scrollAnimations();

let mm = gsap.matchMedia();

mm.add("(min-width: 991px)", () => {
  ctaQR();
});

mm.add("(max-width: 799px)", () => {
  // mobile setup code here...
});

//swiper slider for profiles
let swipers = [];

function initSwiper() {
  if (window.innerWidth < 992) {
    $(".profiles_component").each(function (index) {
      const swiper = new Swiper($(this).find(".swiper")[0], {
        speed: 500,
        loop: false,
        autoHeight: false,
        centeredSlides: false,
        followFinger: true,
        freeMode: false,
        slideToClickedSlide: false,
        slidesPerView: 1.4,
        spaceBetween: "4%",
        rewind: false,
        mousewheel: {
          forceToAxis: true
        },
        keyboard: {
          enabled: true,
          onlyInViewport: true
        },
        breakpoints: {
          // mobile landscape
          480: {
            slidesPerView: 2,
            spaceBetween: "4%"
          },
          // tablet
          768: {
            slidesPerView: 2.5,
            spaceBetween: "3%"
          }
        },
        pagination: {
          el: $(this).find(".swiper-bullet-wrapper")[0],
          bulletActiveClass: "is-active",
          bulletClass: "swiper-bullet",
          bulletElement: "button",
          clickable: true
        },
        navigation: {
          nextEl: $(this).find(".swiper-next")[0],
          prevEl: $(this).find(".swiper-prev")[0],
          disabledClass: "is-disabled"
        },
        scrollbar: {
          el: $(this).find(".swiper-drag-wrapper")[0],
          draggable: true,
          dragClass: "swiper-drag",
          snapOnRelease: true
        },
        slideActiveClass: "is-active",
        slideDuplicateActiveClass: "is-active"
      });
      swipers.push(swiper);
    });
  }
}

function destroySwiper() {
  swipers.forEach(swiper => {
    if (swiper !== null && typeof swiper.destroy === 'function') {
      swiper.destroy(true, true);
    }
  });
  swipers = [];
}

function resetSwiper() {
  destroySwiper();
  initSwiper();
}

// Initialize Swiper on page load
initSwiper();

// Reset Swiper on window resize
let resizeTimer;
window.addEventListener('resize', function () {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(function () {
    resetSwiper();
  }, 250);
});

// Different Section
(function initializeDifferentStickyHeading() {
  const stickyWrapper = $(".section_different .different_text-contain-sticky");
  if (!stickyWrapper.length) return;

  const stickyWrapperHeight = stickyWrapper.outerHeight();

  gsap.set(".section_different .different_text-contain-sticky", {
    height: stickyWrapperHeight,
  });

  gsap.set(".section_different .different_gradient", {
    opacity: 0,
  });

  ScrollTrigger.matchMedia({
    "(min-width: 992px)": function () {
      // Resize heading font size on section scroll start
      gsap.to("#different_text", {
        scrollTrigger: {
          trigger: ".section_different",
          start: "top top",
          end: `+=${stickyWrapperHeight / 2}`,
          scrub: true,
        },
        opacity: 1,
        fontSize: "5rem",
        ease: Power1.out,
      });
    },
    "(min-width: 768px) and (max-width: 991px)": function () {
      // Resize heading font size on section scroll start
      gsap.to("#different_text", {
        scrollTrigger: {
          trigger: ".section_different",
          start: "top top",
          end: `+=${stickyWrapperHeight / 2}`,
          scrub: true,
        },
        opacity: 1,
        fontSize: "4rem",
        ease: Power1.out,
      });
    },
    "(min-width: 479px) and (max-width: 767px)": function () {
      // Resize heading font size on section scroll start
      gsap.to("#different_text", {
        scrollTrigger: {
          trigger: ".section_different",
          start: "top top",
          end: `+=${stickyWrapperHeight / 2}`,
          scrub: true,
        },
        opacity: 1,
        fontSize: "2.75rem",
        ease: Power1.out,
      });
    },
    "(max-width: 478px)": function () {
      // Resize heading font size on section scroll start
      gsap.to("#different_text", {
        scrollTrigger: {
          trigger: ".section_different",
          start: "top top",
          end: `+=${stickyWrapperHeight / 2}`,
          scrub: true,
        },
        opacity: 1,
        fontSize: "2.5rem",
        ease: Power1.out,
      });
    },
  });

  // Hide sticky heading on section scroll end
  gsap.to("#different_text", {
    scrollTrigger: {
      trigger: ".section_different",
      start: "bottom 37.5%",
      end: "+=50",
      scrub: true,
    },
    opacity: 0,
    ease: Power1.out,
  });

  // Show heading gradient on section scroll start
  gsap.to(".section_different .different_gradient", {
    scrollTrigger: {
      trigger: ".section_different",
      start: "top top",
      end: `+=${stickyWrapperHeight / 2}`,
      scrub: true,
    },
    opacity: 1,
    ease: Power1.out,
  });
})();

// Timeline Swiper
(function initializeTimelineSwiper() {
  const switchItems = $(".swiper-pagination-custom .swiper-pagination-switch");
  const switchItemsLength = switchItems.length || 1;

  const timelineSwiper = new Swiper(".swiper#timeline-swipper", {
    autoHeight: false,
    /* autoplay: {
      delay: 5000,
      disableOnInteraction: true
    }, */
    speed: 500,
    direction: "horizontal",
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev"
    },
    pagination: {
      el: ".swiper-pagination",
      type: "progressbar"
    },
    loop: false,
    effect: "slide",
    navigation: {
      nextEl: '.session_arrow.is-right',
      prevEl: '.session_arrow.is-left',
    },
    slidesPerView: 'auto',
    centeredSlides: true,
    spaceBetween: 0,
    slideToClickedSlide: true,
    on: {
      init: function () {
        $(".swiper-pagination-custom .swiper-pagination-switch").removeClass("active");
        $(".swiper-pagination-custom .swiper-pagination-switch").eq(0).addClass("active");
        $(document).find('.swiper-pagination-progressbar-fill').css('--progressFillScale',
          1 * (1 / switchItemsLength));
      },
      slideChangeTransitionStart: function () {
        $(".swiper-pagination-custom .swiper-pagination-switch").removeClass("active");
        $(".swiper-pagination-custom .swiper-pagination-switch").eq(timelineSwiper
          .realIndex)
          .addClass("active");
        $(document).find('.swiper-pagination-progressbar-fill').css('--progressFillScale', (
          timelineSwiper
            .realIndex + 1) * (1 / switchItemsLength));
      }
    }
  });

  $(".swiper-pagination-custom .swiper-pagination-switch .journey_progress-dot, .swiper-pagination-custom .swiper-pagination-switch .journey_year-text")
    .click(
      function () {
        const switcher = $(this).closest('.swiper-pagination-switch');
        const index = switcher.index()

        timelineSwiper.slideTo(index);
        $(".swiper-pagination-custom .swiper-pagination-switch").removeClass("active");
        switcher.addClass("active");
      });
})();

(function initializePieChart() {
  // Bail if Chart.js hasn't loaded
  if (typeof Chart === 'undefined') {
    console.warn('Chart.js not loaded yet — skipping pie chart init.');
    return;
  }
  
  const ctx = document.getElementById('tax-chart');
  if (!ctx) return; // Element not on this page

  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ["Pay & Super", "Insurance", "Training & Events", "Humdrum"],
      datasets: [
        {
          fill: true,
          backgroundColor: ['#fdebab', '#7fe4dd', '#65dcfe', '#024a5e'],
          data: [76, 6, 8, 10],
          borderColor: ['#121617', '#121617', '#121617', '#121617'],
          borderWidth: [3, 3, 3, 3]
        }
      ]
    },
    options: {
      plugins: {
        legend: false,
        tooltip: {
          callbacks: {
            label: function (context) {
              let label = context.dataset.label || '';
              return label;
            }
          }
        }
      },
    }
  });
})();

(function initializeTeamSwiper() {
  const swiperCard = new Swiper('.swiper.is-card', {
    effect: 'cards',
    grabCursor: true,
    cardsEffect: {
      slideShadows: false,
      perSlideRotate: 10
    },
    initialSlide: 6,
    pagination: {
      el: '.team-pagination',
      type: 'bullets',
      bulletClass: 'team_pagination',
      bulletActiveClass: 'is-active',
      bulletElement: 'button',
      clickable: true,// Enables clicking on pagination bullets to switch slides
    },
  });

  const swiper = new Swiper('.swiper.is-tablet-team', {
    slidesPerView: 1.15,
    navigation: {
      nextEl: '.team_card-nav.is-right',
      prevEl: '.team_card-nav.is-left',
    },
    spaceBetween: 24, // Adjust space between slides
    loop: true, // Infinite loop
    pagination: false, // Disable pagination
    breakpoints: {
      // mobile landscape
      480: {
        slidesPerView: 'auto',
      },
      // tablet
      768: {
        slidesPerView: 'auto',
      }
    },
  });
})();
