window.addEventListener('load', function() {
    var href = '.' + this.location.pathname;
    var element = document.querySelector('nav li a[href="' + href + '"]');
    if (element) {
        element.classList.add('active');
    }
});
