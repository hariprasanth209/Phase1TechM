  window.onload = function() {
    document.getElementById("planPrice").innerText = localStorage.getItem("planPrice");
    document.getElementById("planData").innerText = localStorage.getItem("planData");
    document.getElementById("validDays").innerText = localStorage.getItem("validDays");
    const loggedInMobile = localStorage.getItem("loggedInMobile");
    const guestMobile = localStorage.getItem("guestMobile");

    const mobileToDisplay = guestMobile || loggedInMobile;
    document.getElementById("phone").innerText = mobileToDisplay;
  };
