let session = new Session()
session = session.get()

if (session !== true) {
    window.location.href = "/html/"
}

//LOG OUT
document.querySelector(".lgbtn").addEventListener("click", (e) => {
    let session = new Session()
    session.destroy()

    window.location.href = "/html/"
})

//open/close the profile change
document.querySelector(".profileimg").addEventListener("click", (e) => {
    document.querySelector(".d").style.display = "flex"
})

document.querySelector(".ex").addEventListener("click", (e) => {
    document.querySelector(".d").style.display = "none"
})

//set image

document.querySelectorAll(".gridimage").forEach(gi => {
    gi.addEventListener("click", (e) => {
        let url = getComputedStyle(e.target).backgroundImage
        let img = url.slice(4, -1).replace(/"/g, "")
        
        document.querySelector(".d").style.display = "none"
        
        document.querySelector(".profileimg").style.backgroundImage = `url(${img})`
    
    })
})

//save

let config = {
    "username": {
        required: false,
        min: 4,
        max: 12
    },
    "email": {
        required: false,
        email: true,
        min: 5,
        max: 25
    },
    "password": {
        required: false,
        min: 8,
        max: 20,
    }
}

let validator = new Validator(config)

document.querySelector(".save").addEventListener("click", async (e) => {

    if (validator.validationPassed()) {
        let username = document.querySelector("#username").value
        let email = document.querySelector("#email").value
        let password = document.querySelector("#password").value
    
        let url = document.querySelector(".profileimg").style.backgroundImage
        let img = url.slice(4, -1).replace(/"/g, "")
    
        let user = new User()
        user.user_id = new Session().getCurrent()
    
        let data = await user.get_data()
        
        data.username = ((username === "") ? data.username : username)
        data.email = ((email === "") ? data.email : email)
        data.password = ((password === "") ? data.password : password)
        data.image = img

        data = JSON.stringify(data)

        user.update(data)
    }



})

//load
async function load() {
    //get the logged in id
    let session = new Session()
    let id = session.getCurrent()

    //get the logged in data
    let user = new User()
    user.user_id = id
    let userd = await user.get_data()

    //put username and image on left side
    document.querySelector(".user").textContent = "@" + userd.username
    document.querySelector(".image").style.backgroundImage = `url(${userd.image})`

    //put image, username, email

    document.querySelector(".profileimg").style.backgroundImage = `url(${userd.image})`
    document.querySelector("#username").value = userd.username
    document.querySelector("#email").value = userd.email


    //NEWS
    let d = new Date()
    let news = new News()
    news.date = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
    news.load()


}

load()
