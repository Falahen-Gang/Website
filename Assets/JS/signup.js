const form = document.getElementById('signup');

form.addEventListener("submit",
    function (e){
        e.preventDefault();
        const api_url = `${base_url}auth/register`;
        const responseMessage = document.getElementById("response-message");
        const formData = new FormData(form);
        const jsonData = Object.fromEntries(formData.entries());
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(jsonData),
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
        responseMessage.textContent = "sign up successfully";
        responseMessage.classList.add('alert', 'alert-success');
        // console.log(data);
        form.reset();
        localStorage.setItem('token', data.access_token)
        location.assign('home.html');
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