export async function mostrarProductosDisponibles() {
  const container = document.getElementById("productosContainer");
  try {
    const response = await fetch("../database/productos.json");
    const data = await response.json();

    let disponibles = JSON.parse(localStorage.getItem("productosDisponibles"));
    if (!disponibles) {
      localStorage.setItem("productosDisponibles", JSON.stringify(data));
      disponibles = data;
    }

    container.innerHTML = ""; // Limpiar antes de renderizar

    disponibles.forEach(producto => {
      const card = document.createElement("div");
      card.className = "bg-white p-4 rounded shadow-md border border-gray-200";
      card.id = `producto-${producto.id}`;
      card.innerHTML = `
        <img src="${producto.imagen}" alt="${producto.nombre}" class="w-full h-48 object-cover rounded mb-2">
        <h2 class="text-xl font-bold mb-2">${producto.nombre}</h2>
        <p class="text-green-600 font-bold mb-1">$${producto.precio}</p>
        <p class="text-sm text-gray-500">ID: ${producto.id}</p>
        <button class="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 comprar-btn" data-id="${producto.id}">Comprar</button>
      `;
      container.appendChild(card);
    });

    //  Conectar los botones
    const botonesComprar = container.querySelectorAll(".comprar-btn");
    botonesComprar.forEach(btn => {
      btn.addEventListener("click", () => {
        const id = parseInt(btn.dataset.id);
        comprarProducto(id);
      });
    });

  } catch (error) {
    container.innerHTML = "<p class='text-red-600'>Error al cargar los productos.</p>";
  }
}

//  Función para manejar la compra
function comprarProducto(idProducto) {
  let disponibles = JSON.parse(localStorage.getItem("productosDisponibles")) || [];
  let comprados = JSON.parse(localStorage.getItem("productosComprados")) || [];

  const producto = disponibles.find(p => p.id === idProducto);
  if (!producto) return;

  comprados.push(producto);
  localStorage.setItem("productosComprados", JSON.stringify(comprados));

  disponibles = disponibles.filter(p => p.id !== idProducto);
  localStorage.setItem("productosDisponibles", JSON.stringify(disponibles));

  const card = document.getElementById(`producto-${idProducto}`);
  if (card) card.remove();

  Swal.fire({
    icon: 'success',
    title: '¡Producto comprado!',
    text: `${producto.nombre} ha sido añadido a tus compras.`,
    confirmButtonColor: '#3085d6'
  });
}
