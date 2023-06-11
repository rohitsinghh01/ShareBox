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
copyBtn.addEventListener("click", () => {
  fileUrl.select();
  document.execCommand('copy')
});

const uploadFile = () => {
  progressContainer.style.display = "block";
  const file = fileUpload.files[0];
  const formData = new FormData();
  formData.append("myfile", file);

  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      console.log(xhr.response);
    }
  };
  xhr.upload.onprogress = updateProgress;
  xhr.open("POST", uploadURL);
  xhr.send(formData);
};

const updateProgress = (e) => {
  const percent = Math.round((e.loaded / e.total) * 100);
  bgProgress.style.width = `${percent}`;
  percentValue.innerText = percent;
  progressBar.style.transform = `scaleX(${percent / 100})`;
};

const showLink = ({ file: url }) => {
  progressContainer.style.display = "none";
  sharingContainer.style.display = "block";
  fileUrl.value = url;
};
