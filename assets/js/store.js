const defaultProducts = [

{
id: 1,
name: "Royal Anarkali Suit",
cat: "Ladies",
price: 1599,
tag: "Bestseller",
icon: "✦"
},

{
id: 2,
name: "Premium Cotton Kurti",
cat: "Ladies",
price: 799,
tag: "New",
icon: "RN"
},

{
id: 3,
name: "Designer Party Gown",
cat: "Ladies",
price: 2199,
tag: "Premium",
icon: "✧"
},

{
id: 4,
name: "Elegant Gold Jewelry Set",
cat: "Jewelry",
price: 1299,
tag: "Trending",
icon: "◆"
},

{
id: 5,
name: "Girls Party Dress",
cat: "Kids",
price: 699,
tag: "New",
icon: "♡"
},

{
id: 6,
name: "Kids Ethnic Set",
cat: "Kids",
price: 899,
tag: "Bestseller",
icon: "RN"
},

{
id: 7,
name: "Kids Cotton Frock",
cat: "Kids",
price: 499,
tag: "Value",
icon: "♡"
},

{
id: 8,
name: "Classic Jewelry Set",
cat: "Jewelry",
price: 999,
tag: "Elegant",
icon: "◆"
}

];


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


const Store = {

cat: "All",

products: DB.get(
"rn_products",
defaultProducts
),

cart: DB.get(
"rn_cart",
[]
),


money(number) {

return "₹" +
Number(number)
.toLocaleString("en-IN");

},


render() {

const search =
document.querySelector("#search");

const query =
(search?.value || "")
.toLowerCase();


const list =
this.products.filter(product =>

(
this.cat === "All" ||
product.cat === this.cat
)

&&
product.name
.toLowerCase()
.includes(query)

);


document.querySelector("#products")
.innerHTML = list.map(product => `

<article class="product">

<div class="pimg">

<span>
${product.icon}
</span>

<i>
${product.tag}
</i>

</div>


<div class="pbody">

<small>
${product.cat}
</small>

<h3>
${product.name}
</h3>

<div class="price">
${this.money(product.price)}
</div>

<button
class="add"
onclick="Store.add(${product.id})"
>
Add to Cart
</button>

</div>

</article>

`).join("");

},


add(id) {

this.cart.push(id);

DB.set(
"rn_cart",
this.cart
);

this.update();

this.openCart();

},


update() {

document.querySelector("#cartCount")
.textContent =
this.cart.length;

},


openCart() {

this.drawCart();

document
.querySelector("#cartModal")
.classList
.remove("hide");

},


closeCart() {

document
.querySelector("#cartModal")
.classList
.add("hide");

},


drawCart() {

let total = 0;

const box =
document.querySelector("#cartItems");


if (!this.cart.length) {

box.innerHTML =
"<p>Your cart is empty.</p>";

document.querySelector("#cartTotal")
.textContent = "₹0";

return;

}


box.innerHTML =
this.cart.map((id, index) => {

const product =
this.products.find(
item => item.id === id
);

total += product.price;


return `

<div class="cartrow">

<span>
${product.name}
</span>

<b>

${this.money(product.price)}

<button
onclick="Store.remove(${index})"
>
×
</button>

</b>

</div>

`;

}).join("");


document.querySelector("#cartTotal")
.textContent =
this.money(total);

},


remove(index) {

this.cart.splice(
index,
1
);

DB.set(
"rn_cart",
this.cart
);

this.update();

this.drawCart();

},


checkout() {

if (!this.cart.length) {

alert("Your cart is empty.");

return;

}

location.href =
"checkout.html";

}

};


document
.querySelectorAll(".filters button")
.forEach(button => {

button.onclick = () => {

document
.querySelectorAll(".filters button")
.forEach(item =>
item.classList.remove("active")
);

button.classList.add("active");

Store.cat =
button.dataset.cat;

Store.render();

};

});


const defaultReviews = [

[
"Ayesha",
5,
"Beautiful quality and very elegant designs."
],

[
"Sana",
5,
"The kids collection is lovely and comfortable."
],

[
"Farhana",
5,
"Fast response and helpful service."
]

];


function renderReviews() {

const reviews =
DB.get(
"rn_reviews",
defaultReviews
);


document.querySelector("#reviewsList")
.innerHTML = reviews.map(review => `

<article class="review">

<div class="stars">
${"★".repeat(review[1])}
</div>

<p>
“${review[2]}”
</p>

<b>
— ${review[0]}
</b>

</article>

`).join("");

}


document
.querySelector("#reviewForm")
?.addEventListener(
"submit",
event => {

event.preventDefault();

const form =
new FormData(event.target);

const reviews =
DB.get(
"rn_reviews",
defaultReviews
);


reviews.push([

form.get("name"),

Number(
form.get("rating")
),

form.get("text")

]);


DB.set(
"rn_reviews",
reviews
);

event.target.reset();

renderReviews();

alert(
"Thank you for your review!"
);

});


if (
document.querySelector("#products")
) {

Store.render();

Store.update();

renderReviews();

}
