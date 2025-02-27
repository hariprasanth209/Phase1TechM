let plansData = []; // Store plans data globally
$(document).ready(function () {
    
    // Fetch JSON data
    fetch("http://localhost:3001/plans")
      .then((response) => response.json())
      .then((data) => {
        plansData = data; // Store plans data
        const planContainer = $("#planContainer");
  
        // Generate plan cards
        plansData.forEach((plan) => {
          const categories = plan.categories.join(" ");
          // Determine if the card should have a badge
          const badge = plan.categories.includes("Unlimite") ? `<span class="badge bg-success">Unlimited</span>` : 
          plan.categories.includes("New") ? `<span class="badge bg-primary">New</span>` : "";

          const cardHtml = `
            <div class="col-md-4 my-3 contain ${categories}">
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
                <a href="Payment Page.html" class="btn-3d-press mt-auto align-self-center text-decoration-none" onclick="savePlanDetails(this)">Purchase</a>
                <a class="Link" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasBottom" aria-controls="offcanvasBottom" onclick="showPlanDetails(${plan.id})">more</a>
              </div>
            </div>
          </div>
          `;
          planContainer.append(cardHtml);
        });
  
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
    fetch(`http://localhost:3001/plans/${planId}`)
        .then(response => response.json())
        .then(plan => {
            const offcanvasBody = document.getElementById("offcanvasBody");
            offcanvasBody.innerHTML = `
                <p><strong>Price:</strong> ₹${plan.price}</p>
                ${plan.calls ? `<p><strong>Calls:</strong> ${plan.calls}</p>` : ""}
                <p><strong>Data:</strong> ${plan.data}</p>
                ${plan.sms ? `<p><strong>SMS:</strong> ${plan.sms}/Day</p>` : ""}
                <p><strong>Validity:</strong> ${plan.validity}</p>
            `;
        })
        .catch(error => console.error("Plan not found:", error));
}