let baseURL = 'http://localhost'
let port = 8080

let orderTable = document.getElementById('orderTable')

function getOrders() {
    try {
        orderData = fetch(baseURL + ':' + port + '/getOrders')
        let orders = orderData.json()
        return orders
    }
    catch (e) {
        orderTable.innerHTML = 
        `<i style="color: red;">There was an error fetching the orders!</i>`
        console.log(e)
    }
}

function displayOrders() {
    let orders = getOrders()

    for (let i = 0; i < orders.length; i++) {
        let order = orders[i]
        orderTable.innerHTML = `
        <tr>
        <td>${order.orderId}</td>
        <td>${order.orderer}</td>
        <td>${order.ordererPhone}</td>
        <td>${order.ordererEmail}</td>
        <td>${order.ordererCity}, ${order.ordererAddress}, ${order.ordererStreet}, </td>        <td>${order.ordererAddress}</td>
        <td>${order.orderItems}</td>
        <td>${order.orderTotal}</td>
        <td>${order.orderStatus}</td>
        </tr>
        `
    }
}
