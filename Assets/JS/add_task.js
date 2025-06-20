const add_task_form = document.getElementById('add_task_form');
const api_add_task = `${base_url}addTask`;
const response_addtask = document.getElementById('response');
add_task_form.addEventListener('submit',
    function(event){
        event.preventDefault();
        const formData_addtask = new FormData(add_task_form);
        const jsonData_addtask = Object.fromEntries(formData_addtask.entries());
        const requestOptions_addtask = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization' : `Bearer ${localStorage['token']}`
            },
            body: JSON.stringify(jsonData_addtask),
        };

        fetch(api_add_task,requestOptions_addtask)
        .then((respone)=>respone.json())
        .then(data => {
      response_addtask.textContent = data.message;
      response_addtask.style.display = "block";
      if(data.status==true)
      {
        response_addtask.classList.add('alert-success');
        add_task_form.reset();
      }
      if(data.status==false)
      {
        response_addtask.classList.add('alert-danger');

      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
});

const api_get_dates = `${base_url}getDates`;
const requestOptions_getDates={
    method: 'GET',
    headers:{
        "Authorization" : `Bearer ${localStorage['token']}`
    }
}
fetch(api_get_dates, requestOptions_getDates)
  .then(response => response.json())
  .then(data => {
    const datesSelect = document.getElementById('dates');
    data.data.forEach(item => {
      const option = document.createElement('option');
      option.value = item.id;        
      option.textContent = item.date; 
      datesSelect.appendChild(option);
    });
  })
  .catch(error => {
    console.error('Error fetching dates:', error);
  });

  const api_getFarms = `${base_url}getFarms`;
  const options_getfarms = {
    method : 'GET',
    headers : {
        'Authorization' : `Bearer ${localStorage['token']}`
    }
  }
  fetch(api_getFarms, options_getfarms)
  .then(respone =>respone.json())
  .then(data =>
    {
        const datesSelect = document.getElementById('farms');
      if(data.data.length != 0)
      {
        data.data.forEach(item => {
          const option = document.createElement('option');
          option.value = item.id;        
          option.textContent = `${item.name} - ${item.location}` ; 
          datesSelect.appendChild(option);
        });
      }else{
        const add = document.getElementById('add');
        add.innerHTML = "you need to add farm first";
        add.disabled=true;
      }
  })
  .catch(error => {
    console.error('Error fetching dates:', error);
  });