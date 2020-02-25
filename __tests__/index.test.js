
const $ = require('jquery');
const { default: Draggable } = require('../dist/index.c');

// use jquery to bind/remove event
const oldBinder = HTMLElement.prototype.addEventListener;
const oldRemove = HTMLElement.prototype.removeEventListener;

const newBinder = function (type, callback) {
  this.addEventListener = oldBinder;
  $(this).on(type, callback);
  this.addEventListener = newBinder;
}

const newRemove = function (type, callback) {
  this.removeEventListener = oldRemove;
  $(this).off(type, callback);
  this.removeEventListener = newRemove;
}

HTMLElement.prototype.addEventListener = newBinder;
HTMLElement.prototype.removeEventListener = newRemove;

window.addEventListener = newBinder;
window.removeEventListener = newRemove;

const startEvent = $.Event('mousedown', { pageX: 20, pageY: 30 });
const moveEvent = $.Event('mousemove', { pageX: 30, pageY: 40 });
const moveEvent2 = $.Event('mousemove', { pageX: 40, pageY: 60 });

function getEl() {
  const div = document.createElement('div');
  div.style.width = '100px';
  div.style.height = '100px';
  document.body.appendChild(div);
  return div;
}

test('drag correctly', () => {
  const el = getEl();
  new Draggable(el);

  $(el).trigger(startEvent);
  $(window).trigger(moveEvent);

  const trans = el.style.transform;
  expect(trans).toBe('matrix(1,0,0,1,10,10)')
})

test('trigger onMoving correctly', () => {

  const el = getEl();
  let eventArg;

  new Draggable(el, {
    onMoving(e) {
      eventArg = e
    }
  });

  $(el).trigger(startEvent);

  $(window).trigger(moveEvent);
  expect(eventArg.deltX).toBe(10);
  expect(eventArg.deltY).toBe(10)

  $(window).trigger(moveEvent2);
  expect(eventArg.deltX).toBe(20);
  expect(eventArg.deltY).toBe(30)
})

test('treat maxX/maxY correctly', () => {
  const el = getEl();
  new Draggable(el, {
    maxX: 5,
    maxY: 0
  });

  $(el).trigger(startEvent);
  $(window).trigger(moveEvent);

  const trans = el.style.transform;
  expect(trans).toBe('matrix(1,0,0,1,5,0)')
})

test('treat minX/minY correctly', () => {
  const el = getEl();
  new Draggable(el, {
    minX: -5,
    minY: 0
  });

  $(el).trigger(startEvent);
  $(window).trigger(
    $.Event('mousemove', { pageX: -10, pageY: -20 })
  );

  const trans = el.style.transform;
  expect(trans).toBe('matrix(1,0,0,1,-5,0)')
})