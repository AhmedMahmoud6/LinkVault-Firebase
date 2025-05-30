export function setUserId(id) {
  localStorage.setItem("uid", JSON.stringify(id));
}

export function getUserId() {
  return JSON.parse(localStorage.getItem("uid"));
}
