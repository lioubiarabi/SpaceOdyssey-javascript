// getting the inputs value from contact form
let form = document.getElementById("form");
let firstName = document.getElementById("firstName");
let lastName = document.getElementById("lastName");
let email = document.getElementById("email");
let phone = document.getElementById("phone");
let subject = document.getElementById("select").querySelectorAll("input:checked")[0];
let message = document.getElementById("message");
let alertError = document.getElementById("alertError");

console.log(document.querySelectorAll("label"))

form.addEventListener("input", () => {
    //delete the worning msg if it's visible
    alertError.style.display = "none";

    firstName.value && (validate(firstName, /^[a-z]{3,20}$/i));
    lastName.value && (validate(lastName, /^[a-z]{3,20}$/i));
    email.value && (validate(email, /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/));
    phone.value && (validate(phone, /^(\+)?\d{10,}$/));
    message.value && (validate(message, /\S{2,}/));
})

form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (validate(firstName, /^[a-z]{3,20}$/i) && validate(lastName, /^[a-z]{3,20}$/i) && validate(email, /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/) && validate(phone, /^(\+)?\d{10,}$/) && validate(message, /\S{2,}/)) {
        // redirect to success contact page 
        window.open(`./success.html?firstName=${firstName.value}&lastName=${lastName.value}`, "_self");
    } else {
        // show error msg
        alertError.textContent = "All fields must be filled in.";
        alertError.style.display = "block";
    }

});


function validate(input, regex) {
    if (regex.test(input.value)) {
        input.style.borderColor = "#e5e7eb";
        return true;
    } else {
        input.style.borderColor = "red"
        return false;
    }
}

