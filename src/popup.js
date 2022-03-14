chrome.storage.sync.get('sizes', (data) => {
  const sizes = JSON.parse(data.sizes);

  let html = '';
  sizes.forEach(function (size) {
    html += `
    <li data-width="${size.width}" data-height="${size.height}">${size.name}</li>`;
  });
  document.getElementById('sizes').innerHTML = html;
});

/**
 * Get closest li tag
 * @param {HTMLElement} target
 * @returns
 */
function getLI(target) {
  while (
    target.nodeName.toLowerCase() != 'li' &&
    target.nodeName.toLowerCase() != 'body'
  ) {
    target = target.parentNode;
  }
  if (target.nodeName.toLowerCase() == 'body') {
    return false;
  } else {
    return target;
  }
}

/**
 * Get scale multiplier for given
 * width & height based on display constraint
 * @param {DisplayInfo} displayInfo - browser API display object
 * @param {number} width - desired width
 * @param {number} height - desired height
 * @returns {number} scale multiplier
 */
const getScale = function getScale(displayInfo, width, height) {
  let maxHeight = 0;
  let maxWidth = 0;
  displayInfo.forEach(function (info) {
    const screenWidth = info.bounds.width;
    const screenHeight = info.bounds.height;
    if (screenWidth > maxWidth) {
      maxWidth = screenWidth;
    }
    if (screenHeight > maxHeight) {
      maxHeight = screenHeight;
    }
  });
  return 1 / Math.max(width / maxWidth, height / maxHeight, 1);
};

document.addEventListener('pointerdown', function (e) {
  const $li = getLI(e.target);
  if ($li) {
    let height = parseInt($li.dataset.height, 10);
    let width = parseInt($li.dataset.width, 10);

    chrome.system.display.getInfo(function (displayInfo) {
      const scale = getScale(displayInfo, width, height);
      chrome.windows.getCurrent(function (window) {
        var updateInfo = {
          width: width * scale,
          height: height * scale,
          state: 'normal',
        };
        chrome.windows.update(window.id, updateInfo);
      });
    });
  }
});
