class News {
    date = ""
    api = `https://newsapi.org/v2/everything?q=tech&from=${this.date}&to=${this.date}&sortBy=popularity&apiKey=2faed909dd884590a000362d326f743e`

    async load() {
        let res = await fetch(this.api)
        let data = await res.json()


        for (let i = 0; i<10; i++) {
            this.createElement(data.articles[i])
        }

    }

    createElement(data) {
        let newselem = document.createElement("div")
        newselem.classList.add("newselem")
        newselem.style.backgroundImage = `url(${data.urlToImage})`

        let container = document.querySelector(".newscont")

        newselem.innerHTML = `
        <div class="holder">
            <div class="texthldr">
                <a href="${data.url}" target="_blank" class="ntitle">${data.title}</a>
                <p class="ndesc">${data.description}</p>
            </div>
        </div>
        `

        container.insertBefore(newselem, container.firstChild)
    }
}