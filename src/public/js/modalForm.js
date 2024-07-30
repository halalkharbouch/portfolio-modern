document.addEventListener("DOMContentLoaded", () => {
  setupModalFormHandlers();
});

function setupModalFormHandlers() {
  const modalForms = document.querySelectorAll('form[id^="form-modal"]');

  modalForms.forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const formId = form.id;
      const name = document.querySelector(`#${formId} #name-${formId}`).value;
      const email = document.querySelector(
        `#${formId} #semail-${formId}`
      ).value;
      const message = document.querySelector(
        `#${formId} #smessage-${formId}`
      ).value;

      if (!validateFormInputs(name, email, message)) {
        return;
      }

      showLoadingOverlay();

      try {
        const response = await postFormData({ name, email, message, formId });
        if (response.ok) {
          toastr.success(
            "Thank You For Contacting Us. We will get back to you shortly.",
            "Success"
          );
          form.reset(); // Clear the form fields
        } else {
          const result = await response.json();
          toastr.error(result.message || "Failed to send message.", "Error");
        }
      } catch (error) {
        toastr.error("An error occurred: " + error.message, "Error");
        console.error("Error sending message: ", error);
      } finally {
        hideLoadingOverlay();
      }
    });
  });
}

function validateFormInputs(name, email, message) {
  if (!name || !email || !message) {
    toastr.error("Please fill in all the required fields.", "Validation Error");
    return false;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    toastr.error("Please enter a valid email address.", "Validation Error");
    return false;
  }

  return true;
}

async function postFormData({ name, email, message, formId }) {
  return fetch("/send-mail", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      firstName: name,
      lastName: "N/A",
      email,
      message,
      service: formId,
      phone: "N/A",
    }),
  });
}

function showLoadingOverlay() {
  document.getElementById("overlay").style.display = "block";
  document.getElementById("spinner").style.display = "block";
}

function hideLoadingOverlay() {
  document.getElementById("overlay").style.display = "none";
  document.getElementById("spinner").style.display = "none";
}
