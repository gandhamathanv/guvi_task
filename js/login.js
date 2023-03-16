//SECTION-START: DOCUMENT QUERRY SELECTORS

const username = document.getElementById("username");
const password = document.getElementById("password");
const loginButton = document.querySelector(".Login-button");
const errorMessage = document.querySelector(".err");

//SECTION-END: DOCUMENT QUERRY SELECTORS

const LoginUser = (username, password) => {
  var data = {
    username,
    password,
  };
  $.ajax({
    url: "/php/login.php",
    method: "POST",
    data: data,
    success: (response) => {
      // Handle the response from the server
      console.log("Response:", response);
      const { status, message, data, encode } = response;
      if (status) {
        localStorage.setItem("isLogin", true);
        localStorage.setItem("token", encode);
        window.location.href = "/profile.html";
      } else {
        errorMessage.innerHTML = "error";
      }
      console.log(localStorage.getItem(JSON.parse(data)));
    },
    error: (jqXHR, textStatus, errorThrown) => {
      console.error("Error:", textStatus, errorThrown);
    },
  });
};

//SECTION-START: EVENT LISTITONERS

loginButton.addEventListener("click", (e) => {
  e.preventDefault();
  console.log("login button");
  const usernameValue = username.value;
  const passwordValue = password.value;
  LoginUser(usernameValue, passwordValue);
});
//SECTION-END: EVENT LISTITONERS