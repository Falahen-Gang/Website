

if (!localStorage.getItem('token')) 
{
    console.log("you need to sign in first");
    logged_out();
}
else{
const api_check = `${base_url}checkToken`;
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
        logged_in();
        const token = localStorage['token'];
        const payload = parseJwt(token);
        const exp = payload.exp;
        const now = Math.floor(Date.now() / 1000);
        const threshold = 10 * 60; // 5 minutes in seconds
        if( exp - now < threshold)
        {
          const api_refresh = `${base_url}refresh`;
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
          // console.log(data.access_token);
          localStorage['token'] = data.access_token;
          })
        }
      }
      else{
          console.log("user logged out");
          logged_out();
      }
})
}

//extract rest time to determine if refresh or not
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
function logged_out() {
    document.querySelectorAll('.login').forEach(el => {
    el.classList.add('hidden');
  });
    document.querySelectorAll('.logout').forEach(el => {
    el.classList.remove('hidden');
  });
}
function logged_in() {
      document.querySelectorAll('.login').forEach(el => {
    el.classList.remove('hidden');
  });
    document.querySelectorAll('.logout').forEach(el => {
    el.classList.add('hidden');
  });
  
}