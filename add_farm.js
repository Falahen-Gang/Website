document.getElementById("add_farm_form").addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(this);
  const data = Object.fromEntries(formData.entries());
  console.log("Submitting farm:", data);

  document.getElementById("response").textContent = "Farm added successfully!";
  document.getElementById("response").className = "alert alert-success";
});
