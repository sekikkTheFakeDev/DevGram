let session = new Session()
session = session.get()

if (session === true) {
    window.location.href = "content.html"
}

// OPEN/CLOSE REGISTER
document.querySelector("#reg").addEventListener("click", (e) => {
    document.querySelector(".wrapper .blur").style.display = "flex"
})

document.querySelector(".x").addEventListener("click", (e) => {
    document.querySelector(".wrapper .blur").style.display = "none"
})



//VALIDATOR
let config = {
    "email": {
        required: true,
        email: true,
        min: 5,
        max: 25
    },
    "password": {
        required: true,
        min: 8,
        max: 20
    },
    "email2": {
        required: true,
        email: true,
        min: 5,
        max: 25
    },
    "password2": {
        required: true,
        min: 8,
        max: 20
    },
    "username": {
        required: true,
        min: 4,
        max: 12
    }
}

let validator = new Validator(config)

// REGISTER

document.querySelector("#registerForm").addEventListener("submit", (e) => {

    e.preventDefault()

    let allFull = true

    document.querySelectorAll("#registerForm input").forEach((input) => {
        if (input.value === "") {
            allFull = false
        }
    })

    if (validator.validationPassed() && allFull) {

        async function createUser() {
            let user = new User()
            user.username = document.querySelector(`input[name="username"]`).value
            user.email = document.querySelector(`input[name="email2"]`).value
            user.password = document.querySelector(`input[name="password2"]`).value
            user.config = config
    
            await user.create()
        }

        createUser()

    }
})



// LOGIN 
document.querySelector("#loginForm").addEventListener("submit", (e) => {
    e.preventDefault()
    
    let allFull = true
    
    document.querySelectorAll("#loginForm input").forEach((input) => {
        if (input.value === "") {
            allFull = false
        }
    })
    
    let user = new User()
    user.email = document.querySelector("input[name='email']").value
    user.password = document.querySelector("input[name='password']").value
    user.login()
})