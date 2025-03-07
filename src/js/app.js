const paymentSystems = ["visa", "mastercard", "amex", "mir", "jcb"];
// const iconsPath = "img/";
const variants = ["", "outline"];

function importAll(r) {
    let images = {};
    r.keys().map((item, index) => {
        images[item.replace("./", "")] = r(item);
    });
    return images;
}
const images = importAll(
    require.context("../img", false, /\.(png|jpe?g|svg)$/),
);

function validateCardNumber(cardNumber) {
    cardNumber = cardNumber.replaceAll(/[- ]/g, "");
    if (!/^\d{13,19}$/.test(cardNumber)) return false;
    if (isNaN(cardNumber)) return false;
    let sum = 0;
    let shouldDouble = false;
    for (let i = cardNumber.length - 1; i >= 0; i--) {
        let digit = Number(cardNumber[i]);
        if (shouldDouble) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }
        sum += digit;
        shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0;
}

function getPaymentSystem(cardNumber) {
    cardNumber = cardNumber.replaceAll(/[- ]/g, "");
    if (!/^\d{13,19}$/.test(cardNumber)) return null;
    if (cardNumber.startsWith("4")) return paymentSystems[0];
    if (/^5[1-5]/.test(cardNumber)) return paymentSystems[1];
    if (/^3[47]/.test(cardNumber)) return paymentSystems[2];
    if (/^220[0-4]/.test(cardNumber)) return paymentSystems[3];
    if (/^(?:2131|1800|35)/.test(cardNumber)) return paymentSystems[4];
    return null;
}

function drawPaymentSystemIcon(container, paymentSystem) {
    console.log(123);
    const deselectedVariant = variants[1];
    if (typeof container === "string")
        container = document.querySelector(container);
    if (!container) return;

    container.innerHTML = "";

    let variant;
    for (let system of paymentSystems) {
        let icon = document.createElement("img");
        if (paymentSystem == system || !paymentSystems.includes(paymentSystem))
            variant = variants[0];
        else variant = deselectedVariant;
        icon.src =
            images[`${system}${variant === "" ? variant : "-" + variant}.svg`];
        icon.className = "payment-icon";
        icon.alt = system;
        container.appendChild(icon);
    }
}

drawPaymentSystemIcon(document.querySelector(".payment-icons"));
document.querySelectorAll(".payment-form").forEach((form) => {
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const cardNumber = form.querySelector("#card-number").value;
        if (!validateCardNumber(cardNumber)) {
            document.querySelector(".error-message").style.display = "block";
        } else {
            document.querySelector(".error-message").style.display = "none";
        }
        let paymentSystem = getPaymentSystem(cardNumber);
        drawPaymentSystemIcon(
            document.querySelector(".payment-icons"),
            paymentSystem,
        );
    });
});
