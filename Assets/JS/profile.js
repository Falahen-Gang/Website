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
        <div id="map-${farm.id}" class="farm-map" style="width: 100%;"></div>
        <a class="nav-link p-2 p-lg-3" href="Farm.html">
          <div class="farm-details" onclick="localStorage.setItem('farmId',${farm.id})">
            <p><strong>${farm.name}</strong></p>
            <p>Tomatoes</p>
          </div>
        </a>
      `;
    li.style.width = "100%";


    var mapbox_url = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoiam9ubnltY2N1bGxhZ2giLCJhIjoiY2xsYzdveWh4MGhwcjN0cXV5Z3BwMXA1dCJ9.QoEHzPNq9DtTRrdtXfOdrw';
    var mapbox_attribution = '© Mapbox © OpenStreetMap Contributors';
    var esri_url ='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
    var esri_attribution = '© Esri © OpenStreetMap Contributors';

    var lyr_satellite = L.tileLayer(esri_url, {id: 'MapID', maxZoom: 20, tileSize: 512, zoomOffset: -1, attribution: esri_attribution});
    var lyr_streets   = L.tileLayer(mapbox_url, {id: 'mapbox/streets-v11', maxZoom: 28, tileSize: 512, zoomOffset: -1, attribution: mapbox_attribution});

    var baseMaps = {
        "Streets": lyr_streets,
        "Satellite": lyr_satellite
    };

    farmsList.appendChild(li);
    console.log(farm.x, farm.y)
    if (!farm.x || !farm.y) {
      farm.x = 1
      farm.y = 1
    }
    const map = L.map(
      `map-${farm.id}`,
      {
        dragging: false,
        zoomControl: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        touchZoom: false,
        keyboard: false,
        layers: [lyr_satellite, lyr_streets]
      }
    ).setView([parseFloat(farm.x), parseFloat(farm.y)], 17);

    L.marker().setLatLng([farm.x, farm.y]).addTo(map).bindPopup(`<b>${farm.location}</b>`).openPopup();;
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);
  L.control.layers(baseMaps).addTo(map);


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