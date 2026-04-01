// Admin Panel JavaScript
const API = 'https://ram-store-complete.onrender.com/api';

let rams = [];
let orders = [];
let reviews = [];
let authToken = null;

// Check if already logged in
function checkAuth() {
    authToken = localStorage.getItem('adminToken');
    if (authToken) {
        showAdminPanel();
        loadAdminData();
    } else {
        showLoginScreen();
    }
}

// Show login screen
function showLoginScreen() {
    document.getElementById('loginScreen').classList.remove('hidden');
    document.getElementById('adminPanel').classList.add('hidden');
}

// Show admin panel
function showAdminPanel() {
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('adminPanel').classList.remove('hidden');
}

// Handle login keypress
function handleLoginKeypress(event) {
    if (event.key === 'Enter') {
        adminLogin();
    }
}

// Admin login
async function adminLogin() {
    const password = document.getElementById('adminPassword').value;
    const errorDiv = document.getElementById('loginError');
    
    if (!password) {
        errorDiv.textContent = 'Please enter password';
        return;
    }

    try {
        const res = await fetch(`${API}/admin/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: password })
        });

        const data = await res.json();

        if (res.ok) {
            authToken = data.token;
            localStorage.setItem('adminToken', authToken);
            showAdminPanel();
            loadAdminData();
            errorDiv.textContent = '';
        } else {
            errorDiv.textContent = data.message || 'Login failed';
        }
    } catch (error) {
        console.error('Login error:', error);
        errorDiv.textContent = 'Login failed - network error';
    }
}

// Admin logout
function adminLogout() {
    authToken = null;
    localStorage.removeItem('adminToken');
    showLoginScreen();
    document.getElementById('adminPassword').value = '';
}

// Get auth headers
function getAuthHeaders() {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
    };
}

// Load all data
async function loadAdminData() {
    if (!authToken) return;
    await loadRams();
    await loadOrders();
    await loadReviews();
}

// Load RAMs
async function loadRams() {
    try {
        const res = await fetch(`${API}/admin/rams`, {
            headers: getAuthHeaders()
        });
        if (res.status === 401) {
            adminLogout();
            return;
        }
        rams = await res.json();
        renderRamsList();
    } catch (error) {
        console.error('Error loading RAMs:', error);
    }
}

// Render RAMs list
function renderRamsList() {
    const div = document.getElementById('ramsList');
    div.innerHTML = '<h3>Current RAMs</h3>';
    
    rams.forEach(ram => {
        div.innerHTML += `
            <div style="border: 1px solid #333; margin: 10px 0; padding: 15px; border-radius: 8px;">
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; margin-bottom: 10px;">
                    <input type="text" id="name_${ram.id}" value="${ram.name}" placeholder="Name">
                    <input type="text" id="brand_${ram.id}" value="${ram.brand}" placeholder="Brand">
                    <select id="ddrType_${ram.id}">
                        <option value="DDR4" ${ram.ddrType === 'DDR4' ? 'selected' : ''}>DDR4</option>
                        <option value="DDR5" ${ram.ddrType === 'DDR5' ? 'selected' : ''}>DDR5</option>
                    </select>
                    <input type="number" id="speedMhz_${ram.id}" value="${ram.speedMhz}" placeholder="Speed">
                    <input type="number" id="capacityGb_${ram.id}" value="${ram.capacityGb}" placeholder="Capacity">
                    <input type="number" id="price_${ram.id}" value="${ram.price}" placeholder="Price" step="0.01">
                    <input type="number" id="stock_${ram.id}" value="${ram.stock}" placeholder="Stock">
                    <input type="text" id="warranty_${ram.id}" value="${ram.warranty}" placeholder="Warranty">
                </div>
                <textarea id="description_${ram.id}" placeholder="Description" style="width: 100%; padding: 8px; background: #0f1a2e; color: white; border: 1px solid #333; border-radius: 4px;">${ram.description || ''}</textarea>
                <div style="margin-top: 10px;">
                    <button class="btn-admin" onclick="updateRam(${ram.id})">Update</button>
                    <button class="btn-admin btn-danger" onclick="deleteRam(${ram.id})">Delete</button>
                </div>
            </div>
        `;
    });
}

// Show add RAM form
function showAddRamForm() {
    document.getElementById('addRamForm').style.display = 'block';
}

// Hide add RAM form
function hideAddRamForm() {
    document.getElementById('addRamForm').style.display = 'none';
}

// Add new RAM
async function addNewRam() {
    const newRam = {
        name: document.getElementById('newName').value,
        brand: document.getElementById('newBrand').value,
        ddrType: document.getElementById('newDdrType').value,
        speedMhz: parseInt(document.getElementById('newSpeedMhz').value),
        capacityGb: parseInt(document.getElementById('newCapacityGb').value),
        price: parseFloat(document.getElementById('newPrice').value),
        stock: parseInt(document.getElementById('newStock').value),
        warranty: document.getElementById('newWarranty').value,
        description: document.getElementById('newDescription').value
    };

    try {
        const res = await fetch(`${API}/admin/rams`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(newRam)
        });

        if (res.status === 401) {
            adminLogout();
            return;
        }

        if (res.ok) {
            alert('RAM added successfully!');
            hideAddRamForm();
            await loadRams();
        } else {
            alert('Error adding RAM');
        }
    } catch (error) {
        console.error('Error adding RAM:', error);
        alert('Error adding RAM');
    }
}

// Update RAM
async function updateRam(id) {
    const updatedRam = {
        id: id,
        name: document.getElementById(`name_${id}`).value,
        brand: document.getElementById(`brand_${id}`).value,
        ddrType: document.getElementById(`ddrType_${id}`).value,
        speedMhz: parseInt(document.getElementById(`speedMhz_${id}`).value),
        capacityGb: parseInt(document.getElementById(`capacityGb_${id}`).value),
        price: parseFloat(document.getElementById(`price_${id}`).value),
        stock: parseInt(document.getElementById(`stock_${id}`).value),
        warranty: document.getElementById(`warranty_${id}`).value,
        description: document.getElementById(`description_${id}`).value
    };

    try {
        const res = await fetch(`${API}/admin/rams/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(updatedRam)
        });

        if (res.status === 401) {
            adminLogout();
            return;
        }

        if (res.ok) {
            alert('RAM updated successfully!');
            await loadRams();
        } else {
            alert('Error updating RAM');
        }
    } catch (error) {
        console.error('Error updating RAM:', error);
        alert('Error updating RAM');
    }
}

// Delete RAM
async function deleteRam(id) {
    if (confirm('Are you sure you want to delete this RAM?')) {
        try {
            const res = await fetch(`${API}/admin/rams/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });

            if (res.status === 401) {
                adminLogout();
                return;
            }

            if (res.ok) {
                alert('RAM deleted successfully!');
                await loadRams();
            } else {
                alert('Error deleting RAM');
            }
        } catch (error) {
            console.error('Error deleting RAM:', error);
            alert('Error deleting RAM');
        }
    }
}

// Load Orders
async function loadOrders() {
    try {
        const res = await fetch(`${API}/admin/orders`, {
            headers: getAuthHeaders()
        });
        if (res.status === 401) {
            adminLogout();
            return;
        }
        orders = await res.json();
        renderOrdersList();
    } catch (error) {
        console.error('Error loading orders:', error);
    }
}

// Render Orders list
function renderOrdersList() {
    const div = document.getElementById('ordersList');
    div.innerHTML = '<h3>All Orders</h3>';
    
    if (orders.length === 0) {
        div.innerHTML += '<p>No orders yet</p>';
        return;
    }

    orders.forEach(order => {
        div.innerHTML += `
            <div style="border: 1px solid #333; margin: 10px 0; padding: 15px; border-radius: 8px;">
                <strong>Customer:</strong> ${order.customerName} (${order.email})<br>
                <strong>RAM:</strong> ${order.ram ? order.ram.name : 'N/A'}<br>
                <strong>Quantity:</strong> ${order.quantity}<br>
                <strong>Status:</strong> ${order.status}<br>
                <strong>Date:</strong> ${new Date(order.orderedAt).toLocaleString()}
            </div>
        `;
    });
}

// Load Reviews
async function loadReviews() {
    try {
        const res = await fetch(`${API}/admin/reviews`, {
            headers: getAuthHeaders()
        });
        if (res.status === 401) {
            adminLogout();
            return;
        }
        reviews = await res.json();
        renderReviewsList();
    } catch (error) {
        console.error('Error loading reviews:', error);
    }
}

// Render Reviews list
function renderReviewsList() {
    const div = document.getElementById('reviewsList');
    div.innerHTML = '<h3>All Reviews</h3>';
    
    if (reviews.length === 0) {
        div.innerHTML += '<p>No reviews yet</p>';
        return;
    }

    reviews.forEach(review => {
        div.innerHTML += `
            <div style="border: 1px solid #333; margin: 10px 0; padding: 15px; border-radius: 8px;">
                <strong>Customer:</strong> ${review.customerName}<br>
                <strong>RAM:</strong> ${review.ram ? review.ram.name : 'N/A'}<br>
                <strong>Rating:</strong> ${'⭐'.repeat(review.rating)}<br>
                <strong>Comment:</strong> ${review.comment}<br>
                <strong>Date:</strong> ${new Date(review.createdAt).toLocaleString()}
            </div>
        `;
    });
}

// Test email functionality
async function testEmail() {
    const email = document.getElementById('testEmail').value.trim();
    const resultDiv = document.getElementById('emailTestResult');
    
    if (!email) {
        resultDiv.innerHTML = '<p style="color: #ff4757;">Please enter an email address</p>';
        return;
    }

    resultDiv.innerHTML = '<p style="color: #00d4ff;">Sending test email...</p>';

    try {
        const res = await fetch(`${API}/admin/test-email`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ email: email })
        });

        if (res.status === 401) {
            adminLogout();
            return;
        }

        const data = await res.json();
        
        if (res.ok) {
            resultDiv.innerHTML = '<p style="color: #2ed573;">✅ Test email sent successfully! Check your inbox.</p>';
        } else {
            resultDiv.innerHTML = `<p style="color: #ff4757;">❌ Email test failed: ${data.message}</p>`;
        }
    } catch (error) {
        console.error('Email test error:', error);
        resultDiv.innerHTML = '<p style="color: #ff4757;">❌ Email test failed: Network error</p>';
    }
}

// Initialize admin panel
checkAuth();