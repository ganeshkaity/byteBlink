const recentList = document.getElementById("recentList");
const savedItemsList = document.getElementById("savedItemsList");
const deleteToggle = document.getElementById("deleteToggle");
const savedItemsButton = document.getElementById("savedItemsButton");
const deleteOptions = document.getElementById("deleteOptions");
const alertDialog = document.getElementById("alertDialog");
const savedItemsDialog = document.getElementById("savedItemsDialog");
const alertMessage = document.getElementById("alertMessage");

let files = JSON.parse(localStorage.getItem("files")) || [];

function closeTheCont() {
    document.getElementById("cont2").style.animation = " closeC2 0.3s linear";
    setTimeout(function () {
        document.getElementById("cont2").style.display = "none";
    }, 300);
}
function renderFiles() {
    // Display the 5 most recent files
    recentList.innerHTML = files.map((file, index) => `
        <li onclick="loadFile(${index})" ondblclick="toggleDeleteMode()" >
          <span  onclick="loadFile(${index})">${index + 1}. ${file.title}</span>
          <span id="tooltip" class="tooltip">${file.date}</span>
          <input  class="checkbox" type="checkbox" data-index="${index}">
        </li>
      `).join("") || "<li>No saved files yet.</li>";
}

function openSavedItemsDialog() {
    savedItemsList.innerHTML = recentList.innerHTML;
    savedItemsDialog.showModal();
    document.body.style.filter = "blur(20px)";
}

function closeSavedItemsDialog() {
    savedItemsDialog.close();
    document.body.style.filter = "none";
}

function saveFile() {
    const title = document.getElementById("titleInput").value.trim();
    const content = document.getElementById("inputArea").value.trim();
    if (!content) {
        alertMessage.textContent = "You can not save an empty file.";
        alertDialog.showModal();
        return;
    }
    if (!title) {
        document.getElementById("titleInput").value = "Untitled Document";
        saveFile();
        return;
    }
    if (title.length > 30) {
        alertMessage.textContent = "The title can contains only 30 letters.";
        alertDialog.showModal();
        return;
    }

    files.push({
        title,
        content,
        date: new Date().toLocaleString()
    });
    localStorage.setItem("files", JSON.stringify(files));
    renderFiles();
    document.getElementById("titleInput").value = "";
    document.getElementById("inputArea").value = "";
}

function loadFile(index) {
    const file = files[index];
    document.getElementById("titleInput").value = file.title;
    document.getElementById("inputArea").value = file.content;
    document.getElementById("cont2").style.display = "block";
    document.getElementById("cont2").style.animation = " openC2 0.3s linear";
    document.getElementById("ttl2").textContent = file.title;
    document.getElementById("texts").textContent = file.content;
}

function toggleDeleteMode() {
    const isDeleting = deleteToggle.textContent === "Delete";
    deleteToggle.textContent = isDeleting ? "Close Selection" : "Delete";
    deleteOptions.classList.toggle("visible", isDeleting);

    document.querySelectorAll(".checkbox").forEach(checkbox => {
        checkbox.style.display = isDeleting ? "inline-block" : "none";
    });
}

function selectAll() {
    document.querySelectorAll(".checkbox").forEach(checkbox => (checkbox.checked = true));
}

function deselectAll() {
    document.querySelectorAll(".checkbox").forEach(checkbox => (checkbox.checked = false));
}

function deleteSelectedFiles() {
    const selectedIndexes = Array.from(document.querySelectorAll(".checkbox:checked"))
        .map(checkbox => parseInt(checkbox.dataset.index));

    files = files.filter((_, index) => !selectedIndexes.includes(index));
    localStorage.setItem("files", JSON.stringify(files));
    renderFiles();
    toggleDeleteMode();
}

function closeDialog() {
    alertDialog.close();
}

renderFiles();

const numParticles = 50; // Fewer particles
const particleBg = document.querySelector(".particle-bg");

for (let i = 0; i < numParticles; i++) {
    const particle = document.createElement("div");
    particle.classList.add("particle");
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 1000}px`;
    particle.style.animationDuration = `${Math.random() * 5 + 10}s`;
    particleBg.appendChild(particle);
}

document.getElementById('titleInput').addEventListener("input", updtRming);
function updtRming() {
    const title = document.getElementById('titleInput').value.trim();
    const numberOfttl = title.length;
    let maxChar = 30;

    if (numberOfttl > maxChar) {
        document.getElementById("rmning").textContent = "⚠️" + numberOfttl;
        document.getElementById('warXtra').style.color = "#ff0000d6";
    } else {
        document.getElementById("rmning").textContent = numberOfttl;
        document.getElementById('warXtra').style.color = "#ffffff78";
    }
}