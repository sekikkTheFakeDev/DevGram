class User {
    user_id = ""
    username = ""
    email = ""
    password = ""
    config = ""
    api = "https://62cb31993e924a012864b5cb.mockapi.io"

    async create() {
        let data = {
            username: this.username,
            email: this.email,
            password: this.password,
            image: "https://pomocniludzie.pl/wp-content/uploads/2022/03/anonymous-czyli-hakerzy-z-misja.jpg"
        }

        data = JSON.stringify(data)

        let ok = await this.check()

        if (ok !== false) {
            fetch(this.api + "/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: data
            })
            .then(response => response.json())
            .then(data => {
                let session = new Session()
                session.user_id = data.id
                session.start()
                window.location.href = "content.html"
            })
        }
    }

    async check() {
        let res = await fetch(this.api + "/users")
        let rdata = await res.json()
        
        let validator = new Validator(this.config)

        let ok = true

        rdata.forEach(user => {
            if (user.username === this.username) {
                validator.specialError("username")
                ok = false
            }
    
            if (user.email === this.email) {
                validator.specialError("email2")
                ok = false
            }

        })
        return ok
    }

    login() {
        fetch(this.api + "/users").then(res => res.json()).then(data => {
            data.forEach(user => {
                if (this.email === user.email && this.password === user.password) {
                    let session = new Session()
                    session.user_id = user.id
                    session.start()
                    window.location.href = "content.html"
                }
            })
        })
    }

    async get_data() {
        let res = await fetch(this.api + "/users/" + this.user_id)
        let rdata = await res.json()
        return rdata
    }

    update(data) {
        fetch(this.api + "/users/" + this.user_id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: data
        }).then(res => res.json()).then(data => {
            window.location.reload()
        })
    }

}