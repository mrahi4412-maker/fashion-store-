/* =========================================================
   RAHI NUR OFFICIAL FASHION STORE
   STORE FUNCTIONALITY
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =======================================================
     CART
     ======================================================= */

  let cart = JSON.parse(localStorage.getItem("rahiNurCart")) || [];

  const saveCart = () => {
    localStorage.setItem("rahiNurCart", JSON.stringify(cart));
    updateCartCount();
    renderCart();
  };

  const updateCartCount = () => {
    const count = cart.reduce((total, item) => total + item.quantity, 0);

    document.querySelectorAll(".cart-count").forEach(el => {
      el.textContent = count;
    });

    document.querySelectorAll("[data-cart-count]").forEach(el => {
      el.textContent = count;
    });
  };


  /* =======================================================
     ADD TO CART
     ======================================================= */

  document.addEventListener("click", event => {

    const button = event.target.closest(
      ".add, .add-to-cart, [data-add-cart]"
    );

    if (!button) return;

    const card = button.closest(
      ".product-card, [data-product]"
    );

    if (!card) return;

    const name =
      card.dataset.name ||
      card.querySelector("h3")?.textContent?.trim() ||
      "Fashion Product";

    const priceText =
      card.dataset.price ||
      card.querySelector(".price")?.textContent ||
      "0";

    const price =
      parseFloat(
        String(priceText).replace(/[^\d.]/g, "")
      ) || 0;

    const image =
      card.dataset.image ||
      card.querySelector("img")?.src ||
      "";

    const existing = cart.find(
      item => item.name === name
    );

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        id: Date.now(),
        name,
        price,
        image,
        quantity: 1
      });
    }

    saveCart();

    showMessage(
      `${name} added to cart`
    );

    openCart();

  });


  /* =======================================================
     CART DRAWER
     ======================================================= */

  const cartDrawer =
    document.querySelector(".cart-drawer");

  const overlay =
    document.querySelector(".overlay");

  const openCart = () => {

    if (cartDrawer) {
      cartDrawer.classList.add("open");
    }

    if (overlay) {
      overlay.classList.add("show");
    }

    document.body.style.overflow = "hidden";

    renderCart();
  };

  window.openCart = openCart;


  const closeCart = () => {

    if (cartDrawer) {
      cartDrawer.classList.remove("open");
    }

    if (overlay) {
      overlay.classList.remove("show");
    }

    document.body.style.overflow = "";
  };

  window.closeCart = closeCart;


  document.addEventListener("click", event => {

    if (
      event.target.closest(
        ".cart, [data-cart], #cartButton, .cart-button"
      )
    ) {
      openCart();
    }

    if (
      event.target.closest(
        ".cart-close, [data-close-cart], #closeCart"
      )
    ) {
      closeCart();
    }

  });


  if (overlay) {
    overlay.addEventListener("click", closeCart);
  }


  /* =======================================================
     RENDER CART
     ======================================================= */

  const renderCart = () => {

    const container =
      document.querySelector(
        ".cart-items"
      );

    if (!container) return;

    if (cart.length === 0) {

      container.innerHTML = `
        <div style="
          text-align:center;
          padding:60px 20px;
          color:#c8bda8;
        ">
          <div style="font-size:45px;margin-bottom:15px;">
            🛍️
          </div>

          <h3 style="
            color:#f8f0df;
            margin-bottom:10px;
          ">
            Your cart is empty
          </h3>

          <p>
            Add something beautiful to your cart.
          </p>
        </div>
      `;

      updateTotal();

      return;
    }


    container.innerHTML = cart.map(item => {

      const subtotal =
        item.price * item.quantity;

      return `
        <div
          class="cart-item"
          data-id="${item.id}"
          style="
            display:flex;
            gap:14px;
            padding:15px 0;
            border-bottom:1px solid rgba(218,175,53,.25);
          "
        >

          <img
            src="${item.image}"
            alt="${escapeHTML(item.name)}"
            style="
              width:75px;
              height:90px;
              object-fit:cover;
              border-radius:2px;
            "
          >

          <div style="flex:1;">

            <h4 style="
              color:#fff;
              margin-bottom:7px;
              font-family:Georgia,serif;
              font-weight:normal;
            ">
              ${escapeHTML(item.name)}
            </h4>

            <div style="
              color:#d9ae32;
              margin-bottom:10px;
            ">
              ₹${item.price.toLocaleString("en-IN")}
            </div>

            <div style="
              display:flex;
              align-items:center;
              gap:10px;
            ">

              <button
                class="quantity-minus"
                data-id="${item.id}"
                style="
                  width:28px;
                  height:28px;
                  background:transparent;
                  color:#d9ae32;
                  border:1px solid #d9ae32;
                  cursor:pointer;
                "
              >−</button>

              <span style="color:#fff;">
                ${item.quantity}
              </span>

              <button
                class="quantity-plus"
                data-id="${item.id}"
                style="
                  width:28px;
                  height:28px;
                  background:transparent;
                  color:#d9ae32;
                  border:1px solid #d9ae32;
                  cursor:pointer;
                "
              >+</button>

              <button
                class="remove-item"
                data-id="${item.id}"
                style="
                  margin-left:auto;
                  background:transparent;
                  color:#e55;
                  border:0;
                  cursor:pointer;
                "
              >
                Remove
              </button>

            </div>

          </div>

        </div>
      `;

    }).join("");

    updateTotal();

  };


  /* =======================================================
     CART QUANTITY
     ======================================================= */

  document.addEventListener("click", event => {

    const plus =
      event.target.closest(".quantity-plus");

    const minus =
      event.target.closest(".quantity-minus");

    const remove =
      event.target.closest(".remove-item");


    if (plus) {

      const id =
        Number(plus.dataset.id);

      const item =
        cart.find(item => item.id === id);

      if (item) {
        item.quantity++;
        saveCart();
      }

    }


    if (minus) {

      const id =
        Number(minus.dataset.id);

      const item =
        cart.find(item => item.id === id);

      if (!item) return;

      item.quantity--;

      if (item.quantity <= 0) {
        cart =
          cart.filter(item => item.id !== id);
      }

      saveCart();

    }


    if (remove) {

      const id =
        Number(remove.dataset.id);

      cart =
        cart.filter(item => item.id !== id);

      saveCart();

      showMessage("Product removed");

    }

  });


  /* =======================================================
     TOTAL
     ======================================================= */

  const updateTotal = () => {

    const total =
      cart.reduce(
        (sum, item) =>
          sum + item.price * item.quantity,
        0
      );

    document.querySelectorAll(
      ".cart-total strong, [data-cart-total]"
    ).forEach(el => {

      el.textContent =
        `₹${total.toLocaleString("en-IN")}`;

    });

  };


  /* =======================================================
     SEARCH
     ======================================================= */

  const searchInputs =
    document.querySelectorAll(
      ".search-box input, #searchInput, [data-search]"
    );

  searchInputs.forEach(input => {

    input.addEventListener("input", () => {

      const search =
        input.value.toLowerCase().trim();

      const products =
        document.querySelectorAll(
          ".product-card"
        );

      products.forEach(product => {

        const text =
          product.textContent.toLowerCase();

        product.style.display =
          !search || text.includes(search)
            ? ""
            : "none";

      });

    });

    input.addEventListener("keydown", event => {

      if (event.key === "Enter") {

        event.preventDefault();

        const search =
          input.value.trim();

        if (search) {

          document.querySelector(
            ".product-grid"
          )?.scrollIntoView({
            behavior: "smooth"
          });

        }

      }

    });

  });


  /* =======================================================
     CATEGORY FILTER
     ======================================================= */

  document.addEventListener("click", event => {

    const button =
      event.target.closest(
        ".filter-buttons button, [data-category]"
      );

    if (!button) return;

    const category =
      (
        button.dataset.category ||
        button.textContent
      )
      .toLowerCase()
      .trim();

    document.querySelectorAll(
      ".filter-buttons button"
    ).forEach(btn => {
      btn.classList.remove(
        "filter-active"
      );
    });

    button.classList.add(
      "filter-active"
    );


    document.querySelectorAll(
      ".product-card"
    ).forEach(card => {

      const cardCategory =
        (
          card.dataset.category ||
          card.textContent
        )
        .toLowerCase();

      if (
        category === "all" ||
        category === "" ||
        cardCategory.includes(category)
      ) {

        card.style.display = "";

      } else {

        card.style.display = "none";

      }

    });

  });


  /* =======================================================
     WISHLIST
     ======================================================= */

  let wishlist =
    JSON.parse(
      localStorage.getItem("rahiNurWishlist")
    ) || [];


  document.addEventListener("click", event => {

    const button =
      event.target.closest(
        ".wishlist, [data-wishlist], #wishlistButton"
      );

    if (!button) return;

    const card =
      button.closest(".product-card");

    if (!card) return;

    const name =
      card.dataset.name ||
      card.querySelector("h3")?.textContent?.trim() ||
      "Product";

    if (wishlist.includes(name)) {

      wishlist =
        wishlist.filter(
          item => item !== name
        );

      button.classList.remove(
        "wishlist-active"
      );

      showMessage(
        "Removed from wishlist"
      );

    } else {

      wishlist.push(name);

      button.classList.add(
        "wishlist-active"
      );

      showMessage(
        "Added to wishlist ❤️"
      );

    }

    localStorage.setItem(
      "rahiNurWishlist",
      JSON.stringify(wishlist)
    );

  });


  /* =======================================================
     SHOP NOW
     ======================================================= */

  document.addEventListener("click", event => {

    const button =
      event.target.closest(
        ".gold-button, [data-shop-now]"
      );

    if (!button) return;

    document.querySelector(
      ".product-grid"
    )?.scrollIntoView({
      behavior: "smooth"
    });

  });


  /* =======================================================
     LOGIN / REGISTER
     ======================================================= */

  document.addEventListener("click", event => {

    const button =
      event.target.closest(
        ".login, [data-login], #loginButton"
      );

    if (!button) return;

    showLoginBox();

  });


  const showLoginBox = () => {

    if (document.querySelector(
      ".login-modal"
    )) return;

    const modal =
      document.createElement("div");

    modal.className =
      "login-modal";

    modal.innerHTML = `

      <div class="login-overlay"></div>

      <div style="
        position:fixed;
        z-index:2000;
        top:50%;
        left:50%;
        transform:translate(-50%,-50%);
        width:min(420px,90%);
        background:#180005;
        border:1px solid #d9ae32;
        padding:35px;
        box-shadow:0 20px 60px rgba(0,0,0,.6);
      ">

        <button
          class="login-close"
          style="
            position:absolute;
            right:15px;
            top:12px;
            background:none;
            border:0;
            color:#fff;
            font-size:25px;
            cursor:pointer;
          "
        >
          ×
        </button>

        <div style="
          text-align:center;
          margin-bottom:25px;
        ">

          <div style="
            color:#d9ae32;
            font-size:35px;
          ">
            ✦
          </div>

          <h2 style="
            color:#d9ae32;
            font-family:Georgia,serif;
            margin:8px 0;
          ">
            RAHI NUR
          </h2>

          <p style="color:#c8bda8;">
            Welcome back
          </p>

        </div>

        <input
          type="email"
          placeholder="Email address"
          style="
            width:100%;
            padding:14px;
            margin-bottom:12px;
            background:#260008;
            color:#fff;
            border:1px solid rgba(218,175,53,.5);
            outline:none;
          "
        >

        <input
          type="password"
          placeholder="Password"
          style="
            width:100%;
            padding:14px;
            margin-bottom:18px;
            background:#260008;
            color:#fff;
            border:1px solid rgba(218,175,53,.5);
            outline:none;
          "
        >

        <button
          class="gold-button"
          style="width:100%;"
        >
          LOGIN
        </button>

        <p style="
          text-align:center;
          color:#999;
          font-size:12px;
          margin-top:18px;
        ">
          Account system will be connected in the next step.
        </p>

      </div>

    `;

    document.body.appendChild(modal);


    modal.querySelector(
      ".login-close"
    ).addEventListener(
      "click",
      () => modal.remove()
    );

    modal.querySelector(
      ".login-overlay"
    ).addEventListener(
      "click",
      () => modal.remove()
    );

  };


  /* =======================================================
     TOAST MESSAGE
     ======================================================= */

  const showMessage = message => {

    const old =
      document.querySelector(".store-toast");

    if (old) old.remove();

    const toast =
      document.createElement("div");

    toast.className =
      "store-toast";

    toast.textContent =
      message;

    Object.assign(
      toast.style,
      {
        position: "fixed",
        bottom: "25px",
        left: "50%",
        transform: "translateX(-50%)",
        background: "#d9ae32",
        color: "#180005",
        padding: "13px 22px",
        borderRadius: "30px",
        zIndex: "3000",
        fontWeight: "bold",
        fontSize: "13px",
        boxShadow: "0 8px 30px rgba(0,0,0,.4)"
      }
    );

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 2500);

  };


  /* =======================================================
     SECURITY / HTML ESCAPE
     ======================================================= */

  const escapeHTML = value => {

    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  };


  /* =======================================================
     INITIALIZE
     ======================================================= */

  updateCartCount();
  renderCart();

});
