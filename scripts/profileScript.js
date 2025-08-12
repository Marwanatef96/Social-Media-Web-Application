/** @format */

setupUI();

    let urlPrams = new URLSearchParams(window.location.search);
    let id = urlPrams.get("userid");

function getProfile() {
        toggleloader(true);
    axios
        .get(`${baseUrl}/users/${id}`)
        .then((response) => {
            toggleloader(false);
            let user = response.data.data;
            document.getElementById("mainEmail").innerHTML = user.email;
            document.getElementById("mainName").innerHTML = user.name;
            document.getElementById("mainUsername").innerHTML = user.username;
            document.getElementById("postsCount").innerHTML = user.posts_count;
            document.getElementById("commentsCount").innerHTML =
                user.comments_count;
            document.getElementById("mainPic").src = user.profile_image;
            document.getElementById("ss").innerHTML =
                user.username + "'s Posts";
        })
        .catch((error) => {
            console.log(error);
        })
        .finally(() => {
            toggleloader(false);
        });
}

function getUserposts() {
        toggleloader(true);
    axios
        .get(`${baseUrl}/users/${id}/posts`)
        .then((response) => {
            toggleloader(false);
            document.getElementById("user-posts").innerHTML = "";
            let posts = response.data.data;
            for (post of posts) {
                let user = getCurrentUser();
                let isMyPost = user != null && post.author.id == user.id;
                console.log(post);
                let buttonContent = `<button type="button" class="btn btn-outline-info " onclick="editClicked('${encodeURIComponent(
                    JSON.stringify(post)
                )}')">edit</button>`;
                let buttonDElete = `<button type="button" class="btn btn-outline-danger " onclick="deleteClicked('${encodeURIComponent(
                    JSON.stringify(post)
                )}')">Delete</button>`;
                let content = `
                        <div class="card my-4 " >
                            <div class="card-header d-flex justify-content-between">
                                <div>
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
                    .getElementById("user-posts")
                    .insertAdjacentHTML("beforeend", content);
                document.getElementById(`postTags-${post.id}`).innerHTML = "";
                for (tag of post.tags) {
                    let tagContent = `    <button class="btn btn-sm rounded-5 text-light bg-secondary fw-bold shadow">${tag.name}</button>`;
                    document.getElementById(`postTags-${post.id}`).innerHTML +=
                        tagContent;
                }
            }
        })
        .catch((error) => {
            console.log(error);
        })
        .finally(() => {
            toggleloader(false);
        });
}

getProfile();

getUserposts();