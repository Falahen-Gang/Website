const add_farm_form = document.getElementById('add_farm_form');
const api_add_farm = `${base_url}addFarm`;
const response_addfarm = document.getElementById('response');
        const getLocationBtn = document.getElementById('getLocationBtn');

let latitude  = 26.82;
let longitude = 30.80;
let locat  = 'N/A';
var map = L.map('map').setView([latitude, longitude], 5);


async function fetchAddress(lat, lon) {
    try {
        // Added user-agent header as per Nominatim's usage policy
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`, {
            headers: {
                // IMPORTANT: Replace with your application's name/version and a contact email.
                // Using a generic User-Agent might lead to blocks by Nominatim.
                'User-Agent': 'LocationFormApp/1.0 (user@example.com)' 
            }
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Unknown error details' }));
            throw new Error(`HTTP error! status: ${response.status}. Message: ${errorData.error || 'Failed to fetch address details'}`);
        }
        const data = await response.json();
        if (data && data.display_name) {
            locat = data.display_name
            marker.bindPopup(`<b>${data.display_name}</b>`).openPopup();

        } else {
            console.warn("Address not found in Nominatim response:", data);
            marker.bindPopup(`<b>Address not found.</b>`).openPopup();

        }
    } catch (error) {
        console.error("Error fetching address:", error);
        marker.bindPopup(`<b>Could not fetch address.</b>`).openPopup();
    }
}


// Event listener for the button
getLocationBtn.addEventListener('click', () => {
    if (navigator.geolocation) {
        getLocationBtn.disabled = true;
        // Store original button content
        const originalButtonContent = getLocationBtn.innerHTML;
        getLocationBtn.innerHTML = `
            <svg class="animate-spin" style="width: 1.25rem; height: 1.25rem; margin-right: 0.75rem; display: inline-block;" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle style="opacity: 0.25;" cx="12" cy="12" r="10" stroke-width="4"></circle>
                <path style="opacity: 0.75;" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Fetching Location...`;

        navigator.geolocation.getCurrentPosition(
            (position) => {
                latitude = position.coords.latitude;
                longitude = position.coords.longitude;

                map.setView([latitude, longitude], 17);
                marker.setLatLng([latitude, longitude]).addTo(map);
                fetchAddress(latitude, longitude)

                getLocationBtn.disabled = false;
                getLocationBtn.innerHTML = originalButtonContent;
            },
            (error) => {
                let errorMessage = "Error getting location: ";
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage += "User denied the request for Geolocation.";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage += "Location information is unavailable.";
                        break;
                    case error.TIMEOUT:
                        errorMessage += "The request to get user location timed out.";
                        break;
                    case error.UNKNOWN_ERROR:
                        errorMessage += "An unknown error occurred.";
                        break;
                }
                console.error(errorMessage, error);
                showMessage(errorMessage, "error");
                latitudeInput.value = "";
                longitudeInput.value = "";
                addressInput.value = "";
                
                getLocationBtn.disabled = false;
                getLocationBtn.innerHTML = originalButtonContent;
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    } else {
        const errorMsg = "Geolocation is not supported by this browser.";
        console.error(errorMsg);
        showMessage(errorMsg, "error");
        latitudeInput.value = "";
        longitudeInput.value = "";
        addressInput.value = "";
    }
});



L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var popup = L.popup();
var marker = L.marker();

function onMapClick(e) {
  marker.remove();
  console.log(e.latlng)
  latitude  = e.latlng.lat;
  longitude = e.latlng.lng;
  marker.setLatLng(e.latlng).addTo(map);
  map.setView([latitude, longitude], 17);
  fetchAddress(latitude, longitude);
}

map.on('click', onMapClick);


add_farm_form.addEventListener('submit',
    function(event){
        event.preventDefault();
        const formData_addfarm = new FormData(add_farm_form);
        const jsonData_addfarm = Object.fromEntries(formData_addfarm.entries());
        jsonData_addfarm['y'] = `${longitude}`;
        jsonData_addfarm['x'] = `${latitude}`;
        jsonData_addfarm['location'] = locat;
        console.log(jsonData_addfarm)
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