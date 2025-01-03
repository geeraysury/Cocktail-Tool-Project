document.getElementById("password").addEventListener("input", function () {
    const password = this.value;

    // Requirements
    const lengthReq = password.length >= 8;
    const uppercaseReq = /[A-Z]/.test(password);
    const lowercaseReq = /[a-z]/.test(password);
    const numberReq = /[0-9]/.test(password);
    const specialReq = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    // Update requirement indicators
    updateRequirement("length", lengthReq);
    updateRequirement("uppercase", uppercaseReq);
    updateRequirement("lowercase", lowercaseReq);
    updateRequirement("number", numberReq);
    updateRequirement("special", specialReq);

    const allValid = lengthReq && uppercaseReq && lowercaseReq && numberReq && specialReq;
    document.getElementById("signupButton").disabled = !allValid;

    // Update strength meter
    const strength = [lengthReq, uppercaseReq, lowercaseReq, numberReq, specialReq].filter(req => req).length;
    updateStrengthBar(strength);
});

function updateRequirement(id, isValid) {
    const element = document.getElementById(id);
    if (isValid) {
        element.classList.add("valid");
    } else {
        element.classList.remove("valid");
    }
}

function updateStrengthBar(strength) {
    const bar = document.getElementById("strengthBar");
    const text = document.getElementById("strengthText");

    const colors = ["red", "orange", "yellow", "lightgreen", "green"];
    const widths = ["20%", "40%", "60%", "80%", "100%"];
    const strengthTexts = ["Very Weak", "Weak", "Moderate", "Strong", "Very Strong"];

    bar.style.width = widths[strength - 1] || "0%";
    bar.style.backgroundColor = colors[strength - 1] || "red";
    text.innerText = strengthTexts[strength - 1] || "Enter a password to check strength";
}
