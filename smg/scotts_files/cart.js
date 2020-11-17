define(['domReady'], function (domReady) {
    domReady(function () {
        document.getElementById('cart-checkout').addEventListener('click', function() {
            window.parent.postMessage('cartClicked', '*');
        });
    });
});
