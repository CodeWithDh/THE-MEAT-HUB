let menuIcon = document.querySelector(".menu-icon");
const body = document.body;
let menu = document.querySelector(".menu");
let menuItems = document.querySelector(".menu ul");
let dashboard = document.querySelector("#Dashboard");

function toggleMenu() {
    if (menu.classList.contains('hidden')) {
        menuItems.style.display = 'block';
        setTimeout(() => {
            menu.classList.remove('hidden');
            body.style.gridTemplateColumns = '15% 85% 0';
        }, 50); 
    } else {
        menuItems.style.display = 'none';
        setTimeout(() => {
            menu.classList.add('hidden');
            body.style.gridTemplateColumns = '0% 70% 30%'; 
        }, 50); 
    }
}

console.log("working in script");

// Array to store selected items
let selectedItems = [];

// Function to add an item to the order
function addToOrder(itemName, itemPrice, itemId) {
    const existingItem = selectedItems.find(item => item.itemId === itemId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        selectedItems.push({ itemName, itemPrice, itemId, quantity: 1 });
    }

    updateOrderList();
    updateTotalPrice();
}

// Function to subtract an item from the order
function subtractFromOrder(itemId) {
    const existingItem = selectedItems.find(item => item.itemId === itemId);
    if (existingItem) {
        if (existingItem.quantity > 1) {
            existingItem.quantity -= 1;
        } else {
            selectedItems = selectedItems.filter(item => item.itemId !== itemId);
        }

        updateOrderList();
        updateTotalPrice();
    }
}

// Function to update the order list in the DOM
function updateOrderList() {
    const orderList = document.getElementById("order-list");
    orderList.innerHTML = ""; // Clear the current list

    selectedItems.forEach((item) => {
        const listItem = document.createElement("li");
        listItem.className = "flex justify-between items-center py-2 border-b border-gray-700 text-white";

        // Left side: Item name
        const itemName = document.createElement("span");
        itemName.textContent = `${item.itemName} - ₹${item.itemPrice}`;
        itemName.className = "text-white text-sm";

        // Right side: Quantity badge and remove button
        const rightControls = document.createElement("div");
        rightControls.className = "flex items-center space-x-3";

        const quantityBadge = document.createElement("span");
        quantityBadge.className = "bg-green-600 text-white text-sm px-2 py-0.5 rounded-full";
        quantityBadge.textContent = `${item.quantity}x`;

        const cancelIcon = document.createElement("button");
        cancelIcon.className = "bg-red-600 hover:bg-red-700 text-white text-sm px-2 py-1 rounded";
        cancelIcon.innerHTML = "×";
        cancelIcon.onclick = () => removeFromOrder(item.itemId);

        // Append right controls
        rightControls.appendChild(quantityBadge);
        rightControls.appendChild(cancelIcon);

        // Combine both parts
        listItem.appendChild(itemName);
        listItem.appendChild(rightControls);

        orderList.appendChild(listItem);
    });
}


// Function to update the total price
function updateTotalPrice() {
    const totalPriceInput = document.getElementById("total-price");
    const totalPrice = selectedItems.reduce((total, item) => total + (item.itemPrice * item.quantity), 0);
    totalPriceInput.value = `₹${totalPrice}`;
}

// Function to remove an item from the order
function removeFromOrder(itemId) {
    const itemIndex = selectedItems.findIndex(item => item.itemId === itemId);
    if (itemIndex !== -1) {
        selectedItems.splice(itemIndex, 1);
        updateOrderList();
        updateTotalPrice();
    }
}

// Function to place the order
function placeOrder() {
    if (selectedItems.length === 0) {
        alert("Please select items first");
        return;
    }

    const loader = document.getElementById("fullLoader");
    loader.style.display = "flex";

    const totalPrice = document
        .getElementById("total-price")
        .value.replace("₹", "")
        .trim();

    fetch("http://localhost:8080/placeOrder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            items: selectedItems,
            total: totalPrice
        })
    })
    .then(res => {
        if (!res.ok) throw new Error("Server error");
        return res.json();
    })
    .then(data => {
        if (!data.success || !data.invoiceUrl) {
            throw new Error("Invalid response");
        }

        // ✅ Open PDF
        window.open(data.invoiceUrl, "_blank");
    })
    .catch(err => {
        console.error(err);
        alert("Invoice generation failed");
    })
    .finally(() => {
        // ✅ STOP LOADER FIRST (ABSOLUTE RULE)
        loader.style.display = "none";

        // ✅ SAFE CLEANUP
        try {
            selectedItems = [];
            if (typeof updateOrderList === "function") updateOrderList();
            if (typeof updateTotalPrice === "function") updateTotalPrice();
        } catch (e) {
            console.warn("Cleanup error ignored:", e);
        }
    });
}

