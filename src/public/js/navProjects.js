document.addEventListener("DOMContentLoaded", () => {
    const projectModals = document.querySelectorAll(".project-popup");
  
    document.querySelectorAll(".project").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
  
        const currentId = parseInt(button.getAttribute("data-id"));
        const direction = button.getAttribute("data-direction");
        let newId;
  
        if (direction === "next") {
          newId = (currentId + 1) % projectModals.length;
        } else {
          newId = (currentId - 1 + projectModals.length) % projectModals.length;
        }
  
        const newModal = projectModals[newId];
  
        $.magnificPopup.close();
        
        setTimeout(() => {
          $.magnificPopup.open({
            items: {
              src: newModal,
            },
            type: "inline",
          });
        }, 300); // Delay to ensure the current popup closes before opening the new one
      });
    });
  });
  