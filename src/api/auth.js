import axios from 'axios'
const BASE_URL = "https://relevel-crm--backend.herokuapp.com"


/*HOW Post API wokrs:.

1. first we need to grab info from the UI
2. sote it into the state
3. send the data to api
*/

/*
SIGNUP:
POST : api
url : /crm/api/v1/auth/signup
data ; useid, email, name, pw
*/

export async function userSignup(data) {
    return await axios.post(`${BASE_URL}/crm/api/v1/auth/signup`, data);
}

/*
SIGNIN:
POST : api
url : /crm/api/v1/auth/signin
data : userid, pw
*/

export async function userSignin(data) {
    return await axios.post(`${BASE_URL}/crm/api/v1/auth/signin`, data);
}

