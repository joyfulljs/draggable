
const $ = require('jquery');
const { default: Draggable } = require('../dist/index.c');
const jestUtils = require('@joyfulljs/jest-utils');

jestUtils.mockEventBinding();

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

test('trigger onMoving/onStart/onEnd correctly', () => {

  const el = getEl();
  let eventArg = null;

  const onStart = jest.fn();
  const onEnd = jest.fn();

  new Draggable(el, {
    onMoving(e) {
      eventArg = e
    },
    onStart: onStart,
    onEnd: onEnd
  });

  $(el).trigger(startEvent);

  $(window).trigger(moveEvent);

  // test onStart/onMoving called
  expect(onStart).toHaveBeenCalledTimes(1);
  expect(eventArg).not.toBeNull();

  // test onMoving arguments is given correctly
  expect(eventArg.deltX).toBe(10);
  expect(eventArg.deltY).toBe(10);
  expect(eventArg.totalDeltX).toBe(10);
  expect(eventArg.totalDeltY).toBe(10)

  $(window).trigger(moveEvent2);
  expect(eventArg.deltX).toBe(10);
  expect(eventArg.deltY).toBe(20);
  expect(eventArg.totalDeltX).toBe(20);
  expect(eventArg.totalDeltY).toBe(30);

  // test onEnd called
  $(el).trigger($.Event('mouseup'));
  expect(onEnd).toHaveBeenCalledTimes(1);
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


// test('treat stay correctly', () => {
//   const el = getEl();
//   new Draggable(el, {
//     stay: true
//   });

//   $(el).trigger(startEvent);
//   $(window).trigger(
//     $.Event('mousemove', { pageX: 10, pageY: 20 })
//   );

//   const trans = el.style.transform;
//   expect(trans).toBe('')
// })