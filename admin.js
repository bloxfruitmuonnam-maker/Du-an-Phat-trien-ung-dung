const API_URL = "http://localhost:3000/api";

document.addEventListener("DOMContentLoaded", function () {
  checkAdminAuth();
  loadAdminProducts();
  loadAdminOrders();
  loadAdminUsers();
});

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

function checkAdminAuth() {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  if (!token || !user || user.role !== "admin") {
    alert("Bạn không có quyền truy cập trang Quản Trị!");
    window.location.href = "./login.html";
    return;
  }

  const adminNameEl = document.getElementById("admin-name");
  if (adminNameEl && user.username) {
    adminNameEl.textContent = user.username.toUpperCase();
  }

  const btnLogout = document.getElementById("btn-admin-logout");
  if (btnLogout) {
    btnLogout.addEventListener("click", function () {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      alert("Đã đăng xuất!");
      window.location.href = "./login.html";
    });
  }
}

function switchTab(e, tabName) {
  const menuItems = document.querySelectorAll(".sidebar-menu li");
  menuItems.forEach((li) => li.classList.remove("active"));
  e.currentTarget.classList.add("active");

  const contents = document.querySelectorAll(".tab-content");
  contents.forEach((c) => c.classList.remove("active"));

  const targetTab = document.getElementById("tab-" + tabName);
  if (targetTab) targetTab.classList.add("active");

  const titles = {
    products: "QUẢN LÝ SẢN PHẨM",
    orders: "QUẢN LÝ ĐƠN HÀNG",
    users: "QUẢN LÝ NGƯỜI DÙNG",
  };
  document.getElementById("page-title").textContent = titles[tabName];
}

async function loadAdminProducts() {
  const tableBody = document.getElementById("product-table-body");
  if (!tableBody) return;

  try {
    const response = await fetch(`${API_URL}/products`);
    const data = await response.json();
    const products = Array.isArray(data) ? data : data.products || [];

    tableBody.innerHTML = "";
    if (products.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="8" style="text-align:center;">Chưa có sản phẩm nào.</td></tr>`;
      return;
    }

    products.forEach((p, index) => {
      tableBody.innerHTML += `
        <tr>
          <td>${index + 1}</td>
          <td><img src="${p.image || ""}" alt="${p.name}"></td>
          <td><strong>${p.name}</strong></td>
          <td>${p.brand || "N/A"}</td>
          <td>${p.category || "Khác"}</td>
          <td>${p.price ? p.price.toLocaleString("vi-VN") : 0} đ</td>
          <td>${p.stock ?? 0}</td>
          <td>
            <button class="btn-action delete" onclick="deleteProduct('${p._id}')">Xóa</button>
          </td>
        </tr>
      `;
    });
  } catch (err) {
    tableBody.innerHTML = `<tr><td colspan="8" style="text-align:center;">Chưa thể tải dữ liệu sản phẩm từ server</td></tr>`;
  }
}

async function loadAdminOrders() {
  const tableBody = document.getElementById("order-table-body");
  if (!tableBody) return;

  try {
    const response = await fetch(`${API_URL}/orders`, {
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    const orders = Array.isArray(data) ? data : data.orders || [];

    tableBody.innerHTML = "";
    if (orders.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">Chưa có đơn hàng nào.</td></tr>`;
      return;
    }

    orders.forEach((o) => {
      const orderId = o._id ? `#${o._id.slice(-6).toUpperCase()}` : "#N/A";
      const customer = o.customerName || "Khách lẻ";
      const orderDate = o.createdAt
        ? new Date(o.createdAt).toLocaleDateString("vi-VN")
        : "N/A";
      const total = o.totalAmount || 0;

      tableBody.innerHTML += `
        <tr>
          <td>${orderId}</td>
          <td>${customer}</td>
          <td>${orderDate}</td>
          <td>${total.toLocaleString("vi-VN")} đ</td>
          <td><span class="badge badge-warning">${o.status || "Chờ xử lý"}</span></td>
        </tr>
      `;
    });
  } catch (err) {
    tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">Chưa thể tải dữ liệu đơn hàng từ server</td></tr>`;
  }
}

async function loadAdminUsers() {
  const tableBody = document.getElementById("user-table-body");
  if (!tableBody) return;

  try {
    const response = await fetch(`${API_URL}/users`, {
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    const users = Array.isArray(data) ? data : data.users || [];

    tableBody.innerHTML = "";
    if (users.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="4" style="text-align:center;">Chưa có người dùng nào.</td></tr>`;
      return;
    }

    users.forEach((u, index) => {
      const badge =
        u.role === "admin"
          ? '<span class="badge badge-danger">ADMIN</span>'
          : '<span class="badge badge-info">USER</span>';

      tableBody.innerHTML += `
        <tr>
          <td>${index + 1}</td>
          <td><strong>${u.username}</strong></td>
          <td>${u.email || "Không có"}</td>
          <td>${badge}</td>
        </tr>
      `;
    });
  } catch (err) {
    tableBody.innerHTML = `<tr><td colspan="4" style="text-align:center;">Chưa thể tải dữ liệu người dùng từ server</td></tr>`;
  }
}

function openAddModal() {
  document.getElementById("modal-product").classList.add("active");
}

function closeAddModal() {
  document.getElementById("modal-product").classList.remove("active");
  document.getElementById("form-add-product").reset();
}

async function handleSaveProduct(e) {
  e.preventDefault();

  const payload = {
    name: document.getElementById("p-name").value.trim(),
    brand: document.getElementById("p-brand").value.trim(),
    category: document.getElementById("p-category").value,
    price: Number(document.getElementById("p-price").value),
    oldPrice: Number(document.getElementById("p-oldPrice").value) || 0,
    stock: Number(document.getElementById("p-stock").value) || 0,
    image: document.getElementById("p-image").value.trim(),
    detailUrl: document.getElementById("p-detailUrl").value.trim() || "#",
    isNewArrival: document.getElementById("p-isNewArrival").checked,
  };

  try {
    const response = await fetch(`${API_URL}/products`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (response.ok) {
      alert("✅ " + data.message);
      closeAddModal();
      loadAdminProducts();
    } else {
      alert("❌ " + (data.message || "Thêm sản phẩm thất bại!"));
    }
  } catch (err) {
    alert("❌ Lỗi kết nối đến server!");
  }
}

async function deleteProduct(id) {
  if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) return;

  try {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    const data = await response.json();
    if (response.ok) {
      alert(data.message);
      loadAdminProducts();
    } else {
      alert(data.message || "Xóa thất bại!");
    }
  } catch (err) {
    alert("Lỗi khi kết nối đến server!");
  }
}
