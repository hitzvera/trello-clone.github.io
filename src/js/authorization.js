const isLoggedin = JSON.parse(localStorage.getItem("user"));

if (!isLoggedin) {
    window.location.href = "../pages/error.html";
}