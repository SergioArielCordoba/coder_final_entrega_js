
let contenedorPrincipal = document.getElementById("contenedorPrincipal")
let btnCart = document.getElementById("btnCart")
let carrito


/**
 * Obtiene el carrito del LStorage y lo guarda en carrito.
 * Si LStorage esta vacio, crea un array carrito vacio.
 */

function getCarritoFromLocalStorage() {
    let carritoLocalStorage = localStorage.getItem("carrito")
    if (carritoLocalStorage) {
        let carritoLocalStorageParse = JSON.parse(carritoLocalStorage)
        carrito = carritoLocalStorageParse
    } else {
        carrito = []
    }
}


/**
 * Limpia el LStorage.
 * Guarda el carrito actualizado, en el LStorage.
 */

function setCarritoToLocalStorage() {
    localStorage.clear()
    let prodcutoJson = JSON.stringify(carrito)
    localStorage.setItem("carrito", prodcutoJson)
}

/**
 * Carga e inserta en el index.html, los productos del archivo productos.js.
 * Genera el boton (y su funcionalidad)"Agregar al carrito" a los productos en el index
 */


function cargarProductosAlIndex(arrayDeProductos) {
    let cantidad = 0
    
        


    arrayDeProductos.forEach((producto) => {
        let contenedorDeProducto = document.createElement("div")
        contenedorDeProducto.className = "contenedor-item"
        contenedorDeProducto.innerHTML = `
            <h2 class="contenedor-nombre">${producto.nombre}</h2>
            <img src="${producto.img}" alt="">
            <p class="contenedor-precio">${producto.precio} ${producto.moneda}</p>
            <div class="input-cant">
                <label class="label-cantidad"> Cantidad  </label>
                <input class="inputCantidad" type ="number" min=1></input>
            </div>
        `
        
        let inputCantidad = document.querySelectorAll(".inputCantidad")
        for (const iterator of inputCantidad) {
        iterator.addEventListener("input",(e)=>{
            cantidad = e.target.value
            })
        }

        //input cantidad
        
        // inputCantidad.forEach(element => {
        //     element.addEventListener("input",(e)=>{
        //         cantidad = element.value //e.target.value
        //     })

        // });

        contenedorPrincipal.appendChild(contenedorDeProducto)
        let btnAddCart = document.createElement("button")
        btnAddCart.className = "btnAddCart"
        btnAddCart.innerText = "Agregar al Carrito"
        contenedorDeProducto.appendChild(btnAddCart)
        btnAddCart.addEventListener("click", () => {
            if(cantidad == 0){
                sweetAlert("Seleccione la cantidad", "error")
            }else{
                getCarritoFromLocalStorage()
                let indice = carrito.findIndex((productoBuscado) => producto.id == productoBuscado.id)
                if (indice > -1) {
                    carrito[indice].cant = carrito[indice].cant + parseInt(cantidad)
                    
                } else {
                    producto.cant = parseInt(cantidad)
                    carrito.push(producto)
                    
                }
                setCarritoToLocalStorage()
                
                /** Toastify**/

                Toastify({
                    text: producto.nombre + "   => Enviado al 🛒" ,
                    duration: 2000,
                    gravity: "top", // `top` or `bottom`
                    position: "center", // `left`, `center` or `right`
                    style: {
                        background: "linear-gradient(to right, #00b09b, #96c93d)",
                      },
                    }).showToast();
            }
            cantidad = 0
        })
    })

    
}

/*Se carga la pagina principal con productos, desde el archivo productos.js*/

cargarProductosAlIndex(misProductos)

/**
 * ventana modal del carrito
 * 
 */

let modal = document.getElementById("modalConteiner");
let close = document.getElementById("close");
let modalProductos = document.getElementById("modalProductos")

activarModal();

close.addEventListener("click", () => {
    modal.classList.remove("show")
    while (modalProductos.firstChild) {
        modalProductos.removeChild(modalProductos.firstChild)
    }

    let totalAPagar = document.querySelector(".valor-total-modal")
    totalAPagar.remove()
})

function activarModal() {
    btnCart.addEventListener("click", mostrarProductosDelCarrito)
}


function mostrarProductosDelCarrito() {
    getCarritoFromLocalStorage()

    let acumulador=0

    if(!carrito.length){
        modal.classList.remove("show")
        sweetAlert("EL CARRITO ESTA VACIO","error")
    }else{
        carrito.forEach(item => {
            let itemCarrito = document.createElement("div")
            itemCarrito.setAttribute("class", "items-carrito")
            itemCarrito.innerHTML = `
                <h3>${item.nombre}</h3>
                <img src="${item.img}" alt="">
                <p>${item.cant}</p>
                <p>${item.moneda} ${item.precio}</p>
                <i class="bi bi-trash-fill btnEliminar" id ="${item.id}"></i>
            `
            modalProductos.append(itemCarrito)
            acumulador += (item.cant*item.precio)
        })
        modal.classList.add("show")
        eliminarProductoDelCarrito();
        pagar();
        let totalAPagar = document.querySelector(".total-container")
        let total = document.createElement("h3")
        total.className = "valor-total-modal"
        total.innerText=acumulador
        totalAPagar.appendChild(total)
    }
}

function eliminarProductoDelCarrito() {

    let btnEliminar = document.querySelectorAll(".btnEliminar")
    btnEliminar.forEach((item) => {
        item.addEventListener("click", (e) => {
            let id = parseInt(e.currentTarget.id)
            let indice = carrito.findIndex((x) => x.id == id)
            carrito.splice(indice, 1)
            let borrarProductosDelModal = document.querySelectorAll(".items-carrito")
            borrarProductosDelModal.forEach(x => x.remove())
            let totalAPagar = document.querySelector(".valor-total-modal")
            totalAPagar.remove()
            setCarritoToLocalStorage()
            mostrarProductosDelCarrito()
        })
    })
}

/* USO DE DOLAR API */
/* USO de async await */
let dolarApi = "https://dolarapi.com/v1/dolares/tarjeta"
let misProductosDolar

const perdirDatos = async () => {
    const resp = await fetch(dolarApi)
    let data = await resp.json()
    let misProductosDolar = misProductos.map(prod => {
        return{
            id: prod.id,
            nombre: prod.nombre,
            precio: (prod.precio / data.venta).toFixed(2),
            img: prod.img,
            cant: prod.cant,
            moneda: "US$"
        }
    })

    let borrarProductosDelindex = document.querySelectorAll(".contenedor-item")
    borrarProductosDelindex.forEach(x => x.remove("contenedor-item"))
    cargarProductosAlIndex(misProductosDolar)
    flagDolar=1
    flagPeso = 0
    /* SweetAlert */
    sweetAlert("Se cambio moneda a Dolar ✔","success")
}
let flagDolar //Usado para validar si la tienda se encuentra en dolares
let flagPeso //Usado para validar si la tienda se encuentra en pesos

let btnUSA = document.querySelector(".usa")
btnUSA.addEventListener("click", () => {
    //sintaxis avanzada
    flagDolar ? sweetAlert("Ya se encuentra en dolar","info") : perdirDatos();
    
})

let btnArg = document.querySelector(".arg")
btnArg.addEventListener("click", ()=>{

    if(flagPeso==0){
        let borrarProductosDelindex = document.querySelectorAll(".contenedor-item")
        borrarProductosDelindex.forEach(x => x.remove("contenedor-item"))
        sweetAlert("Se cambio moneda a Pesos ✔","success")
        cargarProductosAlIndex(misProductos)
        flagPeso = 1
    }else{
        sweetAlert("Ya se encuentra en Peso","info")
    }
    flagDolar = 0
})

/**
 * Utilizo una funcion para llamar la libreria de sweetAler para reutilizar la misma configuracion en distintas 
 * partes del proyecto
 */

function sweetAlert(mensaje,icon){
    Swal.fire({
        icon: icon,
        text: mensaje,
      });
}


/**
 * Boton pagar, deberia vaciar el LStorage.
 * Mensaje de compra satisfactoria
 * Limpia modal y carrito
 */

function pagar (){
    let pagar = document.getElementById("pagar")
    pagar.addEventListener("click",()=>{
        sweetAlert("Gracias por su compra","success")
        carrito=[]
        setCarritoToLocalStorage()
        modal.classList.remove("show")
        let borrarProductosDelModal = document.querySelectorAll(".items-carrito")
        borrarProductosDelModal.forEach(x => x.remove())
    })

}