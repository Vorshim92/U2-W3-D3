const storageCart = "cart";

function createCartItem(bookTitle) {
  const listItem = document.createElement("li");
  listItem.className = "list-group-item d-flex justify-content-between align-items-center";

  const title = document.createElement("span");
  title.innerText = bookTitle;

  const removeButton = document.createElement("button");
  removeButton.className = "btn btn-danger remove-from-cart-button";
  removeButton.textContent = "Rimuovi";

  removeButton.addEventListener("click", () => {
    listItem.remove();
    saveCartToLocalStorage();
  });

  listItem.appendChild(title);
  listItem.appendChild(removeButton);

  return listItem;
}

async function getBooks() {
  try {
    const response = await fetch("https://striveschool-api.herokuapp.com/books");
    const books = await response.json();

    console.log(response);
    console.log(books);

    const bookList = document.getElementById("bookList");
    const cartList = document.getElementById("cartList");

    books.forEach(function (book) {
      bookList.innerHTML += `<div class="col-md-3 mb-4 book-card"><img class="card-img-top" src="${book.img}" alt="${book.title}" style="height: 500px; object-fit: cover;"><div class="card-body d-flex flex-column"><h5 style="height: 50px;" class="card-title text-dark">${book.title}</h5><p style="padding-top: 25px; class="card-text text-dark">Price: $${book.price}</p><div class="mt-auto"><button class="btn btn-danger discard-button" style="height: 38px;">Scarta</button><button class="btn btn-primary add-to-cart-button float-end">Compra ora</button></div></div></div>`;
    });
    const bookCards = bookList.querySelectorAll(".book-card");

    bookCards.forEach(function (bookCard) {
      // PULSANTE AGGIUNTA AL CARRELLO
      const addToCartButton = bookCard.querySelector(".add-to-cart-button");
      addToCartButton.addEventListener("click", () => {
        const cartItem = createCartItem(bookCard.querySelector("h5").innerText);
        cartList.appendChild(cartItem);
        saveCartToLocalStorage();
      });

      // PULSANTE RIMUOVI CARD
      const discardButton = bookCard.querySelector(".discard-button");
      discardButton.addEventListener("click", () => {
        bookCard.parentNode.removeChild(bookCard);
      });
    });
  } catch (error) {
    console.error("Errore durante il recupero dei libri:", error);
  }
}

function saveCartToLocalStorage() {
  const cartItems = document.querySelectorAll("#cartList li span");
  const cartBooks = [];

  cartItems.forEach((item) => {
    cartBooks.push(item.textContent);
  });

  localStorage.setItem(storageCart, JSON.stringify(cartBooks));
}

function loadCartFromLocalStorage() {
  const cart = localStorage.getItem(storageCart);

  if (cart) {
    const cartBooks = JSON.parse(cart);
    const cartList = document.getElementById("cartList");

    cartBooks.forEach((cartBook) => {
      const cartItem = createCartItem(cartBook);
      cartList.appendChild(cartItem);
    });
  }
}

window.onload = () => {
  getBooks();
  loadCartFromLocalStorage();
};
