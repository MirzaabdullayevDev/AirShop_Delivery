// $(document).bind("contextmenu",function(e) {
//     e.preventDefault();
//    });

//    $(document).keydown(function(e){
//        if(e.which === 123){
//           return false;
//        }
//    });
/* SECTION SLIDER OWL START */
let owl = $(".slider .owl-carousel");
owl.owlCarousel({
  items: 1,
  loop: true,
  margin: 10,
  autoplay: true,
  autoplayTimeout: 7000,
  autoplayHoverPause: false,
  nav: true,
  responsiveClass: true,
  responsive: {
    0: {
      nav: false,
      dots: false,
    },
    576: {
      items: 1,
      nav: false,
      dots: false,
    },
    768: {
      dots: false,
    },
  },
});
/* SECTION SLIDER OWL END */

/* SECTION PRODUCTS OWL START */
$(".products .owl-carousel").owlCarousel({
  loop: true,
  margin: 30,
  items: 4,
  autoWidth: true,
  nav: true,
  autoplay: true,
  autoplayTimeout: 20000,
  autoplayHoverPause: true,
  responsiveClass: true,
  responsive: {
    0: {
      items: 1,
      autoWidth: true,
      margin: 15,
      dots: false,
    },
    576: {
      items: 2,
      dots: false,
      margin: 33,
      autoWidth: true,
    },
    768: {
      items: 3,
      margin: 10,
      dots: false,
      autoWidth: true,
    },
    992: {
      items: 4,
      nav: true,
      loop: true,
      dots: false,
      autoWidth: true,
      margin: 40,
    },
    1200: {
      margin: 4,
      dots: false,
    },
  },
});
/* SECTION PRODUCTS OWL END */

/* SECTION PRODUCTS OWL START */
$(".categories .owl-carousel").owlCarousel({
  loop: false,
  items: 7,
  autoWidth: false,
  nav: true,
  autoplay: true,
  autoplayTimeout: 20000,
  autoplayHoverPause: true,
  responsiveClass: true,
  responsive: {
    0: {
      items: 2,
      margin: 10,
      dots: false,
    },
    576: {
      items: 3,
      dots: false,
      margin: 33,
    },
    768: {
      items: 4,
      margin: 10,
    },
    992: {
      items: 5,
      margin: 40,
    },
    1200: {
      margin: 5,
    },
  },
});
/* SECTION PRODUCTS OWL END */

$(document).ready(function () {
  $(".owl-carousel").owlCarousel();
  $(".owl-prev").html('<i class="far fa-chevron-left"></i>');
  $(".owl-next").html('<i class="far fa-chevron-right"></i>');

  let $catalog = $(".catalog__menu");
  let $catalogLabel = $(".catalog__span");

  $catalogLabel.on("click", function () {
    $catalog.slideToggle(100);
  });

  let $mobileForm = $(".header__form");
  let $mobileSearch = $(".header__search");

  $mobileForm.on("click", function () {
    if ($(window).width() < 768) {
      $(this).css("max-width", "100%").find($mobileSearch).focus();
      $mobileSearch.css("width", "100%");
    } else {
      $(this).find($mobileSearch).focus();
    }
  });

  $mobileSearch.bind("blur", function (e) {
    e.preventDefault();
    if ($(window).width() < 768) {
      $mobileForm.css("max-width", "40px");
      $(this).css("width", "0%");
    }
  });

  let $mobileBars = $(".mobile__bars");

  $mobileBars.on("click", function () {
    $(".mobile__bars__item").toggleClass("mobile__bars__close");
    $catalog.slideToggle(100);
  });

  $(".products__item__chosen").on("click", function () {
    $(this).find("i").addClass("fas").removeClass("far");
  });

  const user = $(".header__action__item");
  const userLog = $(".user__list");
  user.on("click", () => {
    userLog.slideToggle(100);
  });

  let $addCard = $(".products__item__btn");
  let $quantityCard = $(".quantity");
  let $showCard = $(".quantity__show");

  $addCard.on("click", function () {
    $(this).hide(1);
    $(this).parent().find($quantityCard).css("display", "flex");
    $(this).parent().find($showCard).html(1);
  });

  $(".products__item__link").on("click", function () {
    $(this).parent().find($addCard).hide(1);
    $(this).parent().find($quantityCard).css("display", "flex");
    $(this).parent().find($showCard).html(1);
  });

  let $pilusCard = $(".quantity__pilus");

  $pilusCard.on("click", function () {
    let show = $(this).parent().find($showCard);
    show.html(+show.html() + +1);
  });

  let $minusCard = $(".quantity__minus");
  $minusCard.on("click", function () {
    let show = $(this).parent().find($showCard);
    if (show.html() <= 1) {
      $(this).parent().hide(1);
      $(this).parent().parent().find($addCard).show(1);
    } else {
      show.html(+show.html() - 1);
    }
  });

  /* MODAL START */
  let $modal = $(".modal");
  let $modalView = $(".modal__view");

  $modal.on("click", function (e) {
    if (e.target === this) {
      $(this).hide(1).css("opacity", "0");
      $modalView.css("transform", "translateY(-1000px)");
    }
  });

  let $closeModal = $(".modal__close__btn");

  $closeModal.on("click", function () {
    $modal.css("opacity", "0").hide(1);
    $modalView.css("transform", "translateY(-1000px)");
  });

  if ($(window).width() < 576) {
    $("#buy").html("Без регистрации");
  }
  /* MODAL END */

  let $addQuantity = $(".quantity__add");
  let $allQuantity = $(".card__span");
  let $allAmount = $(".amount");
  const $fixedCard = $(".fixed__card");
  let $toTop = $(".scrollToTop");
  let $cartCountProducts = $(".card__head__count");

  // //Получение информацию о количество товаров в корзине и общую сумму корзины start
  axios
    .get("/cart?fromAxios=true")
    .then(function (response) {
      if (response.data.message !== "Unauthorized") {
        const cart = response.data;
        $allAmount.html(cart.totalCost);
        $allQuantity.html(cart.countProducts);
        $cartCountProducts.html(cart.countProducts);
      }
    })
    .catch(function (error) {
      console.log(error.message);
    });
  // //Получение информацию о количество товаров в корзине и общую сумму корзины end

  //Добавление товара в корзину start
  $addQuantity.on("click", function () {
    $(this).parent().hide(1);
    $(this).parent().parent().find($addCard).show(1);
    let show = $(this).parent().find($showCard);
    axios
      .post("/cart?fromAxios=true", {
        productId: $(this).attr("data-id"),
        count: +show.html(),
      })
      .then(function (response) {
        if (response.data.message !== "Unauthorized") {
          const cart = response.data;
          $allAmount.html(cart.totalCost);
          $allQuantity.html(cart.countProducts);
        } else {
          $modal.show(1).css("opacity", "1");
          $modalView.css("transform", "none");
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    if ($(window).width() < 768) {
      $fixedCard.show(0);
      $toTop.css("bottom", "15%");
    }
  });

  //Добавление товара в корзину start
  let elementClick = $("#fixed");
  let destination = $(elementClick).offset().top;

  $(window).scroll(function () {
    $scroll = $(this).scrollTop();

    if ($scroll > destination) {
      $toTop.css("display", "flex");
    } else {
      $toTop.hide(1);
    }
  });
  //Добавление товара в корзину end

  $toTop.on("click", function (e) {
    e.preventDefault();
    $("html, body").animate(
      {
        scrollTop: 0,
      },
      500
    );
  });

  /* SHOPPING CARD PAGE START */
  let $pilus = $(".card__pilus");
  let $minus = $(".card__minus");
  let $show = $(".card__show");
  let $delete = $(".card__product__remove");
  let $product = $(".card__product");
  let $actionAmount = $(".card__action__amount");
  let $totalAmount = $(".payment__total__amount");
  let $check = $(".card__product__check");
  let $warningPay = $(".payment__top");
  let $payBtn = $(".payment__btn");

  const $dataList = $(".payment__data");

  if (+$totalAmount.html() < 30000) {
    $warningPay.css("display", "flex");
    $payBtn.hide(1);
    // $dataList.hide(1);
  } else {
    $warningPay.hide();
    $payBtn.css("display", "block");
    // $dataList.css("display", "flex");
  }

  $pilus.on("click", function () {
    let show = $(this).parent().find($show);
    show.html(+show.html() + +1);
    let amount = $(this).parent().parent().find($actionAmount);
    amount.html(amount.attr("data-price") * show.html());
    $(this).closest($product).find($check).show(1);
    $(this).closest($product).find($delete).hide(1);
  });

  $minus.on("click", function () {
    let show = $(this).parent().find($show);
    if (show.html() <= 1) {
      show.html(1);
    } else {
      show.html(+show.html() - 1);
      let amount = $(this).parent().parent().find($actionAmount);
      amount.html(amount.attr("data-price") * show.html());
      $(this).closest($product).find($check).show(1);
      $(this).closest($product).find($delete).hide(1);
    }
  });
  //Изменение количество товара в корзине start
  $check.on("click", function () {
    $(this).parent().find($delete).show(1);
    $(this).hide(1);
    const show = $(this).parent().find($show);
    axios
      .patch("/cart?fromAxios=true", {
        productId: $(this).attr("data-id"),
        count: +show.html(),
      })
      .then(function (response) {
        if (response.data.message !== "Unauthorized") {
          const cart = response.data;
          $allAmount.html(cart.totalCost);
          $totalAmount.html(cart.totalCost);
          $allQuantity.html(cart.countProducts);
          if (cart.totalCost < 30000) {
            $warningPay.css("display", "flex");
            $payBtn.hide(1);
          } else {
            $warningPay.hide();
            $payBtn.css("display", "block");
          }
        } else {
          $modal.show(1).css("opacity", "1");
          $modalView.css("transform", "none");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });
  //Изменение количество товара в корзине end

  //Удаление товара из корзины start
  $delete.on("click", function () {
    const that = $(this);
    const productId = that.attr("data-id");
    axios
      .delete(`/cart/${productId}?fromAxios=true`)
      .then(function (response) {
        if (response.data.message !== "Unauthorized") {
          const cart = response.data;
          $allAmount.html(cart.totalCost);
          $totalAmount.html(cart.totalCost);
          $allQuantity.html(cart.countProducts);
          $cartCountProducts.html(cart.countProducts);
          if (cart.countProducts > 0) {
            if (cart.totalCost < 30000) {
              $warningPay.css("display", "flex");
              $payBtn.hide(1);
            } else {
              $warningPay.hide();
              $payBtn.css("display", "block");
            }
          } else {
            $(".card__payment").html("");
          }

          that.parent().hide(1);
        } else {
          $modal.show(1).css("opacity", "1");
          $modalView.css("transform", "none");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });
  //Удаление товара из корзины end
  let $dropdown = $(".data__items");
  let $downList = $(".data__list");
  $dropdown.on("click", function () {
    $downList.slideToggle(100);
    $(this).css("border-color", "#ef404a");
  });

  let $downTime = $(".data__list__item");

  $downTime.on("click", function () {
    $(this).parent().slideUp(100);
    $dropdown
      .html($(this).html() + `<i class="far fa-chevron-down"></i>`)
      .css("border-color", "#e4e4e4");
  });

  /* SHOPPING CARD PAGE END */

  $(".products__item__empty").on("click", function (event) {
    event.preventDefault();
  });

  const $date = new Date();

  $downTime.toArray().forEach((element) => {
    const $attr = element.getAttribute("data-id");
    if ($date.getHours() > $attr && $date.getHours() <= 21) {
      element.style.display = "none";
    }
  });

  let $btn = $(".menu__btn");
  let $menuDark = $(".menu__dark");

  $menuDark.on("click", function () {
    $(this).toggleClass("menu__dark__active");
    $btn.toggleClass("menu__close");
    $("body").toggleClass("open__menu");
  });

  $btn.on("click", function () {
    $(this).toggleClass("menu__close");
    $menuDark.toggleClass("menu__dark__active");
    $(".menu__btn i").toggleClass("fa-bars");
    $(".menu__btn i").toggleClass("fa-times");
    $("body").toggleClass("open__menu");
  });
});

//My part start

//Выбор времени доставки start
const $deliveryTime = document.querySelector("#deliveryTime");
if ($deliveryTime) {
  $deliveryTime.addEventListener("click", (event) => {
    let timeIde = document.querySelector("#timeId")
    timeIde.value = event.target.dataset.id;
    let timeInterval = document.querySelector("#timeInterval")
    timeInterval.value = event.target.innerHTML;
    let condition = timeId.value && timeInterval.value
    if (condition) {
      document.querySelector('#showButton').classList.remove('hide')
    }
  });
}
//Выбор времени доставки end

//Обновление пользовательских данных start
const newName = document.querySelector("#newName");
if (newName) {
  newName.addEventListener("click", () => {
    newName.value = "";
  });
}
//Обновление пользовательских данных end

//Изменение формата времени заказов start
function toDate(date) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}
const orderDate = document.querySelectorAll(".goods__action__time__now");
orderDate.forEach((item) => {
  item.innerHTML = toDate(item.textContent);
});
//Изменение формата времени заказов end

//Вывод контактов - start
const $telephone = document.querySelectorAll(".header__call__link");
const $instagram = document.querySelectorAll(".instagram_link");
const $telegram = document.querySelectorAll(".telegram_link");
const $facebook = document.querySelectorAll(".facebook_link");

if ($telephone) {
  axios
    .get("/info/getContactsAsJSON")
    .then(function (response) {
      const contacts = response.data;
      if (contacts) {
        for (let i = 0; i < $telephone.length; i++) {
          $telephone[i].setAttribute("href", "tel: " + contacts.telephone);
          $telephone[i].innerHTML = contacts.telephone;
        }

        for (let i = 0; i < $instagram.length; i++) {
          $instagram[i].setAttribute("href", contacts.instagram);
        }

        for (let i = 0; i < $telegram.length; i++) {
          $telegram[i].setAttribute("href", contacts.telegram);
        }

        for (let i = 0; i < $facebook.length; i++) {
          $facebook[i].setAttribute("href", contacts.facebook);
        }
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}
//Вывод контактов - end

//My part end
