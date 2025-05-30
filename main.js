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

let result = [];
let bookMarksList = [];
JSON.parse(localStorage.getItem("bookmark"))
  ? (bookMarksList = JSON.parse(localStorage.getItem("bookmark")))
  : localStorage.setItem("bookmark", JSON.stringify(bookMarksList));

renderTasks(bookMarksList, emptyState, bookmarksParent);

// render pagination
renderPaginationBtns(bookMarksList, pagination);

// add bookmark
addBookmark.addEventListener("click", (_) => {
  let taskVal = addTask.value.trim();
  let urlVal = addUrl.value.trim();
  if (validateForm(taskVal, urlVal, addBookmark, addTask, addUrl)) {
    addTask.value = ""; // clear title input
    addUrl.value = ""; // clear url input
    searchDiv.querySelector("input").value = ""; // clear search input

    createBookmark(taskVal, urlVal, bookMarksList);
    localStorage.setItem("bookmark", JSON.stringify(bookMarksList));
    totalPages = Math.ceil(bookMarksList.length / itemsPerPage); // update total pages counter
    renderTasks(bookMarksList, emptyState, bookmarksParent, false);

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

document.addEventListener("click", (e) => {
  // render page tasks
  if (e.target.classList.contains("page")) {
    renderPageTasks(
      e.target.innerText,
      result.length === 0 ? bookMarksList : result
    );
    renderPaginationBtns(
      result.length === 0 ? bookMarksList : result,
      pagination
    );
  }

  // delete bookmark
  if (e.target.classList.contains("delete-btn")) {
    deleteBookmark(e.target, bookMarksList, pagination);
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
updateBookmarkBtn.addEventListener("click", (_) => {
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
        bookmark.taskVal = taskVal;
        bookmark.urlVal = urlVal;
        localStorage.setItem("bookmark", JSON.stringify(bookMarksList));
        break;
      }
    renderPageTasks(currentPage, result.length === 0 ? bookMarksList : result);
    editContainer.classList.add("hidden");
  }
});
