const cartBtn = document.getElementById('cart-btn')
const cartPanel = document.getElementById('cart-panel')
const contenedorProducto = document.getElementById("contenedor-productos")
const cartItems = document.getElementById("cart-items")
const Carrito = JSON.parse(localStorage.getItem('carrito')) || []

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
        price: '10.000',
        image: 'img/mate-imperial-r.jpeg',
        alt: 'Mate Imperial rojo con bisel cromado'
    },
    {
        id:'2',
        title: 'Mate Camionero Negro',
        description: 'Mate funcional que te acompaña',
        price: '7.000',
        image: 'img/mate-camio.jpeg',
        alt: 'mate camionero de color negro'
    },
    {
        id:'3',
        title: 'Mate Torpedo',
        description: 'Mate sutil pero con onda',
        price: '4.500',
        image: 'img/mate-torpedo.jpeg',
        alt: 'mate torpedo color negro o rojo'
    },
    {
        id:'4',
        title: 'Yerba Canarias',
        description: 'Buena Yerba uruguaya',
        price: '5.000',
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
}

 function agregarCarrito(producto){
    Carrito.push(producto.id)
    localStorage.setItem("carrito", JSON.stringify(Carrito))
 }

function buscadoraPorId(id){
 let producto = products.find(el => el.id == id)

 return producto
}

function dadoraDeEventosAgregar(){
    const botones = document.querySelectorAll(".buy-button")
    const botonesArray = Array.from(botones)
    
    botonesArray.forEach(el =>{
        el.addEventListener("click", (e) =>{
            let id = e.target.parentNode.id
            let producto = buscadoraPorId(id)
            agregarCarrito(producto)
            mostradoraDeCarrito()
            console.log(Carrito)
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

function mostradoraDeCarrito(){
     cartItems.innerHTML = "";
    Carrito.forEach((el) => {
         let producto = `
        <div class="product-card">
            <h3>${el.title}</h3>
            <p class="price">$${el.price}</p>
        </div>`
        cartItems.innerHTML += producto
    })
}

run()