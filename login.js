document
  .getElementById("loginForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Lưu thông tin Đăng nhập
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        alert("Đăng nhập thành công!");
        window.location.href = "index.html";
      } else {
        alert(data.message || "Đăng nhập thất bại!");
      }
    } catch (err) {
      alert("Không thể kết nối đến máy chủ server!");
    }
  });
