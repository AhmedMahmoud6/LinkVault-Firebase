let idCounter = 0; // id counter
let currentPage = 1;
let startPoint = 0;
let endPoint = 4;
let tempStartPoint;
let tempEndPoint;

let totalPages;
let itemsPerPage = 4;

function validateForm(taskVal, urlVal, addBookmark, titleDiv, urlDiv) {
  let existingError = document.querySelector(".err");

  // regex for real links
  const isValidUrl = /^https?:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/.*)?$/.test(
    urlVal
  );

  // if taskVal and urlVal are not empty
  if (taskVal && urlVal) {
    // if the link input is valid
    if (!isValidUrl) {
      existingError = createErrMsg(
        existingError,
        "Link is Inappropriate",
        addBookmark
      );
      console.log(existingError);
      setTimeout(() => {
        if (existingError) existingError.remove();
      }, 3000);
      return false;
    }

    if (existingError) existingError.remove();

    titleDiv.classList.remove("ring-4", "ring-[#ff858b]");
    urlDiv.classList.remove("ring-4", "ring-[#ff858b]");

    return true;
  }

  if (existingError) return false;

  existingError = createErrMsg(
    existingError,
    "Both fields are required!",
    addBookmark
  );

  if (!taskVal) titleDiv.classList.add("ring-4", "ring-[#ff858b]");

  if (!urlVal) urlDiv.classList.add("ring-4", "ring-[#ff858b]");

  console.log(document.querySelector(".err"));

  setTimeout(() => {
    if (existingError) existingError.remove();
  }, 3000);
  return false;
}

function createBookmark(taskVal, urlVal, bookMarksList) {
  idCounter += 1;
  let bookmark = {
    taskVal,
    urlVal,
    idCounter,
  };

  bookMarksList.unshift(bookmark);
  localStorage.setItem("bookmark", JSON.stringify(bookMarksList));
}

function deleteBookmark(delBtn, bookMarksList, pagination) {
  let currBookmark = delBtn.closest(".task");
  for (let i = 0; i < bookMarksList.length; i++) {
    if (bookMarksList[i].idCounter == currBookmark.id) {
      bookMarksList.splice(i, 1);
      break;
    }
  }
  localStorage.setItem("bookmark", JSON.stringify(bookMarksList));
  renderPageTasks(currentPage, bookMarksList);
  renderPaginationBtns(
    JSON.parse(localStorage.getItem("bookmark")),
    pagination
  );
}

function renderTasks(
  bookMarksList,
  emptyState,
  bookmarksParent,
  search = false
) {
  if (bookMarksList.length < 1 || bookMarksList.slice(0, 4).length < 1) {
    emptyState.classList.remove("hidden");
    bookmarksParent.classList.add("hidden");
    return;
  } else {
    emptyState.classList.add("hidden");
    bookmarksParent.classList.remove("hidden");

    bookmarksParent.innerHTML = "";

    if (search) {
      tempStartPoint = startPoint;
      tempEndPoint = endPoint;
      startPoint = 0;
      endPoint = 4;
    }

    for (let i of bookMarksList.slice(startPoint, endPoint)) {
      let bookmarkHtml = `
        <div
            class="task bg-[#243044] border-t-4 border-[#f97316] h-50 p-4 flex flex-col justify-between rounded outline-2 outline-[#333f52] shadow-md hover:-translate-y-2 transition-all"
            id = "${i.idCounter}"
          >
            <div class="top-side">
              <h1 class="title text-white font-bold truncate">
                ${i.taskVal}
              </h1>
              <a
                href="${i.urlVal}"
                class="url text-[#f97316] hover:underline truncate w-full block"
                target="_blank"
                >${i.urlVal}</a
              >
            </div>

            <a
                href="${i.urlVal}"
                target="_blank"
                class="text-white text-center w-20 bg-[#059669] cursor-pointer hover:bg-[#14cb92] focus:ring-3 focus:ring-[#52e0b4] font-medium rounded-lg text-sm px-5 py-2.5"
              >
                Visit
            </a>

            <div class="bottom-side flex gap-4">
              <button
                type="button"
                class="edit-btn text-white w-20 bg-[#fbbf24] cursor-pointer hover:bg-[#f8d066] focus:ring-3 focus:ring-[#d49901] font-medium rounded-lg text-sm px-5 py-2.5"
              >
                Edit
              </button>
              <button
                type="button"
                class="delete-btn text-white w-20 bg-[#ef4444] cursor-pointer hover:bg-[#ef6868] focus:ring-3 focus:ring-[#be0707] font-medium rounded-lg text-sm px-5 py-2.5"
              >
                Delete
              </button>
            </div>
        </div>
        `;
      bookmarksParent.insertAdjacentHTML("beforeend", bookmarkHtml);
    }
    if (search) {
      startPoint = tempStartPoint;
      endPoint = tempEndPoint;
    }
    return;
  }
}

function createErrMsg(existingError, errMsg, addBookmark) {
  if (existingError) existingError.remove();
  let validationMsg = document.createElement("p");
  validationMsg.textContent = errMsg;
  validationMsg.classList = "err text-[#ff858b] font-bold";

  addBookmark.before(validationMsg);
  return validationMsg;
}

function searchBookmark(string, userInput) {
  let i = 0;

  for (let char of string) {
    if (char?.trim()?.toLowerCase() === userInput[i]?.trim()?.toLowerCase())
      i++;
    if (userInput.length === i) return true;
  }
  return false;
}

function renderPageTasks(clickedPage, renderedList) {
  currentPage = Number(clickedPage);
  startPoint = (currentPage - 1) * itemsPerPage;
  endPoint = startPoint + itemsPerPage;
  renderTasks(renderedList, emptyState, bookmarksParent);
}

function renderPaginationBtns(bookMarksList, pagination) {
  totalPages = Math.ceil(bookMarksList.length / itemsPerPage);

  pagination.innerHTML = "";

  if (totalPages <= 5)
    for (let i = 1; i <= totalPages; i++) pageButton(pagination, i);
  else {
    // left side
    if (currentPage - 1 < 3) {
      for (let i = 1; i <= 4; i++) {
        pageButton(pagination, i);
      }
      ellipses(pagination);
      pageButton(pagination, totalPages);
    }

    // center side [1 ... 3 4 5 ... 7]
    if (currentPage - 1 >= 3 && totalPages - currentPage > 2) {
      let beforePage = currentPage - 1;
      let afterPage = currentPage + 1;
      pageButton(pagination, 1);
      ellipses(pagination);
      for (let pageLength = beforePage; pageLength <= afterPage; pageLength++) {
        pageButton(pagination, pageLength);
      }
      ellipses(pagination);
      pageButton(pagination, totalPages);
    }

    // right side
    if (totalPages - currentPage <= 2) {
      pageButton(pagination, 1);
      ellipses(pagination);
      for (let i = totalPages - 3; i <= totalPages; i++) {
        pageButton(pagination, i);
      }
    }
  }

  pagination.classList.remove("hidden");
}

function pageButton(pagination, loopIterable) {
  let pageBtn = document.createElement("div");
  pageBtn.className =
    "page bg-[#243044] active:bg-[#059669] w-12 h-12 rounded outline-2 outline-[#333f52] cursor-pointer shadow-md text-white flex justify-center items-center text-xl";

  pageBtn.textContent = loopIterable;
  if (loopIterable === currentPage) {
    pageBtn.classList.replace("bg-[#243044]", "bg-[#059669]");
  }

  pagination.appendChild(pageBtn);
}

function ellipses(pagination) {
  let ellipsesDiv = document.createElement("p");
  ellipsesDiv.textContent = "...";
  ellipsesDiv.className = "text-white text-2xl";

  pagination.appendChild(ellipsesDiv);
}
