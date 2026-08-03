async function fetchProducts() {
  try {
    const response = await fetch("http://localhost:3000/api/products");
    const products = await response.json();

    const productListDiv = document.getElementById("product-list");
    productListDiv.innerHTML = "";

    products.forEach((product) => {
      const productHTML = `
                <div class="product-card" style="border: 1px solid #ddd; padding: 15px; margin: 10px; border-radius: 8px; width: 220px; display: inline-block; vertical-align: top;">
                    <img src="${product.image || "https://via.placeholder.com/150"}" alt="${product.name}" style="width: 100%; height: 150px; object-fit: cover; border-radius: 5px;">
                    <span style="font-size: 12px; color: #888;">${product.brand || "Thể thao"}</span>
                    <h4 style="margin: 5px 0;">${product.name}</h4>
                    <p style="color: #d9534f; font-weight: bold;">${product.price ? product.price.toLocaleString("vi-VN") : 0} VNĐ</p>
                    <p style="font-size: 13px; color: #555;">Loại: ${product.category}</p>
                    <button style="background: #28a745; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; width: 100%;">Thêm vào giỏ</button>
                </div>
            `;
      productListDiv.innerHTML += productHTML;
    });
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu:", error);
    document.getElementById("product-list").innerHTML =
      "Không thể kết nối với máy chủ!";
  }
}

fetchProducts();
