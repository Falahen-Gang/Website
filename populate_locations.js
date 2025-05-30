document.addEventListener("DOMContentLoaded", () => {
  const countrySelect = document.getElementById("country");
  const governorateSelect = document.getElementById("governorate");

  Object.keys(locationData).forEach((country) => {
    const option = document.createElement("option");
    option.value = country;
    option.textContent = country;
    countrySelect.appendChild(option);
  });

  countrySelect.addEventListener("change", () => {
    const selectedCountry = countrySelect.value;
    governorateSelect.innerHTML = ""; // Clear previous governorates

    locationData[selectedCountry].forEach((governorate) => {
      const option = document.createElement("option");
      option.value = governorate;
      option.textContent = governorate;
      governorateSelect.appendChild(option);
    });
  });

  // Optional: trigger change to auto-fill governorates for first country
  countrySelect.dispatchEvent(new Event("change"));
});
