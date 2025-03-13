const products = [
    {
      id: 1,
      name: "Awesome T-Shirt",
      description: "A comfortable and stylish t-shirt.",
      price: 25.00,
      image: "https://media.istockphoto.com/id/1830111752/photo/black-t-shirt-short-sleeve-mockup.jpg?s=1024x1024&w=is&k=20&c=XsmPOD73lHWEsXDf-blvm5oHiPzuen-SJRsLw4hsHi8="
    },
    {
      id: 2,
      name: "Cool Coffee Mug",
      description: "Enjoy your coffee in this cool mug.",
      price: 12.50,
      image: "https://plus.unsplash.com/premium_photo-1674406102318-c9d362ad510b?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      id: 3,
      name: "Fun Stickers Pack",
      description: "A pack of fun and colorful stickers.",
      price: 5.00,
      image: "https://img.freepik.com/free-vector/funny-sticker-hand-drawn-collection_23-2148373655.jpg"
    }
  ];
  
  let cart = [];
  
  function displayProducts() {
    const productsContainer = document.getElementById("products-container");
    products.forEach(product => {
      const productDiv = document.createElement("div");
      productDiv.classList.add("product");
  
      const img = document.createElement("img");
      img.src = product.image || 'placeholder.png';
      img.alt = product.name;
      productDiv.appendChild(img);
  
      const productInfoDiv = document.createElement("div");
      productInfoDiv.classList.add("product-info");
  
      const productName = document.createElement("h3");
      productName.classList.add("product-name");
      productName.textContent = product.name;
      productInfoDiv.appendChild(productName);
  
      const productDescription = document.createElement("p");
      productDescription.classList.add("product-description");
      productDescription.textContent = product.description;
      productInfoDiv.appendChild(productDescription);
  
      const productPrice = document.createElement("p");
      productPrice.classList.add("product-price");
      productPrice.textContent = `$${product.price.toFixed(2)}`;
      productInfoDiv.appendChild(productPrice);
  
      const addButton = document.createElement("button");
      addButton.textContent = "Add to Cart";
      addButton.dataset.productId = product.id;
      addButton.addEventListener("click", addToCart);
      productInfoDiv.appendChild(addButton);
  
      productDiv.appendChild(productInfoDiv);
      productsContainer.appendChild(productDiv);
    });
  }
  
  function addToCart(event) {
    const productId = parseInt(event.target.dataset.productId);
    const existingCartItemIndex = cart.findIndex(item => item.productId === productId);
    if (existingCartItemIndex !== -1) {
      cart[existingCartItemIndex].quantity += 1;
    } else {
      cart.push({ productId: productId, quantity: 1 });
    }
    updateCartDisplay();
    updateFormSummary();
  }
  
  function removeFromCart(productId) {
    cart = cart.filter(item => item.productId !== productId);
    updateCartDisplay();
    updateFormSummary();
  }
  
  function updateCartDisplay() {
    const cartItemsList = document.getElementById("cart-items");
    const cartTotalDisplay = document.getElementById("cart-total");
    cartItemsList.innerHTML = "";
    let cartTotal = 0;
  
    cart.forEach(cartItem => {
      const product = products.find(p => p.id === cartItem.productId);
      if (product) {
        const listItem = document.createElement("li");
        listItem.innerHTML = `<span>${product.name} x ${cartItem.quantity}</span>
                              <span>$${(product.price * cartItem.quantity).toFixed(2)}</span>`;
        // Add Remove Button
        const removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.style.marginLeft = "10px";
        removeButton.addEventListener("click", () => removeFromCart(product.id));
        listItem.appendChild(removeButton);
  
        cartItemsList.appendChild(listItem);
        cartTotal += product.price * cartItem.quantity;
      }
    });
    cartTotalDisplay.textContent = `Total: $${cartTotal.toFixed(2)}`;
  }
  
  function updateFormSummary() {
    const cartSummaryDiv = document.getElementById("cart-summary-for-form");
    const formTotalInput = document.getElementById("formTotalAmount");
    const formItemsTextarea = document.getElementById("formItems");
    let cartTotal = 0;
    let itemsDescription = "";
    cartSummaryDiv.innerHTML = "<h3>Order Summary:</h3><ul>";
  
    cart.forEach(cartItem => {
      const product = products.find(p => p.id === cartItem.productId);
      if (product) {
        const itemTotal = product.price * cartItem.quantity;
        cartTotal += itemTotal;
        cartSummaryDiv.innerHTML += `<li>${product.name} x ${cartItem.quantity} - $${itemTotal.toFixed(2)}</li>`;
        itemsDescription += `${product.name} x ${cartItem.quantity}, `;
      }
    });
    cartSummaryDiv.innerHTML += "</ul>";
    formTotalInput.value = cartTotal.toFixed(2);
    formItemsTextarea.value = itemsDescription.slice(0, -2);
  }
  
  // Navigation between Shop and Checkout pages
  document.getElementById("nav-shop").addEventListener("click", () => {
    document.getElementById("shop-page").style.display = "block";
    document.getElementById("checkout-page").style.display = "none";
  });
  
  document.getElementById("checkout-button").addEventListener("click", () => {
    if (cart.length === 0) {
      alert("Please add at least one item to your cart before proceeding to checkout.");
      return;
    }
    updateFormSummary();
    localStorage.setItem("cartSummary", document.getElementById("cart-summary-for-form").innerHTML);
    localStorage.setItem("totalAmount", document.getElementById("formTotalAmount").value);
    localStorage.setItem("items", document.getElementById("formItems").value);
    window.location.href = "checkout.html";
  });
  
  document.getElementById("orderForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const customerName = formData.get("customerName").trim();
    const email = formData.get("email").trim();
    const phone = formData.get("phone").trim();
    const address = formData.get("address").trim();

    // Validate full name: must include at least first and last name
    if (!customerName || customerName.split(" ").length < 2) {
      alert("Please enter your full name (first and last name).");
      return;
    }

    // Validate email: must contain '@'
    if (!email.includes('@')) {
      alert("Please enter a valid email address containing '@'.");
      return;
    }
    
    // Validate Bangladeshi phone number: e.g. 01XXXXXXXXX or +8801XXXXXXXXX format
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
        "Status": "Processing"
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
        cart = [];
        updateCartDisplay();
        updateFormSummary();
        document.getElementById("orderForm").reset();
      })
      .catch(error => {
        console.error("Error:", error);
        alert("Error submitting order. Please try again.");
      });
  });
  
  // Initialize displays
  displayProducts();
  updateCartDisplay();
  updateFormSummary();