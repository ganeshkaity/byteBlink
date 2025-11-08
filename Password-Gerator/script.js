const passLength = document.querySelector("#length2");
const numbCkbox = document.querySelector("#numbers");
const uppeCkbox = document.querySelector("#uppercase");
const lowerCkbox = document.querySelector("#lowercase");
const speciaCkbox = document.querySelector("#special");
const passwordBox = document.querySelector("#passwordBox");

const allNumbers = "1234567890";
const allUppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const allLowercase = "abcdefghijklmnopqrstuvwxyz";
const allSpecial = "!@#$%^&*()~";

document.getElementById("length2").addEventListener("input", () => {
    if (document.getElementById("length2").value < 36 && document.getElementById("length2").value > 4) {
        document.getElementById("rightPass").innerText = `Length : ${document.getElementById("length2").value}`;
    }
    else if (document.getElementById("length2").value == 36) {
        document.getElementById("rightPass").innerText = `Length : ${document.getElementById("length2").value} (max)`;
    }
    else if (document.getElementById("length2").value == 4) {
        document.getElementById("rightPass").innerText = `Length : ${document.getElementById("length2").value} (min)`;
    }
});

function generatePassword() {
    let password = "";
    if (numbCkbox.checked == false && uppeCkbox.checked == false && lowerCkbox.checked == false && speciaCkbox.checked == false) {
        alert("Please Select Atleast 1 Option");
        return;
    }
    if (numbCkbox.checked == true) {
        for (let i = 0; i < passLength.value; i++) {
            const randIndex = Math.floor(Math.random() * allNumbers.length);
            password += allNumbers[randIndex];
        }
    }
    if (uppeCkbox.checked == true) {
        for (let i = 0; i < passLength.value; i++) {
            const randIndex = Math.floor(Math.random() * allUppercase.length);
            password += allUppercase[randIndex];
            password = password.split("").sort(() => Math.random() - 0.5).join("");
        }
    }
    if (lowerCkbox.checked == true) {
        for (let i = 0; i < passLength.value; i++) {
            const randIndex = Math.floor(Math.random() * allLowercase.length);
            password += allLowercase[randIndex];
            password = password.split("").sort(() => Math.random() - 0.5).join("");
        }
    }
    if (speciaCkbox.checked == true) {
        for (let i = 0; i < passLength.value; i++) {
            const randIndex = Math.floor(Math.random() * allSpecial.length);
            password += allSpecial[randIndex];
            password = password.split("").sort(() => Math.random() - 0.5).join("");
        }
    }

    let newPass = "";

    for (let i = 0; i < passLength.value; i++) {
        const randIndex = Math.floor(Math.random() * password.length);
        newPass += password[randIndex];
        password = password.split("").sort(() => Math.random() - 0.5).join("");
    }

    newPass = newPass.split("").sort(() => Math.random() - 0.5).join("");
    passwordBox.value = newPass;
}

function clearAll() {
    numbCkbox.checked = true;
    uppeCkbox.checked = false;
    lowerCkbox.checked = false;
    speciaCkbox.checked = false;
    passLength.value = 4;
    alert("Default setting applied");
}

function copy() {
    var copyText = document.querySelector("#passwordBox");
    copyText.select();
    document.execCommand("copy");
    alert("Password Copied !");
}

document.querySelector("#copy").addEventListener("click", copy);
document.querySelector("#clearAll").addEventListener("click", clearAll);
document.querySelector("#generatePassword").addEventListener("click", generatePassword);

// ByteBlink

