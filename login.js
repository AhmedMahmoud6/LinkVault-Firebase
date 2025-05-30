import { login } from "./firebase.js";

let emailInput = document.querySelector(".user-title");
let passwordInput = document.querySelector(".user-password");
let loginBtn = document.querySelector(".login-btn");

loginBtn.addEventListener("click", async (_) => {
  await login(emailInput.value, passwordInput.value);
});
