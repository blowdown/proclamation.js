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
        setTimeout(function(){
            container.removeChild(notification);
        }, time || 5000);
    }
})(this);