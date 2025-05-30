import { register, db } from "./firebase.js";
import {
  doc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";

let emailInput = document.querySelector(".user-title");
let passwordInput = document.querySelector(".user-password");
let registerBtn = document.querySelector(".register-btn");
let registerFailed = document.querySelector(".register-failed");
let registerSuccess = document.querySelector(".register-success");

registerBtn.addEventListener("click", async (_) => {
  let result = await register(emailInput.value, passwordInput.value);
  if (result.success) {
    const uid = result.user.uid;
    await setDoc(doc(db, "users", uid), { idCounter: 0 });

    registerSuccess.classList.remove("hidden");
    registerFailed.classList.add("hidden");
    setTimeout(() => {
      window.location.replace("login.html");
    }, 2000);
  } else {
    registerFailed.classList.remove("hidden");
    registerSuccess.classList.add("hidden");
  }
});
