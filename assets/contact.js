// getting the inputs value from contact form
let form = document.getElementById("form");
let firstName = document.getElementById("firstName");
let lastName = document.getElementById("lastName");
let email = document.getElementById("email");
let phone = document.getElementById("phone");
let message = document.getElementById("message");

form.addEventListener("input", ()=>{
    firstName.value && (validate(firstName, /^[a-z]{3,20}$/i));
    lastName.value && (validate(lastName, /^[a-z]{3,20}$/i));
    email.value && (validate(email, /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/));
    phone.value && (validate(phone, /^(\+)?\d{10,}$/));
    message.value && (validate(message, /\S{2,}/));
})

function validate(input, regex) {
    if(regex.test(input.value)) {
        input.style.borderColor = "#e5e7eb"
    } else {
        input.style.borderColor = "red"
    }
}