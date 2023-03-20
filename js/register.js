const Loading = document.getElementById("loader");
const Content = document.getElementById("content");

// SECTION-START: DOCUMENT SELECTORS
const username = document.getElementById("username");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirm-password");
const loginButtton = document.querySelector(".Login-button");
const errorMessage = document.querySelector(".err");

//SECTION-END: DOCUMENT QUERRY SELECTORS

errorMessage.style.display = "none";

// SECTION-START: FUNCTIONS
const showLoader = (loader) => {
  if (loader) {
    Content.classList.add("Hidden");
    Loading.classList.remove("Hidden");
  } else {
    Loading.classList.add("Hidden");
    Content.classList.remove("Hidden");
  }
};

const validateUserName = (value) => {
  if (value == "") return false;
  return true;
};
const validatePassword = (value) => {
  if (value == "") return false;
  return true;
};
// SECTION-END: FUNCTIONS

//SECTION-START: AJAX CALL

const registerUser = (username, password) => {
  var data = {
    action: "create",
    username,
    password,
  };
  $.ajax({
    url: "/php/register.php",
    method: "POST",
    data: data,
    success: function (response) {
      // Handle the response from the server
      console.log("Response:", response);
      const { status, message, data, session_id } = response;
      if (status) {
        localStorage.setItem("isLogin", true);
        localStorage.setItem("session_id", session_id);
        localStorage.setItem("username", data.username);
        window.location.href = "/profile.html";
      } else {
        errorMessage.innerHTML = response.message;
        errorMessage.style.display = "flex";
      }
      // window.location.href = "../login.html";
      showLoader(false);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      // Handle any errors that occurred during the request
      console.error("Error:", textStatus, errorThrown);
      showLoader(false);
    },
  });
};

//SECTION-END: AJAX CALL

//SECTION-START: EVENT LISITONERS

loginButtton.addEventListener("click", (e) => {
  console.log("buttonclick");
  const usernameValue = username.value;
  const passwordValue = password.value;
  const confirmPasswordValue = confirmPassword.value;
  console.log(validateUserName(usernameValue));
  console.log(validatePassword(passwordValue));
  showLoader(true);
  registerUser(usernameValue, passwordValue);
  e.preventDefault();
});
//SECTION-END: EVENT LISITONERS
