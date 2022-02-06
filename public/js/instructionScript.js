$(document).ready(function () {

    $('.ask').on('click', function () {
        let $answer =  $(this).next();  
        $('.answer').not($answer).slideUp();   
        $answer.slideToggle();
    })

});