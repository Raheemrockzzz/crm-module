import axios from 'axios'
const BASE_URL = "https://relevel-crm--backend.herokuapp.com"

export async function getAllUser() {
    return await axios.get(`${BASE_URL}/crm/api/v1/users/`, 
    {
        headers: {
            'x-access-token': localStorage.getItem("token")
        }
    },
        {
            "userId": localStorage.getItem("userId")
        }
        )
}

export async function userUpdation(userId, selectedCurrUser){
    return await axios.put(`${BASE_URL}/crm/api/v1/users/${userId}`, selectedCurrUser, 
        {
            headers: {
                'x-access-token': localStorage.getItem("token")
            }
        },
        {
            "userId": localStorage.getItem("userId")
        })
}