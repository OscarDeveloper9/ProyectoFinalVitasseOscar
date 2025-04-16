document.addEventListener("DOMContentLoaded", async () => {
  const contenedor = document.getElementById("compradosContainer");

  // Obtener IDs o nombres de productos comprados desde localStorage
  const comprados = JSON.parse(localStorage.getItem("productosComprados")) || [];

  if (comprados.length === 0) {
    contenedor.innerHTML =
      "<p class='text-center text-gray-500 col-span-full'>No has comprado productos todavía.</p>";
    return;
  }

  try {
    const respuesta = await fetch("../database/productos.json");
    const productos = await respuesta.json();

    // Buscar los productos comprados por nombre
    const productosComprados = productos.filter(producto =>
      comprados.some(comp => comp.nombre === producto.nombre)
    );

    productosComprados.forEach((producto) => {
      const card = document.createElement("div");
      card.className = "bg-white rounded-lg shadow-md p-4 w-72 m-2";
      card.innerHTML = `
        <img src="${producto.imagen}" alt="${producto.nombre}" class="w-full h-40 object-cover rounded mb-2">
        <h2 class="text-xl font-semibold mb-2">${producto.nombre}</h2>
        <p class="text-green-600 font-bold">$${producto.precio}</p>
      `;
      contenedor.appendChild(card);
    });
  } catch (error) {
    contenedor.innerHTML =
      "<p class='text-red-500 text-center'>Error al cargar los productos comprados.</p>";
    console.error("Error al cargar productos.json:", error);
  }
});
