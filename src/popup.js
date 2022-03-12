// Initialize button with user's preferred color
let changeColor = document.getElementById('changeColor');

chrome.storage.sync.get('sizes', (data) => {
  const sizes = JSON.parse(data.sizes);

  let html = '';
  sizes.forEach(function (size) {
    html += `
    <li data-width="${size.width}" data-height="${size.height}">${size.name}</li>`;
  });
  document.getElementById('sizes').innerHTML = html;

  // console.log(
  //   chrome.system.display.getInfo(function (displayInfo) {
  //     displayInfo.forEach(function (info) {
  //       console.log(info.bounds.width, info.bounds.height, info);
  //       //keep apect ratio
  //     });
  //   })
  // );
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

document.addEventListener('pointerdown', function (e) {
  const $li = getLI(e.target);
  if ($li) {
    let height = parseInt($li.dataset.height, 10);
    let width = parseInt($li.dataset.width, 10);

    let maxHeight = 0;
    let maxWidth = 0;
    chrome.system.display.getInfo(function (displayInfo) {
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
      let scale = 1 / Math.max(width / maxWidth, height / maxHeight, 1);

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

// // When the button is clicked, inject setPageBackgroundColor into current page
// changeColor.addEventListener('click', async () => {
//   let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

//   chrome.scripting.executeScript({
//     target: { tabId: tab.id },
//     function: setPageBackgroundColor,
//   });

//   chrome.windows.update(chrome.windows.WINDOW_ID_CURRENT, {
//     width: 1000, //1920,
//     height: 1080,
//   });
// });

// The body of this function will be executed as a content script inside the
// current page
function setPageBackgroundColor() {
  chrome.storage.sync.get('color', ({ color }) => {
    document.body.style.backgroundColor = color;
  });
}
