// lay thong tin nguoi dung
function getCurrentUserInfo() {
  const currentUserEmail = localStorage.getItem("currentUser");
  if (currentUserEmail) {
    const userKey = currentUserEmail;
    const userDataString = localStorage.getItem(userKey);
    if (userDataString) {
      try {
        return JSON.parse(userDataString);
      } catch (e) {
        console.error(
          "Lỗi khi phân tích dữ liệu người dùng từ bộ nhớ cục bộ:",
          e
        );
        return null;
      }
    }
  }
  return null;
}

let currentUserInfo = getCurrentUserInfo(); // Get current user info once on load

function loadNotes(notesContainer) {
  const notesData = currentUserInfo.notes || [];
  notesContainer.innerHTML = `<h3 style="width:100%; color:white; text-align:center;"><a href="./html/post.html">Tạo bài đăng mới tại đây</a></h3>`;

  if (notesData.length > 0) {
    notesData.forEach((note) => {
      const noteHTML = `
            <div class="col-md-6 mb-4">
              <div class="card">
                <img
                  class="card-img-top"
                  src="${note.imageUrl}"
                  alt="Hành trình trưởng thành"
                />
                <div class="card-body">
                  <h5 class="card-title">${note.title}</h5>
                  <p class="card-text">${note.description}</p>
                  <a href="./html/post.html?id=${note.id}" class="btn btn-primary"
                    >Cập nhật</a
                  >
                </div>
              </div>
            </div>
        `;
      notesContainer.innerHTML += noteHTML;
      return;
    });
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const noteList = document.getElementById("note-list");
  // check tai khoan (neu chua dang nhap khong hien thi)
  if (!currentUserInfo) {
    noteList.innerHTML = `<h3 style="width:100%; color:white; text-align:center;">Cần đăng nhập để sử dụng tính năng này!</h3>`;
    return;
  } else {
    // da co tai khoan => chay vong for de load danh sach
    loadNotes(noteList);
  }
});
