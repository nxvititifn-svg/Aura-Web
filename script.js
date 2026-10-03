/**
 * AuraWeb Landing Page - JavaScript
 * - Smooth Scroll & აქტიური ნავიგაციის ბმულების მართვა
 * - მობილური მენიუს ტოგლი (Hamburger Menu)
 * - ჰედერის ეფექტი სქროლვისას
 * - საკონტაქტო ფორმის ვალიდაცია და გაგზავნა
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM ელემენტების ინიციალიზაცია
  const header = document.getElementById('header');
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const contactForm = document.getElementById('contactForm');
  const formFeedback = document.getElementById('formFeedback');
  const submitBtn = document.getElementById('submitBtn');

  /* ============================================================
     1. მობილური მენიუ (Hamburger Menu Toggle)
     ============================================================ */
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      mobileToggle.classList.toggle('active', isOpen);
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    // მენიუს დახურვა ბმულზე დაკლიკებისას
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', false);
      });
    });

    // მენიუს დახურვა ეკრანის გარეთ დაკლიკებისას
    document.addEventListener('click', (e) => {
      if (
        navMenu.classList.contains('open') &&
        !navMenu.contains(e.target) &&
        !mobileToggle.contains(e.target)
      ) {
        navMenu.classList.remove('open');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', false);
      }
    });
  }

  /* ============================================================
     2. ჰედერის ფონის ცვლილება სქროლვისას
     ============================================================ */
  const handleHeaderScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  /* ============================================================
     3. Smooth Scroll ნავიგაციისთვის (Header Offset-ის გათვალისწინებით)
     ============================================================ */
  const internalAnchors = document.querySelectorAll('a[href^="#"]');

  internalAnchors.forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();

        const headerHeight = header.offsetHeight;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  /* ============================================================
     4. აქტიური სექციის მონიშვნა ნავიგაციაში (Active Link Highlighting)
     ============================================================ */
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => {
    sectionObserver.observe(section);
  });

  /* ============================================================
     5. საკონტაქტო ფორმის ვალიდაცია & გაგზავნა
     ============================================================ */
  if (contactForm) {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const messageError = document.getElementById('messageError');

    // ელ-ფოსტის რეგექსის შემოწმება
    const isValidEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email.trim());
    };

    // შეყვანის ველის შემოწმების ლოგიკა
    const validateField = (input, errorEl, condition) => {
      if (condition) {
        input.classList.remove('invalid');
        errorEl.classList.remove('visible');
        return true;
      } else {
        input.classList.add('invalid');
        errorEl.classList.add('visible');
        return false;
      }
    };

    // Real-time input listeners
    nameInput.addEventListener('input', () => {
      validateField(nameInput, nameError, nameInput.value.trim().length >= 2);
    });

    emailInput.addEventListener('input', () => {
      validateField(emailInput, emailError, isValidEmail(emailInput.value));
    });

    messageInput.addEventListener('input', () => {
      validateField(messageInput, messageError, messageInput.value.trim().length >= 10);
    });

    // ფორმის გაგზავნის დამუშავება
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const isNameValid = validateField(nameInput, nameError, nameInput.value.trim().length >= 2);
      const isEmailValid = validateField(emailInput, emailError, isValidEmail(emailInput.value));
      const isMessageValid = validateField(messageInput, messageError, messageInput.value.trim().length >= 10);

      if (!isNameValid || !isEmailValid || !isMessageValid) {
        showFeedback('გთხოვთ სწორად შეავსოთ ყველა აუცილებელი ველი!', 'error');
        return;
      }

      // ღილაკის Loading მდგომარეობა
      const btnText = submitBtn.querySelector('.btn-text');
      const btnLoader = submitBtn.querySelector('.btn-loader');
      
      submitBtn.disabled = true;
      btnText.textContent = 'იგზავნება...';
      btnLoader.style.display = 'inline-block';

      // იმიტირებული გაგზავნა (Mock API Request)
      setTimeout(() => {
        submitBtn.disabled = false;
        btnText.textContent = 'შეტყობინების გაგზავნა';
        btnLoader.style.display = 'none';

        // წარმატების შეტყობინება
        showFeedback(`გმადლობთ, ${nameInput.value.trim()}! თქვენი შეტყობინება წარმატებით გაიგზავნა.`, 'success');
        
        // ფორმის გასუფთავება
        contactForm.reset();
        nameInput.classList.remove('invalid');
        emailInput.classList.remove('invalid');
        messageInput.classList.remove('invalid');

        // შეტყობინების ავტომატური გაქრობა 6 წამში
        setTimeout(() => {
          formFeedback.style.display = 'none';
        }, 6000);
      }, 1000);
    });

    function showFeedback(message, type) {
      formFeedback.textContent = message;
      formFeedback.className = `form-feedback ${type}`;
      formFeedback.style.display = 'block';
    }
  }
});
