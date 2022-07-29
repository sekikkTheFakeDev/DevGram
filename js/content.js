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

function getUTC(date) {
    let now_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(),
                date.getUTCDate(), date.getUTCHours(),
                date.getUTCMinutes(), date.getUTCSeconds());

    let utc = new Date(now_utc)
    return utc
}

//POST POST
document.querySelector(".postbtn").addEventListener("click", (e) => {
    let textarea = document.querySelector("#newpost")
    
    if (textarea.value.trim().length !== 0) {
        let post = new Post()
        let session = new Session()

        async function pcr() {
            post.user_id = session.getCurrent()
            post.created_at = getUTC(new Date())
            post.content = textarea.value
    
            let data = await post.create()
            return data
        }

        async function cE(post) {
            let data = await pcr()
            let session = new Session()
            let id = session.getCurrent()

            let user = new User()
            user.user_id = id
        
            let userd = await user.get_data()

            let postelem = document.createElement("div")
            postelem.classList.add("postelement")
            postelem.id = data.id

            post.createElement(postelem, "@" + userd.username, userd.image)

            //add click listener for like and comment
            post.like_listener(postelem)
            post.post_id = data.id
            post.comment_listener(userd.username, userd.image, document, postelem)

            let posts = document.querySelector(".posts")

            posts.insertBefore(postelem, posts.firstChild)
        }
        cE(post)
        textarea.value = ""
    }

})

// LOAD DATA
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
    document.querySelector("#newpost").placeholder = "Hey " + userd.username + ", what's on your mind?"

    //POSTS

    //get all posts
    let post = new Post()
    post.user_id = id
    let posts = await post.getPosts()

    //loop trough the posts
    posts.forEach(async p => {
        //get the creator of the post
        let cuser = new User()
        cuser.user_id = p.user_id
        let cdata = await cuser.get_data()

        let sid = new Session().getCurrent()

        //create the post element parent
        let postobj = new Post()
        postobj.created_at = getUTC(new Date(p.created_at))
        postobj.content = p.content
        postobj.likes = p.likes
        postobj.comments = p.comments
        postobj.post_id = p.id

        let postelem = document.createElement("div")
        postelem.classList.add("postelement")
        postelem.id = p.id

        //create the children
        postobj.createElement(postelem, "@" + cdata.username, cdata.image)
        //add click listener for like and comment
        postobj.like_listener(postelem)
        postobj.comment_listener(cdata.username, cdata.image, document, postelem)

        //check if the logged user has liked the post
        if (p.likes.includes(sid)) {
            postelem.querySelector(".licon").innerHTML = '<i class="fa-solid fa-heart"></i>'
            postelem.querySelector(".licon").classList.add("liked")
        }


        //apend the postelem in the posts container
        let posts = document.querySelector(".posts")
        posts.insertBefore(postelem, posts.firstChild)

    })

    
    //NEWS
    let d = new Date()
    let news = new News()
    news.date = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
    news.load()

}

load()

//CLOSE COMMENT
document.querySelector(".x").addEventListener("click", (e) => {
   document.querySelector(".blur").style.display = "none"
   document.querySelector(".comments").innerHTML = ""
}) 

//POST COMMENT

document.querySelector(".cpbtn").addEventListener("click", (e) => {
    let input = document.querySelector(".cinp")

    if (input.textContent !== "") {
        async function createc() {
            let comment = new Comment()
            // get the logged user_id and the id of the post that is commented on
            let user_id = new Session().getCurrent()
            let post_id = e.target.parentElement.parentElement.parentElement.querySelector(".cpost").id
            //data for comment
            comment.user_id = user_id
            comment.post_id = post_id
            comment.created_at = getUTC(new Date())
            comment.content = input.textContent
            
            //create the comment
            let cdata = await comment.create()

            //get the post that is commented on
            let post = new Post()
            post.post_id = post_id
            let postobj = await post.getPost()

            //append the comment id in the post
            postobj.comments.push(cdata.id)

            //update the post data
            post.update(postobj)

            //get the current user data
            let u = new User()
            u.user_id = user_id
            let udata = await u.get_data()

            //create parent element for comment
            let parent = document.createElement("div")
            parent.classList.add("comment")

            //add children
            comment.createElement(parent, udata.username, udata.image)

            //insert the comment
            let container = document.querySelector(".comments")
            container.insertBefore(parent, container.firstChild)

        }
        createc()
        input.textContent = ""

    }
})





