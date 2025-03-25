document.addEventListener("DOMContentLoaded", () => {
    // Populate stored cart info on checkout page
    const cartSummaryDiv = document.getElementById("cart-summary-for-form");
    const formTotalInput = document.getElementById("formTotalAmount");
    const formItemsTextarea = document.getElementById("formItems");

    cartSummaryDiv.innerHTML = localStorage.getItem("cartSummary") || "";
    formTotalInput.value = localStorage.getItem("totalAmount") || "0.00";
    formItemsTextarea.value = localStorage.getItem("items") || "";

    // Payment method toggle
    const paymentMethodSelect = document.getElementById("paymentMethod");
    const bkashSection = document.getElementById("bkash-section");
    if (paymentMethodSelect) {
        paymentMethodSelect.addEventListener("change", () => {
            if (paymentMethodSelect.value === "Bkash") {
                bkashSection.style.display = "block";
                document.getElementById("paymentNumber").required = true;
                document.getElementById("transactionId").required = true;
            } else { // COD selected
                bkashSection.style.display = "none";
                document.getElementById("paymentNumber").required = false;
                document.getElementById("transactionId").required = false;
            }
        });
    }

    // Button to go back to shop
    document.getElementById("nav-shop").addEventListener("click", () => {
        window.location.href = "index.html";
    });

    // Function to clear all saved data and refresh page
    function clearSavedDataAndRefresh() {
        localStorage.clear();
        window.location.reload();
    }

    // Order form submit handler
    document.getElementById("orderForm").addEventListener("submit", async function(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const customerName = formData.get("customerName").trim();
        const email = formData.get("email").trim();
        const phone = formData.get("phone").trim();
        const address = formData.get("address").trim();
        const selectedPayment = formData.get("paymentMethod");

        // Validate full name: must include at least first and last name
        if (!customerName || customerName.split(" ").length < 2) {
            alert("Please enter your full name (first and last name).");
            return;
        }

        // Validate email contains '@'
        if (!email.includes('@')) {
            alert("Please enter a valid email address containing '@'.");
            return;
        }

        // Validate Bangladeshi phone number format (01XXXXXXXXX or +8801XXXXXXXXX)
        const bdPhoneRegex = /^(?:\+?8801|01)[3-9]\d{8}$/;
        if (!bdPhoneRegex.test(phone)) {
            alert("Please enter a valid Bangladeshi phone number.");
            return;
        }

        // Validate address is not empty
        if (!address) {
            alert("Please enter your address.");
            return;
        }

        // Payment data: if COD selected, then no further data required
        let paymentOption = "";
        let paymentNumber = "";
        let transactionId = "";
        if (selectedPayment === "Bkash") {
            paymentOption = "Bkash";
            paymentNumber = formData.get("paymentNumber").trim();
            transactionId = formData.get("transactionId").trim();
            if (!paymentNumber || !transactionId) {
                alert("Please enter your Bkash number and Transaction ID.");
                return;
            }
        } else {
            paymentOption = "COD";
            // paymentNumber and transactionId remain empty
        }

        // Fetch the orderer's IP address from an external service
        let ordererIP = "";
        try {
            const ipResponse = await fetch('https://api.ipify.org?format=json');
            const ipData = await ipResponse.json();
            ordererIP = ipData.ip;
        } catch(err) {
            console.error("Error fetching order IP:", err);
        }

        const currentDate = new Date();
        const orderDate = currentDate.toISOString().slice(0, 10);
        const orderData = {
            fields: {
                "Order Date": orderDate,
                "Customer Name": customerName,
                "Email": email,
                "Phone": phone,
                "Address": address,
                "Total Amount": parseFloat(formData.get("totalAmount")),
                "Items": formData.get("items"),
                "Status": "Received",
                "Payment Option": paymentOption,
                "Payment Number": paymentNumber,
                "Transaction ID": transactionId,
                "IP": ordererIP
            }
        };

        fetch("https://api.airtable.com/v0/appwM7vvebCuxFvyo/Orders", {
            method: "POST",
            headers: {
                "Authorization": "Bearer patY7Wci1nOQOxvbj.47251cf00c6cf895d81ab00290c9ed636b65beea73529c5e0cb5d22f7dbcddd2",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(orderData)
        })
        .then(response => response.json())
        .then(data => {
            console.log("Success:", data);
            alert("Order submitted successfully!");
            // Optionally clear the form and all locally saved cart data before refreshing
            event.target.reset();
            clearSavedDataAndRefresh();
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Error submitting order. Please try again.");
        });
    });
});