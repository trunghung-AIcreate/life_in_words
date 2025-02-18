//lay thong tinh nguoi dung nhap vao from//
function validateFrom(username, password) {
  //kiem tra rong
  if (username == "" || password == "") {
    alert("you need to fell all fields!");
    return false;
  }
  //kiem tra format password
  if (password.length < 6) {
    alert("pass needs least 6 letters!");
    return false;
  }
  //kiem tra do dai user name
  if (username.length < 6) {
    alert("pass needs least 5 letters!");
    return false;
  }
  return true;
}

//luu vao local strore=> kiem tra trang thai co login chua
function checkLoginAccount(defaultAccount) {
  //lay du lieu tu from html
  const password = document.getElementById("password").value.trim();
  const username = document.getElementById("username").value.trim();
  //kiem tra from
  if (validateFrom(username, password)) {
    if (defaultAccount.username == username) {
      if (defaultAccount.password == password) {
        // dang nhap thanh cong => luu tru du lieu
        localStorage.setItem("currentUser", username);
        location.href = "../index.html";
      } else {
        alert("Password is incorrect!");
        return;
      }
    } else {
      alert("Username is not exist is database, please sign up");
      return;
    }
  } else return;
}
document
  .getElementById("login-btn")
  .addEventListener("click", function (event) {
    event.preventDefault();
    //lay lai du lieu tai khoan nac dinh trong local storage
    // getItem: tra ve du Lieu json -> su dung ham parse() chuyen thanh kieu du Lieu js
    const defaultAccount = JSON.parse(localStorage.getItem("defaultAccount"));
    checkLoginAccount(defaultAccount);
  });
