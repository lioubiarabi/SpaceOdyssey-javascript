// getting the inputs value from contact form
let form = document.getElementById("form");
let firstName = document.getElementById("firstName");
let lastName = document.getElementById("lastName");
let email = document.getElementById("email");
let phone = document.getElementById("phone");
let message = document.getElementById("message");

form.addEventListener("input", ()=>{
    firstName.value && (console.log(/^[a-z]{3,20}$/i.test(firstName.value)));
})