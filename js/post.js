document.addEventListener("DOMContentLoaded", function () {
  const pageTitle = document.getElementById("page-title");
  const imgForm = document.getElementById("img_form");
  const imgUrlInput = imgForm.querySelector("input[type='url']");
  const btnUpload = document.getElementById("btn-upload");
  const frameImage = document.getElementById("frame-image");
  const frameDesc = document.getElementById("frame-desc-editable");
  const content = document.getElementById("editable-content");
  const status = document.getElementById("status");
  const btnImprove = document.getElementById("btn-improve");
  const btnBack = document.getElementById("btn-back");

  // --- Gemini API Configuration ---
  const GEMINI_API_KEY = "AIzaSyA3nRzLXzDk5XhkkcUaKptTXBJDcXHhWLw";
  const GEMINI_API_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

  let postID = null;
  let currentUserInfo = getCurrentUserInfo();

  if (!currentUserInfo) {
    alert("Vui lòng đăng nhập để sử dụng tính năng này!");
    window.location.href = "../html/login.html";
    return;
  }

  const AUTOSAVE_STORAGE_KEY_TITLE = "autosavePageTitle";
  const AUTOSAVE_STORAGE_KEY_DESC = "autosaveFrameDesc";
  const AUTOSAVE_STORAGE_KEY_CONTENT = "autosaveContent";
  const AUTOSAVE_STORAGE_KEY_IMG = "autosaveImageUrl";

  function autosave() {
    localStorage.setItem(AUTOSAVE_STORAGE_KEY_TITLE, pageTitle.textContent);
    localStorage.setItem(AUTOSAVE_STORAGE_KEY_DESC, frameDesc.value);
    localStorage.setItem(AUTOSAVE_STORAGE_KEY_CONTENT, content.value);
    localStorage.setItem(AUTOSAVE_STORAGE_KEY_IMG, imgUrlInput.value);
    status.textContent = "Đã lưu tự động!";
    setTimeout(() => {
      status.textContent = "Chưa lưu!";
    }, 2000);
  }

  function loadSavedContent() {
    const urlParams = new URLSearchParams(window.location.search);
    const idFromUrl = urlParams.get("id");

    if (idFromUrl) {
      postID = parseInt(idFromUrl);
      const post = currentUserInfo.notes
        ? currentUserInfo.notes.find((p) => p.id === postID)
        : null;

      if (post) {
        pageTitle.textContent = post.title || "Tiêu đề bài viết ...";
        frameDesc.value = post.description || "";
        content.value = post.content || "";
        imgUrlInput.value = post.imageUrl || "";
        updateImgDisplay();
        status.textContent = `Đang chỉnh sửa bài viết ID: ${postID}`;
      } else {
        status.textContent = "Không tìm thấy bài viết để chỉnh sửa, tạo bài mới.";
        postID = null;
        pageTitle.textContent = localStorage.getItem(AUTOSAVE_STORAGE_KEY_TITLE) || "Tiêu đề bài viết...";
        frameDesc.value = localStorage.getItem(AUTOSAVE_STORAGE_KEY_DESC) || "";
        content.value = localStorage.getItem(AUTOSAVE_STORAGE_KEY_CONTENT) || "";
        imgUrlInput.value = localStorage.getItem(AUTOSAVE_STORAGE_KEY_IMG) || "";
        updateImgDisplay();
      }
    } else {
      pageTitle.textContent = localStorage.getItem(AUTOSAVE_STORAGE_KEY_TITLE) || "Tiêu đề bài viết ...";
      frameDesc.value = localStorage.getItem(AUTOSAVE_STORAGE_KEY_DESC) || "";
      content.value = localStorage.getItem(AUTOSAVE_STORAGE_KEY_CONTENT) || "";
      imgUrlInput.value = localStorage.getItem(AUTOSAVE_STORAGE_KEY_IMG) || "https://thumb.ac-illust.com/b1/b170870007dfa419295d949814474ab2_t.jpeg";
      updateImgDisplay();
    }
  }

  loadSavedContent();

  pageTitle.addEventListener("input", autosave);
  frameDesc.addEventListener("input", autosave);
  content.addEventListener("input", autosave);
  imgUrlInput.addEventListener("input", autosave);

  pageTitle.addEventListener("blur", autosave);
  frameDesc.addEventListener("blur", autosave);
  content.addEventListener("blur", autosave);
  imgUrlInput.addEventListener("blur", autosave);

  function updateImgDisplay() {
    const imageUrl = imgUrlInput.value.trim();
    if (imageUrl) {
      frameImage.src = imageUrl;
      frameImage.style.display = "block";
      frameImage.onerror = () => {
        frameImage.style.display = "none";
        status.textContent = "Không thể tải ảnh từ URL này.";
        setTimeout(() => (status.textContent = ""), 3000);
      };
    } else {
      frameImage.src = "";
      frameImage.style.display = "none";
    }
  }

  btnUpload.addEventListener("click", function (event) {
    event.preventDefault();
    updateImgDisplay();
    autosave();
  });

  updateImgDisplay();

  async function geminiImproveText(textToImprove, promptContext, length) {
    if (!textToImprove.trim()) {
      status.textContent = "Không có gì để cải thiện.";
      return textToImprove;
    }

    document.querySelector(".loader-container").classList.remove("hide");
    document.querySelector("main").classList.add("hide");
    status.textContent = "Đang cải thiện nội dung với Gemini...";

    try {
      const response = await fetch(GEMINI_API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Cải thiện văn bản sau: "${textToImprove}". ${promptContext}. Độ dài tối đa: ${
                    length ? length + " ký tự." : "phù hợp."
                  }`,
                },
              ],
            },
          ],
          safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
          ],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Lỗi API Gemini: ${response.status} - ${errorData.error.message || response.statusText}`);
      }

      const data = await response.json();
      if (
        data.candidates &&
        data.candidates.length > 0 &&
        data.candidates[0].content &&
        data.candidates[0].content.parts.length > 0
      ) {
        status.textContent = "Nội dung đã được cải thiện!";
        return data.candidates[0].content.parts[0].text;
      } else {
        status.textContent = "Gemini không trả về nội dung cải thiện.";
        return textToImprove;
      }
    } catch (error) {
      console.error("Lỗi khi gọi API Gemini:", error);
      status.textContent = `Lỗi cải thiện nội dung: ${error.message}`;
      return textToImprove;
    } finally {
      document.querySelector(".loader-container").classList.add("hide");
      document.querySelector("main").classList.remove("hide");
      setTimeout(() => (status.textContent = ""), 3000);
    }
  }

  function getCurrentUserInfo() {
    const currentUsername = localStorage.getItem("currentUser");
    if (currentUsername) {
      const userKey = currentUsername;
      const userDataString = localStorage.getItem(userKey);
      if (userDataString) {
        try {
          return JSON.parse(userDataString);
        } catch (e) {
          console.error("Lỗi khi phân tích dữ liệu người dùng:", e);
          return null;
        }
      }
    }
    return null;
  }

  function savePostToLocalStorage() {
    const newPost = {
      id: postID !== null ? postID : currentUserInfo.notes ? currentUserInfo.notes.length : 0,
      title: pageTitle.textContent,
      content: content.value,
      description: frameDesc.value,
      imageUrl: imgUrlInput.value,
      lastModified: new Date().toISOString(),
    };

    if (!currentUserInfo.notes) {
      currentUserInfo.notes = [];
    }

    if (postID !== null) {
      const index = currentUserInfo.notes.findIndex((p) => p.id === postID);
      if (index > -1) {
        currentUserInfo.notes[index] = newPost;
      } else {
        currentUserInfo.notes.push(newPost);
      }
    } else {
      newPost.id =
        currentUserInfo.notes.length > 0
          ? Math.max(...currentUserInfo.notes.map((p) => p.id)) + 1
          : 0;
      currentUserInfo.notes.push(newPost);
    }

    localStorage.setItem(localStorage.getItem("currentUser"), JSON.stringify(currentUserInfo));
    status.textContent = "Bài viết đã được lưu thành công!";
    setTimeout(() => (status.textContent = ""), 3000);
    postID = newPost.id;
  }

  btnImprove.addEventListener("click", async () => {
    const improvedDesc = await geminiImproveText(
      frameDesc.value,
      `Hãy làm cho nó súc tích, hấp dẫn và phù hợp làm mô tả tóm tắt cho một bài viết về ${pageTitle.textContent}.`,
      500
    );
    if (improvedDesc) {
      frameDesc.value = improvedDesc;
      autosave();
    }

    const improvedContent = await geminiImproveText(
      content.value,
      "Mở rộng ý tưởng, sửa lỗi ngữ pháp, cải thiện cấu trúc câu và làm cho bài viết trở nên chuyên nghiệp, lôi cuốn hơn.",
      5000
    );
    if (improvedContent) {
      content.value = improvedContent;
      autosave();
    }
  });

  btnBack.addEventListener("click", (event) => {
    event.preventDefault();
    autosave();
    savePostToLocalStorage();
    removeTempSavingVars();
    window.location.href = "../index.html";
  });

  function removeTempSavingVars() {
    localStorage.removeItem(AUTOSAVE_STORAGE_KEY_TITLE);
    localStorage.removeItem(AUTOSAVE_STORAGE_KEY_DESC);
    localStorage.removeItem(AUTOSAVE_STORAGE_KEY_CONTENT);
    localStorage.removeItem(AUTOSAVE_STORAGE_KEY_IMG);
  }
});
