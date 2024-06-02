let cart = [];

document.addEventListener("DOMContentLoaded", () => {
  fetch('products.json')
    .then(response => response.json())
    .then(products => {
      displayProducts(products);

      document.querySelectorAll('.navbar a').forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          document.querySelectorAll('.navbar a').forEach(link => link.classList.remove('active'));
          e.target.classList.add('active');
          filterProducts(e.target.getAttribute('data-category'), products);
          if (window.innerWidth <= 768) {
            navbar.classList.remove('active');
          }
        });
      });

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
            <button ${!product.inStock ? 'disabled' : ''} onclick="addToCart(${product.id})">
              ${product.inStock ? 'Adicionar ao Carrinho' : 'Esgotado'}
            </button>
          `;
          productContainer.appendChild(productDiv);
        });

        // Adiciona evento de clique às imagens para abrir o modal
        document.querySelectorAll('.product img').forEach(img => {
          img.addEventListener('click', () => {
            openImageModal(img.src, img.alt);
          });
        });
      }

      function filterProducts(category, products) {
        if (category === 'all') {
          displayProducts(products);
        } else {
          const filteredProducts = products.filter(product => product.category === category);
          displayProducts(filteredProducts);
        }
      }

      window.addToCart = function(productId) {
        const product = products.find(p => p.id === productId);
        if (product) {
          if (product.inStock) {
            cart.push(product);
            showNotification(`${product.name} foi adicionado ao carrinho.`);
            updateCartModal();
          } else {
            showNotification(`${product.name} está esgotado.`);
          }
        } else {
          console.error('Produto não encontrado:', productId);
        }
      }

      window.removeFromCart = function(productId) {
        const productIndex = cart.findIndex(p => p.id === productId);
        if (productIndex > -1) {
          cart.splice(productIndex, 1);
          showNotification('Item removido do carrinho.');
          updateCartModal();
        }
      }

      function showNotification(message) {
        Toastify({
          text: message,
          duration: 1000,
          gravity: "top", // `top` or `bottom`
          position: "right", // `left`, `center` or `right`
          backgroundColor: "#333",
          className: "notification"
        }).showToast();
      }

      function updateCartModal() {
        const cartItems = document.getElementById('cartItems');
        cartItems.innerHTML = '';
        let total = 0;

        cart.forEach(product => {
          const cartItem = document.createElement('div');
          cartItem.classList.add("flex-cart");
          cartItem.innerHTML = `
            <strong>${product.name} - R$${product.price.toFixed(2)}</strong>
            <button class="remove-btn" onclick="removeFromCart(${product.id})">
              <i class="fas fa-trash"></i>
            </button>
          `;
          cartItems.appendChild(cartItem);
          total += product.price;
        });

        const totalDiv = document.createElement('div');
        totalDiv.classList.add("mt-total");
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

      const burgerMenu = document.getElementById('burgerMenu');
      const navbar = document.getElementById('navbar');

      burgerMenu.addEventListener('click', () => {
        navbar.classList.toggle('active');
      });

      // Modal de imagem
      const imageModal = document.getElementById('imageModal');
      const modalImage = document.getElementById('modalImage');
      const closeImageModal = imageModal.querySelector('.close');

      function openImageModal(src, alt) {
        modalImage.src = src;
        modalImage.alt = alt;
        imageModal.style.display = 'block';
      }

      closeImageModal.onclick = function() {
        imageModal.style.display = 'none';
      }

      window.onclick = function(event) {
        if (event.target == imageModal) {
          imageModal.style.display = 'none';
        }
        if (event.target == modal) {
          modal.style.display = 'none';
        }
      }
    })
    .catch(error => console.error('Erro ao carregar os produtos:', error));
});
