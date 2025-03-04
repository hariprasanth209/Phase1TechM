let plansData = []; // Store plans data globally

$(document).ready(function () {
  // Fetch JSON data
  fetch("http://localhost:3000/plans")
    .then((response) => response.json())
    .then((data) => {
      plansData = data; // Store plans data
      renderPlans(plansData); // Render all plans initially

      // Initialize filtering functionality
      filterItems("all");
    })
    .catch((error) => console.error("Error fetching plans:", error));

  // Filter functionality
  function filterItems(filter) {
    $(".portfolio-container .contain").hide();
    if (filter === "all") {
      $(".portfolio-container .contain").fadeIn();
    } else {
      $(".portfolio-container .contain." + filter).fadeIn(500);
    }
  }

  $(".filters a").click(function (event) {
    event.preventDefault();
    $(".filters .active").removeClass("active");
    $(this).addClass("active");

    let filter = $(this).attr("data-filter");
    filterItems(filter);
  });
});

// Function to render plans
function renderPlans(plans) {
  const planContainer = $("#planContainer");
  planContainer.empty(); // Clear existing content

  plans.forEach((plan) => {
    const categories = plan.categories.join(" ");
    // Determine if the card should have a badge
    const badge = plan.categories.includes("Unlimite")
      ? `<span class="badge bg-danger">Unlimited</span>`
      : plan.categories.includes("New")
      ? `<span class="badge bg-info" style="color:black;">New</span>`
      : "";

    const cardHtml = `
      <div class="col-md-4 col-lg-3 my-3 contain ${categories}">
        <div class="card h-100 me-3">
          <div class="card-header text-white">
            <h5 class="card-title mb-0" id="planPrice">₹${plan.price}</h5>
            ${badge} <!-- Add badge here -->
          </div>
          <div class="card-body d-flex flex-column">
            ${plan.calls ? `<p class="card-text"><i class="fas fa-phone-alt me-2"></i>${plan.calls}</p>` : ""}
            <p class="card-text" id="planData"><i class="fas fa-database me-2"></i>${plan.data}</p>
            ${plan.sms ? `<p class="card-text"><i class="fas fa-comment-alt me-2"></i>${plan.sms} SMS/Day</p>` : ""}
            <p class="card-text mb-5" id="validDays"><i class="fas fa-calendar-alt me-2"></i>${plan.validity} Vaild</p>
            <a href="Payment Page.html?id=${plan.id}" class="btn-3d-press mt-auto align-self-center text-decoration-none" onclick="savePlanDetails(this)">Purchase</a>
            <a class="Link" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasBottom" aria-controls="offcanvasBottom" onclick="showPlanDetails(${plan.id})">more</a>
          </div>
        </div>
      </div>
    `;
    planContainer.append(cardHtml);
  });
}

// Function to sort plans by price
function sortPlans(sortType) {
  let sortedPlans = [...plansData]; // Create a copy of the plans data
  if (sortType === "highToLow") {
    sortedPlans.sort((a, b) => b.price - a.price); // Sort high to low
  } else if (sortType === "lowToHigh") {
    sortedPlans.sort((a, b) => a.price - b.price); // Sort low to high
  }
  renderPlans(sortedPlans); // Re-render the sorted plans
}

// Function to filter plans by data
function filterByData(data) {
  const filteredPlans = plansData.filter((plan) => plan.data === data); // Filter by data
  renderPlans(filteredPlans); // Re-render the filtered plans
}

// Save plan details to localStorage
function savePlanDetails(button) {
  let card = button.closest(".card-body");
  let planPrice = card.querySelector("#planPrice").innerText;
  let planData = card.querySelector("#planData").innerText;
  let validDays = card.querySelector("#validDays").innerText;

  localStorage.setItem("planPrice", planPrice);
  localStorage.setItem("planData", planData);
  localStorage.setItem("validDays", validDays);
}

// Show plan details in offcanvas
function showPlanDetails(planId) {
  fetch(`http://localhost:3000/plans/${planId}`)
    .then((response) => response.json())
    .then((plan) => {
      const offcanvasBody = document.getElementById("offcanvasBody");
      offcanvasBody.innerHTML = `
        <p><strong>Price:</strong> ₹${plan.price}</p>
        ${plan.calls ? `<p><strong>Calls:</strong> ${plan.calls}</p>` : ""}
        <p><strong>Data:</strong> ${plan.data}</p>
        ${plan.sms ? `<p><strong>SMS:</strong> ${plan.sms}/Day</p>` : ""}
        <p><strong>Validity:</strong> ${plan.validity}</p>
      `;
    })
    .catch((error) => console.error("Plan not found:", error));
}