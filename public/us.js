window.onload = () => {
    const but = document.getElementById("h");
    but.addEventListener("click", (e) => {
        var r = confirm("are you sure you want to delete your account");
        if (r) {

        } else {
            e.preventDefault();
        }
    })
}