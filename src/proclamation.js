(function(global) {
    'use strict';
    global.proclamation = proclamation;

    var container = document.createElement('div');
    document.body.appendChild(container);
    container.className = 'proclamation-container';

    function proclamation(text, time) {
        var wrapper = document.createElement('div');
        var notification = document.createElement('div');
        wrapper.appendChild(notification);
        container.appendChild(wrapper);

        wrapper.className = 'proclamation-wrapper';

        notification.textContent = text;
        notification.className = 'proclamation';

        var height = notification.clientHeight;
        notification.style.height = 0;

        setTimeout(function() {
            notification.style.height = height + 'px';
        }, 0);

        setTimeout(function() {
            wrapper.style.paddingTop = 0;
            wrapper.style.paddingBottom = 0;
            notification.style.height = 0;

            var heightDone = false,
                paddingTopDone = false,
                paddingBottomDone = false;

            notification.addEventListener('transitionend', function(event) {
                event.stopPropagation();
                if (event.propertyName === 'height') {
                    heightDone = true;
                    remove();
                }
            });

            wrapper.addEventListener('transitionend', function(event) {
                event.stopPropagation();
                if (event.propertyName === 'padding-top') {
                    paddingTopDone = true;
                    remove();
                }
                if (event.propertyName === 'padding-bottom') {
                    paddingBottomDone = true;
                    remove();
                }
            });

            function remove() {
                if (heightDone && paddingTopDone && paddingBottomDone) {
                    container.removeChild(wrapper);
                }
            }
        }, time || 5000);
    }
})(this);