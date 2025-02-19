$(document).ready(function(){
    function filterItems(filter){
        $(".portfolio-container .contain").hide();
        if(filter === "all"){
            $(".portfolio-container .contain").fadeIn();
        }else{
            $(".portfolio-container .contain." +filter).fadeIn(500);
        }
    }
    $(".filters a").click(function(event){
        event.preventDefault();
        $(".filters .active").removeClass("active");
        $(this).addClass("active");

        let filter=$(this).attr("data-filter");
        filterItems(filter);
    });
    filterItems("all");
});


// value passes
  function savePlanDetails(button) {
    let card = button.closest('.card-body');
    let planPrice = card.querySelector("#planPrice").innerText;
    let planData = card.querySelector("#planData").innerText;
    let validDays = card.querySelector("#validDays").innerText;

    localStorage.setItem("planPrice", planPrice);
    localStorage.setItem("planData", planData);
    localStorage.setItem("validDays", validDays);
  }
