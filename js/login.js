// Hàm kiểm tra dữ liệu nhập từ form
function validateForm(username, email, password) {
    // kiểm tra rỗng
    if (username === "" || email === "" || password === "") {
        alert("You need to fill all fields!");
        return false;
    }

    // regex kiểm tra định dạng email
    const email_regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    // kiểm tra định dạng email
    if (!email_regex.test(email)) {
        alert("Email is bad format");
        return false;
    }

    // kiểm tra độ dài password
    if (password.length < 6) {
        alert("Password needs at least 6 characters!");
        return false;
    }

    // kiểm tra độ dài username
    if (username.length < 6) {
        alert("Username needs at least 6 characters!");
        return false;
    }

    return true;
}

// Hàm kiểm tra đăng nhập tài khoản
function checkLoginAccount(defaultAccount) {
    // Lấy dữ liệu từ form HTML (id phải là chuỗi)
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    // Kiểm tra dữ liệu form
    if (validateForm(username, email, password)) {
        if (defaultAccount) {
            if (defaultAccount.username === username) {
                if (defaultAccount.password === password) {
                    // Đăng nhập thành công, chuyển trang
                    location.href = "../index.html";
                } else {
                    alert("Password is incorrect, please try again.");
                }
            } else {
                alert("Username does not exist in database, please sign up.");
            }
        } else {
            alert("No account data found.");
        }
    } else {
        return; // Dữ liệu không hợp lệ
    }
}

// Gắn sự kiện click cho nút đăng nhập
document.getElementById("login-btn").addEventListener("click", function(event) {
    event.preventDefault();

    // Lấy dữ liệu tài khoản mặc định trong localStorage
    const storedAccount = localStorage.getItem("defaultAccount");
    const defaultAccount = storedAccount ? JSON.parse(storedAccount) : null;

    checkLoginAccount(defaultAccount);
});
