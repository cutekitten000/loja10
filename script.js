const products = [
  { id: 1, name: 'Batom', price: 20.0, category: 'makeup', image: 'https://via.placeholder.com/150' },
  { id: 2, name: 'Base', price: 50.0, category: 'makeup', image: 'https://via.placeholder.com/150' },
  { id: 3, name: 'Hidratante', price: 30.0, category: 'skincare', image: 'https://via.placeholder.com/150' },
  { id: 4, name: 'Shampoo', price: 25.0, category: 'haircare', image: 'https://via.placeholder.com/150' },
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
  alert(`${product.name} foi adicionado ao carrinho.`);
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
  const cartItems = document.getElementById('cartItems');
  cartItems.innerHTML = '';
  let total = 0;
  
  cart.forEach(product => {
      const cartItem = document.createElement('div');
      cartItem.innerHTML = `${product.name} - R$${product.price.toFixed(2)}`;
      cartItems.appendChild(cartItem);
      total += product.price;
  });

  const totalDiv = document.createElement('div');
  totalDiv.innerHTML = `<strong>Total: R$${total.toFixed(2)}</strong>`;
  cartItems.appendChild(totalDiv);

  modal.style.display = 'block';
}

document.getElementById('viewCartButton').addEventListener('click', openCartModal);

document.getElementById('sendOrder').addEventListener('click', () => {
  const customerName = document.getElementById('customerName').value;
  if (!customerName) {
      alert('Por favor, digite seu nome.');
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
  console.log("clicado")
});
