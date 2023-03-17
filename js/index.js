console.log("index");
//SECTION-START: QUERRY SELECTOR

const loginCard = document.getElementById("login-card");
const signupCard = document.getElementById("signup-card");
//SECTION-START: QUERRY SELECTOR

//SECTION-START: EVENT LISITONERS
loginCard.addEventListener("click", (e) => {
  window.location.href = "../login.html";
});
signupCard.addEventListener("click", (e) => {
  window.location.href = "../register.html";
});
//SECTION-START: EVENT LISITONERS
