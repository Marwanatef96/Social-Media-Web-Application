/** @format */

getPosts(true, 1);
let currentPage = 1;
let lastPage = 1;
let scrolling = false;
window.addEventListener("scroll", function () {
    let endOfPage =
        window.scrollY + window.innerHeight + 1 >=
        document.documentElement.scrollHeight;
    if (endOfPage && !scrolling && currentPage < lastPage) {
        scrolling = true;
        currentPage++;
        getPosts(false, currentPage);
    }
});

setupUI();

function userClicked(id) {
    window.location = `profile.html?userid=${id}`;
}

function getPosts(reload = 1, currentPage = 1) {
    if (reload && document.getElementById("posts")) {
        document.getElementById("posts").innerHTML = "";
    }

    toggleloader(true);
    axios
        .get(`${baseUrl}/posts?page=${currentPage}&limit=5`)
        .then((response) => {
            toggleloader(false);
            lastPage = response.data.meta.last_page;
            let posts = response.data.data;

            for (post of posts) {
                let user = getCurrentUser();
                let isMyPost = user != null && post.author.id == user.id;
                let buttonContent = `<button type="button" class="btn btn-outline-info " onclick="editClicked('${encodeURIComponent(
                    JSON.stringify(post)
                )}')">edit</button>`;
                let buttonDElete = `<button type="button" class="btn btn-outline-danger " onclick="deleteClicked('${encodeURIComponent(
                    JSON.stringify(post)
                )}')">Delete</button>`;
                let content = `
                        <div class="card my-4 " >
                            <div class="card-header d-flex justify-content-between">
                                <div style="cursor: pointer;" onClick="userClicked(${
                                    post.author.id
                                })">
                                    <img src="${
                                        post.author.profile_image
                                    }" alt="Profile Pic"
                                        class="border border-2 rounded-circle me-2" style="width: 40px; height: 40px;">
                                    <b>${post.author.username}</b>
                                </div>
                                <div> 
                                    ${isMyPost ? buttonDElete : ""}
                                    ${isMyPost ? buttonContent : ""}
                                </div>

                            </div>
                            <div class="card-body role="button"  onclick="postClicked(${
                                post.id
                            })"" >
                                <div class="d-flex justify-content-center">
                                    <img src="${post.image}"
                                        class=" img-fluid" alt="">
                                    </div>
                                <h6 class="mt-2 text-secondary">${
                                    post.created_at
                                }</h6>
                                <h5 class="card-title">${post.title || ""}</h5>
                                <p class="card-text"> ${post.body}</p>
                                <hr>
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                        class="bi bi-pen" viewBox="0 0 16 16">
                                        <path
                                            d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z" />
                                    </svg>
                                    <span>
                                        (${post.comments_count}) Comments
                                        <span id="postTags-${post.id}">
                                        
                                        </span>
                                    </span>
                                </div>
                                </div>
                            </div>
                        </div>
                        `;
                document
                    .getElementById("posts")
                    .insertAdjacentHTML("beforeend", content);
                document.getElementById(`postTags-${post.id}`).innerHTML = "";
                for (tag of post.tags) {
                    let tagContent = `    <button class="btn btn-sm rounded-5 text-light bg-secondary fw-bold shadow">${tag.name}</button>`;
                    document.getElementById(`postTags-${post.id}`).innerHTML +=
                        tagContent;
                }
                if (reload) {
                    window.scrollTo(0, 0);
                }
            }
        })
        .catch((error) => {
            console.log(error);
        })
        .then(() => {
            toggleloader(false);
            scrolling = false;
        });
}

function postClicked(id) {
    window.location = `postDetails.html?postId=${id}`;
}

function createPostClicked() {
    document.getElementById("postModalLabel").innerHTML = "Create New Post";
    document.getElementById("createModalBtn").innerHTML = "Post";
    document.getElementById("postID").value = "";
    document.getElementById("createPostTitle").value = "";
    document.getElementById("createPostBody").value = "";
    let postModal = new bootstrap.Modal(
        document.getElementById("addPostModal"),
        {}
    );
    postModal.toggle();
}
