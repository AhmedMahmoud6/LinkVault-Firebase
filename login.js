import { login } from "./firebase.js";
import { setUserId } from "./user.js";

let emailInput = document.querySelector(".user-title");
let passwordInput = document.querySelector(".user-password");
let loginBtn = document.querySelector(".login-btn");

loginBtn.addEventListener("click", async (_) => {
  let result = await login(emailInput.value, passwordInput.value);
  if (result.success) {
    setUserId(result.user.uid);
  } else {
    console.log("couldn't register", result.error);
  }
});
