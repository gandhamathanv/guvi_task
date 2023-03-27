const Loading = document.getElementById("loader");
const Content = document.getElementById("content");

const showLoader = (loader) => {
  if (loader) {
    Content.classList.add("Hidden");
    Loading.classList.remove("Hidden");
  } else {
    Loading.classList.add("Hidden");
    Content.classList.remove("Hidden");
  }
};
const Storage = {};
//SECTION-START: QUERRY SELECTORS

const DisplayUsername = document.getElementById("username");

const currentUserSelector = document.getElementById("current-user-name");
const UserGivenName = document.getElementById("user-given-name");
const UserPhoneNumber = document.getElementById("user-phone-number");
const UserAge = document.getElementById("user-age");
const UserEmail = document.getElementById("user-email");
const UserDOB = document.getElementById("user-dob");
const updateButton = document.querySelector(".update-button");
const logoutButton = document.querySelector("#logout-btn");
//SECTION-END: QUERRY SELECTORS

//SECTION-START: AJAX CALL

const UpdateUserDetails = (data) => {
  data.action = "update";
  data.redisID = localStorage.getItem("session_id");
  console.log(data);
  showLoader(true);
  $.ajax({
    url: "/php/register.php",
    method: "POST",
    data: data,
    success: (response) => {
      console.log("Response:", response);
      Storage.newUser = false;
      showLoader(false);
    },
    error: (jqXHR, textStatus, errorThrown) => {
      console.error("Error:", textStatus, errorThrown);
      showLoader(false);
    },
  });
};
const GetUserDetails = (data) => {
  data.action = "getUserDetails";
  console.log(data);
  // ASYNC JAVASCRIPT and XML
  $.ajax({
    url: "/php/profile.php",
    method: "GET",
    data: data,
    success: (response) => {
      console.log("here");
      console.log(response);

      const { status, message } = response;
      if (!status) {
        alert(message);
        localStorage.removeItem("session_id");
        window.location.href = "/login.html";

        setterValue(null, null, null, null);
        Storage.newUser = true;
        Storage.username = localStorage.getItem("username");
        console.log("storage");
        console.log(Storage);
      } else {
        const {
          username,
          UserGivenName,
          UserPhoneNumber,
          UserAge,
          UserEmail,
          UserDOB,
        } = response.userDetails;
        console.log(response.userDetails);
        console.log({
          username,
          UserGivenName,
          UserPhoneNumber,
          UserAge,
          UserEmail,
        });
        setterValue(
          UserGivenName,
          UserPhoneNumber,
          UserAge,
          UserEmail,
          UserDOB
        );
        Storage.newUser = false;
        Storage.username = localStorage.getItem("username");
      }
      updateUI();
      showLoader(false);
      return;
      Storage.newUser = newUser;
      Storage.username = username;
      if (
        newUser == undefined &&
        username == undefined &&
        userDetails == undefined
      ) {
        Storage.newUser = true;
        Storage.username = localStorage.getItem("username");
      }
      if (!newUser) {
        Storage.userDetails = response.userDetails;
      }
      console.log(Storage);
      updateUI();
    },
    error: (jqXHR, textStatus, errorThrown) => {
      console.log("err");
      console.error("Error:", textStatus, errorThrown);
      showLoader(false);
    },
  });
};

const LogoutUser = (session_id) => {
  data = {
    redisID: session_id,
    action: "logout",
  };
  $.ajax({
    url: "/php/profile.php",
    method: "GET",
    data: data,
    success: (response) => {
      if (response.status) {
        localStorage.removeItem("session_id");
      }
      showLoader(false);
    },
    error: (jqXHR, textStatus, errorThrown) => {
      console.error("Error:", textStatus, errorThrown);
      showLoader(false);
    },
  });
};
//SECTION-START: AJAX CALL

//SECTION-START: FUNCTION
const setterValue = (name, number, age, email, dob) => {
  // const data = .value;
  console.log("setter");
  console.log(name);
  console.log(number);
  console.log(age);
  console.log(email);
  console.log(dob);

  UserGivenName.value = name ? name : "";
  UserPhoneNumber.value = number ? parseInt(number) : 0;
  UserAge.value = age ? parseInt(age) : 0;
  UserEmail.value = email ? email : "";
  UserDOB.value = dob ? dob : "";
};
const getterValue = () => {
  // const data = .value;
  console.log("getter");
  const user = {};
  user.username = Storage.username;
  user.UserGivenName = UserGivenName.value;
  user.UserPhoneNumber = UserPhoneNumber.value;
  user.UserAge = UserAge.value;
  user.UserEmail = UserEmail.value;
  user.UserDOB = UserDOB.value;
  return user;
};
const updateUI = () => {
  console.log(currentUserSelector);
  currentUserSelector.innerHTML = Storage.username;
};
//SECTION-START: FUNCTION
//SECTION-START: EVENT LISITONERS
window.addEventListener("load", () => {
  const isLogin = Boolean(localStorage.getItem("isLogin"));
  console.log(isLogin);
  if (isLogin) {
    const data = localStorage.getItem("session_id");
    console.log(data);
    showLoader(true);
    GetUserDetails({ redisID: data });
  } else {
    alert("login to continue");
    window.location.href = "/login.html";
  }
});
updateButton.addEventListener("click", (e) => {
  e.preventDefault();
  console.log(Storage);

  console.log("update");
  console.log({
    details: getterValue(),
    isSaved: Storage.newUser,
    username: Storage.username,
  });
  showLoader(true);
  UpdateUserDetails({
    details: getterValue(),
    isSaved: Storage.newUser,
    username: Storage.username,
  });
});
UserDOB.addEventListener("change", (e) => {
  const DOB = new Date(e.target.value);
  const today = new Date();
  if (today < DOB) {
    alert("invalid Date");
    e.target.value = DOB;
  }
  var age_dt = new Date(today - DOB);
  age = Math.abs(age_dt.getUTCFullYear() - 1970);
  UserAge.value = age;
});
logoutButton.addEventListener("click", (e) => {
  session_id = localStorage.getItem("session_id");
  LogoutUser(session_id);
});
updateUI();
//SECTION-END: EVENT LISITONERS
