const sidebar = `
<div id="sidebar">
    <div class="logo">
        <img src="/public/yoga.png">
        <h4>Mama & Json's Pizza</h4>
    </div>
    <nav>
        <button class="pizzaList">List of Pizzas</button>
        <button class="orderList">List of Orders</button>
    </nav>
</div>
`;


const startingPage = `
<div id="startingPage">
    <h1>Please choose a list to manage either Pizza or Orders</h1>
</div>
`;


const editPage = (listHeader, list) => {
    return `
    <div id="editPage">
        <div class="listHeader">${listHeader}</div>
        <div class="list">${list}</div>
        <div class="popup" id="popup-1">
            <div class="overlay">
            <div class="content">
                <button id="myCloseBtn" class="close-btn">&times;</button>
                <form id="newPizzaForm">
                    <input type="text" id="name" name="name" placeholder="Name">
                    <input type="description" id="description" name="description" placeholder="Description">
                    <input type="price" id="price" name="price" placeholder="Price">
                    <input id="picture" class="input-file" type="file" name="picture" hidden/>
                    <label id="pictureChooseBtn" for="picture">Choose Picture</label>
                    <button id="formButton">Send</button>
                </form>
            </div>
        </div>
    </div>
    `;
};

const pizzaHeader = `
<h3>Pizzas</h3>
<button id="mybtn"><i class="fa-solid fa-plus"></i></button>
`;

const orderHeader = `
<h3>Orders</h3>
`;

const listOfPizzas = (id, pizzaName, description, price) => {
    return `
    <div class="listCard" id="${id}">
        <h4>${pizzaName}</h4>
        <p>${description}</p>
        <span>${price} Ft</span>
        <div id="circle${id}" class="circle"></div>
    </div>
    `;
};

const listOfOrders = (id, amount, totalPrice) => {
    return `
    <div id="${id}" class="listCard">
        <h4 id="orderId">ID#${id}</h3>
        <p class="amount">${amount}x</p>
        <span class="totalPrice">${totalPrice} Ft</span>
    </div>
    `;
};

const pizzaModderFormComponent = (id, name, description, price, picture) =>{
    return `
    <form class="modderForm" id="ModderForm${id}">
        <div>
            <input type="text" value="${name}" name="modderName" id="modderName">
            <button class="activeBtn">Active</button>
        </div>

        <div class="modderLine"></div>
        <div>
            <h3>Details</h3>
            <i class="fa-solid fa-pen-to-square edit" id="editImg"></i>
        </div>
        <input type="text" value="${description}" name="modderDescription" id="modderDescription">
        <h3>Price</h3>
        <input type="text" value="${price}" name="modderPrice" id="modderPrice">
        <h3>Picture</h3>
        <img class="modderPictureNow" src="./public/pizza-images/${picture}" >
        
        <input id="modderPicture" class="inputFile" type="file" name="modderPicture"/>
        <div>
            <button id="sendButton">Save</button>
            <button id="delete">Delete</button>
        </div

    </form>
    `
}

const orderCardDisplay = (id, custName, zip, city, street, houseNumber, totalPrice, pizzaCard) => {
    return `
    <div class="listHeader">
        <h3 class="ordId">ID#${id}</h3>
    </div>
    <h4 class="custDet">Customer Details:</h4>
    <p class="custName">Name: ${custName}</p>
    <p class="custAddr">Address: ${zip} ${city}, ${street} street ${houseNumber}.</p>
    <h4 class="ordInf">Order info:</h4>
    <div class="ord-flex-container">
        ${pizzaCard}
    </div>
    <p class="ordTotPri">Total: ${totalPrice} Ft</p>
    <button class="ordCompl">Complete</button>
    <button class="ordDel">Delete</button>
    `;
}

const pizzaCardForOrder = (amount, pizzaName, price) => {
    return `
    <p class="pizzaCFOr" id="pizzaBorder">${amount}x ${pizzaName} ${price} Ft</p>
    `;
};

const detailPage = (cardDisplay) => {
    return `
        <div id="detailPage">
            ${cardDisplay}
        </div>
`};




const sendFunction = form => {

    form.addEventListener("submit", e => {

        e.preventDefault();

        const formData = new FormData();

        let name = e.target.querySelector(`input[name="modderName"]`).value
        let description = e.target.querySelector(`input[name="modderDescription"]`).value
        let price = e.target.querySelector(`input[name="modderPrice"]`).value
        let pizzaCardId2 = e.target.id.split("ModderForm")[1]
        let picture = e.target.querySelector(`input[name="modderPicture"]`).files[0]
        
        
        
        
        formData.append("name", name);
        formData.append("description", description);
        formData.append("price", price);
        formData.append("id", pizzaCardId2);
        formData.append("picture", picture);

        const fetchSettings = {
            method: "POST",
            body: formData
        };

        fetch("/putter", fetchSettings)
            .then(async data => {
                if (data.status === 200) {
                    const res = await data.json()

                    console.dir(data);
                }
            })
            .catch(error => {
                e.target.outerHTML = `Error`;
                console.dir(error);
            })

        document.getElementById("modderName").classList.remove("editNow");
        document.getElementById("modderDescription").classList.remove("editNow");
        document.getElementById("modderPrice").classList.remove("editNow");
        document.getElementById("modderPicture").classList.remove("editNow2");
        document.querySelector('input[name="modderName"]').disabled = true;
        document.querySelector('input[name="modderDescription"]').disabled = true;
        document.querySelector('input[name="modderPrice"]').disabled = true;
    });
};






window.addEventListener('load', async () => {

    const rootElement = document.getElementById('root');

    rootElement.insertAdjacentHTML('beforeend', sidebar);
    rootElement.insertAdjacentHTML('beforeend', startingPage);

    const startPage = document.getElementById('startingPage');
    const pizzaList = document.querySelector('.pizzaList');
    const orderList = document.querySelector('.orderList');

    const pizzaRes = await fetch('/data');
    const pizzas = await pizzaRes.json();




    pizzaList.addEventListener('click', (e) => {

        orderList.classList.remove('stayActive');
        e.target.classList.add('stayActive');
        startPage.classList.add('hidden');

        if (rootElement.children[3] === undefined) {
            console.log("Nothing to delete")
        } else {
            rootElement.children[3].remove()
        };

        if (rootElement.children[2] === undefined) {
            console.log("Nothing to delete")
        } else {
            rootElement.children[2].remove()
        };


        let pizzaListContent = "";

        for (let pizza of pizzas) {
            pizzaListContent += listOfPizzas(pizza.id, pizza.name, pizza.description, pizza.price);
        };

        rootElement.insertAdjacentHTML('beforeend', editPage(pizzaHeader, pizzaListContent));


        const newPizzaForm = document.getElementById("newPizzaForm");
        const newPizzaBtn = document.getElementById("mybtn");
        const pizzaCloseBtn = document.getElementById("myCloseBtn");
        const editablePage = document.getElementById('editPage');
        const pizzaListCard = document.querySelectorAll('.listCard');
        const formPopup = document.getElementById("popup-1");


        newPizzaBtn.addEventListener('click', () => {
            formPopup.classList.toggle("active")
        });

        newPizzaForm.addEventListener("submit", async e => {
            e.preventDefault();

            const pizzaData = new FormData();
            pizzaData.append("id", pizzas.length + 1);
            pizzaData.append("name", e.target.querySelector(`input[name="name"]`).value);
            pizzaData.append("description", e.target.querySelector(`input[name="description"]`).value);
            pizzaData.append("price", e.target.querySelector(`input[name="price"]`).value);
            pizzaData.append("amount", 0);
            pizzaData.append("picture", e.target.querySelector(`input[name="picture"]`).files[0]);

            const pizzaFetch = {
                method: 'POST',
                body: pizzaData
            };

            fetch("/newpizza", pizzaFetch)
                .then(async data => {
                    if (data.status === 500) {
                        const response = await data.json()
                    }
                })
                .catch(error => {
                    e.target.outerHTML = `Something Wrong!`;
                    console.dir(error);
                });

            formPopup.classList.remove("active");
        });

        pizzaCloseBtn.addEventListener('click', () => {
            formPopup.classList.toggle("active")
        });






        for (let pizzaCard of pizzaListCard) {

            pizzaCard.addEventListener('click', () => {

                if (rootElement.children[3] === undefined) {
                    console.log("Nothing to delete")
                } else {
                    rootElement.children[3].remove()
                };


                let pizzaCardId = pizzaCard.id

                for (let pizzaCard2 of pizzas) {
                    if (pizzaCard2.id == pizzaCardId) {
                        rootElement.insertAdjacentHTML('beforeend', detailPage(pizzaModderFormComponent(pizzaCard2.id, pizzaCard2.name, pizzaCard2.description, pizzaCard2.price, pizzaCard2.picture)));
                    }
                }

                const formElement = document.querySelector(".modderForm");
                const detailedPage = document.getElementById('detailPage');
                const activeBtn = document.querySelector(".activeBtn");
                const deleteBtn = document.getElementById('delete');
                const saveBtn = document.getElementById('sendButton');
                const circle = document.getElementById(`${pizzaCard.children[3].id}`)
                

                saveBtn.addEventListener('click', () => {
                    sendFunction(formElement);
                });


                activeBtn.addEventListener('click', (e) => {
                    e.preventDefault()
                    
                    if (e.target.innerHTML === 'Active') {
                        e.target.innerHTML = "Disabled"
                        e.target.classList.add('red')
                        circle.className = 'redCircle'
                    }
                    else {
                        e.target.innerHTML = 'Active'
                        if (e.target.classList.contains('red')) {
                            e.target.classList.remove('red')
                            circle.className = 'circle'
                        }
                    }
                });



                deleteBtn.addEventListener('click', () => {
                    const pizzaCardID = pizzaCard.id

                    fetch('/del', {
                        method: "DELETE",
                        headers: {
                            "Content-type": "application/json"
                        },
                        body: JSON.stringify({ id: pizzaCardID })
                    })
                        .then(async () => {
                            detailedPage.remove();
                        });

                });
                //edit button
                const editImg = document.getElementById("editImg")
                document.querySelector('input[name="modderName"]').disabled = true;
                document.querySelector('input[name="modderDescription"]').disabled = true;
                document.querySelector('input[name="modderPrice"]').disabled = true;
                editImg.addEventListener('click', () => {
                    if (document.getElementById("modderName").className) {
                        document.getElementById("modderName").classList.remove("editNow");
                        document.getElementById("modderDescription").classList.remove("editNow");
                        document.getElementById("modderPrice").classList.remove("editNow");
                        document.getElementById("modderPicture").classList.remove("editNow2");
                        document.querySelector('input[name="modderName"]').disabled = true;
                        document.querySelector('input[name="modderDescription"]').disabled = true;
                        document.querySelector('input[name="modderPrice"]').disabled = true;
                        
                    }else{
                        document.getElementById("modderName").className += " editNow";
                        document.getElementById("modderDescription").className += " editNow";
                        document.getElementById("modderPrice").className += " editNow";
                        document.getElementById("modderPicture").className += " editNow2";
                        document.getElementById("modderPicture").classList += " inputFile";
                        document.querySelector('input[name="modderName"]').disabled = false;
                        document.querySelector('input[name="modderDescription"]').disabled = false;
                        document.querySelector('input[name="modderPrice"]').disabled = false;
                    }
                })

                orderList.addEventListener('click', () => {
                    detailedPage.remove();
                });
            });
        };

        orderList.addEventListener('click', () => {
            editablePage.remove();
        });


    });





    orderList.addEventListener('click', async (e) => {

        pizzaList.classList.remove('stayActive');
        e.target.classList.add('stayActive');
        startPage.classList.add('hidden');

        if (rootElement.children[3] === undefined) {
            console.log("Nothing to delete")
        } else {
            rootElement.children[3].remove()
        };

        if (rootElement.children[2] === undefined) {
            console.log("Nothing to delete")
        } else {
            rootElement.children[2].remove()
        };



        const dataFiles = await fetch('/orders');
        const readData = await dataFiles.json();
        let dataListContent = "";

        for (let dataFile of readData) {

            let amount = 0
            dataFile.orderDetails.map(data => {
                amount += data.amount
            })

            dataListContent += listOfOrders(dataFile.orderID, amount, dataFile.customerDetails.totalPrice);
        };

        rootElement.insertAdjacentHTML('beforeend', editPage(orderHeader, dataListContent));


        const editablePage = document.getElementById("editPage");
        const orderListCard = document.querySelectorAll('.listCard');
        console.log(orderListCard[0])


        for (let orderCard of orderListCard) {
            orderCard.addEventListener('click', () => {

                if (rootElement.children[3] === undefined) {
                    console.log("Nothing to delete")
                } else {
                    rootElement.children[3].remove()
                };


                let orderCardId = orderCard.id;
                let pizzaCardData = "";


                for (let pizzaDetail of readData) {

                    if (pizzaDetail.orderID === orderCardId) {

                        for (let amountData of pizzaDetail.orderDetails) {
                            pizzaCardData += pizzaCardForOrder(amountData.amount, amountData.name, amountData.price)
                        }
                    }
                }

                for (let orderCard2 of readData) {

                    if (orderCard2.orderID === orderCardId) {

                        rootElement.insertAdjacentHTML('beforeend', detailPage(orderCardDisplay(orderCard2.orderID, orderCard2.customerDetails.fullName, orderCard2.customerDetails.zip, orderCard2.customerDetails.city, orderCard2.customerDetails.street, orderCard2.customerDetails.houseNumber, orderCard2.customerDetails.totalPrice, pizzaCardData)));
                    }
                }

                const detailedPage = document.getElementById('detailPage');

                pizzaList.addEventListener('click', () => {
                    detailedPage.remove();
                });
            })
        };

        pizzaList.addEventListener('click', () => {
            editablePage.remove();
        });
    });
});