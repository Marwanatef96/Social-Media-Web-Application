/** @format */

setupUI();

let urlPrams = new URLSearchParams(window.location.search);
let id = urlPrams.get("postId");
getPost();

function getPost() {
    document.getElementById("posts").innerHTML = "";
    toggleloader(true);
    axios
        .get(`${baseUrl}/posts/${id}`)
        .then((response) => {
            toggleloader(false);
            let post = response.data.data;
            let comments = post.comments;
            document.getElementById("usernameSpan").innerHTML =
                post.author.username + "'s Post";
            let commentsContent = "";

            for (comment of comments) {
                commentsContent += `
                            <div class="d-flex mb-3 ms-4 ">
                                <img src="${comment.author.profile_image}" alt="Profile Pic"
                                    class="rounded-circle me-3" width="40" height="40">
                                    <div class="p-2 bg-light rounded-3 shadow-sm">
                                        <b class="text-dark">${comment.author.username}</b>
                                        <div class="text-dark"> ${comment.body}
                                        </div>
                                </div>
                            </div>
                                `;
            }

            let content = `
                                            <div class="card my-4 " >
                            <div class="card-header">
                                <img src="${
                                    post.author.profile_image
                                }" alt="Profile Pic"
                                    class="border border-2 rounded-circle" style="width: 40px; height: 40px;">
                                <b>${post.author.username}</b>
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
                                <div id="comments">
                                    ${commentsContent}
                            </div>
                            <form class="d-flex m-1 form-floating"  onsubmit="addComment(${
                                post.id
                            })" id="addCommmentDiv">
                                <input type="text" id = "addCommment" class="form-control" placeholder="Leave a comment here" id="floatingTextarea"></input>
                                <label for="floatingTextarea">Comments</label>
                                <button type="button" class="btn btn-outline-primary ms-2" onclick="addComment(${
                                    post.id
                                })">Send</button>
                            </form>
                            </div>
                
                        </div>
                        `;
            document
                .getElementById("posts")
                .insertAdjacentHTML("beforeend", content);
        })
        .catch((error) => {
            console.log(error);
        })
        .finally(() => {
            toggleloader(false);
        });
}

function addComment(postId) {
    event.preventDefault();
    let comment = document.getElementById("addCommment").value;
    toggleloader(true);
    axios
        .post(
            `${baseUrl}/posts/${postId}/comments`,
            {
                body: comment,
            },
            {
                headers: {
                    authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        )
        .then((response) => {
            toggleloader(false);
            showSuccessAlert("the Comment has been added successfully", "");
            // getPost();
            let content = `
                            <div class="d-flex mb-3 ms-4 ">
                                <img src="${response.data.data.author.profile_image}" alt="Profile Pic"
                                    class="rounded-circle me-3" width="40" height="40">
                                    <div class="p-2 bg-light rounded-3 shadow-sm">
                                        <b class="text-dark">${response.data.data.author.username}</b>
                                        <div class="text-dark"> ${response.data.data.body}
                                        </div>
                                </div>
                            </div>`;
            document
                .getElementById("comments")
                .insertAdjacentHTML("beforeend", content);
        })
        .catch((error) => {
            let allErrors = "An error occurred";

            if (error.response && error.response.data) {
                const data = error.response.data;

                if (data.errors) {
                    allErrors = Object.values(data.errors).flat().join("<hr>");
                } else if (data.message) {
                    allErrors = data.message;
                }
            } else if (error.message) {
                allErrors = error.message;
            }

            showSuccessAlert(allErrors, "danger");
        })
        .then(() => {
            document.getElementById("addCommment").value = "";
            toggleloader(false);
        });
}
