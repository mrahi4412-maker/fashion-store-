const DB = {

get(key, fallback) {

try {

return JSON.parse(
localStorage.getItem(key)
) ?? fallback;

}

catch {

return fallback;

}

},

set(key, value) {

localStorage.setItem(
key,
JSON.stringify(value)
);

}

};


const Admin = {


login() {

const username =
document.querySelector("#adminUser")
.value;

const password =
document.querySelector("#adminPass")
.value;


if (
username === "admin" &&
password === "admin123"
) {

sessionStorage.rnAdmin = "1";

this.show();

}

else {

alert(
"Demo login: admin / admin123"
);

}

},


show() {

document
.querySelector("#login")
.classList
.add("hide");


document
.querySelector("#panel")
.classList
.remove("hide");


this.render();

},


addProduct() {

const products =
DB.get(
"rn_products",
[]
);


products.push({

id:
Date.now(),

name:
"New Fashion Product",

cat:
"Ladies",

price:
999,

tag:
"New",

icon:
"RN"

});


DB.set(
"rn_products",
products
);


this.render();

},


render() {

const products =
DB.get(
"rn_products",
[]
);


const orders =
DB.get(
"rn_orders",
[]
);


const reviews =
DB.get(
"rn_reviews",
[]
);


const cart =
DB.get(
"rn_cart",
[]
);


document.querySelector("#sProducts")
.textContent =
products.length;


document.querySelector("#sOrders")
.textContent =
orders.length;


document.querySelector("#sReviews")
.textContent =
reviews.length;


document.querySelector("#sCart")
.textContent =
cart.length;


document.querySelector("#adminProducts")
.innerHTML =
products.map(product => `

<div class="adminrow">

<span>

<b>
${product.name}
</b>

<small>
${product.cat}
</small>

</span>

<b>
₹${Number(product.price)
.toLocaleString("en-IN")}
</b>

</div>

`).join("");


if (!orders.length) {

document.querySelector("#orders")
.innerHTML =
"<p class='muted'>No orders yet.</p>";

}

else {

document.querySelector("#orders")
.innerHTML =
orders.map(order => `

<div class="adminrow">

<span>

<b>
${order.id}
</b>

<small>
${order.name} •
${order.phone}
</small>

</span>

<b>

₹${Number(order.total)
.toLocaleString("en-IN")}

<br>

<small>
${order.status}
</small>

</b>

</div>

`).join("");

}


document.querySelector("#adminReviews")
.innerHTML =
reviews.map(review => `

<div class="adminrow">

<span>

<b>
${review[0]}
</b>

<small>
${review[2]}
</small>

</span>

<b>
${"★".repeat(review[1])}
</b>

</div>

`).join("");

}

};


if (
sessionStorage.rnAdmin === "1"
) {

Admin.show();

}
