import { baseUrl } from "./constant.js";

const formRegister = document.getElementById("form-register");
const errorElm = document.getElementById("register-error");
const successElm = document.getElementById("register-success");

formRegister.addEventListener("submit", (e) => {
  e.preventDefault();

  const username = document.getElementById("register-username").value;
  const password = document.getElementById("register-password").value;
  const confirmPassword = document.getElementById(
    "register-confirm-password"
  ).value;

  register(username, password, confirmPassword);
});

function loading(isLoading) {
  if (isLoading) {
    document.getElementById("register-loading").classList.remove("hidden");
  } else {
    document.getElementById("register-loading").classList.add("hidden");
  }
}

async function validator(username, password, confirmPassword) {
  loading(true);
  const response = await fetch(`${baseUrl}/users`)
    .then((res) => res.json())
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      loading(false);
    });

  const user = response.find((user) => {
    return user.username === username;
  });

  if (user) {
    errorElm.classList.remove("hidden");
    errorElm.innerText = "Username already exists";

    setTimeout(() => {
      errorElm.classList.add("hidden");
    }, 3000);
    return false;
  }

  if (username === "" || password === "" || confirmPassword === "") {
    errorElm.classList.remove("hidden");
    errorElm.innerText = "Username and password is required";

    setTimeout(() => {
      errorElm.classList.add("hidden");
    }, 3000);

    return false;
  }
  if (password !== confirmPassword) {
    errorElm.classList.remove("hidden");
    errorElm.innerText = "Passwords do not match";

    setTimeout(() => {
      errorElm.classList.add("hidden");
    }, 3000);
    return false;
  }

  return true;
}

async function register(username, password, confirmPassword) {
  // dont continue if not pass validator
  const isValid = await validator(username, password, confirmPassword);
  if (!isValid) {
    return;
  }

  loading(true);
  const response = await fetch(`${baseUrl}/users`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  if (!response.ok) {
    // Handle the error case
    loading(false);
    errorElm.classList.remove("hidden");
    errorElm.innerText =
      "Something went wrong (HTTP Status Code: " + response.status + ")";
    // Use setTimeout to hide the error message after 3 seconds
    setTimeout(() => {
      errorElm.classList.add("hidden");
    }, 3000);

    return;
  }

  loading(false);
  const data = await response.json();

  successElm.classList.remove("hidden");
  successElm.innerText = "Register success";
  setTimeout(() => {
    successElm.classList.add("hidden");
    document.getElementById("form-login").classList.remove("hidden");
    document.getElementById("form-register").classList.add("hidden");

    document
      .getElementById("login-button-page")
      .classList.add(
        "bg-gradient-to-r",
        "from-[#392196]",
        "to-[#DB499C]",
        "text-white"
      );
    document
      .getElementById("signup-button-page")
      .classList.remove(
        "bg-gradient-to-r",
        "from-[#392196]",
        "to-[#DB499C]",
        "text-white"
      );
  }, 3000);
}
