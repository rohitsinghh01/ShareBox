const dropZone = document.querySelector(".drop-zone");
const fileUpload = document.querySelector("#file-upload");
const browseBtn = document.querySelector(".browse-btn");
const host = "https://inshare.herokuapp.com/";
const uploadURL = `${host}api/files`;

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

const uploadFile = () => {
  const file = fileUpload.files[0];
  const formData = new FormData();
  formData.append("myFile", file);

  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState === XMLHttpRequest.DONE) (1)[console.log(xhr.response)];
    xhr.open("POST", uploadURL);
    xhr.send(formData);
  };
};
