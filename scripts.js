// Cookie handling functions
function setCookie(name, value, days = 365) {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = "expires=" + date.toUTCString();
  document.cookie = name + "=" + encodeURIComponent(JSON.stringify(value)) + ";" + expires + ";path=/";
  console.log(`Set cookie ${name}:`, value); // Debug log
}

function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) {
          const value = JSON.parse(decodeURIComponent(c.substring(nameEQ.length, c.length)));
          console.log(`Retrieved cookie ${name}:`, value); // Debug log
          return value;
      }
  }
  console.log(`Cookie ${name} not found, returning empty array`);
  return [];
}

// Initialize data
function initializeData() {
  ["products", "orders", "categories", "users"].forEach(key => {
      if (!document.cookie.includes(key)) {
          console.log(`Initializing cookie ${key}`);
          setCookie(key, []);
      }
  });
}

// DOM Content Loaded
document.addEventListener("DOMContentLoaded", function() {
  console.log("DOM fully loaded, initializing...");
  OverlayScrollbars(document.querySelectorAll("body"), {});
  initializeData();

  // Load and display all dashboard data immediately
  const products = getCookie("products");
  const orders = getCookie("orders");
  const categories = getCookie("categories");
  const users = getCookie("users");

  console.log("Initial data:", { products, orders, categories, users });

  loadDashboardProducts(products);
  loadDashboardCategories(categories);
  loadDashboardOrders(orders);
  loadDashboardUsers(users);
  updateDashboardCounts(products, orders, categories, users);

  showSection("dashboard"); // Show dashboard after loading data
  updateDropdowns();
});

// Section handling
const sections = ["dashboard", "addProduct", "listProduct", "addCategory", "listCategory", 
               "addOrder", "listOrders", "addUser", "listUsers", "sitting"];

function showSection(section) {
  sections.forEach(s => {
      const el = document.getElementById(s);
      if (el) el.style.display = s === section ? "block" : "none";
  });

  if (section === "dashboard") {
      const products = getCookie("products");
      const orders = getCookie("orders");
      const categories = getCookie("categories");
      const users = getCookie("users");
      loadDashboardProducts(products);
      loadDashboardCategories(categories);
      loadDashboardOrders(orders);
      loadDashboardUsers(users);
      updateDashboardCounts(products, orders, categories, users);
  }
  if (section === "addProduct") {
      loadProducts();
      updateDropdowns();
  }
  if (section === "listProduct") loadProducts2();
  if (section === "addCategory") loadCategories();
  if (section === "listCategory") loadCategories2();
  if (section === "addOrder") {
      loadOrders();
      updateDropdowns();
  }
  if (section === "listOrders") loadOrders2();
  if (section === "addUser") loadUsers();
  if (section === "listUsers") loadUsers2();
}

// Dashboard Updates
function updateDashboardCounts(products, orders, categories, users) {
  console.log("Updating dashboard counts:", { products, orders, categories, users });
  document.getElementById("productCount").innerText = products.length;
  document.getElementById("orderCount").innerText = orders.length;
  document.getElementById("categoryCount").innerText = categories.length;
  document.getElementById("userCount").innerText = users.length;
}

// PRODUCT LOGIC
function handleProductForm(event) {
  event.preventDefault();
  const idx = parseInt(document.getElementById("editProductIndex").value, 10);
  if (idx >= 0) updateProduct(idx);
  else saveProduct();
}

function saveProduct() {
  let products = getCookie("products");
  const product = {
      name: document.getElementById("productName").value,
      price: document.getElementById("productPrice").value,
      qty: parseInt(document.getElementById("productQty").value, 10),
      cat: document.getElementById("category").value,
      desc: document.getElementById("productDesc").value
  };
  products.push(product);
  setCookie("products", products);
  alert("Product Saved");
  resetProductForm();
  loadProducts();
  loadDashboardProducts(products);
  updateDashboardCounts(products, getCookie("orders"), getCookie("categories"), getCookie("users"));
}

function loadProducts() {
  const products = getCookie("products");
  const tbody = document.querySelector("#productTable tbody");
  tbody.innerHTML = "";
  products.forEach((p, i) => {
      const row = document.createElement("tr");
      row.innerHTML = `
          <td>${i + 1}</td>
          <td>${p.name}</td>
          <td>${p.price}</td>
          <td>${p.qty}</td>
          <td>${p.cat}</td>
          <td>${p.desc}</td>
          <td>
              <button class="btn btn-sm btn-warning" onclick="editProduct(${i})">Edit</button>
              <button class="btn btn-sm btn-danger" onclick="deleteProduct(${i})">Delete</button>
          </td>
      `;
      tbody.appendChild(row);
  });
}

function loadProducts2() {
  const products = getCookie("products");
  const tbody = document.querySelector("#productTable2 tbody");
  tbody.innerHTML = "";
  products.forEach((p, i) => {
      const row = document.createElement("tr");
      row.innerHTML = `
          <td>${i + 1}</td>
          <td>${p.name}</td>
          <td>${p.price}</td>
          <td>${p.qty}</td>
          <td>${p.cat}</td>
          <td>${p.desc}</td>
          <td>
              <button class="btn btn-sm btn-warning" onclick="editProductInAdd(${i})">Edit</button>
              <button class="btn btn-sm btn-danger" onclick="deleteProduct(${i})">Delete</button>
          </td>
      `;
      tbody.appendChild(row);
  });
}

function loadDashboardProducts(products) {
  const tbody = document.querySelector("#dashboardProductTable tbody");
  tbody.innerHTML = "";
  products.forEach((p, i) => {
      const row = document.createElement("tr");
      row.innerHTML = `
          <td>${i + 1}</td>
          <td>${p.name}</td>
          <td>${p.price}</td>
          <td>${p.qty}</td>
          <td>${p.cat}</td>
          <td>${p.desc}</td>
      `;
      tbody.appendChild(row);
  });
}

function editProduct(index) {
  const products = getCookie("products");
  const p = products[index];
  document.getElementById("productName").value = p.name;
  document.getElementById("productPrice").value = p.price;
  document.getElementById("productQty").value = p.qty;
  document.getElementById("category").value = p.cat;
  document.getElementById("productDesc").value = p.desc;
  document.getElementById("editProductIndex").value = index;
  document.getElementById("productBtn").textContent = "Update Product";
}

function editProductInAdd(index) {
  showSection("addProduct");
  editProduct(index);
}

function updateProduct(index) {
  let products = getCookie("products");
  products[index] = {
      name: document.getElementById("productName").value,
      price: document.getElementById("productPrice").value,
      qty: parseInt(document.getElementById("productQty").value, 10),
      cat: document.getElementById("category").value,
      desc: document.getElementById("productDesc").value
  };
  setCookie("products", products);
  alert("Product Updated");
  resetProductForm();
  loadProducts();
  loadProducts2();
  loadDashboardProducts(products);
  updateDashboardCounts(products, getCookie("orders"), getCookie("categories"), getCookie("users"));
}

function deleteProduct(index) {
  if (!confirm("Are you sure you want to delete this product?")) return;
  let products = getCookie("products");
  products.splice(index, 1);
  setCookie("products", products);
  loadProducts();
  loadProducts2();
  loadDashboardProducts(products);
  updateDashboardCounts(products, getCookie("orders"), getCookie("categories"), getCookie("users"));
}

function resetProductForm() {
  document.getElementById("editProductIndex").value = -1;
  document.getElementById("productName").value = "";
  document.getElementById("productPrice").value = "";
  document.getElementById("productQty").value = "";
  document.getElementById("category").value = "";
  document.getElementById("productDesc").value = "";
  document.getElementById("productBtn").textContent = "Save Product";
}

// CATEGORY LOGIC
function handleCategoryForm(event) {
  event.preventDefault();
  const idx = parseInt(document.getElementById("editCategoryIndex").value, 10);
  if (idx >= 0) updateCategory(idx);
  else saveCategory();
}

function saveCategory() {
  let categories = getCookie("categories");
  const catName = document.getElementById("categoryName").value.trim();
  if (catName && !categories.includes(catName)) {
      categories.push(catName);
      setCookie("categories", categories);
      alert("Category Saved");
  } else {
      alert("Category already exists or invalid!");
  }
  resetCategoryForm();
  loadCategories();
  loadDashboardCategories(categories);
  updateDashboardCounts(getCookie("products"), getCookie("orders"), categories, getCookie("users"));
}

function loadCategories() {
  const categories = getCookie("categories");
  const tbody = document.querySelector("#categoryTable tbody");
  tbody.innerHTML = "";
  categories.forEach((c, i) => {
      const row = document.createElement("tr");
      row.innerHTML = `
          <td>${i + 1}</td>
          <td>${c}</td>
          <td>
              <button class="btn btn-sm btn-warning" onclick="editCategory(${i})">Edit</button>
              <button class="btn btn-sm btn-danger" onclick="deleteCategory(${i})">Delete</button>
          </td>
      `;
      tbody.appendChild(row);
  });
}

function loadCategories2() {
  const categories = getCookie("categories");
  const tbody = document.querySelector("#categoryTable2 tbody");
  tbody.innerHTML = "";
  categories.forEach((c, i) => {
      const row = document.createElement("tr");
      row.innerHTML = `
          <td>${i + 1}</td>
          <td>${c}</td>
          <td>
              <button class="btn btn-sm btn-warning" onclick="editCategoryInAdd(${i})">Edit</button>
              <button class="btn btn-sm btn-danger" onclick="deleteCategory(${i})">Delete</button>
          </td>
      `;
      tbody.appendChild(row);
  });
}

function loadDashboardCategories(categories) {
  const tbody = document.querySelector("#dashboardCategoryTable tbody");
  tbody.innerHTML = "";
  categories.forEach((c, i) => {
      const row = document.createElement("tr");
      row.innerHTML = `
          <td>${i + 1}</td>
          <td>${c}</td>
      `;
      tbody.appendChild(row);
  });
}

function editCategory(index) {
  const categories = getCookie("categories");
  document.getElementById("categoryName").value = categories[index];
  document.getElementById("editCategoryIndex").value = index;
  document.getElementById("categoryBtn").textContent = "Update Category";
}

function editCategoryInAdd(index) {
  showSection("addCategory");
  editCategory(index);
}

function updateCategory(index) {
  let categories = getCookie("categories");
  const newCat = document.getElementById("categoryName").value.trim();
  if (newCat && (!categories.includes(newCat) || categories[index] === newCat)) {
      categories[index] = newCat;
      setCookie("categories", categories);
      alert("Category Updated");
  } else {
      alert("Category already exists or invalid!");
  }
  resetCategoryForm();
  loadCategories();
  loadCategories2();
  loadDashboardCategories(categories);
  updateDashboardCounts(getCookie("products"), getCookie("orders"), categories, getCookie("users"));
}

function deleteCategory(index) {
  if (!confirm("Are you sure you want to delete this category?")) return;
  let categories = getCookie("categories");
  categories.splice(index, 1);
  setCookie("categories", categories);
  loadCategories();
  loadCategories2();
  loadDashboardCategories(categories);
  updateDashboardCounts(getCookie("products"), getCookie("orders"), categories, getCookie("users"));
}

function resetCategoryForm() {
  document.getElementById("editCategoryIndex").value = -1;
  document.getElementById("categoryName").value = "";
  document.getElementById("categoryBtn").textContent = "Save Category";
}

// ORDER LOGIC
function handleOrderForm(event) {
  event.preventDefault();
  const idx = parseInt(document.getElementById("editOrderIndex").value, 10);
  if (idx >= 0) updateOrder(idx);
  else saveOrder();
}

function saveOrder() {
  let orders = getCookie("orders");
  let products = getCookie("products");
  const orderProductName = document.getElementById("orderProduct").value;
  const orderQty = parseInt(document.getElementById("orderqty").value, 10);

  const productIndex = products.findIndex(p => p.name === orderProductName);
  if (productIndex === -1) {
      alert("Product not found!");
      return;
  }
  if (products[productIndex].qty < orderQty) {
      alert("Insufficient stock!");
      return;
  }

  products[productIndex].qty -= orderQty;
  const order = {
      name: document.getElementById("orderName").value,
      qty: orderQty,
      date: document.getElementById("orderDate").value,
      product: orderProductName
  };
  orders.push(order);
  setCookie("orders", orders);
  setCookie("products", products);
  alert("Order Saved");
  resetOrderForm();
  loadOrders();
  loadDashboardOrders(orders);
  loadDashboardProducts(products);
  updateDashboardCounts(products, orders, getCookie("categories"), getCookie("users"));
}

function loadOrders() {
  const orders = getCookie("orders");
  const tbody = document.querySelector("#orderTable tbody");
  tbody.innerHTML = "";
  orders.forEach((o, i) => {
      const row = document.createElement("tr");
      row.innerHTML = `
          <td>${i + 1}</td>
          <td>${o.name}</td>
          <td>${o.qty}</td>
          <td>${o.date}</td>
          <td>${o.product}</td>
          <td>
              <button class="btn btn-sm btn-warning" onclick="editOrder(${i})">Edit</button>
              <button class="btn btn-sm btn-danger" onclick="deleteOrder(${i})">Delete</button>
          </td>
      `;
      tbody.appendChild(row);
  });
}

function loadOrders2() {
  const orders = getCookie("orders");
  const tbody = document.querySelector("#orderTable2 tbody");
  tbody.innerHTML = "";
  orders.forEach((o, i) => {
      const row = document.createElement("tr");
      row.innerHTML = `
          <td>${i + 1}</td>
          <td>${o.name}</td>
          <td>${o.qty}</td>
          <td>${o.date}</td>
          <td>${o.product}</td>
          <td>
              <button class="btn btn-sm btn-warning" onclick="editOrderInAdd(${i})">Edit</button>
              <button class="btn btn-sm btn-danger" onclick="deleteOrder(${i})">Delete</button>
          </td>
      `;
      tbody.appendChild(row);
  });
}

function loadDashboardOrders(orders) {
  const tbody = document.querySelector("#dashboardOrderTable tbody");
  tbody.innerHTML = "";
  orders.forEach((o, i) => {
      const row = document.createElement("tr");
      row.innerHTML = `
          <td>${i + 1}</td>
          <td>${o.name}</td>
          <td>${o.qty}</td>
          <td>${o.date}</td>
          <td>${o.product}</td>
      `;
      tbody.appendChild(row);
  });
}

function editOrder(index) {
  const orders = getCookie("orders");
  const o = orders[index];
  document.getElementById("orderName").value = o.name;
  document.getElementById("orderqty").value = o.qty;
  document.getElementById("orderDate").value = o.date;
  document.getElementById("orderProduct").value = o.product;
  document.getElementById("editOrderIndex").value = index;
  document.getElementById("orderBtn").textContent = "Update Order";
}

function editOrderInAdd(index) {
  showSection("addOrder");
  editOrder(index);
}

function updateOrder(index) {
  let orders = getCookie("orders");
  orders[index] = {
      name: document.getElementById("orderName").value,
      qty: parseInt(document.getElementById("orderqty").value, 10),
      date: document.getElementById("orderDate").value,
      product: document.getElementById("orderProduct").value
  };
  setCookie("orders", orders);
  alert("Order Updated");
  resetOrderForm();
  loadOrders();
  loadOrders2();
  loadDashboardOrders(orders);
  updateDashboardCounts(getCookie("products"), orders, getCookie("categories"), getCookie("users"));
}

function deleteOrder(index) {
  if (!confirm("Are you sure you want to delete this order?")) return;
  let orders = getCookie("orders");
  orders.splice(index, 1);
  setCookie("orders", orders);
  loadOrders();
  loadOrders2();
  loadDashboardOrders(orders);
  updateDashboardCounts(getCookie("products"), orders, getCookie("categories"), getCookie("users"));
}

function resetOrderForm() {
  document.getElementById("editOrderIndex").value = -1;
  document.getElementById("orderName").value = "";
  document.getElementById("orderqty").value = "";
  document.getElementById("orderDate").value = "";
  document.getElementById("orderProduct").value = "";
  document.getElementById("orderBtn").textContent = "Save Order";
}

// USER LOGIC
function handleUserForm(event) {
  event.preventDefault();
  const idx = parseInt(document.getElementById("editUserIndex").value, 10);
  if (idx >= 0) updateUser(idx);
  else saveUser();
}

function saveUser() {
  let users = getCookie("users");
  const user = {
      name: document.getElementById("userName").value,
      email: document.getElementById("userEmail").value,
      phone: document.getElementById("userPhone").value
  };
  users.push(user);
  setCookie("users", users);
  alert("User Saved");
  resetUserForm();
  loadUsers();
  loadDashboardUsers(users);
  updateDashboardCounts(getCookie("products"), getCookie("orders"), getCookie("categories"), users);
}

function loadUsers() {
  const users = getCookie("users");
  const tbody = document.querySelector("#userTable tbody");
  tbody.innerHTML = "";
  users.forEach((u, i) => {
      const row = document.createElement("tr");
      row.innerHTML = `
          <td>${i + 1}</td>
          <td>${u.name}</td>
          <td>${u.email}</td>
          <td>${u.phone || ""}</td>
          <td>
              <button class="btn btn-sm btn-warning" onclick="editUser(${i})">Edit</button>
              <button class="btn btn-sm btn-danger" onclick="deleteUser(${i})">Delete</button>
          </td>
      `;
      tbody.appendChild(row);
  });
}

function loadUsers2() {
  const users = getCookie("users");
  const tbody = document.querySelector("#userTable2 tbody");
  tbody.innerHTML = "";
  users.forEach((u, i) => {
      const row = document.createElement("tr");
      row.innerHTML = `
          <td>${i + 1}</td>
          <td>${u.name}</td>
          <td>${u.email}</td>
          <td>${u.phone || ""}</td>
          <td>
              <button class="btn btn-sm btn-warning" onclick="editUserInAdd(${i})">Edit</button>
              <button class="btn btn-sm btn-danger" onclick="deleteUser(${i})">Delete</button>
          </td>
      `;
      tbody.appendChild(row);
  });
}

function loadDashboardUsers(users) {
  const tbody = document.querySelector("#dashboardUserTable tbody");
  tbody.innerHTML = "";
  users.forEach((u, i) => {
      const row = document.createElement("tr");
      row.innerHTML = `
          <td>${i + 1}</td>
          <td>${u.name}</td>
          <td>${u.email}</td>
          <td>${u.phone || ""}</td>
      `;
      tbody.appendChild(row);
  });
}

function editUser(index) {
  const users = getCookie("users");
  const u = users[index];
  document.getElementById("userName").value = u.name;
  document.getElementById("userEmail").value = u.email;
  document.getElementById("userPhone").value = u.phone;
  document.getElementById("editUserIndex").value = index;
  document.getElementById("userBtn").textContent = "Update User";
}

function editUserInAdd(index) {
  showSection("addUser");
  editUser(index);
}

function updateUser(index) {
  let users = getCookie("users");
  users[index] = {
      name: document.getElementById("userName").value,
      email: document.getElementById("userEmail").value,
      phone: document.getElementById("userPhone").value
  };
  setCookie("users", users);
  alert("User Updated");
  resetUserForm();
  loadUsers();
  loadUsers2();
  loadDashboardUsers(users);
  updateDashboardCounts(getCookie("products"), getCookie("orders"), getCookie("categories"), users);
}

function deleteUser(index) {
  if (!confirm("Are you sure you want to delete this user?")) return;
  let users = getCookie("users");
  users.splice(index, 1);
  setCookie("users", users);
  loadUsers();
  loadUsers2();
  loadDashboardUsers(users);
  updateDashboardCounts(getCookie("products"), getCookie("orders"), getCookie("categories"), users);
}

function resetUserForm() {
  document.getElementById("editUserIndex").value = -1;
  document.getElementById("userName").value = "";
  document.getElementById("userEmail").value = "";
  document.getElementById("userPhone").value = "";
  document.getElementById("userBtn").textContent = "Save User";
}

// Dropdown Updates
function updateDropdowns() {
  const categories = getCookie("categories");
  const products = getCookie("products");
  const categoryDropdown = document.getElementById("category");
  const productDropdown = document.getElementById("orderProduct");

  if (categoryDropdown) {
      categoryDropdown.innerHTML = '<option value="">Select Category</option>' + 
          categories.map(c => `<option value="${c}">${c}</option>`).join("");
  }
  if (productDropdown) {
      productDropdown.innerHTML = '<option value="">Select Product</option>' + 
          products.map(p => `<option value="${p.name}">${p.name}</option>`).join("");
  }
}