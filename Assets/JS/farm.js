const api_farm = "http://192.168.1.9:8000/api/getFarms";
const options_farm = {
    method : "GET",
    headers : {
        'Authorization' : `Bearer ${localStorage['token']}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        
    }
}