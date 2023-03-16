//SECTION-START: QUERRY SELECTORS
const currentUserSelector = document.querySelector(".current-user-name");
const UserGivenName = document.getElementById("user-give-name");
const updateButton = document.querySelector(".update-button");
//SECTION-END: QUERRY SELECTORS

//SECTION-START: AJAX CALL

const UpdateUserDetails = (data) => {
  $.ajax({
    url: "/php/update.php",
    method: "POST",
    data: data,
    success: (response) => {
      console.log("Response:", response);
    },
    error: (jqXHR, textStatus, errorThrown) => {
      console.error("Error:", textStatus, errorThrown);
    },
  });
};
const GetUserDetails = (data) => {
  $.ajax({
    url: "/php/profile.php",
    method: "GET",
    data: data,
    success: (response) => {
      console.log("Response:", response);
    },
    error: (jqXHR, textStatus, errorThrown) => {
      console.error("Error:", textStatus, errorThrown);
    },
  });
};

//SECTION-START: AJAX CALL

//SECTION-START: EVENT LISITONERS
window.addEventListener("load", () => {
  const isLogin = Boolean(localStorage.getItem("isLogin"));
  console.log(isLogin);
  if (isLogin) {
    const data = localStorage.getItem("token");
    console.log(data);
    GetUserDetails({ token: data });
    currentUserSelector.innerHTML = data;
  } else {
    alert("login to continue");
    window.location.href = "/login.html";
  }
});
updateButton.addEventListener("click", (e) => {
  e.preventDefault();

  console.log("update");
  UpdateUserDetails({
    details: {
      name: "sdsd",
      email: "userer",
    },
  });
});

//SECTION-END: EVENT LISITONERS
