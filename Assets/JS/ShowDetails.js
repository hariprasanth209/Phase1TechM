  window.onload = function() {
    document.getElementById("planPrice").innerText = localStorage.getItem("planPrice");
    document.getElementById("planData").innerText = localStorage.getItem("planData");
    document.getElementById("validDays").innerText = localStorage.getItem("validDays");
  };
