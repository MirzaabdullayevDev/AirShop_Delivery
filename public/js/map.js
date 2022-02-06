var map;

DG.then(function () {
    map = DG.map('map', {
        center: [40.851652486675135, 69.59690315975278],
        zoom: 13
    });
    const timeId = document.querySelector('#timeId').innerHTML
    let url = '/orders/getAdress/';
    if(timeId){
        url = `/orders/getAdress?timeId=${timeId}`
    }
    fetch(url)
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            const { orderList } = data
            console.log(orderList);
            let adress = {}
            let popup = ''
            let order = 0
            for (var i = 0; i < orderList.length; i++) {
                adress = orderList[i].adress
                order = orderList[i].order
                popup = `
                 <a href="/admin/orders?order=${order}" target="_blanc">Заказ №${order}</a>
                `
                DG.marker([adress.latitude, adress.longitude]).addTo(map).bindPopup(popup);
            }
        })
});