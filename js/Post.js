class Post {
    post_id = ""
    user_id = ""
    created_at = ""
    content = ""
    likes = []
    comments = []
    api = "https://62cb31993e924a012864b5cb.mockapi.io"

    async create() {
        let data = {
            user_id: this.user_id,
            created_at: this.created_at,
            content: this.content,
            likes: this.likes,
            comments: this.comments
        }

        data = JSON.stringify(data)

        let res = await fetch(this.api + "/posts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: data
        })
        let rdata = res.json()

        return rdata

    }

    createElement(parent, user, image) {
        parent.innerHTML = `
        <div class="info">
            <div class="usr">
                <div class="usrimage" style="background-image: url(${image})"></div>
                <p class="usrname">${user}</p>
            </div>
            <p class="ptime">${this.getTime()}</p>
        </div>
        <div class="postcont">
            <p class="ptext"></p>
        </div>
        <div class="likcom">
            <div class="lik">
                <div class="licon"><i class="fa-regular fa-heart"></i></div>
                <p class="lcnum">${this.likes.length}</p>
            </div>
            <div class="com">
                <div class="cicon"><i class="fa-regular fa-comment"></i></div>
                <p class="lcnum">${this.comments.length}</p>
            </div>
        </div>
        `

        parent.querySelector(".ptext").textContent = this.content

    }

    like_listener(parent) {
        async function like(element) {
            let user_id = new Session().getCurrent()
        
            let post = new Post()
            post.post_id = element.parentElement.parentElement.parentElement.id
        
            let data = await post.getPost()
        
            if (element.classList.contains("liked")) {
                element.classList.remove("liked")
                element.innerHTML = '<i class="fa-regular fa-heart"></i>'
                if (data.likes.indexOf(user_id) > -1) {
                    data.likes.splice(data.likes.indexOf(user_id), 1)
                }
                element.parentElement.querySelector(".lcnum").textContent = data.likes.length
            }
            else {
                element.classList.add("liked")
                element.innerHTML = '<i class="fa-solid fa-heart"></i>'
                data.likes.push(user_id)
                element.parentElement.querySelector(".lcnum").textContent = data.likes.length
            }
        
            post.update(data)
        
        }

        parent.querySelector(".licon").addEventListener("click", (e) => like(e.target))
    }
    
    comment_listener(username, image, document, parent) {
        async function comment(id, username, image, time, content, document, element) {
            document.querySelector(".blur").style.display = "flex"

            let parent = document.querySelector(".cpost")

            parent.querySelector(".usrimage").style.backgroundImage = `url(${image})`
            parent.querySelector(".usrname").textContent = "@" + username
            parent.querySelector(".ptime").textContent = time
            parent.querySelector(".ptext").textContent = content
            parent.id = id

            let comobj = new Comment()
            comobj.post_id = id
            comobj.load()

        } 

        parent.querySelector(".cicon").addEventListener("click", (e) => comment(this.post_id, username, image, this.getTime(), this.content, document, e.target))
    }

    getTime() {
        let date = new Date();
        let now_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(),
                    date.getUTCDate(), date.getUTCHours(),
                    date.getUTCMinutes(), date.getUTCSeconds());
    
        let now = new Date(now_utc)

        let milliseconds = now - this.created_at
    
        function numberEnding (number) {
            return (number > 1) ? 's ago' : ' ago';
        }
    
        var temp = Math.floor(milliseconds / 1000);
        var years = Math.floor(temp / 31536000);
        if (years) {
            return years + ' year' + numberEnding(years);
        }

        var days = Math.floor((temp %= 31536000) / 86400);
        if (days) {
            return days + ' day' + numberEnding(days);
        }
        var hours = Math.floor((temp %= 86400) / 3600);
        if (hours) {
            return hours + ' hour' + numberEnding(hours);
        }
        var minutes = Math.floor((temp %= 3600) / 60);
        if (minutes) {
            return minutes + ' minute' + numberEnding(minutes);
        }
        var seconds = temp % 60;
        if (seconds) {
            return seconds + ' second' + numberEnding(seconds);
        }
        return 'just now'; 
    }

    async getPosts() {
        let res = await fetch(this.api + "/posts")
        let data = res.json()

        return data
    }

    async getPost() {
        let res = await fetch(this.api + "/posts/" + this.post_id)
        let data = res.json()

        return data     
    }

    update(data) {
        data = JSON.stringify(data)
        fetch(this.api + "/posts/" + this.post_id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: data
        })
    }
}