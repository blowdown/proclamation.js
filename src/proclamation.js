(function(global) {
    'use strict';
    global.proclamation = proclamation;

    var container = document.createElement('div');
    document.body.appendChild(container);
    container.className = 'proclamation-container';

    function proclamation(text, time) {
        var notification = document.createElement('div');
        container.appendChild(notification);

        notification.textContent = text;
        notification.className = 'proclamation';

        notification.style.height = 0;
        notification.style.height = notification.clientHeight + 'px';

        setTimeout(function() {
            notification.style.height = 0;
            notification.addEventListener('transitionend', function(event) {
                if (event.propertyName === 'height') {
                    container.removeChild(notification);
                }
            });
        }, time || 5000);
    }
})(this);