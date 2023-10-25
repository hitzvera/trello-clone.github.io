import { baseUrl } from "./constant.js";

const loginBtnPage = document.querySelectorAll(".login-button-page");
const signupBtn = document.querySelectorAll(".signup-button-page");
const formLogin = document.getElementById("form-login");
const signupLink = document.getElementById("signup-link");
const loginLink = document.getElementById("login-link");
const errorElm = document.getElementById("login-error");

const navItems = document.querySelectorAll('.nav-item');
const homeDescription = document.getElementById("home-description");
const aboutDescription = document.getElementById("about-description");

navItems[0].addEventListener("mouseover", () => {
  homeDescription.classList.remove("hidden");
})

navItems[0].addEventListener("mouseout", () => {
  homeDescription.classList.add("hidden");
})

navItems[1].addEventListener("mouseover", () => {
  aboutDescription.classList.remove("hidden");
})

navItems[1].addEventListener("mouseout", () => {
  aboutDescription.classList.add("hidden");
})

signupBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    changeToRegister();
  });
})

loginBtnPage.forEach((btn) => {
  btn.addEventListener("click", () => {
    changeTologin();
  });
})

signupLink.addEventListener("click", () => {
  changeToRegister();
});

loginLink.addEventListener("click", () => {
  changeTologin();
})


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

function changeTologin() {
  document.getElementById("form-login").classList.remove("hidden");
  document.getElementById("form-register").classList.add("hidden");

  loginBtnPage.forEach((btn) => {
    btn.classList.add(
      "bg-gradient-to-r",
      "from-[#392196]",
      "to-[#DB499C]",
      "text-white"
    );
  });

  signupBtn.forEach((btn) => {
    btn.classList.remove(
      "bg-gradient-to-r",
      "from-[#392196]",
      "to-[#DB499C]",
      "text-white"
    );
  });
}

function changeToRegister() {
  document.getElementById("form-login").classList.add("hidden");
  document.getElementById("form-register").classList.remove("hidden");

  loginBtnPage.forEach((btn) => {
    btn.classList.remove(
      "bg-gradient-to-r",
      "from-[#392196]",
      "to-[#DB499C]",
      "text-white"
    );
  })

  signupBtn.forEach((btn) => {
    btn.classList.add(
      "bg-gradient-to-r",
      "from-[#392196]",
      "to-[#DB499C]",
      "text-white"
    );
  })

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
