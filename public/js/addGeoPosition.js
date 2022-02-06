ymaps.ready(init);
function init() {
    var myPlacemark,
        myMap = new ymaps.Map('map', {
            center: [40.847015743980485, 69.60525666460877],
            zoom: 14,
            controls: ['zoomControl'],
            type: 'yandex#hybrid',
            behaviors: ['drag', 'multiTouch', 'scrollZoom']
        }, {
            searchControlProvider: 'yandex#search'
        });
    let checkout = document.querySelector('#checkout')
    checkout.classList.add('hide')
    // Слушаем клик на карте.
    myMap.events.add('click', function (e) {
        var coords = e.get('coords');
        let latitude = document.querySelector('#latitude')
        let longitude = document.querySelector('#longitude')
        latitude.value = coords[0]
        longitude.value = coords[1]
        let condition = longitude.value && latitude.value
        if (condition) {
            checkout.classList.remove('hide')
        }

        // Если метка уже создана – просто передвигаем ее.
        if (myPlacemark) {
            myPlacemark.geometry.setCoordinates(coords);
        }
        // Если нет – создаем.
        else {
            myPlacemark = createPlacemark(coords);
            myMap.geoObjects.add(myPlacemark);
        }
    });

    // Создание метки.
    function createPlacemark(coords) {
        return new ymaps.Placemark(coords, {
            iconCaption: 'Местоположение вaшего дома'
        }, {
            draggable: true
        });
    }
}
const showBtn = document.querySelector('#showButton')
const hideBtn = document.querySelector('#hideButton')
const card = document.querySelector('#card')
const instruction = document.querySelector('#instruction')
let map = document.querySelector('#map')
if (showBtn) {
    showBtn.addEventListener('click', () => {
        if (map.classList.contains('hide')) {
            map.classList.remove('hide')
            hideBtn.classList.remove('hide')
            card.classList.add('hide')
            instruction.classList.remove('hide')
        }
    })
}
if (hideBtn) {
    hideBtn.addEventListener('click', () => {
        if (!map.classList.contains('hide')) {
            map.classList.add('hide')
            hideBtn.classList.add('hide')
            card.classList.remove('hide')
            instruction.classList.add('hide')
        }
    })
}