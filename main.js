import {
  validateForm,
  createBookmark,
  createBookmarkFirebase,
  deleteBookmark,
  renderTasks,
  searchBookmark,
  renderPageTasks,
  renderPaginationBtns,
  itemsPerPage,
} from "./functions.js";
import {
  collection, // Reference to a collection
  doc, // Reference to a document
  getDocs, // Get multiple documents
  updateDoc, // Update a document
  deleteDoc, // Delete a document
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";
import { db, auth, logout } from "./firebase.js";
import { getUserId } from "./user.js";

let addTask = document.querySelector(".add-title");
let addUrl = document.querySelector(".add-url");
let addBookmark = document.querySelector(".add-btn");
let emptyState = document.querySelector(".empty-state");
let bookmarksParent = document.querySelector(".bookmarks");
let searchDiv = document.querySelector(".search");
let pagination = document.querySelector(".pagination");
let editContainer = document.querySelector(".edit-container");
let editTitleInput = document.querySelector(".edit-title");
let editUrlInput = document.querySelector(".edit-url");
let updateBookmarkBtn = document.querySelector(".update-bookmark");
let editingBookmarkId = 0;
let loginRegisterContainer = document.querySelector(".login-register");
let userProfile = document.querySelector(".profile");
let userMenu = document.querySelector(".menu");

let result = [];
let bookMarksList = [];

if (getUserId() === "" || !getUserId()) {
  JSON.parse(localStorage.getItem("bookmark"))
    ? (bookMarksList = JSON.parse(localStorage.getItem("bookmark")))
    : localStorage.setItem("bookmark", JSON.stringify(bookMarksList));
} else {
  let returnedData = await getDocs(
    collection(db, "users", getUserId(), "tasks")
  );
  bookMarksList = returnedData.docs
    .map((task) => task.data())
    .sort((a, b) => b.idCounter - a.idCounter);
}

// check if user is logged in
if (getUserId() === "" || !getUserId()) {
  loginRegisterContainer.classList.remove("hidden");
  userProfile.classList.add("hidden");
} else {
  userProfile.classList.remove("hidden");
  loginRegisterContainer.classList.add("hidden");
  let user = auth.currentUser;
  document.querySelector(".user-name h1").textContent = user.email;
}

// display profile menu
userProfile.addEventListener("click", (_) => {
  if (userMenu.classList.contains("hidden"))
    userMenu.classList.remove("hidden");
  else userMenu.classList.add("hidden");
});

// logout
userMenu.addEventListener("click", (_) => {
  localStorage.setItem("uid", JSON.stringify(""));
  logout();
});

renderTasks(bookMarksList, emptyState, bookmarksParent);

// render pagination
renderPaginationBtns(bookMarksList, pagination);

// add bookmark
addBookmark.addEventListener("click", async (_) => {
  let taskVal = addTask.value.trim();
  let urlVal = addUrl.value.trim();

  if (validateForm(taskVal, urlVal, addBookmark, addTask, addUrl)) {
    addTask.value = ""; // clear title input
    addUrl.value = ""; // clear url input
    searchDiv.querySelector("input").value = ""; // clear search input

    if (getUserId() === "" || !getUserId()) {
      createBookmark(taskVal, urlVal, bookMarksList);
      localStorage.setItem("bookmark", JSON.stringify(bookMarksList));
    } else {
      await createBookmarkFirebase(taskVal, urlVal, bookMarksList);
      let returnedData = await getDocs(
        collection(db, "users", getUserId(), "tasks")
      );
      bookMarksList = returnedData.docs
        .map((task) => task.data())
        .sort((a, b) => b.idCounter - a.idCounter);
    }

    renderTasks(bookMarksList, emptyState, bookmarksParent, false);
    localStorage.setItem(
      "totalpages",
      JSON.stringify(Math.ceil(bookMarksList.length / itemsPerPage))
    ); // update total pages counter

    // render pagination
    renderPaginationBtns(bookMarksList, pagination);

    // update result arr length to not conflict with pagination when adding new bookmarks
    result.length = 0;
  }
});

// search bookmarks
searchDiv.addEventListener("input", (e) => {
  let userInput = e.target.value;

  if (!bookMarksList.length < 1) {
    result = bookMarksList.filter((task) =>
      searchBookmark(task.taskVal, userInput)
    );

    if (result.length === 0) pagination.classList.add("hidden"); // hide pagination when no results

    renderTasks(result, emptyState, bookmarksParent, true);
    renderPaginationBtns(result, pagination);
  }
  if (userInput.length == 0) {
    renderTasks(bookMarksList, emptyState, bookmarksParent, false);
    pagination.classList.remove("hidden");
  }
});

document.addEventListener("click", async (e) => {
  // render page tasks
  if (e.target.classList.contains("page")) {
    renderPageTasks(
      e.target.innerText,
      result.length === 0 ? bookMarksList : result,
      emptyState,
      bookmarksParent
    );
    renderPaginationBtns(
      result.length === 0 ? bookMarksList : result,
      pagination
    );
  }

  // delete bookmark
  if (e.target.classList.contains("delete-btn")) {
    if (getUserId() === "" || !getUserId())
      deleteBookmark(
        e.target,
        bookMarksList,
        pagination,
        emptyState,
        bookmarksParent
      );
    else {
      let taskId = e.target.closest(".task").id;
      const docRef = doc(db, "users", getUserId(), "tasks", taskId);
      await deleteDoc(docRef);

      let returnedData = await getDocs(
        collection(db, "users", getUserId(), "tasks")
      );
      bookMarksList = returnedData.docs
        .map((task) => task.data())
        .sort((a, b) => b.idCounter - a.idCounter);

      renderTasks(bookMarksList, emptyState, bookmarksParent);

      // render pagination
      renderPaginationBtns(bookMarksList, pagination);
    }
  }

  // open edit bookmark
  if (e.target.classList.contains("edit-btn")) {
    let currBookmark = e.target.closest(".task");
    editingBookmarkId = Number(currBookmark.id);

    editContainer.classList.remove("hidden");

    editTitleInput.focus();
    editTitleInput.value = currBookmark.querySelector("h1").innerText;

    editUrlInput.value = currBookmark.querySelector("a").href;
  }

  // close edit bookmark
  if (e.target.classList.contains("edit-container")) {
    e.target.classList.add("hidden");
  }
});

// edit bookmark
updateBookmarkBtn.addEventListener("click", async (_) => {
  let taskVal = editTitleInput.value.trim();
  let urlVal = editUrlInput.value.trim();
  if (
    validateForm(
      taskVal,
      urlVal,
      updateBookmarkBtn,
      editTitleInput,
      editUrlInput
    )
  ) {
    for (let bookmark of bookMarksList)
      if (bookmark.idCounter === editingBookmarkId) {
        if (getUserId() === "" || !getUserId()) {
          bookmark.taskVal = taskVal;
          bookmark.urlVal = urlVal;
          localStorage.setItem("bookmark", JSON.stringify(bookMarksList));
        } else {
          const docRef = doc(
            db,
            "users",
            getUserId(),
            "tasks",
            `${editingBookmarkId}`
          );

          await updateDoc(docRef, {
            taskVal: taskVal,
            urlVal: urlVal,
          });

          let returnedData = await getDocs(
            collection(db, "users", getUserId(), "tasks")
          );
          bookMarksList = returnedData.docs
            .map((task) => task.data())
            .sort((a, b) => b.idCounter - a.idCounter);
        }
        break;
      }
    renderPageTasks(
      JSON.parse(localStorage.getItem("currentpage")),
      result.length === 0 ? bookMarksList : result,
      emptyState,
      bookmarksParent
    );
    editContainer.classList.add("hidden");
  }
});
