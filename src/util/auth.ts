import {API_URL} from "@/util/base_url";

function deleteCookies() {
    var allCookies = document.cookie.split(';');

    for (var i = 0; i < allCookies.length; i++)
        document.cookie = allCookies[i] + "=;expires="
            + new Date(0).toUTCString();


}
const clearCookie = (name:any) => {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
};
export const auth = async (token:any,phone:any) => {
    const response = await fetch(`${API_URL}/verify`,
        {
            method: 'POST',
            headers: {
                'x-access-token': token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                phone:phone
            }),
        })
    const data = await response.json();
    if(response.status===401){
        sessionStorage.clear()
        deleteCookies()
        clearCookie('token')
       return false
    }
    else if(response.status===201 && data.auth) {
        return true
    }else{return false}
};
