/* Interior pages: WPForms-style local demos (info card + contact form). */
(function () {
  "use strict";

  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function attach(form) {
    var nameField = form.querySelector('input[name="name"]');
    var emailField = form.querySelector('input[name="email"]');
    var messageField = form.querySelector('[name="message"]');
    var consentField = form.querySelector('input[name="consent"]');
    var honeypot = form.querySelector('input[name="website"]');
    var status = form.querySelector(".form-status");

    var fields = [nameField, emailField, messageField, consentField].filter(Boolean);

    function setStatus(message, isError) {
      if (!status) return;
      status.textContent = message;
      status.classList.toggle("is-error", Boolean(isError));
    }

    fields.forEach(function (field) {
      var evt = field.type === "checkbox" ? "change" : "input";
      field.addEventListener(evt, function () {
        field.removeAttribute("aria-invalid");
        if (status && status.classList.contains("is-error")) setStatus("", false);
      });
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      if (honeypot && honeypot.value.trim()) return;

      var invalid = null;
      if (nameField && !nameField.value.trim()) {
        nameField.setAttribute("aria-invalid", "true");
        invalid = invalid || nameField;
      }
      if (emailField && !EMAIL.test(emailField.value.trim())) {
        emailField.setAttribute("aria-invalid", "true");
        invalid = invalid || emailField;
      }
      if (messageField && !messageField.value.trim()) {
        messageField.setAttribute("aria-invalid", "true");
        invalid = invalid || messageField;
      }
      if (consentField && !consentField.checked) {
        consentField.setAttribute("aria-invalid", "true");
        invalid = invalid || consentField;
      }

      if (invalid) {
        setStatus(
          consentField === invalid
            ? "Please tick the box to receive free info."
            : "Please check the highlighted fields.",
          true
        );
        invalid.focus();
        return;
      }

      var firstName = nameField ? nameField.value.trim().split(/\s+/)[0] : "";
      var greeting = "Thanks" + (firstName ? ", " + firstName : "") + "!";
      setStatus(
        messageField
          ? greeting + " Your message has been noted."
          : greeting + " We'll send the free info to " + (emailField ? emailField.value.trim() : "") + ".",
        false
      );
      form.reset();
    });
  }

  var forms = document.querySelectorAll("[data-info-form], [data-contact-form]");
  Array.prototype.forEach.call(forms, attach);
})();
