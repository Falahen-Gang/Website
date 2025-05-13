const api_profile = `${base_url}user-profile`;
const options_profile = {
    method : 'GET',
    headers : {
        'Authorization' : `Bearer ${localStorage['token']}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
}
const farmsList = document.getElementById('map-container');
const tasksTableBody = document.querySelector('.tasks-table tbody');
fetch(api_profile, options_profile)
  .then(response => response.json())
  .then(data => {
    farmsList.innerHTML = '';

    data.farms.forEach(farm => {
      const li = document.createElement('li');
      li.className = 'farm-item';

      li.innerHTML = `
        <div class="farm-map">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3416.465970104768!2d30.949456!3d31.09677850000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14f7ac7ba77647ed%3A0xcd75a051c77224b6!2sFaculty%20of%20Engineering%2C%20Kafrelsheikh%20University!5e0!3m2!1sen!2seg!4v1741398316302!5m2!1sen!2seg"
            style="border: 0"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade">
          </iframe>
        </div>
        <div class="farm-details">
          <p><strong>${farm.name}</strong></p>
          <p>Tomatoes</p>
        </div>
      `;

      farmsList.appendChild(li);


tasksTableBody.innerHTML = '';

    data.tasks.forEach(task => {
      const tr = document.createElement('tr');
      tr.className = 'task-item';
      tr.innerHTML = `
        <td>
          <img src="./Assets/IMG/profile/image-03.webp.png" alt="Task Image" />
        </td>
        <td>${task.service.title}</td>
        <td>${task.farms.name}</td>
        <td>${task.dates.date}</td>
        <td>${task.status}</td>
      `;
      tasksTableBody.appendChild(tr);
    })
    
    });

  })
  .catch(error => {
    console.error('Error fetching farms:', error);
  });
