const products = [
  { id: 1, name: 'Batom', description: 'Batom de longa duração', price: 20.0, category: 'makeup', image: 'https://images.unsplash.com/photo-1626895872564-b691b6877b83?crop=entropy&cs=srgb&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MTcxODAyMzh8&ixlib=rb-4.0.3&q=85' },
  { id: 2, name: 'Base', description: 'Base líquida', price: 50.0, category: 'makeup', image: 'https://images.unsplash.com/photo-1550281378-521929a11c42?crop=entropy&cs=srgb&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MTcxODAyMzh8&ixlib=rb-4.0.3&q=85' },
  { id: 3, name: 'Hidratante', description: 'Hidratante facial', price: 30.0, category: 'skincare', image: 'https://images.unsplash.com/photo-1632221522690-6a0c04bf6f85?crop=entropy&cs=srgb&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MTcxODE3NjZ8&ixlib=rb-4.0.3&q=85' },
  { id: 4, name: 'Shampoo', description: 'Shampoo para cabelos', price: 25.0, category: 'haircare', image: 'https://images.unsplash.com/photo-1619195816855-886c9abd0395?crop=entropy&cs=srgb&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MTcxODE3ODd8&ixlib=rb-4.0.3&q=85' },
];

let cart = [];

function displayProducts(products) {
  const productContainer = document.getElementById('products');
  productContainer.innerHTML = '';

  products.forEach(product => {
      const productDiv = document.createElement('div');
      productDiv.classList.add('product');
      productDiv.innerHTML = `
          <img src="${product.image}" alt="${product.name}">
          <h2>${product.name}</h2>
          <p class="product-description">${product.description}</p>
          <p>R$${product.price.toFixed(2)}</p>
          <button onclick="addToCart(${product.id})">Adicionar ao Carrinho</button>
      `;
      productContainer.appendChild(productDiv);
  });
}

function filterProducts(category) {
  if (category === 'all') {
      displayProducts(products);
  } else {
      const filteredProducts = products.filter(product => product.category === category);
      displayProducts(filteredProducts);
  }
}

document.querySelectorAll('.navbar a').forEach(link => {
  link.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelectorAll('.navbar a').forEach(link => link.classList.remove('active'));
      e.target.classList.add('active');
      filterProducts(e.target.getAttribute('data-category'));
      if (window.innerWidth <= 768) {
          navbar.classList.remove('active');
      }
  });
});

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  cart.push(product);
  showNotification(`${product.name} foi adicionado ao carrinho.`);
  updateCartModal();
}

function removeFromCart(productId) {
  const productIndex = cart.findIndex(p => p.id === productId);
  if (productIndex > -1) {
    cart.splice(productIndex, 1);
    showNotification('Item removido do carrinho.');
    updateCartModal();
  }
}

function showNotification(message) {
  const notificationContainer = document.getElementById('notification-container');
  const notification = document.createElement('div');
  notification.classList.add('notification');
  notification.innerText = message;
  notificationContainer.appendChild(notification);

  // Show the notification
  setTimeout(() => {
    notification.classList.add('show');
  }, 100);

  // Remove the notification after 3 seconds
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.remove();
    }, 500);
  }, 3000);
}

function updateCartModal() {
  const cartItems = document.getElementById('cartItems');
  cartItems.innerHTML = '';
  let total = 0;

  cart.forEach(product => {
      const cartItem = document.createElement('div');
      cartItem.innerHTML = `
          ${product.name} - R$${product.price.toFixed(2)}
          <button class="remove-btn" onclick="removeFromCart(${product.id})">
            <i class="fas fa-trash"></i>
          </button>
      `;
      cartItems.appendChild(cartItem);
      total += product.price;
  });

  const totalDiv = document.createElement('div');
  totalDiv.innerHTML = `<strong>Total: R$${total.toFixed(2)}</strong>`;
  cartItems.appendChild(totalDiv);
}

const modal = document.getElementById('cartModal');
const closeModal = document.querySelector('.close');

closeModal.onclick = function() {
  modal.style.display = 'none';
}

window.onclick = function(event) {
  if (event.target == modal) {
      modal.style.display = 'none';
  }
}

function openCartModal() {
  updateCartModal();
  modal.style.display = 'block';
}

document.getElementById('viewCartButton').addEventListener('click', openCartModal);

document.getElementById('sendOrder').addEventListener('click', () => {
  const customerName = document.getElementById('customerName').value;
  if (!customerName) {
      showNotification('Por favor, digite seu nome.');
      return;
  }

  let message = `Pedido de ${customerName}:\n\n`;
  let total = 0;

  cart.forEach(product => {
      message += `${product.name} - R$${product.price.toFixed(2)}\n`;
      total += product.price;
  });

  message += `\nTotal: R$${total.toFixed(2)}`;

  const whatsappUrl = `https://api.whatsapp.com/send?phone=5562994106768&text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank');
});

displayProducts(products);

const burgerMenu = document.getElementById('burgerMenu');
const navbar = document.getElementById('navbar');

burgerMenu.addEventListener('click', () => {
  navbar.classList.toggle('active');
});
