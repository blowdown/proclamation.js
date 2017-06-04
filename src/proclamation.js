(function(global) {
    'use strict';
    global.proclamation = proclamation;

    var containers = createContainers({
        leftTop: { left: 0, top: 0 },
        leftBottom: { left: 0, bottom: 0},
        rightTop: { right: 0, top: 0 },
        rightBottom: { right: 0, bottom: 0 }
    })

    function createContainers(descriptions) {
        var containers = {};
        for (var name in descriptions) {
            var styles = descriptions[name];
            Object.defineProperty(containers, name, { get: makeContainerGetter(styles) });
        }

        return containers;
    }

    function makeContainerGetter(styles) {
        var container;
        return function() {
            if (!container) {
                container = document.createElement('div');
                document.body.appendChild(container);
                container.className = 'proclamation-container';

                assign(container.style, styles);
            }
            return container;
        };
    }

    function proclamation(config) {
        if (typeof config === 'string') {
            config = {
                text: arguments[0],
                time: arguments[1]
            };
        }

        if (config.container === undefined) {
            config.container = 'rightBottom';
        }

        if (config.closeOnClick === undefined) {
            config.closeOnClick = true;
        }

        var container = containers[config.container];

        var wrapper = document.createElement('div');
        var notification = document.createElement('div');
        var closeButton = document.createElement('div');
        wrapper.appendChild(notification);

        if (!config.closeOnClick) {
            wrapper.appendChild(closeButton);
        }

        container.appendChild(wrapper);

        closeButton.textContent = '⨯';
        closeButton.className = 'proclamation-close';

        wrapper.className = 'proclamation-wrapper';
        if (config.type) {
            wrapper.className += ' proclamation-' + config.type;
        }

        if (config.html) {
            notification.innerHTML = config.html;
        } else {
            notification.textContent = config.text;
        }
        notification.className = 'proclamation';

        var height = notification.clientHeight;
        notification.style.height = 0;

        // HACK: trigger CSS height transition.
        setTimeout(function() {
            notification.style.height = height + 'px';
        }, 0);

        wrapper.addEventListener('click', function() {
            if (config.closeOnClick) {
                close();
            }
            if (typeof config.onClick === 'function') {
                config.onClick();
            }
        });

        closeButton.addEventListener('click', function(e) {
            close();
            e.stopPropagation();
        });

        if (config.time !== undefined) {
            setTimeout(close, config.time);
        }

        var isClosed = false;
        var isClosing = false;
        function close() {
            if (isClosing) {
                return;
            }

            isClosing = true;
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
                    isClosed = true;
                }
            }
        }

        return {
            close: close,
            isClosed: function() { return isClosed; }
        };
    }

    function assign(destination, source) {
        for (var key in source) {
            destination[key] = source[key];
        }

        return destination;
    }
})(this);
