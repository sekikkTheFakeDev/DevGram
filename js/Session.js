class Session {
    user_id = "";


    start() {
        let d = new Date()
        d.setTime(d.getTime() + (2*24*60*60*100))
        let expires = "expires=" + d.toUTCString()
        document.cookie = `user_id=${this.user_id}; ${expires}`
    }

    get() {
        let name = "user_id"
        let ca = document.cookie.split(";")

        let found = false

        for (let i=0; i<ca.length; i++) {
            let c = ca[i]
            c = c.split("=")
            if (c[0] === name) {
                found = true
                break
            }
        }

        if (found === true) {
            return true
        }
    }

    getCurrent() {
        let name = "user_id"
        let ca = document.cookie.split(";")

        let result

        for (let i=0; i<ca.length; i++) {
            let c = ca[i]
            c = c.split("=")
            if (c[0] === name) {
                result = c[1]
                break
            }
        }

        return result
    }

    destroy() {
        let name = "user_id"
        let ca = document.cookie.split(";")

        let found = false

        for (let i=0; i<ca.length; i++) {
            let c = ca[i]
            c = c.split("=")
            if (c[0] === name) {
                document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT"
                break
            }
        }
    }

}