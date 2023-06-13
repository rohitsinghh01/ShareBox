const dropZone = document.querySelector(".drop-zone");
const fileUpload = document.querySelector("#file-upload");
const browseBtn = document.querySelector(".browse-btn");
const percentValue = document.querySelector("#percent");
const bgProgress = document.querySelector(".progress");
const progressBar = document.querySelector(".progress-bar");
const progressContainer = document.querySelector(".progress-container");
const fileUrl = document.querySelector("#fileURL");
const sharingContainer = document.querySelector(".share-container");
const copyBtn = document.querySelector("#copy-btn");
const emailForm = document.querySelector("#email-form");
const toast = document.querySelector(".toast");

const host = "http://localhost:8000/";
const uploadURL = `${host}api/v1/files`;
const emailURL = `${host}api/v1/files/send`;
const maxAllowedSize = 100 * 1024 * 1024;

dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  if (!dropZone.classList.contains("dragged")) {
    dropZone.classList.add("dragged");
  }
});

dropZone.addEventListener("dragleave", () => {
  dropZone.classList.remove("dragged");
});

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("dragged");
  const files = e.dataTransfer.files;
  if (files.length) {
    fileUpload.files = files;
    uploadFile();
  }
});

fileUpload.addEventListener("change", () => {
  uploadFile();
});
browseBtn.addEventListener("click", () => {
  fileUpload.click();
});
copyBtn.addEventListener("click", () => {
  fileUrl.select();
  document.execCommand("copy");
  showToast("Link Copied");
});

const uploadFile = () => {
  if (fileUpload.files.length > 1) {
    resetFileInput();
    showToast("Only upload 1 file");
    return;
  }
  const file = fileUpload.files[0];
  if (file.size > maxAllowedSize) {
    resetFileInput()
    showToast("Can't upload more than 100MB");
    return
    
  }
  progressContainer.style.display = "block";
  const formData = new FormData();
  formData.append("myfile", file);

  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      console.log(xhr.response);
      onUploadSuccess(xhr.responseText);
    }
  };
  xhr.upload.onprogress = updateProgress;

  xhr.upload.onerror = () => {
    resetFileInput();
    showToast(`Error in upload: ${xhr.statusText}`);
  };

  xhr.open("POST", uploadURL);
  xhr.send(formData);
};

const updateProgress = (e) => {
  const percent = Math.round((e.loaded / e.total) * 100);
  bgProgress.style.width = `${percent}`;
  percentValue.innerText = percent;
  progressBar.style.transform = `scaleX(${percent / 100})`;
};

const onUploadSuccess = (res) => {
  resetFileInput();
  emailForm[2].removeAttribute("disabled");
  progressContainer.style.display = "none";
  const { file: url } = JSON.parse(res);
  sharingContainer.style.display = "block";
  fileUrl.value = url;
};

const resetFileInput = () => {
  fileUpload.value = "";
};

emailForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const url = fileUrl.value;
  const formData = {
    uuid: url.split("/").splice(-1, 1)[0],
    emailTo: emailForm.elements["to-email"].value,
    emailFrom: emailForm.elements["from-email"].value,
  };

  emailForm[2].setAttribute("disabled", "true");

  fetch(emailURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((res) => res.json())
    .then(({ success }) => {
      if (success) {
        sharingContainer.style.display = "none";
        showToast("Email Sent");
      }
    });
});

let toastTimer;
const showToast = (msg) => {
  toast.innerText = msg;
  toast.style.transform = "translate(-50%,0)";
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.style.transform = "translate(-50%,60px)";
  }, 2000);
};
