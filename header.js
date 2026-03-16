function navbarToggle() {
    gsap.registerPlugin(MorphSVGPlugin);
    MorphSVGPlugin.convertToPath("#hamburger-menu rect");
    let navbarToggleTl = gsap.timeline({
      defaults: {
        duration: 0.65,
        ease: "power2.inOut",
      },
      paused: true,
    });
  
    navbarToggleTl
      .set(".nav_menu-left-mask", { backgroundColor: "#024a5e" })
      .set(".link-mask", {
        display: "block"
      })
      .to(".nav_menu-left-mask", { width: "0px" }, 0.75)
      .from(".navbar_menu_master", { backgroundColor: "#00000000" })
      .from(".navbar_menu_master-in", { opacity: 0, xPercent: -50 }, 0)
      .to(".navbar_menu_master", { display: "flex" }, 0)
      .to("#hamburger-menu path", { morphSVG: ".cross-icon path", duration: 1 }, 0)
      .to(".navbar_menu-button-text-track", { yPercent: "-50" }, 0)
      .to(".navbar_logo-link", { pointerEvents: "none" }, 0)
      .to("body", { overflow: "hidden" }, 0)
      .from("[data-nav-animator='stagger']", {
          opacity: 0,
          y: "2.4rem",
          ease: "power2.out",
          stagger: { amount: 1 }
        },
        0.65)
  
    ;
  
    $(".navbar_menu-button").on("click", function () {
      $(this).toggleClass("clicked");
      if ($(this).hasClass("clicked")) {
        navbarToggleTl.timeScale(1).play();
        navLogoTl.timeScale(1).play();
      } else {
        navbarToggleTl.timeScale(2).reverse();
        navLogoTl.timeScale(1.4).reverse();
      }
    });

    $(".navbar_component [data-cta='SignUp'], .navbar_component [data-cta='TalktoSomeone']").on("click", function () {
      const $btn = $(".navbar_menu-button");

      if ($btn.hasClass("clicked")) {
        $btn.removeClass("clicked");
        navbarToggleTl.timeScale(2).reverse();
        navLogoTl.timeScale(1.4).reverse();
        console.log("Navbar auto-closed via internal link.");
      }
    });
  
    //Nav Hover
    let navLogoTl = gsap.timeline({
      defaults: {
        duration: 0.4,
        ease: "back.out(1.2)",
      },
      paused: true,
    });
  
    navLogoTl
      .to(".navbar_link-text-wrapper", {
        width: "8rem",
        opacity: 1,
        ease: "power2.out",
      })
      .from(
        ".navbar_link-text", { y: "100%", opacity: 0, stagger: { amount: 0.3 } },
        0
      );
  
    $(".navbar_logo-link").on("mouseenter", function () {
      navLogoTl.timeScale(1).play();
    });
  
    $(".navbar_logo-link").on("mouseleave", function () {
      navLogoTl.timeScale(1.4).reverse();
    });
  
  }
  
  function ctaAnim() {
    let ctaAnimTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".section_cta",
        start: "top 90%",
        end: "bottom top",
        scrub: false,
        toggleActions: "play none none none"
  
      },
      defaults: {
        ease: "power2.out",
        duration: 0.8,
        yoyo: true,
        repeat: -1
      }
    })
  
    ctaAnimTl.to(".cta_heading-icon-wrapper.is-man", {
        y: "-0.6em",
        rotate: 10,
        duration: 0.6
  
      })
      .fromTo(".cta_heading-icon-wrapper.is-horse", { rotate: -20 }, { rotate: 30 }, 0)
      .to(".cta_heading-icon-wrapper.is-house", {
        scale: "1.1",
        duration: 0.5
      }, 0)
      .to(".cta_heading-icon-wrapper.is-radio", {
        y: "-0.6em",
        rotate: -10,
        duration: 0.6
  
      });
  
  }
  ctaAnim();
  navbarToggle();
  
