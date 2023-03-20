//SECTION-START: DOCUMENT QUERRY SELECTORS
const error = document.querySelector(".err");
const Loading = document.getElementById("loader");
const Content = document.getElementById("content");

const username = document.getElementById("username");
const password = document.getElementById("password");
const loginButton = document.querySelector(".Login-button");
const errorMessage = document.querySelector(".err");

//SECTION-END: DOCUMENT QUERRY SELECTORS

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

const LoginUser = (username, password) => {
  var data = {
    username,
    password,
  };
  console.log("asdsd");

  $.ajax({
    url: "/php/login.php",
    method: "POST",
    data: data,
    success: (response) => {
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
      showLoader(false);
      // console.log(localStorage.getItem(JSON.parse(data)));
    },
    error: (jqXHR, textStatus, errorThrown) => {
      console.error("Error:", textStatus, errorThrown);
      showLoader(false);
    },
  });
};

//SECTION-START: EVENT LISTITONERS

loginButton.addEventListener("click", (e) => {
  e.preventDefault();

  const usernameValue = username.value;
  const passwordValue = password.value;
  showLoader(true);
  LoginUser(usernameValue, passwordValue);

  console.log("hlo");
});
//SECTION-END: EVENT LISTITONERS
