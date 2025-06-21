// kiem tra trang thai dang nhap
function checkLoginStatus() {
  // lay button login + logout
  const loginBtn = document.getElementById("login-btn");
  const adminBtn = document.getElementById("admin-btn");
  const logoutBtn = document.getElementById("logout-btn");

  // kiem tra local storage co ton tai currentUser khong
  const currentUser = localStorage.getItem("currentUser");

  function checkAccountPage(status) {
    if (location.href.includes("quanly.html")) {
      logoutBtn.style.display = status;
    } else {
      adminBtn.style.display = status;
    }
  }

  // neu da dang nhap -> tat login
  if (currentUser !== null) {
    loginBtn.style.display = "none";
    checkAccountPage("block");
  } else {
    loginBtn.style.display = "block";
    checkAccountPage("none");
  }
}

document.addEventListener("DOMContentLoaded", checkLoginStatus);

// bat su kien cho logout
document.getElementById("logout-btn")?.addEventListener("click", function () {
  // xoa currentUser trong local storage
  localStorage.removeItem("currentUser");
});
