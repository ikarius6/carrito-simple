// Cargar productos desde el JSON y guardarlos en localStorage
fetch('productos.json')
  .then(response => response.json())
  .then(productos => {
    // Asignar un índice a cada producto, no sería necesario si el json ya lo tuviera
    productos.forEach((producto, index) => producto.id = index)
    localStorage.setItem('productos', JSON.stringify(productos))
    mostrarProductos(productos)
    cargarCarrito()
  })

function mostrarProductos(productos) {
  const contenedor = document.getElementById('productos')
  contenedor.innerHTML = '' // Limpiar contenedor antes de agregar productos
  productos.forEach(producto => {
    const div = document.createElement('div')
    div.classList.add('producto')
    // Para ahorrar espacio no agregué las imagenes, pero deberían estar en imagenes/
    div.innerHTML = `
      <img src="./imagenes/${producto.imagen}" alt="${producto.nombre}">
      <h3>${producto.nombre}</h3>
      <p>Precio: $${producto.precio}</p>
      <p>Stock: ${producto.stock}</p>
      <button onclick="agregarAlCarrito(${producto.id})">Agregar al carrito</button>
    `
    contenedor.appendChild(div)
  })
}

function agregarAlCarrito(idProducto) {
  let carrito = JSON.parse(localStorage.getItem('carrito')) || []
  // Busca el producto en el carrito, puede ser con filter también
  const productoIndex = carrito.findIndex(p => p.id === idProducto)

  if (productoIndex !== -1) {
    carrito[productoIndex].cantidad++
  } else {
    // En el carrito solo agrego el id del producto y la cantidad, nada más
    carrito.push({ id: idProducto, cantidad: 1 })
  }

  localStorage.setItem('carrito', JSON.stringify(carrito))
  cargarCarrito()
}

function cargarCarrito() {
  const carrito = JSON.parse(localStorage.getItem('carrito')) || []
  const productos = JSON.parse(localStorage.getItem('productos')) || []
  const contenedor = document.getElementById('carrito')
  contenedor.innerHTML = ''

  carrito.forEach(item => {
    const producto = productos.find(p => p.id === item.id)
    if (producto) {
      const div = document.createElement('div')
      div.classList.add('producto-carrito')
      div.innerHTML = `
        <span>${producto.nombre} - Cantidad: ${item.cantidad}</span>
        <button onclick="agregarAlCarrito(${item.id})">+</button>
        ${item.cantidad > 1 ? `<button onclick="reducirCantidad(${item.id})">-</button>` : ''}
        <button onclick="eliminarDelCarrito(${item.id})">Eliminar</button>
      `
      contenedor.appendChild(div)
    }
  })
}

function reducirCantidad(idProducto) {
  let carrito = JSON.parse(localStorage.getItem('carrito')) || []
  const productoIndex = carrito.findIndex(p => p.id === idProducto)

  if (productoIndex !== -1) {
    if (carrito[productoIndex].cantidad > 1) {
        carrito[productoIndex].cantidad--
    }
  }

  localStorage.setItem('carrito', JSON.stringify(carrito))
  cargarCarrito()
}

function eliminarDelCarrito(idProducto) {
  let carrito = JSON.parse(localStorage.getItem('carrito')) || []
  carrito = carrito.filter(p => p.id !== idProducto)

  localStorage.setItem('carrito', JSON.stringify(carrito))
  cargarCarrito()
}
