/** @format */
const baseUrl = "https://tarmeezacademy.com/api/v1";
let deleteID = "";
function setupUI() {
    let token = localStorage.getItem("token");
    let loginBtn = document.getElementById("loginBtn");
    let registerBtn = document.getElementById("registerBtn");
    let logoutBtn = document.getElementById("logoutBtn");
    let addPostBtn = document.getElementById("addPostBtn");
    let addCommmentDiv = document.getElementById("addCommmentDiv");

    if (!token) {
        loginBtn.style.display = "block";
        registerBtn.style.display = "block";
        logoutBtn.style.display = "none";
        if (addPostBtn != null) {
            addPostBtn.style.display = "none";
        }
        if (addCommmentDiv != null) {
            addCommmentDiv.style.setProperty("display", "none", "important");
        }
    } else {
        loginBtn.style.display = "none";
        registerBtn.style.display = "none";
        logoutBtn.style.display = "block";
        if (addPostBtn != null) {
            addPostBtn.style.display = "flex";
        }
        if (addCommmentDiv != null) {
            addCommmentDiv.style.setProperty("display", "flex", "important");
        }

        let user = getCurrentUser();
        document.getElementById("navUserName").innerHTML = user.username;
        document.getElementById("navUserPic").src = user.profile_image;
    }
}
function loginBtnClicked() {
    let username = document.getElementById("userText").value;
    let password = document.getElementById("passwordText").value;
    toggleloader(true);
    axios
        .post(`${baseUrl}/login`, {
            username: username,
            password: password,
        })
        .then((response) => {
            toggleloader(false);
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));
            let modal = document.getElementById("loginModal");
            let modalInstance =
                bootstrap.Modal.getInstance(modal) ||
                new bootstrap.Modal(modal);
            modalInstance.hide();
            setupUI();
            showSuccessAlert("You Logged In Successfully", "");
        })
        .catch((error) => {
            let allErrors = Object.values(error.response.data.errors)
                .flat()
                .join("<hr>");
            showSuccessAlert(allErrors, "danger");
        })
        .finally(() => {
            toggleloader(false);
        });
}

function registerBtnClicked() {
    let username = document.getElementById("registerUsername").value;
    let password = document.getElementById("registerPassword").value;
    let name = document.getElementById("registerName").value;
    let image = document.getElementById("registerImage").files[0];
    let formData = new FormData();
    formData.append("image", image);
    formData.append("username", username);
    formData.append("password", password);
    formData.append("name", name);
    toggleloader(true);
    axios
        .post(`${baseUrl}/register`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
        .then((response) => {
            toggleloader(false);
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));
            let modal = document.getElementById("registerModal");
            let modalInstance =
                bootstrap.Modal.getInstance(modal) ||
                new bootstrap.Modal(modal);
            modalInstance.hide();
            setupUI();
            showSuccessAlert("New User Registered Successfully", "");
        })
        .catch((error) => {
            let allErrors = Object.values(error.response.data.errors)
                .flat()
                .join("<hr>");
            showSuccessAlert(allErrors, "danger");
        })
        .finally(() => {
            toggleloader(false);
        });
}

function showSuccessAlert(message, bg) {
    const alertPlaceholder = document.getElementById("successAlert");

    const wrapper = document.createElement("div");
    wrapper.innerHTML = [
        `<div class="alert alert-success bg-${bg} alert-dismissible d-flex justify-content-center mb-0 " role="alert " >`,
        `   <div class="d-flex flex-column ">${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        "</div>",
    ].join("");

    alertPlaceholder.append(wrapper);
    setTimeout(() => {
        wrapper.classList.add("fade");
        setTimeout(() => wrapper.remove(), 150);
    }, 3000);
}

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setupUI();
    showSuccessAlert("You Logged Out Successfully", "");
}
function getCurrentUser() {
    let user = null;
    let storgeUser = localStorage.getItem("user");
    if (storgeUser != null) {
        user = JSON.parse(storgeUser);
    }
    return user;
}

function editClicked(id) {
    post = JSON.parse(decodeURIComponent(id));
    console.log(post);
    document.getElementById("postID").value = post.id;
    document.getElementById("createPostTitle").value = post.title;
    document.getElementById("createPostBody").value = post.body;
    document.getElementById("postModalLabel").innerHTML = "Edit Post";
    document.getElementById("createModalBtn").innerHTML = "Edit";
    // document.getElementById("createPostImage").value = post.image;
    let postModal = new bootstrap.Modal(
        document.getElementById("addPostModal"),
        {}
    );
    postModal.toggle();
}

function deleteClicked(id) {
    post = JSON.parse(decodeURIComponent(id));
    let postModal = new bootstrap.Modal(
        document.getElementById("deletepost"),
        {}
    );
    postModal.toggle();
    deleteID = post.id;
}

function confirmDelete() {
        toggleloader(true);
    axios
        .delete(`${baseUrl}/posts/${deleteID}`, {
            headers: {
                authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
        .then((response) => {
            toggleloader(false);
            getPosts();
            let modal = document.getElementById("deletepost");
            let modalInstance =
                bootstrap.Modal.getInstance(modal) ||
                new bootstrap.Modal(modal);
            modalInstance.hide();
            showSuccessAlert("You Deleted A Post Successfully", "danger");
        })
        .catch((error) => {
            let allErrors = Object.values(error.response.data.errors)
                .flat()
                .join("<hr>");
            showSuccessAlert(allErrors, "danger");
        })
        .finally(() => {
            toggleloader(false);
        });
}
function createNewPostClicked() {
    let postid = document.getElementById("postID").value;
    let isCreate = postid == "" || postid == null;

    let title = document.getElementById("createPostTitle").value;
    let body = document.getElementById("createPostBody").value;
    let image = document.getElementById("createPostImage").files[0];
    let formData = new FormData();
    formData.append("image", image);
    formData.append("title", title);
    formData.append("body", body);
    let url = "";
    if (isCreate) {
        url = `${baseUrl}/posts`;
    } else {
        formData.append("_method", "PUT");
        url = `${baseUrl}/posts/${postid}`;
    }
        toggleloader(true);
    axios
        .post(url, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
        .then((response) => {
            toggleloader(false);
            getPosts();
            let modal = document.getElementById("addPostModal");
            let modalInstance =
                bootstrap.Modal.getInstance(modal) ||
                new bootstrap.Modal(modal);
            modalInstance.hide();
            isCreate
                ? showSuccessAlert("You Created A New Post Successfully", "")
                : showSuccessAlert("You Edited A Post Successfully", "");
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
        .finally(() => {
            toggleloader(false);
        });
}
function profileClicked() {
    window.location = `profile.html?userid=${getCurrentUser().id}`;
}
function toggleloader(show = true) {
    if (show) document.getElementById("loader").style.display = "flex";
    else document.getElementById("loader").style.display = "none";
}
