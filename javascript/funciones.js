
import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11.7.5/+esm";

let productosComprados = JSON.parse(localStorage.getItem('productosComprados')) || [];
let saldo = JSON.parse(localStorage.getItem('saldo')) || 500;

export function verSaldoYProductos() {
  const saldoDiv = document.getElementById('saldo');
  const productosDiv = document.getElementById('productosComprados');
  saldoDiv.innerHTML = `<h3 class="text-center font-bold text-xl text-green-700">Tu saldo actual: $${saldo}</h3>`;
  productosDiv.innerHTML = '<h2 class="text-lg font-semibold mb-2">Productos comprados:</h2>';

  if (productosComprados.length === 0) {
    productosDiv.innerHTML += `<p class="text-gray-600">No compraste productos aún.</p>`;
    return;
  }

  const ul = document.createElement('ul');
  productosComprados.forEach(producto => {
    const li = document.createElement('li');
    li.classList = 'bg-blue-100 p-2 my-2 rounded';
    li.textContent = `${producto.nombre} - $${producto.precio}`;
    ul.appendChild(li);
  });

  productosDiv.appendChild(ul);
}

export async function comprarProducto() {
  const { value: id } = await Swal.fire({
    title: 'Comprar producto',
    input: 'number',
    inputLabel: 'ID del producto a comprar',
    inputPlaceholder: 'Ej: 1',
    showCancelButton: true,
    confirmButtonText: 'Comprar'
  });

  const productos = JSON.parse(localStorage.getItem('productosDisponibles')) || [];
  const producto = productos.find(p => p.id == id);

  if (!producto) return Swal.fire('Error', 'Producto no encontrado', 'error');
  if (producto.precio > saldo) return Swal.fire('Saldo insuficiente', 'No tenés saldo suficiente', 'error');

  const confirmar = await Swal.fire({
    title: `¿Confirmás la compra de ${producto.nombre} por $${producto.precio}?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí, comprar'
  });

  if (confirmar.isConfirmed) {
    saldo -= producto.precio;
    productosComprados.push(producto);
    const nuevosDisponibles = productos.filter(p => p.id != id);
    localStorage.setItem('productosDisponibles', JSON.stringify(nuevosDisponibles));
    localStorage.setItem('productosComprados', JSON.stringify(productosComprados));
    localStorage.setItem('saldo', JSON.stringify(saldo));
    Swal.fire('Compra exitosa', 'Producto comprado correctamente', 'success');
    verSaldoYProductos();
    window.location.reload();
  }
}

export async function venderProducto() {
  const { value: id } = await Swal.fire({
    title: 'Vender producto',
    input: 'number',
    inputLabel: 'ID del producto comprado',
    inputPlaceholder: 'Ej: 2',
    showCancelButton: true,
    confirmButtonText: 'Continuar'
  });

  const producto = productosComprados.find(p => p.id == id);
  if (!producto) return Swal.fire('Error', 'Producto no encontrado en tus compras', 'error');

  const { value: precioVenta } = await Swal.fire({
    title: `¿Por cuánto lo querés vender?`,
    input: 'number',
    inputLabel: 'Precio de venta',
    inputPlaceholder: 'Ej: 250',
    showCancelButton: true,
    confirmButtonText: 'Vender'
  });

  if (!precioVenta || precioVenta <= 0) return Swal.fire('Error', 'Precio inválido', 'error');

  saldo += parseInt(precioVenta);
  productosComprados = productosComprados.filter(p => p.id != id);
  const productos = JSON.parse(localStorage.getItem('productosDisponibles')) || [];
  productos.push({ ...producto, precio: parseInt(precioVenta) });

  localStorage.setItem('productosDisponibles', JSON.stringify(productos));
  localStorage.setItem('productosComprados', JSON.stringify(productosComprados));
  localStorage.setItem('saldo', JSON.stringify(saldo));

  Swal.fire('Venta exitosa', 'Producto vendido y agregado al mercado', 'success');
  verSaldoYProductos();
  window.location.reload();
}

export async function crearProducto() {
  const { value: nombre } = await Swal.fire({
    title: 'Nombre del nuevo producto',
    input: 'text',
    inputPlaceholder: 'Ej: Monitor usado',
    showCancelButton: true
  });

  if (!nombre) return;

  const { value: precio } = await Swal.fire({
    title: 'Precio del producto',
    input: 'number',
    inputPlaceholder: 'Ej: 120',
    showCancelButton: true
  });

  if (!precio || precio <= 0) return Swal.fire('Error', 'Precio no válido', 'error');

  const productos = JSON.parse(localStorage.getItem('productosDisponibles')) || [];
  const maxId = productos.length > 0 ? Math.max(...productos.map(p => p.id)) : 0;
  const nuevoProducto = { id: maxId + 1, nombre, precio: parseInt(precio) };
  productos.push(nuevoProducto);
  localStorage.setItem('productosDisponibles', JSON.stringify(productos));
  Swal.fire('Producto creado', 'Producto agregado correctamente', 'success');
  window.location.reload();
}

export function salir() {
  Swal.fire({
    title: '¿Estás seguro que querés salir?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, salir',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire('¡Hasta luego!', 'Te redirigiremos a la portada.', 'success').then(() => {
        window.location.href = 'portada.html';
      });
    }
  });
}
