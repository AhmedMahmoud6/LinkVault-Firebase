import { register } from "./firebase.js";

let emailInput = document.querySelector(".user-title");
let passwordInput = document.querySelector(".user-password");
let registerBtn = document.querySelector(".register-btn");

registerBtn.addEventListener("click", async (_) => {
  await register(emailInput.value, passwordInput.value);
});
