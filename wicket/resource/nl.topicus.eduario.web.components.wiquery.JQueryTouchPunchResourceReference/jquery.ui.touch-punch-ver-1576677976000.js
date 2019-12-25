
(function ($) {

$.support.touch = 'ontouchend' in document;

if (!$.support.touch) {
return;
}
var mouseProto = $.ui.mouse.prototype,
_mouseInit = mouseProto._mouseInit,
_mouseDestroy = mouseProto._mouseDestroy,
touchHandled;

function simulateMouseEvent (event, simulatedType) {

if (event.originalEvent.touches.length > 1) {
return;
}
event.preventDefault();
var touch = event.originalEvent.changedTouches[0],
simulatedEvent = document.createEvent('MouseEvents');

simulatedEvent.initMouseEvent(
simulatedType, 
true, 
true, 
window, 
1, 
touch.screenX, 
touch.screenY, 
touch.clientX, 
touch.clientY, 
false, 
false, 
false, 
false, 
0, 
null 
);

event.target.dispatchEvent(simulatedEvent);
}

mouseProto._touchStart = function (event) {
var self = this;

if (touchHandled || !self._mouseCapture(event.originalEvent.changedTouches[0])) {
return;
}

touchHandled = true;

self._touchX = event.originalEvent.changedTouches[0].screenX;
self._touchY = event.originalEvent.changedTouches[0].screenY;

simulateMouseEvent(event, 'mouseover');

simulateMouseEvent(event, 'mousemove');

simulateMouseEvent(event, 'mousedown');
};

mouseProto._touchMove = function (event) {

if (!touchHandled) {
return;
}

simulateMouseEvent(event, 'mousemove');
};

mouseProto._touchEnd = function (event) {
var xDiff, yDiff;

if (!touchHandled) {
return;
}

simulateMouseEvent(event, 'mouseup');

simulateMouseEvent(event, 'mouseout');
xDiff = this._touchX - event.originalEvent.changedTouches[0].screenX;
yDiff = this._touchY - event.originalEvent.changedTouches[0].screenY;

if ((xDiff*xDiff + yDiff*yDiff) < 5) {

simulateMouseEvent(event, 'click');
}

touchHandled = false;
};

mouseProto._mouseInit = function () {
var self = this;

self.element.bind({
touchstart: $.proxy(self, '_touchStart'),
touchmove: $.proxy(self, '_touchMove'),
touchend: $.proxy(self, '_touchEnd')
});

_mouseInit.call(self);
};

mouseProto._mouseDestroy = function () {
var self = this;

self.element.unbind({
touchstart: $.proxy(self, '_touchStart'),
touchmove: $.proxy(self, '_touchMove'),
touchend: $.proxy(self, '_touchEnd')
});

_mouseDestroy.call(self);
};
})(jQuery);