const htmlBody = (pizzas) => {
    return `
    <section id="homepage">
        <img src="./public/homePicture.jpg" alt="homep-pict">
        <img src="./public/yoga.png" class="logo" alt="logo">
        <h2>Mama & json's pizza</h2>
        <p>Life is not about finding yourself.<br> It's about finding pizza.</p>
        <a href="#orderpage">Choose a pizza</a>
        <svg class="arrows" width="100" height="100" viewBox="0 0 100 100">
            <path class="a1" d="M0 0 L30 32 L60 0"></path>
            <path class="a2" d="M0 20 L30 52 L60 20"></path>
            <path class="a3" d="M0 40 L30 72 L60 40"></path>
        </svg>
    </section>
    <section id="orderpage">
        <div id="CheckoutAndPizzaCardsDiv">
            <div class="pizzaCards">${pizzas}</div>
        </div>
        <div id="cardPlaceHolder">
            <img src="./public/pizza-delivery.png">
            <div id="cardPlaceHolderReal"></div>
                <div id="placeHolderForm">
                    <span>Total price:</span>
                    <span class="secondSpan">0 Ft</span>   
                </div>
            <button id="checkout">Checkout</button>
        </div>
    </section>
    <div id="formPlaceHolder"></div>
`}

const formBody = `
    <section id="formpage">
        <video autoplay muted loop id="myVideo">
            <source src="./public/pizzaOven.mp4" type="video/mp4">
        </video>
        <section class="flex-container">
            <form id="profileForm">
                <input type="text" id="fname" name="fname" placeholder="Full name">
                <input type="text" id="zip" name="zip" placeholder="Zip code">
                <input type="text" id="cit" name="city" placeholder="City">
                <input type="text" id="str" name="str" placeholder="Street">
                <input type="text" id="hnu" name="hnum" placeholder="House number"> 
                <input type="text" id="phnu" name="phnu" placeholder="Phone number"> 
                <input type="text" id="ema" name="ema" placeholder="Email"> 
                <button>Send</button>
            </form>
        </section>
    </section>
`

let count = 1
function pizzaComponent(name, des, price, picture, id) {
    return `
        <div class="card" id="${count++}">
            <img class="picture" src="./public/pizza-images/${picture}" >
            
            <div class="heading">${name}</div>
            <div class="content">
                <ul>
                    <div class="des-container">
                        <li>${des}</li>
                    </div>
                    <div class="pri-container">
                        <li>Price: ${price} Ft</li>
                    </div>
                </ul>
            </div>
            <div class = "addToCart">
                <input class="count" type="number" id="txt_invoer${id}" value="1">
                <div class = "plusMinus">
                    <button class="countUpBtn" onclick="countUp(${id})">+</button>
                    <button class="countDownBtn" onclick="countDown(${id})">-</button>
                </div>
                <button class="buyButton">
                    <span class="buyButton_top">
                        Cart
                    </span>
                </button>
            </div>
        </div>
    `
}

let order = {
    orderDate: `${new Date().toLocaleString()}`,
    fullName: "",
    zip: "",
    city: "",
    street: "",
    houseNumber: "",
    phoneNumber: "",
    email: "",
    totalPrice: 0
}

function Pizza(name, description, price, picture, id) {
    this.name = name
    this.description = description
    this.price = price
    this.picture = picture
    this.id = id
}

function countUp(id) {
    let txtInvoer = document.getElementById(`txt_invoer${id}`);
    let i = parseInt(txtInvoer.value, 10);
    txtInvoer.value = ++i;
}

function countDown(id) {
    let txtInvoer = document.getElementById(`txt_invoer${id}`);
    let i = parseInt(txtInvoer.value, 10);
    txtInvoer.value = --i;
    if (i <= 0) {
        txtInvoer.value = 0
    }
}

const loadEvent = async () => {
    //get data
    const pizzaRes = await fetch('/data')
    const pizzaArr = await pizzaRes.json()
    console.log(pizzaArr[0]);

    let pizzas = pizzaArr.map(pizza => {
        return new Pizza(pizza.name, pizza.description, pizza.price, pizza.picture, pizza.id)
    })
    console.log(pizzas);

    //process data
    const rootElement = document.getElementById("root")
    /* rootElement.insertAdjacentHTML("beforeend", htmlBody); */

    let content = ""
    for (const pizza of pizzas) {
        content += pizzaComponent(pizza.name, pizza.description, pizza.price, pizza.picture, pizza.id)
    }
    rootElement.insertAdjacentHTML("beforeend", htmlBody(content))

    let carts = document.querySelectorAll(".buyButton")
    //Itt jelölöm ki a gombokat, és mentjük el egy változóban
    const cardElement = (title, priceContent, image, amount) => {
        return `
        <div id="clone-card">
            <img src="${image}">
            <h2 class="amount-h2">${amount} db</h2>
            <h2 class="title-h2">${title}</h2>
            <div class="price-content">${priceContent}</div>
        </div>
        `
    }

    for (let i of carts) {                       //Végig iterálunk a carts-on (.addcart)
        i.addEventListener("click", (e) => {     //Click eseményt adunk hozzá, hogy a kattintáskor mit csináljon
            let name = e.target.parentElement.parentElement.parentElement.children[1].innerHTML
            let priceText = e.target.parentElement.parentElement.parentElement.children[2].children[0].children[1].innerText
            let amount= e.target.parentElement.parentElement.children[0].valueAsNumber
            let price = priceText.split("Price: ")[1].split(" Ft")[0] * amount
            let priceContent = `Price: ${price} Ft`
            let image =  e.target.parentElement.parentElement.parentElement.children[0].src
            

            console.dir(typeof image)

            document.getElementById("cardPlaceHolderReal").insertAdjacentHTML('beforeend', cardElement(name, priceContent, image, amount))
            //meghívom a cartnumbers függvényt
            
        })
    }

    // POST request
    const cartBtn = document.querySelectorAll(".buyButton_top")

    let pizzaOrder = ""

    for (let cart of cartBtn) {
        cart.addEventListener('click', (e) => {
            for (let pizza of pizzaArr) {

                let pizzaID = e.target.parentElement.parentElement.parentElement.id
                if (pizzaID == pizza.id) {
                    pizza.amount = e.target.parentElement.parentElement.children[0].valueAsNumber
                    let totalPrice = parseInt(pizza.price) * pizza.amount
                    pizza.price = totalPrice
                    order.totalPrice += totalPrice
                }
                document.querySelector('.secondSpan').innerText = `${order.totalPrice} Ft`
            }

            pizzaOrder = pizzaArr.filter(pizza => {
                if (pizza.amount > 0) {
                    console.log(pizza)
                    return pizza
                }
            })

        })
    }

    const checkout = document.getElementById("checkout")

    checkout.addEventListener('click', () => {
        const page = document.getElementById("formPlaceHolder");
        page.insertAdjacentHTML("beforeend", formBody);
        page.scrollIntoView()
        
        const profileForm = document.getElementById("profileForm");

        profileForm.addEventListener('submit', e => {
            e.preventDefault(); 
    
            order.fullName = e.target.querySelector(`input[name="fname"]`).value;
            order.zip = e.target.querySelector(`input[name="zip"]`).value;
            order.city = e.target.querySelector(`input[name="city"]`).value;
            order.street = e.target.querySelector(`input[name="str"]`).value;
            order.houseNumber = e.target.querySelector(`input[name="hnum"]`).value;
            order.phoneNumber = e.target.querySelector(`input[name="phnu"]`).value;
            order.email = e.target.querySelector(`input[name="ema"]`).value;
    

            const formData = {
                customerDetails: order,
                orderDetails: pizzaOrder
            }
    
            const fetchSettings = {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(formData)
            }
    
            fetch('/', fetchSettings)
                .then(async data => {
                    if (data.status === 200) {
                        const response = await data.json()
                        e.target.outerHTML = "Thank you! Your order is being processed. Please check your email for further information.";
                        console.dir(data);
                    }
                })
                .catch(error => {
                    e.target.outerHTML = "error";
                    console.dir(error);
                });
        })
    })



}

window.addEventListener("load", loadEvent)
