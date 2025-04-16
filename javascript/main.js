import { comprarProducto, venderProducto, verSaldoYProductos, crearProducto, salir } from "./funciones.js";
import { mostrarProductosDisponibles } from "./productos.js";

document.getElementById("btnComprar").addEventListener("click", comprarProducto);
document.getElementById("btnVender").addEventListener("click", venderProducto);
document.getElementById("btnSaldo").addEventListener("click", verSaldoYProductos);
document.getElementById("btnCrear").addEventListener("click", crearProducto);
document.getElementById("btnSalir").addEventListener("click", salir);

window.addEventListener("DOMContentLoaded", () => {
  mostrarProductosDisponibles();
  verSaldoYProductos();
});
