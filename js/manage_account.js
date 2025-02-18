// Kiem tra co dang nhap chua, neu chua khong cho vao trang quan ly
const currentUser = localStorage.getItem("currentUser");
const admin_btn = document.getElementById("admin-btn");
if (currentUser) {
  admin_btn.href = "../html/quanly.html";
} else {
  admin_btn.href = "../html/login.html";
}

//tao birn luu 1 account nd
const defaultAccount = {
  username: "huatrunghung1210",
  password: "hung1210",
};
if (!localStorage.getItem("defaultAccount")) {
  // neu chua co du lieu trong storage => tao
  // JSON (chuoi - string): kieu du lieu dung de luu vao trong storage => js khong doc duoc
  // => chuyen kieu du lieu tu js -> json = func stringify()
  localStorage.setItem("defaultAccount", JSON.stringify(defaultAccount));
}
