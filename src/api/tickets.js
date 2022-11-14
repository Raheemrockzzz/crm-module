import axios from "axios";

const BASE_URL = "https://relevel-crm--backend.herokuapp.com"

export async function fetchTicket(){
    return await axios.get(`${BASE_URL}/crm/api/v1/tickets/`, {
        headers:{
            'x-access-token': localStorage.getItem("token")
        }
    },{
            "userId": localStorage.getItem("userId")
    
    })
}

// POST API
// asking for dat in params: title, description
export async function ticketCreation(data){
    return await axios.post(`${BASE_URL}/crm/api/v1/tickets/`, data, {
        headers: {
            'x-access-token': localStorage.getItem("token")
        }
    });
}

// PUT API
export async function ticketUpdation(id, selectedCurrTicket){
    return await axios.put(`${BASE_URL}/crm/api/v1/tickets/${id}`, selectedCurrTicket, {
        headers: {
            'x-access-token': localStorage.getItem("token")
        }
    },
    {
        "userId": localStorage.getItem("userId")
    })
}
// 
/*
        FETCHING THE API IN THE MATERIAL TABLE
1. first we need to create an api inside a function
2. we need to call it in the UI component in another function
3. that another function need to call it inside useEffect function
4. store the response in the state that is actually setTicketDetails
5. call the state in the material table that is actually data prop

       
UPDATING THE MATERIAL TABLE
// PUT logic
/*
1. Grab the curr ticket: ticket id, all the curr data along with it 
2. Store the curr ticket in a state=> display current ticket details in the modal
3.Grab the new updated values and store in a state
4. fetch the api with the new updated  data

*/