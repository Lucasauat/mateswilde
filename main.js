const cartBtn = document.getElementById('cart-btn')
const cartPanel = document.getElementById('cart-panel')
const contenedorProducto = document.getElementById("contenedor-productos")
const cartItems = document.getElementById("cart-items")
let Carrito = JSON.parse(localStorage.getItem('carrito')) || []
const total = document.getElementById('total')

let dejoAbiertoCarrito = JSON.parse(localStorage.getItem("carrito_open")) || false
if(dejoAbiertoCarrito){
    cartPanel.classList.add('active')
}else {
    cartPanel.classList.remove('active')
}

const products = [
    {
        id:'1',
        title: 'Mate Imperial Rojo',
        description: 'Muy buen mate de gran porte',
        price: '10000',
        image: 'img/mate-imperial-r.jpeg',
        alt: 'Mate Imperial rojo con bisel cromado'
    },
    {
        id:'2',
        title: 'Mate Camionero Negro',
        description: 'Mate funcional que te acompaña',
        price: '7000',
        image: 'img/mate-camio.jpeg',
        alt: 'mate camionero de color negro'
    },
    {
        id:'3',
        title: 'Mate Torpedo',
        description: 'Mate sutil pero con onda',
        price: '4500',
        image: 'img/mate-torpedo.jpeg',
        alt: 'mate torpedo color negro o rojo'
    },
    {
        id:'4',
        title: 'Yerba Canarias',
        description: 'Buena Yerba uruguaya',
        price: '5000',
        image: 'img/canarias.jpeg',
        alt: 'yerba canarias tradicional o serena'
    },
]


cartBtn.addEventListener("click" , () => {
    if(!cartPanel.classList.contains('active')){ 
        dejoAbiertoCarrito = true
    }else {
        dejoAbiertoCarrito = false
    }
    cartPanel.classList.toggle('active')
    localStorage.setItem("carrito_open" ,JSON.stringify(dejoAbiertoCarrito))
})

function run (){
    mostradoraDeCarrito()
    renderizarCards()
    dadoraDeEventosAgregar()
    limpiarCarrito()
    finalizarCompra()
}
function alertOK(){
    Swal.fire({
    title: "Agregado",
    text: "Producto Agregado!.",
    icon: "success",
    showConfirmButton: false,
    timer: 1000,
    toast: true,
                })
}
function agregarCarrito(producto){
    
    Carrito.push({...producto,quantity:1})
    localStorage.setItem("carrito", JSON.stringify(Carrito))
    mostradoraDeCarrito();
 }

function calculadoraTotal(){
    return Carrito.reduce((acc, el) =>{
         return (acc += Number(el.price * el.quantity))
    },0)
}

function buscadoraPorId(id){
    let producto = products.find((el) => el.id == id)

    return producto
}

function dadoraDeEventosAgregar(){
    const botones = document.querySelectorAll(".buy-button")
    const botonesArray = Array.from(botones)
    
    botonesArray.forEach(el =>{
        el.addEventListener("click", (e) =>{
            let id = e.target.parentNode.id
            let producto = buscadoraPorId(id)
            
            if(Carrito.length == 0){
                agregarCarrito(producto)
            }else{
                let existe = false;
                Carrito.forEach ((item) => {
                if (item.id == producto.id ){
                    item.quantity++
                    existe = true;
                }
                })
                if(!existe){
                    agregarCarrito(producto)
                }
            }
            mostradoraDeCarrito()
            alertOK()
        })
    })
}

function renderizarCards(){
    products.forEach(el => {
        let producto = ` 
        <div class="product-container">
        <div class="product-card" id=${el.id}>
            <div class="product-image">
            <img src=${el.image} alt=${el.alt}>
            </div>
            <h3>${el.title}</h3>
            <p>${el.description}</p>
            <p class="price">$${el.price}</p>
            <button class="buy-button">Comprar</button>
        </div>
    </div>`

        contenedorProducto.innerHTML += producto
    });
}

function mostradoraDeCarrito() { 
    cartItems.innerHTML = '' 

    Carrito.forEach((el, index) => {
        let producto = `
        <div class="cart-item" id="${el.id}C">
            <img src="${el.image}" alt="${el.alt}">
            <div class="item-info">
                <h4>${el.title}</h4>
                <p style="color: green;">$${Number(el.price)}</p>
                <label for="cantidad-${el.id}">Cantidad:</label>
                <input type="number" id="cantidad-${el.id}" class="input-cantidad" min="1" value="${el.quantity}" data-index="${index}">
            </div>
        </div>`
        cartItems.innerHTML += producto
    })

    total.innerHTML = `$${calculadoraTotal()}`

    
    const inputs = document.querySelectorAll(".input-cantidad")
    inputs.forEach(input => {
        input.addEventListener("change", (e) => {
            const index = e.target.dataset.index
            let nuevaCantidad = parseInt(e.target.value)

            if (isNaN(nuevaCantidad) || nuevaCantidad < 1) {
                nuevaCantidad = 1
                e.target.value = 1
            }

            Carrito[index].quantity = nuevaCantidad
            localStorage.setItem("carrito", JSON.stringify(Carrito))
            total.innerHTML = `$${calculadoraTotal()}`
        })
    })
}
function alertLimpiarCarrito(){
        Swal.fire({
    title: "Queres limpiar carrito?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
     cancelButtonText: "Cancelar",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si, Borrar"
    }).then((result) => {
    if (result.isConfirmed) {
         cartItems.innerHTML = '' 
            Carrito= [];
            localStorage.removeItem('carrito');
            total.innerHTML= '$0';
        Swal.fire({
        title: "Borrado!",
        text: "Carrito limpiado correctamente.",
        icon: "success"
        });
    }
    });
}
function limpiarCarrito(){
     const clearBtn = document.getElementById("clear-cart")
     clearBtn.addEventListener('click', (e) => {
        
        if(Carrito.length > 0){
            alertLimpiarCarrito();
        }
     })
}
function alertFinalizarCompra(){
        Swal.fire({
    title: "Queres finalizar la compra?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
     cancelButtonText: "Cancelar",
    confirmButtonText: "Si!"
    }).then((result) => {
    if (result.isConfirmed) {
        let mensaje = "¡Hola! Quiero hacer un pedido desde *MatesWilde*\n"
    
        Carrito.forEach(el => {
            mensaje += `• ${el.title} (x${el.quantity}) - $${(el.price * el.quantity)}\n`
        })

        mensaje += `Total: $${calculadoraTotal()}`

        const url = `https://wa.me/5491153125860?text=${encodeURI(mensaje)}`

        window.open(url, '_blank')
        Swal.fire({
        title: "Finalizada!",
        text: "Compra finalizada correctamente.",
        icon: "success"
        });
    }
    });
}
function finalizarCompra(){
    const btnFinalizar = document.getElementById('finalizar-btn')
    btnFinalizar.addEventListener('click', (e)=> {
        alertFinalizarCompra()
    })
}
run()