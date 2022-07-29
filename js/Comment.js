class Comment {
    comment_id = ""
    user_id = ""
    post_id = ""
    created_at = ""
    content = ""
    api = "https://62cb31993e924a012864b5cb.mockapi.io"

    async create() {
        let data = {
            user_id: this.user_id,
            post_id: this.post_id,
            created_at: this.created_at,
            content: this.content,
            likes: this.likes,
            comments: this.comments
        }

        data = JSON.stringify(data)

        let res = await fetch(this.api + "/comments", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: data
        })
        let rdata = res.json()

        return rdata
    }

    createElement(parent, username, image) {
        parent.innerHTML = `
        <div class="info">
            <div class="usr">
                <div class="usrimage" style="background-image: url(${image})"></div>
                <div class="usrname">@${username}</div>
            </div>
            <div class="ptime">${this.getTime()}</div>
        </div>
        <div class="postcont">
            <p class="ptext"></p>
        </div>        
        `
        parent.querySelector(".ptext").textContent = this.content
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

    async load() {
        let res = await fetch(this.api + "/comments")
        let data = await res.json()

        data.forEach(async comment => {
            if (comment.post_id === this.post_id) {
                
                let comobj = new Comment()

                function getUTC(date) {
                    let now_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(),
                                date.getUTCDate(), date.getUTCHours(),
                                date.getUTCMinutes(), date.getUTCSeconds());
                
                    let utc = new Date(now_utc)
                    return utc
                }
                comobj.created_at = getUTC(new Date(comment.created_at))
                comobj.content = comment.content

                let u = new User()
                u.user_id = comment.user_id
                let udata = await u.get_data()

                //create parent element for comment
                let parent = document.createElement("div")
                parent.classList.add("comment")

                //add children
                comobj.createElement(parent, udata.username, udata.image)

                //insert the comment
                let container = document.querySelector(".comments")
                container.insertBefore(parent, container.firstChild)

            }
        })
    }
}