const api_farm = `${base_url}getFarms`;
const options_farm = {
    method : "GET",
    headers : {
        'Authorization' : `Bearer ${localStorage['token']}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
}