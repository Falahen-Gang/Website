if (!localStorage.getItem('token')) 
{
    console.log("you need to sign in first");
}
else{
const api_check = "http://192.168.1.9:8000/api/checkToken";
const requestOptions = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization' : `Bearer ${localStorage['token']}`,
    },
};
fetch(api_check, requestOptions)
.then((respone) => respone.json())
.then(data =>{
    if(data.status == true )
    {
        console.log("user logged in");
    }else{
        console.log("user logged out");
    }

})


const token = localStorage['token'];
const payload = parseJwt(token);
  const exp = payload.exp;
  const now = Math.floor(Date.now() / 1000);
  const threshold = 5 * 60; // 5 minutes in seconds
  if( exp - now < threshold)
  {
    const api_refresh = 'http://192.168.1.9:8000/api/auth/refresh';
    const requestOptions_refresh = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization' : `Bearer ${localStorage['token']}`,
    },
};
fetch(api_refresh, requestOptions_refresh)
.then((respone) => respone.json())
.then(data =>{
console.log(data.access_token);
localStorage['token'] = data.access_token;
})
  }

function parseJwt(token) {
   try {
    const base64 = token.split('.')[1]; // Get the payload
    const base64Fixed = base64.replace(/-/g, '+').replace(/_/g, '/'); // Fix URL-safe base64

    const padded = base64Fixed.padEnd(base64Fixed.length + (4 - base64Fixed.length % 4) % 4, '='); // Pad to make length multiple of 4
    const jsonPayload = atob(padded); // Decode base64

    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Failed to parse JWT:", e);
    return null;
  }
}
}