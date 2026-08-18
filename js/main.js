/**
 * PetKeeper Web JavaScript
 * Navigation, dynamic dates, and Account Deletion form handling
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('show');
      const isExpanded = navMenu.classList.contains('show');
      mobileToggle.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        navMenu.classList.remove('show');
      }
    });
  }

  // 2. Set Current Year in Footer
  const yearSpan = document.getElementById('current-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // 3. Highlight Current Active Nav Link
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // 4. Account Deletion Form Handling
  const deleteForm = document.getElementById('account-deletion-form');
  const formStatus = document.getElementById('form-status');
  const directMailBtn = document.getElementById('direct-mail-btn');

  // Direct Mailto Trigger helper
  function triggerMailtoFallback(emailVal, petNameVal, reasonVal) {
    const subject = encodeURIComponent(`PetKeeper Account Deletion Request - ${emailVal}`);
    const body = encodeURIComponent(
      `Hello Forneex PetKeeper Support,\n\n` +
      `I am requesting the permanent deletion of my PetKeeper account and all associated personal and pet data.\n\n` +
      `Account Email: ${emailVal}\n` +
      `Pet Name(s) / Account Identifier: ${petNameVal || 'Not specified'}\n` +
      `Reason (Optional): ${reasonVal || 'Not specified'}\n\n` +
      `I understand that this action will purge my pet profiles, medical timelines, documents, and cloud sync records within 30 days.\n\n` +
      `Thank you.`
    );
    window.location.href = `mailto:haideralidev258@gmail.com?subject=${subject}&body=${body}`;
  }

  if (directMailBtn) {
    directMailBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const emailInput = document.getElementById('account-email');
      const petNameInput = document.getElementById('pet-identifier');
      const reasonInput = document.getElementById('deletion-reason');

      const emailVal = emailInput ? emailInput.value.trim() : '';
      const petNameVal = petNameInput ? petNameInput.value.trim() : '';
      const reasonVal = reasonInput ? reasonInput.value.trim() : '';

      triggerMailtoFallback(emailVal, petNameVal, reasonVal);
    });
  }

  if (deleteForm) {
    deleteForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const emailInput = document.getElementById('account-email');
      const petNameInput = document.getElementById('pet-identifier');
      const reasonInput = document.getElementById('deletion-reason');
      const confirmCheck = document.getElementById('confirm-deletion');
      const submitBtn = document.getElementById('submit-btn');

      if (!emailInput || !emailInput.value.trim()) {
        showStatus('Please enter the email address associated with your PetKeeper account.', 'error');
        if (emailInput) emailInput.focus();
        return;
      }

      if (confirmCheck && !confirmCheck.checked) {
        showStatus('Please check the confirmation box acknowledging permanent data deletion.', 'error');
        if (confirmCheck) confirmCheck.focus();
        return;
      }

      const emailVal = emailInput.value.trim();
      const petNameVal = petNameInput ? petNameInput.value.trim() : '';
      const reasonVal = reasonInput ? reasonInput.value.trim() : '';

      // Prepare submission state
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting Request...';
      }

      // Check if form has a valid action configured
      const formAction = deleteForm.getAttribute('action');
      const isEndpointConfigured = formAction && formAction.startsWith('https://');

      if (isEndpointConfigured) {
        try {
          const formData = new FormData(deleteForm);
          const response = await fetch(formAction, {
            method: 'POST',
            body: formData,
            headers: {
              Accept: 'application/json',
            },
          });

          if (response.ok) {
            showStatus(
              '✓ Your account deletion request has been submitted successfully. Our engineering team will verify and permanently purge your account records within 30 days. A confirmation notification has been sent.',
              'success'
            );
            deleteForm.reset();
          } else {
            throw new Error('Server responded with status ' + response.status);
          }
        } catch (err) {
          console.warn('Form submission endpoint error, offering mailto fallback:', err);
          showStatus(
            'We encountered a network delay with web submission. Opening your email client to send your deletion request directly to haideralidev258@gmail.com...',
            'error'
          );
          setTimeout(() => {
            triggerMailtoFallback(emailVal, petNameVal, reasonVal);
          }, 1200);
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Deletion Request';
          }
        }
      } else {
        // No external webhook configured yet -> seamlessly use client email dispatch
        showStatus(
          '✓ Thank you! Opening your email client to dispatch the deletion request directly to the Forneex Data Protection Team...',
          'success'
        );
        setTimeout(() => {
          triggerMailtoFallback(emailVal, petNameVal, reasonVal);
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Deletion Request';
          }
        }, 800);
      }
    });
  }

  function showStatus(message, type) {
    if (!formStatus) return;
    formStatus.textContent = message;
    formStatus.className = 'form-status ' + type;
    formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
});
