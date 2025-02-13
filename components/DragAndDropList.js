import van from '../third-party/van.js';

const CLICK_AND_HOLD_TIME = 500;

const { li, ul } = van.tags;

export default function DragAndDropList({ items, onupdate }) {
  console.debug('[DragAndDropList] rendering...')

  let dragTimeout, draggedItem, dragStartY, virtualList, lastCursorY;

  const list = ul({ class: 'list-none p-0' }, items.map((item) => li({
    onpointerdown, onpointerup,
    ontouchstart: preventDefault,
  }, item)));

  return list;

  function onpointerdown(event) {
    dragTimeout = setTimeout(() => {
      dragTimeout = null;
      draggedItem = this;
      draggedItem.style.position = 'relative';
      draggedItem.style.zIndex = '1';
      draggedItem.style.opacity = '0.5';
      dragStartY = event.clientY;
      virtualList = [...list.children];
      lastCursorY = dragStartY;

      document.addEventListener('pointermove', handleDrag);
    }, CLICK_AND_HOLD_TIME);
  }

  function handleDrag(event) {
    const cursorY = event.clientY;
    draggedItem.style.top = `${cursorY - dragStartY}px`;

    virtualList.forEach((li) => {
      const liRect = li.getBoundingClientRect();
      if (li !== draggedItem && cursorY > liRect.top && cursorY < liRect.bottom) {
        handleDragOver(event, li);
      }
    });

    lastCursorY = cursorY;
  }

  function handleDragOver(dragEvent, target) {
    const cursorY = dragEvent.clientY;
    const targetRect = target.getBoundingClientRect();
    const targetCenterY = targetRect.top + targetRect.height / 2;

    const draggedIndex = virtualList.indexOf(draggedItem);
    const targetIndex = virtualList.indexOf(target);

    if (cursorY < targetCenterY && lastCursorY > targetCenterY && draggedIndex > targetIndex) {
      moveVirtualItem(draggedIndex, targetIndex);
      translate(target, draggedItem.offsetHeight);
    } else if (cursorY > targetCenterY && lastCursorY < targetCenterY && draggedIndex < targetIndex) {
      moveVirtualItem(draggedIndex, targetIndex);
      translate(target, -draggedItem.offsetHeight);
    }
  }

  function moveVirtualItem(originalIndex, newIndex) {
    const [movedItem] = virtualList.splice(originalIndex, 1);
    virtualList.splice(newIndex, 0, movedItem);
  }

  function translate(element, displacement) {
    const newIndex = virtualList.indexOf(element);
    const originalIndex = [...list.children].indexOf(element);
    const actualDisplacement = newIndex !== originalIndex ? displacement : 0
    element.style.transition = 'transform 0.5s ease-in-out';
    element.style.transform = `translateY(${actualDisplacement}px)`;
  }

  function onpointerup() {
    if (dragTimeout) {
      clearTimeout(dragTimeout);
      return;
    }

    document.removeEventListener('pointermove', handleDrag);

    const draggedIndex = virtualList.indexOf(draggedItem);
    const listItems = [...list.children];
    const originalIndex = listItems.indexOf(draggedItem);
    const sibling = listItems[draggedIndex];
    if (draggedIndex < originalIndex) {
      sibling.insertAdjacentElement('beforebegin', draggedItem);
    } else if (draggedIndex > originalIndex) {
      sibling.insertAdjacentElement('afterend', draggedItem);
    }

    draggedItem.style.position = 'static';
    draggedItem.style.top = '';
    draggedItem.style.zIndex = '';
    draggedItem.style.opacity = '';
    draggedItem = null;
    virtualList.forEach(resetTranslation);

    if (draggedIndex !== originalIndex) {
      onupdate(originalIndex, draggedIndex);
    }
  }
}

function resetTranslation(element) {
  element.style.transition = '';
  element.style.transform = '';
}

function preventDefault(event) {
  event.preventDefault();
}
