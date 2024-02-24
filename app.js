
let contenedorPrincipal = document.getElementById("contenedorPrincipal")
let btnCart = document.getElementById("btnCart")
let carrito


function getCarritoFromLocalStorage() {
    let carritoLocalStorage = localStorage.getItem("carrito")
    if (carritoLocalStorage) {
        let carritoLocalStorageParse = JSON.parse(carritoLocalStorage)
        carrito = carritoLocalStorageParse
    } else {
        carrito = []
    }
}

function setCarritoToLocalStorage() {
    localStorage.clear()
    let prodcutoJson = JSON.stringify(carrito)
    localStorage.setItem("carrito", prodcutoJson)
}

function cargarProductosAlIndex(arrayDeProductos) {

    arrayDeProductos.forEach((producto) => {
        let contenedorDeProducto = document.createElement("div")
        contenedorDeProducto.className = "contenedor-item"
        contenedorDeProducto.innerHTML = `
            <h2 class="contenedor-nombre">${producto.nombre}</h2>
            <img src="${producto.img}" alt="">
            <p class="contenedor-precio">${producto.precio} ${producto.moneda}</p>
        `
        contenedorPrincipal.appendChild(contenedorDeProducto)
        let btnAddCart = document.createElement("button")
        btnAddCart.className = "btnAddCart"
        btnAddCart.innerText = "Agregar al Carrito"
        contenedorDeProducto.appendChild(btnAddCart)
        btnAddCart.addEventListener("click", () => {
            getCarritoFromLocalStorage()
            let indice = carrito.findIndex((productoBuscado) => producto.id == productoBuscado.id)
            if (indice > -1) {
                carrito[indice].cant++
                
            } else {
                
                carrito.push(producto)
                
            }
            setCarritoToLocalStorage()
        })
    })

}

cargarProductosAlIndex(misProductos)

// misProductos.forEach((producto) => {
//     let contenedorDeProducto = document.createElement("div")
//     contenedorDeProducto.className = "contenedor-item"
//     contenedorDeProducto.innerHTML = `
//         <h2 class="contenedor-nombre">${producto.nombre}</h2>
//         <img src="${producto.img}" alt="">
//         <p class="contenedor-precio">${producto.precio} ${producto.moneda}</p>
//     `
//     contenedorPrincipal.appendChild(contenedorDeProducto)
//     let btnAddCart = document.createElement("button")
//     btnAddCart.className = "btnAddCart"
//     btnAddCart.innerText = "Agregar al Carrito"
//     contenedorDeProducto.appendChild(btnAddCart)
//     btnAddCart.addEventListener("click", () => {
//         getCarritoFromLocalStorage()
//         let indice = carrito.findIndex((productoBuscado) => producto.id == productoBuscado.id)
//         if (indice > -1) {
//             carrito[indice].cant++
//         } else {
//             producto.cant++
//             carrito.push(producto)
//         }
//         setCarritoToLocalStorage()
//     })
// })


//Modal config -> ponerlo en otro archivo JS

let modal = document.getElementById("modalConteiner");
let close = document.getElementById("close");
let modalProductos = document.getElementById("modalProductos")

activarModal();

close.addEventListener("click", () => {
    modal.classList.remove("show")
    //let cleanModal = document.getElementById("items-carrito")
    while (modalProductos.firstChild) {
        modalProductos.removeChild(modalProductos.firstChild)
    }
    // window.location.reload()
})

/*
function activarModal(){
    btnCart.addEventListener("click",()=>{
        getCarritoFromLocalStorage()
        carrito.forEach(item => {mostrarProductosDelCarrito (item)})
        eliminarProductoDelCarrito();
        modal.classList.add("show")
    })
}
*/
function activarModal() {
    btnCart.addEventListener("click", mostrarProductosDelCarrito)
}

function mostrarProductosDelCarrito() {
    getCarritoFromLocalStorage()
    carrito.forEach(item => {
        let itemCarrito = document.createElement("div")
        itemCarrito.setAttribute("class", "items-carrito")
        itemCarrito.innerHTML = `
            <h3>${item.nombre}</h3>
            <p>${item.cant}</p>
            <img src="${item.img}" alt="">
            <p>${item.moneda} ${item.precio}</p>
            <i class="bi bi-trash-fill btnEliminar" id ="${item.id}"></i>
        `
        modalProductos.append(itemCarrito)
    })
    modal.classList.add("show")
    eliminarProductoDelCarrito();

}

/* 
function mostrarProductosDelCarrito(item){
    let itemCarrito = document.createElement("div")
    itemCarrito.setAttribute("id", "items-carrito")
    itemCarrito.innerHTML = `
        <h3>${item.nombre}</h3>
        <p>${item.cant}</p>
        <img src="${item.img}" alt="">
        <p>$ ${item.precio}</p>
        <i class="bi bi-trash-fill btnEliminar" id ="${item.id}"></i>
    `
    modalProductos.append(itemCarrito)
}
*/

function eliminarProductoDelCarrito() {

    let btnEliminar = document.querySelectorAll(".btnEliminar")
    btnEliminar.forEach((item) => {
        item.addEventListener("click", (e) => {
            let id = parseInt(e.currentTarget.id)
            let indice = carrito.findIndex((x) => x.id == id)
            carrito.splice(indice, 1)
            let borrarProductosDelModal = document.querySelectorAll(".items-carrito")
            borrarProductosDelModal.forEach(x => x.remove())
            console.log(carrito)
            setCarritoToLocalStorage()
            mostrarProductosDelCarrito()
        })
    })
}

/* USO DE DOLAR API */
let dolarApi = "https://dolarapi.com/v1/dolares/tarjeta"
let misProductosDolar

const perdirDatos = async () => {
    const resp = await fetch(dolarApi)
    let data = await resp.json()
    let misProductosDolar = misProductos.map(function (prod) {
        prod.precio = (prod.precio / data.venta).toFixed(2)
        return prod
    })

    misProductosDolar.forEach(producto => producto.moneda = "US$")
    let borrarProductosDelindex = document.querySelectorAll(".contenedor-item")
    borrarProductosDelindex.forEach(x => x.remove("contenedor-item"))
    cargarProductosAlIndex(misProductosDolar)
    flag=1
}
let flag

let btnUSA = document.querySelector(".usa")
btnUSA.addEventListener("click", () => {
    flag ? alert("ya esta en dolar") : perdirDatos();
})

let btnArg = document.querySelector(".arg")
btnArg.addEventListener("click", ()=>{
    let borrarProductosDelindex = document.querySelectorAll(".contenedor-item")
    borrarProductosDelindex.forEach(x => x.remove("contenedor-item"))
    console.log(misProductos)
})