// tim kiem bai viet
function searchByTitleOrId(searchKey) {
  alert("Tính năng đang cập nhật!");
}

// bắt sự kiện enter khi tìm bài viết
document.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    searchByTitleOrId(document.getElementById("search-input").value);
  }
});

//--------------------------------------------------
// hien thi danh sach bai viet trong bang
function showNotes(currentNoteList, noteListTable) {
  // neu khong co du lieu
  if (currentNoteList.length === 0) {
    noteListTable.innerHTML = "Hiện chưa có bài viết nào!";
  } else {
    noteListTable.innerHTML = "";
    currentNoteList.forEach((note) => {
      const noteRow = document.createElement("tr");
      noteRow.innerHTML = `
        <td>${note.id}</td>
        <td>${note.title}</td>
        <td><a href="./post.html?id=${note.id}">Link</a></td>
        <td>${note.lastModified}</td>
        <td>
          <button class="delete-btn">Xóa</button>
        </td>
      `;
      // bat su kien cho button remove
      noteRow
        .querySelector(".delete-btn")
        .addEventListener("click", function () {
          removeNote(note.id);
        });
      noteListTable.appendChild(noteRow);
    });
  }
}

function removeNote(id) {
  const userInfo = JSON.parse(localStorage.getItem(currentUsername));
  if (!userInfo) {
    alert("Lỗi tìm kiếm user!");
    return;
  } else {
    // xoa bai viet
    const newNoteList = userInfo.notes.filter((note) => note.id != id);
    // cap nhat local storage
    localStorage.setItem(
      currentUsername,
      JSON.stringify({ ...userInfo, notes: newNoteList })
    );
    // cap nhat giao dien
    showNotes(newNoteList, noteListTable);
  }
}

// bat su kien hien thi danh sach bai viet
const currentUsername = localStorage.getItem("currentUser");
const noteListTable = document.getElementById("note-list");

document.addEventListener("DOMContentLoaded", function () {
  // lay thong tin nguoi dung
  if (!currentUsername) {
    alert("Cần đăng nhập để thực hiện chức năng này!");
    return;
  } else {
    const noteList =
      JSON.parse(localStorage.getItem(currentUsername)).notes || [];
    showNotes(noteList, noteListTable);
  }
});
