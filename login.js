import { login } from "./firebase.js";
import { setUserId } from "./user.js";

let emailInput = document.querySelector(".user-title");
let passwordInput = document.querySelector(".user-password");
let loginBtn = document.querySelector(".login-btn");
let loginFailed = document.querySelector(".login-failed");
let loginSuccess = document.querySelector(".login-success");

loginBtn.addEventListener("click", async (_) => {
  let result = await login(emailInput.value, passwordInput.value);
  if (result.success) {
    setUserId(result.user.uid);
    loginSuccess.classList.remove("hidden");
    loginFailed.classList.add("hidden");
    setTimeout(() => {
      window.location.replace("index.html");
    }, 2000);
  } else {
    loginFailed.classList.remove("hidden");
    loginSuccess.classList.add("hidden");
  }
});
