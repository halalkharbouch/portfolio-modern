document.addEventListener("DOMContentLoaded", () => {
  initializeToastrOptions();
  loadSavedCommentDetails();
  restoreCheckboxState();
  setupCommentFormSubmitHandler();
});

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
    timeOut: "5000",
    extendedTimeOut: "1000",
    showEasing: "swing",
    hideEasing: "linear",
    showMethod: "fadeIn",
    hideMethod: "fadeOut",
  };
}

function loadSavedCommentDetails() {
  const savedAuthor = localStorage.getItem("commentAuthor");
  const savedAuthorEmail = localStorage.getItem("commentAuthorEmail");
  const savedAuthorWebsite = localStorage.getItem("commentAuthorWebsite");

  if (savedAuthor) document.getElementById("author").value = savedAuthor;
  if (savedAuthorEmail)
    document.getElementById("email").value = savedAuthorEmail;
  if (savedAuthorWebsite)
    document.getElementById("url").value = savedAuthorWebsite;
}

function restoreCheckboxState() {
  const saveCommentDetails = localStorage.getItem("saveCommentDetails");
  document.getElementById("save-comment-details").checked =
    saveCommentDetails === "true";
}

function setupCommentFormSubmitHandler() {
  document
    .getElementById("comment-form")
    .addEventListener("submit", async (event) => {
      event.preventDefault();

      const saveCommentDetailsCheckbox = document.getElementById(
        "save-comment-details"
      );
      const saveCommentDetails = saveCommentDetailsCheckbox.checked;

      const commentDetails = getCommentDetails();

      if (!validateInputs(commentDetails)) {
        return;
      }

      if (saveCommentDetails) {
        saveCommentDetailsToLocalStorage(commentDetails);
        localStorage.setItem("saveCommentDetails", "true");
      } else {
        localStorage.removeItem("commentAuthor");
        localStorage.removeItem("commentAuthorEmail");
        localStorage.removeItem("commentAuthorWebsite");
        localStorage.setItem("saveCommentDetails", "false");
      }

      showLoadingOverlay();

      try {
        const response = await postComment(commentDetails);
        if (!response.ok) throw new Error("Failed to add comment");

        const result = await response.json();
        addCommentToDom(result);

        toastr.success("Comment added successfully.", "Success");
      } catch (error) {
        toastr.error("An error occurred while adding the comment.", "Error");
        console.error("Error adding comment: ", error);
      } finally {
        hideLoadingOverlay();
      }
    });
}

function getCommentDetails() {
  return {
    commentAuthor: document.getElementById("author").value,
    commentAuthorEmail: document.getElementById("email").value,
    commentAuthorWebsite: document.getElementById("url").value,
    commentText: document.getElementById("comment").value,
    blogId: document.getElementById("blog-data").getAttribute("data-blog-id"),
  };
}

function validateInputs({ commentAuthor, commentAuthorEmail, commentText }) {
  if (!commentAuthor || !commentText) {
    toastr.error("Please fill in all the required fields.", "Validation Error");
    return false;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (commentAuthorEmail !== "" && !emailPattern.test(commentAuthorEmail)) {
    toastr.error("Please enter a valid email address.", "Validation Error");
    return false;
  }

  return true;
}

function saveCommentDetailsToLocalStorage({
  commentAuthor,
  commentAuthorEmail,
  commentAuthorWebsite,
}) {
  if (!localStorage.getItem("commentAuthor")) {
    localStorage.setItem("commentAuthor", commentAuthor);
  }
  if (!localStorage.getItem("commentAuthorEmail")) {
    localStorage.setItem("commentAuthorEmail", commentAuthorEmail);
  }
  if (!localStorage.getItem("commentAuthorWebsite")) {
    localStorage.setItem("commentAuthorWebsite", commentAuthorWebsite);
  }
}

function showLoadingOverlay() {
  document.getElementById("overlay").style.display = "block";
  document.getElementById("spinner").style.display = "block";
}

function hideLoadingOverlay() {
  document.getElementById("overlay").style.display = "none";
  document.getElementById("spinner").style.display = "none";
}

async function postComment({
  commentAuthor,
  commentAuthorEmail,
  commentAuthorWebsite,
  commentText,
  blogId,
}) {
  return fetch(`/blog/add-comment/${blogId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      commentAuthor,
      commentAuthorEmail,
      commentAuthorWebsite,
      commentText,
    }),
  });
}

function addCommentToDom(newComment) {
  const commentLists = document.getElementById("comments-list");
  const commentDiv = document.createElement("li");
  commentDiv.classList.add("tj__comment");
  commentDiv.id = `comment-${newComment._id}`;
  commentDiv.innerHTML = `
    <div class="tj-comment__wrap">
      <div class="comment__avatar">
        <img alt="" src="https://robohash.org/${newComment._id}">
      </div>
      <div class="comment__text">
        <div class="avatar__name">
          <h5><a href="">${newComment.commentAuthor}</a></h5>
          <span>${newComment.formattedDate}</span>
        </div>
        <p>${newComment.commentText}</p>
        <div class="comment__reply">
          <a class="comment-reply-link" href="#">Reply</a>
        </div>
      </div>
    </div>
  `;
  commentLists.appendChild(commentDiv);

  document.getElementById("comment").value = "";
}
