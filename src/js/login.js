import { baseUrl } from "./constant.js";

const loginBtnPage = document.getElementById("login-button-page");
const signupBtn = document.getElementById("signup-button-page");
const formLogin = document.getElementById("form-login");
const errorElm = document.getElementById("login-error");

loginBtnPage.addEventListener("click", () => {
  document.getElementById("form-login").classList.remove("hidden");
  document.getElementById("form-register").classList.add("hidden");

  loginBtnPage.classList.add(
    "bg-gradient-to-r",
    "from-[#392196]",
    "to-[#DB499C]",
    "text-white"
  );
  signupBtn.classList.remove(
    "bg-gradient-to-r",
    "from-[#392196]",
    "to-[#DB499C]",
    "text-white"
  );
});

signupBtn.addEventListener("click", () => {
  document.getElementById("form-login").classList.add("hidden");
  document.getElementById("form-register").classList.remove("hidden");

  loginBtnPage.classList.remove(
    "bg-gradient-to-r",
    "from-[#392196]",
    "to-[#DB499C]",
    "text-white"
  );
  signupBtn.classList.add(
    "bg-gradient-to-r",
    "from-[#392196]",
    "to-[#DB499C]",
    "text-white"
  );
});

formLogin.addEventListener("submit", (e) => {
  e.preventDefault();

  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;

  login(username, password);
});

function loading(isLoading) {
  if (isLoading) {
    document.getElementById("login-loading").classList.remove("hidden");
  } else {
    document.getElementById("login-loading").classList.add("hidden");
  }
}

async function login(username, password) {
  loading(true);
  const response = await fetch(`${baseUrl}/users`, {
    method: "GET",
    headers: { "content-type": "application/json" },
  })
    .then((res) => {
      return res.json();
    })
    .catch((err) => {
      errorElm.classList.remove("hidden");
      errorElm.innerText = "Something went wrong";

      // use setTimeout to hide the error message after 3 seconds
      setTimeout(() => {
        errorElm.classList.add("hidden");
      });
    })
    .finally(() => {
      loading(false);
    });

  const user = response.find((user) => {
    return user.username === username && user.password === password;
  });

  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
    document.getElementById("login-username").value = "";
    document.getElementById("login-password").value = "";
    window.location.href = "./src/pages/home.html";
    // remove username value
  } else {
    errorElm.classList.remove("hidden");
    errorElm.innerText = "Invalid username or password";
    document.getElementById("login-password").value = "";

    // use setTimeout to hide the error message after 3 seconds
    setTimeout(() => {
      errorElm.classList.add("hidden");
    }, 3000);
  }
}
