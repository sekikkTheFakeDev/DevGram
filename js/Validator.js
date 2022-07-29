class Validator {
    constructor(config) {
        this.errors = {}
        this.config = config

        this.generateErrorObject()
        this.inputListener()
    }

    generateErrorObject() {
        for (let field in this.config) {
            this.errors[field] = ""
        }
    }

    inputListener() {
        for (let field in this.config) {
            let el = document.querySelector(`input[name="${field}"]`)

            el.addEventListener("input", this.validate.bind(this))
        }
    }

    validate(e) {
        let field = e.target
        let name = field.getAttribute("name")
        let value = field.value

        this.errors[name] = ""


        if (this.config[name].email) {
            if (!this.validateEmail(value)) {
                this.errors[name] = "Not a valid Email"
            }
        }

        if (value.length < this.config[name].min ) {
            this.errors[name] = "Too short"
            
            if (value.length === 0) {
                this.errors[name] = ""
            }
        }

        if (value.length > this.config[name].max ) {
            this.errors[name] = "Too long"
        }

        if (this.config[name].required) {
            if (value === "" ) {
                this.errors[name] = "This is required"
            }
        }

        this.populateErrors(name)
    }

    validateEmail(mail) {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
            return true
        }

        return false
    }

    populateErrors(name) {
        let errorEl = document.querySelector(`.${name} .error`)

        errorEl.textContent = this.errors[name]
    }

    specialError(name) {
        let errorEl = document.querySelector(`.${name} .error`)

        errorEl.textContent = "Already taken"
    }

    validationPassed() {
        for (let key of Object.keys(this.errors)) {
            if (this.errors[key].length > 0) {
                return false
            }
        }

        return true
    }
}