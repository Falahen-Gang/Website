const form_sign = document.getElementById('signin');

form_sign.addEventListener("submit",
    function (e){
        e.preventDefault();
        const api_url = `${base_url}auth/login`;
        const responseMessage = document.getElementById("response-message");
        const formData ={
            email : document.getElementById("email_sign").value,
            password : document.getElementById("password_sign").value,
        };
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(formData),
        };

        
  fetch(api_url, requestOptions)
    .then(response => {
      return response.json();
    })
    .then(data => {
      responseMessage.style.display = "block";
      console.log(data.status);
      if(data.status==true)
      {
        responseMessage.textContent = "login successfully";
        responseMessage.classList.add('alert', 'alert-success');
        form_sign.reset();
        localStorage.setItem("token",data.access_token);
        // console.log(localStorage['token']);
      }
      if(data.status==false)
      {
        responseMessage.textContent = "error occured";
        responseMessage.classList.add('alert', 'alert-danger');

      }
    })
    .catch(error => {
      console.error('Error:', error);
    });

    }

)