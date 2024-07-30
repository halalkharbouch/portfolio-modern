document.addEventListener("DOMContentLoaded", () => {
    initializeToastrOptions();
    setupContactFormSubmitHandler();
  });
  
  function setupContactFormSubmitHandler() {
    const contactForm = document.getElementById("contact-form-id");
    if (contactForm) {
      contactForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        showLoadingOverlay();
  
        const formData = getContactFormDetails();
  
        if (!validateContactFormInputs(formData)) {
          return;
        }
  
        try {
          const response = await postContactForm(formData);
          if (!response.ok) throw new Error("Failed to send message");
  
          const result = await response.json();
          if (result.success) {
            hideLoadingOverlay();
            clearContactFormFields();
            toastr.success(
              "Thank You For Contacting Us. We will get back to you shortly.",
              "Success"
            );
          } else {
            hideLoadingOverlay();
            toastr.error("Error: " + result.message, "Error");
          }
        } catch (error) {
          hideLoadingOverlay();
          toastr.error("An error occurred: " + error.message, "Error");
          console.error("Error sending message: ", error);
        }
      });
    }
  }
  
  function getContactFormDetails() {
    return {
      lastName: document.getElementById("conLName").value,
      firstName: document.getElementById("conName").value,
      email: document.getElementById("conEmail").value,
      phone: document.getElementById("conPhone").value,
      service: document.getElementById("conService").value,
      message: document.getElementById("conMessage").value,
    };
  }
  
  function validateContactFormInputs({ lastName, firstName, email, message }) {
    if (!lastName || !firstName || !email || !message) {
      hideLoadingOverlay();
      toastr.error("Please fill in all the required fields.", "Validation Error");
      return false;
    }
  
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email !== "" && !emailPattern.test(email)) {
      toastr.error("Please enter a valid email address.", "Validation Error");
      return false;
    }
  
    return true;
  }
  
  async function postContactForm({
    lastName,
    firstName,
    email,
    phone,
    service,
    message,
  }) {
    return fetch("/send-mail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lastName,
        firstName,
        email,
        phone,
        service,
        message,
      }),
    });
  }
  
  function initializeToastrOptions() {
    toastr.options = {
      closeButton: true,
      debug: false,
      newestOnTop: false,
      progressBar: true,
      positionClass: "toast-top-right",
      preventDuplicates: false,
      onclick: null,
      showDuration: "300",
      hideDuration: "1000",
      timeOut: "0",  // Set to 0 for infinite duration
      extendedTimeOut: "0",  // Set to 0 for infinite duration
      showEasing: "swing",
      hideEasing: "linear",
      showMethod: "fadeIn",
      hideMethod: "fadeOut",
    };
  }
  
  function showLoadingOverlay() {
    document.getElementById("overlay").style.display = "block";
    document.getElementById("spinner").style.display = "block";
  }
  
  function hideLoadingOverlay() {
    document.getElementById("overlay").style.display = "none";
    document.getElementById("spinner").style.display = "none";
  }
  
  function clearContactFormFields() {
    document.getElementById("conLName").value = "";
    document.getElementById("conName").value = "";
    document.getElementById("conEmail").value = "";
    document.getElementById("conPhone").value = "";
    document.getElementById("conService").value = "";
    document.getElementById("conMessage").value = "";
  }
  