
async function controlUser() {

    const response = await fetch(`/api/user/logout`,)

    const data = await response.json();
    if (data.success) {
        sessionStorage.clear()
        localStorage.clear()


    }

}
