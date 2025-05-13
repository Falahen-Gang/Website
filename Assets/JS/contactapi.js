const apiUrl = `${base_url}sendmessage`;

const contactForm = document.getElementById('contact-form');
const responseMessage = document.getElementById('response-message');
contactForm.addEventListener('submit', function (event) {
  event.preventDefault();


const formData = new FormData(contactForm);
const jsonData = Object.fromEntries(formData.entries());

  const requestOptions = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    body: JSON.stringify(jsonData),
  };
  fetch(apiUrl, requestOptions)
    .then(response => {
      return response.json();
    })
    .then(data => {
      responseMessage.textContent = data.message;
      responseMessage.style.display = "block";
      console.log(data.status);
      if(data.status==true)
      {
        responseMessage.classList.add('alert-success');
        contactForm.reset();
      }
      if(data.status==false)
      {
        responseMessage.classList.add('alert-danger');

      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
});
