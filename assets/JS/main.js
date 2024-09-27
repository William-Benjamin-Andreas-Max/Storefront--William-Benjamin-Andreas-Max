//#region SERVICE WORKER
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}
//#endregion
//#region VARIABLES
let categories = []; // Store categories
let basketData = []; // Store basket data
let basketTotalAmount = 0; // Store basket total
let basketTotalPrice = 0; // Store basket price
readData();

// console.log(basketData);
let mainCategories = {
  Beauty: [],
  Fashion: [],
  Electronics: [],
  Home: [],
  Sports: [],
};

let myApp = document.getElementById("app");
let headerDiv = document.createElement("header");
myApp.appendChild(headerDiv);
headerDiv.classList.add("headerNav");

let productsHeader = document.createElement("header");
productsHeader.classList.add("productsHeader");
let searchInput = document.getElementById("searchInput");
let productsDiv = document.createElement("div"); // Div for displaying products
let productsContainer = document.createElement("div");
productsContainer.classList.add("productsContainer");

let fetchedProducts = []; // Store fetched products

myApp.appendChild(productsContainer);

//#endregion
//#region DATA FETCHING AND HANDLING
getData(); // Fetch data

function getData() {
  fetch("https://dummyjson.com/products/category-list")
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      return response.json();
    })
    .then((data) => {
      if (Array.isArray(data)) {
        categories = data;
        sortCategories(data);
      }
    })
    .catch((error) => {
      console.error(error);
      buildError(error);
    });
}

function sortCategories(data) {
  data.forEach((category) => {
    // Sort into main categories
    switch (category) {
      case "beauty":
      case "fragrances":
      case "skin-care":
        mainCategories.Beauty.push(category);
        break;
      case "tops":
      case "womens-dresses":
      case "womens-shoes":
      case "mens-shirts":
      case "mens-shoes":
      case "mens-watches":
      case "womens-watches":
      case "womens-bags":
      case "womens-jewellery":
      case "sunglasses":
        mainCategories.Fashion.push(category);
        break;
      case "smartphones":
      case "laptops":
      case "tablets":
      case "mobile-accessories":
        mainCategories.Electronics.push(category);
        break;
      case "furniture":
      case "home-decoration":
      case "groceries":
      case "kitchen-accessories":
        mainCategories.Home.push(category);
        break;
      case "sports-accessories":
      case "motorcycle":
      case "vehicle":
        mainCategories.Sports.push(category);
        break;
      default:
        console.log(`Unknown category: ${category}`);
        break;
    }
  });

  createButton(mainCategories);
}

function buildError(error) {
  myApp.innerHTML = `
    <div class="error-container">
      <h1>Error loading data</h1>
      <p>Please try again later.</p>
      <p>${error.message}</p>
    </div>
  `;
}

function getProducts(subCategories) {
  productsDiv.innerHTML = "";
  productsContainer.innerHTML = "";
  productsContainer.classList.add("products");
  fetchedProducts = []; // Resetting for each category fetch

  subCategories.forEach((subCategory) => {
    let url = `https://dummyjson.com/products/category/${subCategory}`;
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error: " + response.status);
        }
        return response.json();
      })
      .then((data) => {
        fetchedProducts = data.products; // Store fetched products globally
        displayProducts(data, subCategories);
      })
      .catch((error) => {
        console.error(error);
        buildError(error);
      });
  });
}

//#endregion
//#region UI FUNCTIONS
function createButton(data) {
  let buttonDiv = document.createElement("section");
  buttonDiv.classList.add("category");
  let myHtml = "";

  for (let mainCategory in data) {
    myHtml += `
        <div class="category-wrapper">
          <button class="category-button" data-category="${mainCategory}">
            ${mainCategory}
          </button>
          <div class="subcategories" id="${mainCategory}-subcategories">
            ${data[mainCategory]
              .map(
                (sub) =>
                  `<div class="subcategory" onclick="handleSubcategoryClick('${sub}')">${sub}</div>`
              )
              .join("")}
          </div>
        </div>`;
  }

  buttonDiv.innerHTML = myHtml;
  headerDiv.prepend(buttonDiv);

  document.querySelectorAll(".category-wrapper").forEach((wrapper) => {
    wrapper.addEventListener("mouseover", () => showSubCategories(wrapper));
    wrapper.addEventListener("mouseout", () => hideSubCategories(wrapper));
    wrapper.addEventListener("click", () => toggleSubCategories(wrapper));
  });
}

function toggleSubCategories(wrapper) {
  let subCategoriesDiv = wrapper.querySelector(".subcategories");
  if (subCategoriesDiv) {
    subCategoriesDiv.classList.toggle("displaynone");
  }
}
function showSubCategories(wrapper) {
  let subCategoriesDiv = wrapper.querySelector(".subcategories");
  if (subCategoriesDiv) {
    subCategoriesDiv.style.display = "block";
  }
}
function hideSubCategories(wrapper) {
  let subCategoriesDiv = wrapper.querySelector(".subcategories");
  if (subCategoriesDiv) {
    subCategoriesDiv.style.display = "none";
    subCategoriesDiv.classList.remove("displaynone");
  }
}

function handleSubcategoryClick(subCategory) {
  getProducts([subCategory]);
}

function createStars(rating) {
  let stars = "";
  rating = Math.round(rating);
  for (let i = 0; i < 5; i++) {
    stars += `<img class="star" src="assets/Images/${
      i < rating ? "Filled" : "Empty"
    } star.svg" alt="${i < rating ? "Filled" : "Empty"} star">`;
  }
  return stars;
}
//#endregion
//#region FOOTER
function buildFooter() {
  let footer = document.createElement("footer");
  footer.className = "footerMain";

  footer.innerHTML = `
      <div class="lists">
        <ul>
          <h3>Company</h3>
          <p>Infinite Finds Emv</p>
          <p>CVR-NB-44215799</p>
        </ul>
        <ul>
          <h3>Address</h3>
          <p>Bakkegårdsvej 28 C,2</p>
          <p>9000 Aalborg</p>
        </ul>
        <ul>
          <h3>Policy</h3>
          <li><a href="#">Terms and Conditions</a></li>
          <li><a href="#">Privacy</a></li>
          <li><a href="#">Withdrawal</a></li>
          <li><a href="#">Cookies</a></li>
        </ul>
        <ul>
          <h3>Contact Info</h3>
          <p>Phone: +45 42506072</p>
          <p>E-mail: Infinite@finds.dk</p>
        </ul>
      <div class="ratings">
        <ul>
          <li><img src="assets/Images/Link [footer__ben-item1].svg" alt=""></li>
          <li><img src="assets/Images/Link [footer__ben-item].svg" alt=""></li>
          <li><img src="assets/Images/Link [is-br-12--is-m-br-10--slide-in1].svg" alt=""></li>
        </ul>
      </div>
      </div>
    `;

  myApp.appendChild(footer);
}

buildHeader();
buildFeaturedCategory();
buildFooter();

//#endregion
//#region buildFeaturedCategory
function buildFeaturedCategory() {
  let featuredCategory = document.createElement("section");
  featuredCategory.innerHTML = `
    <figure class="featuredCategory">
      <img src="assets/Images/featuredCategory.png" alt="Featured Category" />
      <figcaption>
        <section>
          <p class="new-arrival">New Arrival</p>
          <header>
            <hgroup>
              <h2>Discover Our</h2>
              <h2>New Collection</h2>
            </hgroup>
          </header>
          <article>
            <p class="featuredCategoryText">
              where style meets sophistication. Discover the latest trends
              crafted to perfection, blending innovation with timeless elegance
            </p>
          </article>
        </section>
        <footer><button onclick="FeaturedCategoryCallBack()" class="buy-now">Buy Now</button></footer>
      </figcaption>
    </figure>
  `;
  productsContainer.innerHTML = featuredCategory.innerHTML;
}

function FeaturedCategoryCallBack() {
  getProducts(["furniture"]);
}
//#endregion
//#region HEADER
function buildHeader() {
  let logoDiv = document.createElement("div");
  logoDiv.id = "logoDiv";
  logoDiv.classList.add("logo");
  let logoSearch = document.createElement("div");

  let logoHtml = `
    <img onclick="resetView()" src="assets/Images/Header.svg" alt="logo" class="header-logo">`;

  const searchInputHTML = `
  <div class="search">
  <img src="assets/Images/searchIcon.svg" alt="search-logo" />
  <input id="searchInput" type="text"  placeholder="Search" />
  </div>`;

  const cart = `
   <div id="basketCart" class="cart-container">
   <img src="assets/Images/Cart.svg" alt="Cart" />
   <div> <p id="basket-total">${basketTotalAmount}</p> </div>
   </div>
`;

  headerDiv.appendChild(logoSearch);
  logoSearch.appendChild(logoDiv);
  logoDiv.innerHTML = logoHtml + searchInputHTML + cart;
  searchIt();
}
//#endregion
//#region Basket price/Total
function getBasketTotal() {
  basketTotalAmount = 0;
  basketTotalPrice = 0;

  basketData.forEach((myProduct) => {
    basketTotalAmount += myProduct.amount;
    basketTotalPrice += myProduct.amount * myProduct.Price;
    // console.log(myProduct.Price);
  });

  document.getElementById("basket-total").textContent = basketTotalAmount;

  let basketCartTotal = document.getElementById("basketCartTotal");

  if (basketCartTotal) {
    basketCartTotal.textContent = `Subtotal (${basketTotalAmount})`;
  }

  let basketCartPrice = document.getElementById("basketCartTotalPrice");
  if (basketCartPrice) {
    basketCartPrice.textContent = `$${basketTotalPrice.toFixed(2)}`;
  }

  // console.log("Basket total:", basketTotalAmount);
}
//#endregion
//#region SEARCH
function searchIt() {
  searchInput = document.getElementById("searchInput");
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      let searchQuery = e.target.value;
      searchProducts(searchQuery);
    }
  });
}

function resetView() {
  productsDiv.innerHTML = "";
  productsContainer.innerHTML = "";
  productsContainer.classList.remove("products");
  buildFeaturedCategory();
  getModel();
}

function searchProducts(searchQuery) {
  fetch(`https://dummyjson.com/products/search?q=${searchQuery}`)
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      return response.json(); // Return the response as JSON
    })
    .then((data) => {
      fetchedProducts = data.products;
      displayProducts(data, searchQuery);
      // console.log(data);
    })
    .catch((error) => {
      console.error(error);
      buildError(error);
    });
}

function displayProducts(data, searchQuery) {
  productsContainer.classList.add("products");
  productsContainer.innerHTML = "";
  let myHtml = "";
  // console.log(fetchedProducts);

  productsHeader.innerHTML = `<h2>${searchQuery}</h2>`;

  if (Array.isArray(data.products)) {
    data.products.forEach((categoriesProducts, index) => {
      myHtml += `
    <figure onclick="viewProduct(${index})">
            <img src="${categoriesProducts.thumbnail}" alt="${
        categoriesProducts.title
      }">
            <figcaption>
              <h3>${categoriesProducts.title}</h3>
              <p>${categoriesProducts.price} $</p>
              <div class="rating">${createStars(
                categoriesProducts.rating
              )}</div>
            </figcaption>
          </figure>
        `;
    });

    productsDiv.innerHTML = myHtml;
    productsContainer.appendChild(productsHeader);
    productsContainer.appendChild(productsDiv);
    getModel();
  }
}

//#endregion
//#region viewProduct
function viewProduct(index) {
  const product = fetchedProducts[index];
  buildViewProduct(product);
  getModel();
}

function buildViewProduct(product) {
  // console.log(product);

  productsContainer.innerHTML = "";
  productsContainer.classList.remove("products");

  let productDetailsHtml = `
    <section class="viewProduct">
      <figure>
        <div class="image-container">
          <img src="${product.thumbnail}" alt="${product.title}" />
        </div>
        <figcaption>
          <header><h2>${product.title}</h2></header>
          <div class="details">
            <div class="rating">${createStars(product.rating)}</div>
          </div>
          <section>
            <p>$${product.price}</p>
            <article>
              <p>${product.description}</p>
            </article>
            <hr />
<div class="Buy-Now-container">
  <button onclick="buyNowCallBack(${product.id}, ${
    product.price
  })">Buy Now</button>
</div>
          </section>
        </figcaption>
      </figure>
    </section>
  `;

  // console.log(fetchedProducts);
  productsContainer.innerHTML = productDetailsHtml;
}
//#endregion
//#region basketData

function buyNowCallBack(myProductId, myProductPrice) {
  // console.log(myProductId, myProductPrice);
  let itemFound = false;
  let itemPrice = myProductPrice;

  basketData.forEach((item) => {
    if (item.id === myProductId) {
      item.amount += 1;
      itemPrice = myProductPrice;
      // console.log(item);
      itemFound = true;
    }
  });

  if (!itemFound) {
    basketData.push({ id: myProductId, amount: 1, Price: itemPrice });
  }

  saveData();
  getBasketTotal();
  // console.log("callBack complete");
}

function saveData() {
  let mySerializedData = JSON.stringify(basketData);
  localStorage.setItem("basketCase", mySerializedData);
}

function readData() {
  let myBasketString = localStorage.getItem("basketCase");
  if (myBasketString) {
    basketData = JSON.parse(myBasketString);
  } else {
    basketData = [];
  }
}

getBasketTotal();
//#endregion
//#region Create basket view and toggle modal
const overlay = document.createElement("div");
overlay.classList = "overlay";

// listen for click
let basketCart = document.getElementById("basketCart");
basketCart.addEventListener("click", (e) => {
  getBasketTotal();
  // console.log(basketTotal);
  // console.log(basketTotalAmount);
  displayCartItems();
  toggleModal();
  // console.log("basket clicket");
});

