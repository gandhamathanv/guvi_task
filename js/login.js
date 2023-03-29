//SECTION-START: DOCUMENT QUERRY SELECTORS
const error = document.querySelector(".err");
const Loading = document.getElementById("loader");
const Content = document.getElementById("content");

const username = document.getElementById("username");
const password = document.getElementById("password");
const loginButton = document.querySelector(".Login-button");
const errorMessage = document.querySelector(".err");

//SECTION-END: DOCUMENT QUERRY SELECTORS

//SECTION-START: BASIC FUNCTIONS

errorMessage.style.display = "none";
const showLoader = (loader) => {
  if (loader) {
    Content.classList.add("Hidden");
    Loading.classList.remove("Hidden");
  } else {
    Loading.classList.add("Hidden");
    Content.classList.remove("Hidden");
  }
};

//SECTION-END: BASIC FUNCTIONS

//SECTION-START: AJAX CALLS

const LoginUser = (username, password) => {
  // DATA SEND WITH THE AJAX CALL
  // USERNAME AND PASSWORD
  var data = {
    username,
    password,
  };
  // AJAX CALL TO LOGIN USER WITH USING JQUERY
  // URL: {{BASEURL}}/php/login.php
  // METHOD :POST
  $.ajax({
    url: "/php/login.php",
    method: "POST",
    data: data,
    success: (response) => {
      // Handle the response from the server
      console.log("Response:", response);
      // DISCRUCTORING THE RESPONSE TO STATUS,MESSAGE,DATA,SESSION_ID
      const { status, message, data, session_id } = response;

      if (status) {
        // IF THE STATUS IS TRUE THEN THE THREE VARIABLES ARE SET ON LOCALSTORAGE WHICH ARE THE REFERENCE VARIABLE ISLOGIN, SESSION_ID WHICH IS THE ID THAT RETURN FROM THE REDIS AND THE USERNAME FOR QUICK ACCESS
        localStorage.setItem("isLogin", true);
        localStorage.setItem("session_id", session_id);
        localStorage.setItem("username", data.username);
        // AFTER LOGIN THE PAGE IS REDIRECTED TO THE PROFILE PAGE
        window.location.href = "/profile.html";
      } else {
        // ON ERROR THEN THE MESSAGE FROM THE RESPONSE IS STORED ON THE ERRORMESSAGE ON THE UI
        errorMessage.innerHTML = response.message;
        errorMessage.style.display = "flex";
      }
      // SETTING THE LOADER TO FALSE TO VIEW THE PAGE
      showLoader(false);
    },
    error: (jqXHR, textStatus, errorThrown) => {
      // IF THERE IS A ERROR IN THE SERVER (IE) INTERNAL SERVER SUCH AS 400(BAD REQUEST),401(UNAUTHORIZED),403(FORBIDDEN),404(PAGE NOT FOUND),500(INTERNAL SERVER ERROR)
      console.error("Error:", textStatus, errorThrown);
      showLoader(false);
    },
  });
};

//SECTION-START: AJAX CALLS

//SECTION-START: EVENT LISTITONERS

// EVENT LISITONER FOR LOGIN BUTTON
loginButton.addEventListener("click", (e) => {
  //PREVENT DEFAULT EVENT TO RESTRICT AUTO SUBMIT EVENT
  e.preventDefault();
  // GETTING DATA FROM THE QUERRY SELECTORS
  const usernameValue = username.value;
  const passwordValue = password.value;
  // SETTING THE LOADER TO TRUE TO VIEW THE LOADER
  showLoader(true);
  // CALLING THE AJAX FUNCTION FOR LOGIN THE USER WITH USERNAME AND PASSWORD
  LoginUser(usernameValue, passwordValue); //REF-LINE NO: 30
});
//SECTION-END: EVENT LISTITONERS
