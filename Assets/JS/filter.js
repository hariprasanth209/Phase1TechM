let allPlans = [];

// Fetch plans from the backend
async function fetchPlans() {
    try {
        const response = await fetch("http://localhost:8003/api/plans/all");
        if (!response.ok) throw new Error("Failed to fetch plans");
        allPlans = await response.json();
        displayPlans(allPlans);
    } catch (error) {
        console.error("Error fetching plans:", error);
        alert("Failed to load plans.");
    }
}

// Display plans in the UI
function displayPlans(plans) {
    const container = document.getElementById("plansContainer");
    if (!container) {
        console.error("Plans container not found");
        return;
    }
    container.innerHTML = ""; // Clear before adding data

    plans.forEach(plan => {
        const card = document.createElement("div");
        card.className = "col-md-4 col-lg-3 col-sm-6 my-3 contain";

        card.innerHTML = `
        <div class="card h-100 me-3 shadow-sm">
            <span class="badge bg-info">${plan.category}</span>
            <div class="card-header text-white">
                <h5 class="card-title">₹${plan.price}</h5>
            </div>
            <div class="card-body d-flex flex-column">
                <h6 class="card-subtitle mb-2 text-muted text-center">${plan.name}</h6>
                <p class="card-text"><i class="fas fa-calendar-alt me-2"></i> ${plan.validityDays} Days</p>
                <p class="card-text"><i class="fas fa-database me-2"></i> ${plan.data}</p>
                ${plan.calls ? `<p class="card-text"><i class="fas fa-phone-alt me-2"></i>${plan.calls}</p>` : ""}
                ${plan.sms ? `<p class="card-text"><i class="fas fa-comment-alt me-2"></i>${plan.sms} SMS/Day</p>` : ""}

                <!-- Links at the bottom -->
                <div class="mt-auto text-center d-flex flex-column">
                    <button class="btn-3d-press text-decoration-none me-2 w-100" onclick="initiatePayment('${plan.planId}', '${plan.name}', ${plan.price})">Purchase</button>
                    <a class="Link" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasBottom" aria-controls="offcanvasBottom" onclick="showPlanDetails('${plan.planId}')">More</a>
                </div>
            </div>
        </div>
        `;

        container.appendChild(card);
    });
}


// Razorpay Payment Integration
async function initiatePayment(planId, planName, planPrice) {
    // Check if either mobile1 or mobile2 is missing
    if (!localStorage.getItem("loggedInMobile") && !localStorage.getItem("guestMobile")) {
        alert("Login Necessary!");
        window.location.href = "Login.html";
        return; // Stop further execution
    }

     localStorage.getItem("guestMobile") || localStorage.getItem("loggedInMobile");
    const userName = localStorage.getItem("userName") || "User Name"; // Fetch dynamically if available
    const userEmail = localStorage.getItem("userEmail") || "user@example.com"; // Fetch dynamically if available

    var options = {
        "key": "rzp_test_SQCsjYxxhe6Mix", // Replace with your Razorpay Key ID
        "amount": planPrice * 100, // Convert to paise
        "currency": "INR",
        "name": "MobiComm Pvt Ltd",
        "description": `Payment for ${planName}`,
        "image": "Assets/Images/logo.png", // Optional: Add your company logo
        "handler": async function (response) {
            alert("Payment Successful! Payment ID: " + response.razorpay_payment_id);

            

            // Prepare payment data
            const paymentData = {
                payMethod: "Razorpay", // Assuming paymentMode is "Razorpay"
                rechargePhNo:  localStorage.getItem("guestMobile") || localStorage.getItem("loggedInMobile"),
                userId: localStorage.getItem("guestId") || localStorage.getItem("userID") || null,
                amount: planPrice,
                planId: planId
            };

            try {
                // Send payment data to the backend
                const fetchResponse = await fetch('http://localhost:8003/api/payment-history', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(paymentData)
                });

                if (!fetchResponse.ok) {
                    throw new Error("Failed to create payment history");
                }

                const data = await fetchResponse.json();
                console.log('Success:', data);
                alert('Payment History created successfully!');

                // Clear localStorage after successful payment
                // Clear localStorage after successful payment
                localStorage.removeItem("selectedPlan");
                localStorage.removeItem("guestMobile");
                localStorage.removeItem("guestId");

                // Redirect to history page
                window.location.href = `History.html`;
            } catch (error) {
                console.error('Error:', error);
                alert('Failed to create Payment History.');
            }
        },
        "prefill": {
            "name": userName,
            "email": userEmail,
            "contact":  localStorage.getItem("guestMobile") || localStorage.getItem("loggedInMobile")
        },
        "theme": {
            "color": "#3399cc"
        }
    };

    var rzp1 = new Razorpay(options);
    rzp1.open();
}



        function filterPlans(category) {
            const filteredPlans = allPlans.filter(plan => plan.category === category);
            displayPlans(filteredPlans);
        }

        function showPlanDetails(planId){
            fetch(`http://localhost:8003/api/plans/${planId}`)
                .then(response => {
                    if (!response.ok) {
                    throw new Error("Plan not found");
                    }
                    return response.json();
                })
                .then(plan=> {
                    const offcanvasBody = document.getElementById("offcanvasBody");
                    offcanvasBody.innerHTML = `
                        <p><strong>Price:</strong> ₹${plan.price}</p>
                        ${plan.calls ? `<p><strong>Calls:</strong> ${plan.calls}</p>` : ""}
                        <p><strong>Data:</strong> ${plan.data}</p>
                        ${plan.sms ? `<p><strong>SMS:</strong> ${plan.sms}/Day</p>` : ""}
                        <p><strong>Validity:</strong> ${plan.validityDays} Days</p>
                    `;
                })
        }
        window.onload = fetchPlans;