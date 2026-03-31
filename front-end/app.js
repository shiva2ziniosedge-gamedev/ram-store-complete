const API = 'http://localhost:5299/api';

let rams = [];
let currentRamId = null;

// ── Load RAMs ──────────────────────────────────────────────
async function loadRams() {
  const res = await fetch(`${API}/ram`);
  rams = await res.json();
  renderRamTable();
  populateDropdown();
}

function renderRamTable() {
  const tbody = document.getElementById('ramBody');
  tbody.innerHTML = '';
  rams.forEach(r => {
    const stockBadge = r.stock > 0
      ? `<span class="badge in-stock">In Stock (${r.stock})</span>`
      : `<span class="badge out-stock">No Stock</span>`;

       tbody.innerHTML += `
      <tr class="ram-row" onclick="toggleAccordion(${r.id})" style="cursor:pointer">
        <td>
          <strong>${r.name}</strong> <span style="color:#00d4ff;font-size:0.8rem">▼</span><br/>
          <small>${r.brand} | ${r.ddrType} | ${r.capacityGb}GB | ${r.speedMhz}MHz</small><br/>
          ${stockBadge}
        </td>
        <td><span class="price-tag">₹${r.price.toLocaleString('en-IN')}</span></td>
        <td><button class="btn-view" onclick="event.stopPropagation(); showDetail(${r.id})">View Details</button></td>
      </tr>
      <tr id="accordion-${r.id}" style="display:none">
        <td colspan="3" style="background:#0f1a2e; padding:12px 16px; color:#aaa; font-size:0.88rem; border-left:3px solid #00d4ff;">
          ${r.description || 'No description available.'}
        </td>
      </tr>`;

  });
}

function populateDropdown() {
  const sel = document.getElementById('ramSelect');
  sel.innerHTML = '<option value="">-- Select RAM --</option>';
  rams.forEach(r => {
    sel.innerHTML += `<option value="${r.id}">${r.name} – ${r.brand} ${r.capacityGb}GB (${r.ddrType})</option>`;
  });
}

// ── View Detail Modal ──────────────────────────────────────
async function showDetail(id) {
  currentRamId = id;
  const r = rams.find(x => x.id === id);
  if (!r) return;
  document.getElementById('mName').textContent    = r.name;
  document.getElementById('mBrand').textContent   = r.brand;
  document.getElementById('mDdr').textContent     = r.ddrType;
  document.getElementById('mSpeed').textContent   = `${r.speedMhz} MHz`;
  document.getElementById('mCap').textContent     = `${r.capacityGb} GB`;
  document.getElementById('mWarranty').textContent = r.warranty;
  document.getElementById('mPrice').textContent   = `₹${r.price.toLocaleString('en-IN')}`;
  document.getElementById('mStock').textContent   = r.stock > 0 ? `${r.stock} units` : 'Out of Stock';
  document.getElementById('modal').classList.remove('hidden');
  await loadReviews(id);
}

function closeModal() {
  document.getElementById('modal').classList.add('hidden');
}

// ── Place Order ────────────────────────────────────────────
async function placeOrder() {
  const customerName = document.getElementById('customerName').value.trim();
  const email        = document.getElementById('customerEmail').value.trim();
  const ramId        = parseInt(document.getElementById('ramSelect').value);
  const quantity     = parseInt(document.getElementById('quantity').value);
  const msg          = document.getElementById('orderMsg');

  if (!customerName || !email || !ramId || quantity < 1) 
 {
    msg.textContent = '⚠️ Please fill all fields.';
    return;
  }

  const res = await fetch(`${API}/order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ customerName, email, ramId, quantity })

  });

  const data = await res.json();
  msg.textContent = data.message;

  if (data.order && data.order.status !== 'StockOut') {
      const ram = rams.find(r => r.id === data.order.ramId);
      downloadPDF(data.order, `${ram.name} ${ram.capacityGb}GB`, ram.price);
  }

  // Refresh
  await loadRams();
  await loadOrders();

}

// ── Load Orders ────────────────────────────────────────────
async function loadOrders() {
  const res = await fetch(`${API}/order`);
  const orders = await res.json();
  renderOrders(orders);
}

function renderOrders(orders) {
  const tbody = document.getElementById('orderBody');
  tbody.innerHTML = '';

  if (orders.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:#555">No orders yet</td></tr>';
    return;
  }

  orders.forEach(o => {
    const statusClass = o.status === 'Confirmed' ? 'confirmed'
                      : o.status === 'StockOut'  ? 'stockout'
                      : 'booked';

    const confirmBtn = o.status === 'Booked'
      ? `<button class="btn-confirm" onclick="confirmOrder(${o.id})">Confirm</button>`
      : '';

    tbody.innerHTML += `
      <tr>
        <td>${o.customerName}</td>
        <td>${o.ram ? o.ram.name + ' ' + o.ram.capacityGb + 'GB' : 'N/A'}</td>
        <td>${o.quantity}</td>
        <td><span class="badge ${statusClass}">${o.status}</span></td>
        <td>
          ${confirmBtn}
          <button class="btn-delete" onclick="deleteOrder(${o.id})">Delete</button>
        </td>
      </tr>`;
  });
}

async function confirmOrder(id) {
  await fetch(`${API}/order/${id}/confirm`, { method: 'PUT' });
  await loadOrders();
}

async function deleteOrder(id) {
  await fetch(`${API}/order/${id}`, { method: 'DELETE' });
  await loadOrders();
  await loadRams();
}
async function loadReviews(ramId) {
    const res = await fetch(`${API}/review/${ramId}`);
    const reviews = await res.json();
    const div = document.getElementById('reviewsList');

    if (reviews.length === 0) {
        div.innerHTML = '<p style="color:#555;font-size:0.85rem">No reviews yet</p>';
        return;
    }
    div.innerHTML = reviews.map(r => `
        <div style="border-bottom:1px solid #1e2a45;padding:8px 0">
            <strong>${r.customerName}</strong>
            <span style="color:#f0c040">${'⭐'.repeat(r.rating)}</span>
            <p style="color:#aaa;font-size:0.85rem">${r.comment}</p>
        </div>
    `).join('');
}

async function submitReview() {
    const customerName = document.getElementById('reviewName').value.trim();
    const rating       = parseInt(document.getElementById('reviewRating').value);
    const comment      = document.getElementById('reviewComment').value.trim();

    if (!customerName || !comment) return alert('Fill all fields');

    await fetch(`${API}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerName, rating, comment, ramId: currentRamId })
    });

    await loadReviews(currentRamId);
}
function downloadPDF(order, ramName, price) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.setTextColor(0, 180, 220);
    doc.text('RAM Store - Order Invoice', 20, 20);

    doc.setDrawColor(0, 180, 220);
    doc.line(20, 25, 190, 25);

    doc.setFontSize(12);
    doc.setTextColor(50, 50, 50);
    doc.text(`Customer  : ${order.customerName}`, 20, 40);
    doc.text(`RAM       : ${ramName}`, 20, 52);
    doc.text(`Quantity  : ${order.quantity}`, 20, 64);
    doc.text(`Unit Price: Rs.${price}`, 20, 76);
    doc.text(`Status    : ${order.status}`, 20, 88);
    doc.text(`Date      : ${new Date().toLocaleDateString('en-IN')}`, 20, 100);

    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(`Total     : Rs.${price * order.quantity}`, 20, 116);

    doc.save(`Invoice_${order.customerName}_${order.id}.pdf`);
}
function toggleAccordion(id) {
    const row = document.getElementById(`accordion-${id}`);
    row.style.display = row.style.display === 'none' ? 'table-row' : 'none';
}

// ── Init ───────────────────────────────────────────────────
loadRams();
loadOrders();
createScrollToTop();
