/* =========================================================
   KAVIYARASI E — AI/ML PORTFOLIO
   Main JavaScript
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  /* =======================================================
     MOBILE NAVIGATION
     ======================================================= */

  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav-links");

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      nav.classList.toggle("active");
      menuToggle.classList.toggle("active");
    });

    // Close menu after clicking a navigation link
    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("active");
        menuToggle.classList.remove("active");
      });
    });
  }


  /* =======================================================
     SMOOTH SCROLL
     ======================================================= */

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);

      if (target) {
        event.preventDefault();

        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    });
  });


  /* =======================================================
     ACTIVE NAVIGATION LINK
     ======================================================= */

  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  const updateActiveNav = () => {
    let currentSection = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 180;
      const sectionHeight = section.offsetHeight;

      if (
        window.scrollY >= sectionTop &&
        window.scrollY < sectionTop + sectionHeight
      ) {
        currentSection = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");

      const href = link.getAttribute("href");

      if (href === `#${currentSection}`) {
        link.classList.add("active");
      }
    });
  };

  window.addEventListener("scroll", updateActiveNav);
  updateActiveNav();


  /* =======================================================
     SCROLL REVEAL ANIMATION
     ======================================================= */

  const revealElements = document.querySelectorAll(
    ".reveal, .project-card, .experience-card, .cert-card, .skill-card"
  );

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, observerInstance) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observerInstance.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12
      }
    );

    revealElements.forEach((element) => {
      element.classList.add("reveal-hidden");
      observer.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("visible");
    });
  }


  /* =======================================================
     PROJECT CARD HOVER EFFECT
     ======================================================= */

  const projectCards = document.querySelectorAll(".project-card");

  projectCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      card.classList.add("hovered");
    });

    card.addEventListener("mouseleave", () => {
      card.classList.remove("hovered");
    });
  });


  /* =======================================================
     CERTIFICATE PREVIEW
     ======================================================= */

  const certificateCards = document.querySelectorAll(
    ".certificate-card, .cert-card"
  );

  certificateCards.forEach((card) => {
    card.addEventListener("click", () => {
      const link = card.querySelector("a");

      if (link) {
        link.click();
      }
    });
  });


  /* =======================================================
     CONTACT FORM
     ======================================================= */

  const contactForm = document.querySelector("#contact-form");

  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const nameInput = contactForm.querySelector(
        'input[name="name"], #name'
      );

      const emailInput = contactForm.querySelector(
        'input[name="email"], #email'
      );

      const messageInput = contactForm.querySelector(
        'textarea[name="message"], #message'
      );

      const name = nameInput ? nameInput.value.trim() : "";
      const email = emailInput ? emailInput.value.trim() : "";
      const message = messageInput ? messageInput.value.trim() : "";

      if (!name || !email || !message) {
        showNotification(
          "Please fill in your name, email and message.",
          "error"
        );
        return;
      }

      if (!isValidEmail(email)) {
        showNotification(
          "Please enter a valid email address.",
          "error"
        );
        return;
      }

      /*
       * This opens the user's email client.
       * Replace the email address below if required.
       */

      const recipient = "ibkkaviyarasi@gmail.com";

      const subject = encodeURIComponent(
        `Portfolio Contact from ${name}`
      );

      const body = encodeURIComponent(
        `Name: ${name}\n` +
        `Email: ${email}\n\n` +
        `Message:\n${message}`
      );

      window.location.href =
        `mailto:${recipient}?subject=${subject}&body=${body}`;

      showNotification(
        "Opening your email application...",
        "success"
      );
    });
  }


  /* =======================================================
     EMAIL VALIDATION
     ======================================================= */

  function isValidEmail(email) {
    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailPattern.test(email);
  }


  /* =======================================================
     NOTIFICATION SYSTEM
     ======================================================= */

  function showNotification(message, type = "success") {
    const existingNotification =
      document.querySelector(".portfolio-notification");

    if (existingNotification) {
      existingNotification.remove();
    }

    const notification =
      document.createElement("div");

    notification.className =
      `portfolio-notification ${type}`;

    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add("show");
    }, 50);

    setTimeout(() => {
      notification.classList.remove("show");

      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3500);
  }


  /* =======================================================
     VOICE ASSISTANT
     ======================================================= */

  const listenButton = document.querySelector(
    "#start-listening, .start-listening, [data-listen]"
  );

  const voiceStatus = document.querySelector(
    "#voice-status, .voice-status"
  );

  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  let recognition = null;
  let isListening = false;


  /* -------------------------------------------------------
     Browser Speech Recognition Support
     ------------------------------------------------------- */

  if (SpeechRecognition) {
    recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;

    /*
     * English is used for navigation commands.
     * The assistant can still speak Tamil/Hindi/English
     * when those language names are requested.
     */

    recognition.lang = "en-IN";


    recognition.onstart = () => {
      isListening = true;

      if (listenButton) {
        listenButton.classList.add("listening");
      }

      updateVoiceStatus("Listening...");
    };


    recognition.onresult = (event) => {
      const transcript =
        event.results[0][0].transcript.trim();

      updateVoiceStatus(`You said: "${transcript}"`);

      processVoiceCommand(transcript);
    };


    recognition.onerror = (event) => {
      console.error(
        "Speech recognition error:",
        event.error
      );

      isListening = false;

      if (listenButton) {
        listenButton.classList.remove("listening");
      }

      if (event.error === "not-allowed") {
        updateVoiceStatus(
          "Microphone permission is required."
        );
      } else {
        updateVoiceStatus(
          "Sorry, I couldn't understand that."
        );
      }
    };


    recognition.onend = () => {
      isListening = false;

      if (listenButton) {
        listenButton.classList.remove("listening");
      }
    };


    if (listenButton) {
      listenButton.addEventListener("click", () => {
        if (isListening) {
          recognition.stop();
          return;
        }

        try {
          recognition.start();
        } catch (error) {
          console.error(error);
        }
      });
    }
  } else {
    if (listenButton) {
      listenButton.disabled = true;
      listenButton.textContent =
        "🎤 Voice Not Supported";
    }

    updateVoiceStatus(
      "Voice recognition is not supported in this browser."
    );
  }


  /* =======================================================
     VOICE COMMAND PROCESSOR
     ======================================================= */

  function processVoiceCommand(command) {
    const text = command.toLowerCase().trim();


    /* -------------------------------------------------------
       HOME
       ------------------------------------------------------- */

    if (
      text.includes("home") ||
      text.includes("about you") ||
      text.includes("who are you")
    ) {
      goToSection("home");

      speak(
        "Welcome to Kaviyarasi's portfolio. " +
        "She is an AI and machine learning focused computer science engineer."
      );

      return;
    }


    /* -------------------------------------------------------
       PROJECTS
       ------------------------------------------------------- */

    if (
      text.includes("project") ||
      text.includes("projects") ||
      text.includes("work")
    ) {
      goToSection("projects");

      speak(
        "Here are Kaviyarasi's featured AI and software projects."
      );

      return;
    }


    /* -------------------------------------------------------
       EXPERIENCE
       ------------------------------------------------------- */

    if (
      text.includes("experience") ||
      text.includes("internship") ||
      text.includes("internships")
    ) {
      goToSection("experience");

      speak(
        "Kaviyarasi's experience includes AI, Generative AI and application development internships."
      );

      return;
    }


    /* -------------------------------------------------------
       SKILLS
       ------------------------------------------------------- */

    if (
      text.includes("skill") ||
      text.includes("skills") ||
      text.includes("technology") ||
      text.includes("technologies")
    ) {
      goToSection("skills");

      speak(
        "Her technical skills include Python, machine learning, NLP, JavaScript, React, Flutter, Firebase and AI technologies."
      );

      return;
    }


    /* -------------------------------------------------------
       CERTIFICATIONS
       ------------------------------------------------------- */

    if (
      text.includes("certificate") ||
      text.includes("certification") ||
      text.includes("certifications")
    ) {
      goToSection("certifications");

      speak(
        "You can view Kaviyarasi's internships, job simulations and certifications here."
      );

      return;
    }


    /* -------------------------------------------------------
       EDUCATION
       ------------------------------------------------------- */

    if (
      text.includes("education") ||
      text.includes("college") ||
      text.includes("degree")
    ) {
      goToSection("education");

      speak(
        "Kaviyarasi is pursuing a Bachelor of Engineering in Computer Science and Engineering."
      );

      return;
    }


    /* -------------------------------------------------------
       CONTACT
       ------------------------------------------------------- */

    if (
      text.includes("contact") ||
      text.includes("email") ||
      text.includes("hire") ||
      text.includes("reach")
    ) {
      goToSection("contact");

      speak(
        "You can contact Kaviyarasi through the email and LinkedIn details provided in the contact section."
      );

      return;
    }


    /* -------------------------------------------------------
       GITHUB
       ------------------------------------------------------- */

    if (
      text.includes("github") ||
      text.includes("git hub")
    ) {
      window.open(
        "https://github.com/Kaviyarasi27",
        "_blank"
      );

      speak(
        "Opening Kaviyarasi's GitHub profile."
      );

      return;
    }


    /* -------------------------------------------------------
       LINKEDIN
       ------------------------------------------------------- */

    if (
      text.includes("linkedin") ||
      text.includes("linked in")
    ) {
      window.open(
        "https://www.linkedin.com/in/kaviyarasi-e-67b93a293/",
        "_blank"
      );

      speak(
        "Opening Kaviyarasi's LinkedIn profile."
      );

      return;
    }


    /* -------------------------------------------------------
       RESUME
       ------------------------------------------------------- */

    if (
      text.includes("resume") ||
      text.includes("cv")
    ) {
      const resumeLink = document.querySelector(
        'a[href*="Resume"], a[href*="resume"], a[href*="CV"], a[href*="cv"]'
      );

      if (resumeLink) {
        window.open(
          resumeLink.href,
          "_blank"
        );

        speak(
          "Opening Kaviyarasi's resume."
        );
      } else {
        speak(
          "The resume link is not available yet."
        );
      }

      return;
    }


    /* -------------------------------------------------------
       TAMIL
       ------------------------------------------------------- */

    if (
      text.includes("tamil") ||
      text.includes("தமிழ்")
    ) {
      speak(
        "வணக்கம். நான் கவியரசியின் AI மற்றும் மெஷின் லெர்னிங் போர்ட்ஃபோலியோவிற்கு உங்களை வரவேற்கிறேன்.",
        "ta-IN"
      );

      return;
    }


    /* -------------------------------------------------------
       HINDI
       ------------------------------------------------------- */

    if (
      text.includes("hindi") ||
      text.includes("हिंदी")
    ) {
      speak(
        "नमस्ते। यह कवियारसी का AI और मशीन लर्निंग पोर्टफोलियो है।",
        "hi-IN"
      );

      return;
    }


    /* -------------------------------------------------------
       ENGLISH
       ------------------------------------------------------- */

    if (
      text.includes("english")
    ) {
      speak(
        "Hello. Welcome to Kaviyarasi's AI and machine learning portfolio.",
        "en-IN"
      );

      return;
    }


    /* -------------------------------------------------------
       GREETING
       ------------------------------------------------------- */

    if (
      text.includes("hello") ||
      text.includes("hi") ||
      text.includes("hey")
    ) {
      speak(
        "Hello! How can I help you explore Kaviyarasi's portfolio?"
      );

      return;
    }


    /* -------------------------------------------------------
       DEFAULT
       ------------------------------------------------------- */

    speak(
      "I can help you navigate projects, experience, skills, certifications, education, contact, GitHub, LinkedIn and the resume."
    );
  }


  /* =======================================================
     GO TO SECTION
     ======================================================= */

  function goToSection(sectionId) {
    const section =
      document.getElementById(sectionId);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  }


  /* =======================================================
     VOICE STATUS
     ======================================================= */

  function updateVoiceStatus(message) {
    if (voiceStatus) {
      voiceStatus.textContent = message;
    }
  }


  /* =======================================================
     TEXT TO SPEECH
     ======================================================= */

  function speak(text, language = "en-IN") {
    if (!("speechSynthesis" in window)) {
      return;
    }

    window.speechSynthesis.cancel();

    const utterance =
      new SpeechSynthesisUtterance(text);

    utterance.lang = language;
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.volume = 1;

    /*
     * Try to select an appropriate voice.
     */

    const voices =
      window.speechSynthesis.getVoices();

    const matchingVoice =
      voices.find(
        (voice) =>
          voice.lang.toLowerCase() ===
          language.toLowerCase()
      );

    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    window.speechSynthesis.speak(
      utterance
    );
  }


  /* =======================================================
     LOAD AVAILABLE SPEECH VOICES
     ======================================================= */

  if ("speechSynthesis" in window) {
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };
  }


  /* =======================================================
     TYPING EFFECT
     ======================================================= */

  /* =======================================================
   TYPING EFFECT
   ======================================================= */

const typingElement = document.querySelector(
  ".typing-text, .typed-text, [data-typing]"
);

if (typingElement) {

  const roles = [
    "AI/ML Engineer",
    "AI Developer",
    "NLP Enthusiast",
    "Python Developer"
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  const typeSpeed = 100;
  const deleteSpeed = 60;
  const pauseTime = 1500;

  function typeEffect() {

    const currentRole = roles[roleIndex];

    // Typing
    if (!isDeleting) {

      typingElement.textContent =
        currentRole.substring(0, charIndex + 1);

      charIndex++;

      // Finished typing the word
      if (charIndex >= currentRole.length) {

        isDeleting = true;

        setTimeout(typeEffect, pauseTime);

        return;
      }

      setTimeout(typeEffect, typeSpeed);

    }

    // Deleting
    else {

      typingElement.textContent =
        currentRole.substring(0, charIndex - 1);

      charIndex--;

      // Finished deleting
      if (charIndex <= 0) {

        charIndex = 0;
        isDeleting = false;

        roleIndex =
          (roleIndex + 1) % roles.length;

        setTimeout(typeEffect, 300);

        return;
      }

      setTimeout(typeEffect, deleteSpeed);
    }
  }

  // Start typing
  typeEffect();

} else {

  console.warn(
    "Typing effect: .typing-text element was not found."
  );
}

  /* =======================================================
     CURRENT YEAR
     ======================================================= */

  const yearElements =
    document.querySelectorAll(
      "#current-year, .current-year"
    );

  yearElements.forEach((element) => {
    element.textContent =
      new Date().getFullYear();
  });


  /* =======================================================
     BACK TO TOP
     ======================================================= */

  const backToTop =
    document.querySelector(
      "#back-to-top, .back-to-top"
    );

  if (backToTop) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 500) {
        backToTop.classList.add("show");
      } else {
        backToTop.classList.remove("show");
      }
    });

    backToTop.addEventListener(
      "click",
      () => {
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      }
    );
  }


  /* =======================================================
     PROJECT FILTERS
     ======================================================= */

  const filterButtons =
    document.querySelectorAll(
      "[data-filter]"
    );

  const filterCards =
    document.querySelectorAll(
      "[data-category]"
    );

  if (
    filterButtons.length &&
    filterCards.length
  ) {
    filterButtons.forEach((button) => {
      button.addEventListener(
        "click",
        () => {
          const filter =
            button.dataset.filter;

          filterButtons.forEach(
            (btn) =>
              btn.classList.remove(
                "active"
              )
          );

          button.classList.add("active");

          filterCards.forEach((card) => {
            const category =
              card.dataset.category;

            if (
              filter === "all" ||
              category === filter
            ) {
              card.style.display = "";
            } else {
              card.style.display = "none";
            }
          });
        }
      );
    });
  }


  /* =======================================================
     EXTERNAL LINKS
     ======================================================= */

  document
    .querySelectorAll(
      'a[target="_blank"]'
    )
    .forEach((link) => {
      link.setAttribute(
        "rel",
        "noopener noreferrer"
      );
    });


  /* =======================================================
     CONSOLE MESSAGE
     ======================================================= */

  console.log(
    "%cKaviyarasi E | AI/ML Engineer",
    "font-size: 18px; font-weight: bold;"
  );

  console.log(
    "Portfolio loaded successfully."
  );
});