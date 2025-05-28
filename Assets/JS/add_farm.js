const add_farm_form = document.getElementById('add_farm_form');
const api_add_farm = `${base_url}addFarm`;
const response_addfarm = document.getElementById('response');
add_farm_form.addEventListener('submit',
    function(event){
        event.preventDefault();
        const formData_addfarm = new FormData(add_farm_form);
        const jsonData_addfarm = Object.fromEntries(formData_addfarm.entries());
        const requestOptions_addfarm = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization' : `Bearer ${localStorage['token']}`
            },
            body: JSON.stringify(jsonData_addfarm),
        };

        fetch(api_add_farm,requestOptions_addfarm)
        .then((respone)=>respone.json())
        .then(data => {
      response_addfarm.textContent = data.message;
      response_addfarm.style.display = "block";
      if(data.status==true)
      {
        response_addfarm.classList.add('alert-success');
        add_farm_form.reset();
      }
      if(data.status==false)
      {
        response_addfarm.classList.add('alert-danger');

      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
});