// ==UserScript==
// @name         TOKIMEKI View on Bluesky
// @namespace    https://tokimeki.blue/
// @version      0.1.0
// @description  個別postのメニューにBlueskyで開く項目を追加する
// @author       mudo34
// @match        https://tokimeki.blue/*
// @icon         https://www.google.com/s2/favicons?domain=tokimeki.blue
// @grant        none
// @noframes
// ==/UserScript==

(function() {
  'use strict';
  function onContent(el, e) {
    const copy = el.parentElement.querySelector('.timeline-menu-list__item--copy-url');
    if (!copy) {
      return;
    }
    const jump = copy.cloneNode(true);
    jump.addEventListener('click', openBluesky);
    jump.firstChild.innerHTML = `
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 568 501"
        fill="currentColor"
        aria-hidden="true"
        class="lucide-icon lucide lucide-copy"
      >
        <path d="M123.121 33.6637C188.241 82.5526 258.281 181.681 284 234.873C309.719 181.681 379.759 82.5526 444.879 33.6637C491.866 -1.61183 568 -28.9064 568 57.9464C568 75.2916 558.055 203.659 552.222 224.501C531.947 296.954 458.067 315.434 392.347 304.249C507.222 323.8 536.444 388.56 473.333 453.32C353.473 576.312 301.061 422.461 287.631 383.039C285.169 375.812 284.017 372.431 284 375.306C283.983 372.431 282.831 375.812 280.369 383.039C266.939 422.461 214.527 576.312 94.6667 453.32C31.5556 388.56 60.7778 323.8 175.653 304.249C109.933 315.434 36.0535 296.954 15.7778 224.501C9.94525 203.659 0 75.2916 0 57.9464C0 -28.9064 76.1345 -1.61183 123.121 33.6637Z"/>
      </svg>
      Open Bluesky
    `;
    copy.parentElement.insertBefore(jump, copy.nextSibling);

  }

  function openBluesky(e){
    const item =    e.target.closest('.timeline__item');
    const content = item?.querySelector('.timeline__content');
    const aturi =   content?.getAttribute('data-aturi');

    if (!aturi) {
      return;
    }

    const url = aturi.replace(
      /.+(did:plc:.+)\/app\.bsky\.feed\.post\/(.+)$/,
      'https://bsky.app/profile/$1/post/$2'
    );
    console.log(url);
    
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    a.remove();

    e.target.closest('.timeline__item').querySelector('.timeline-menu-toggle').click();
  }

  function attachEvent(root, type, selector, handler) {
    root.addEventListener(type, e => {
      const el = e.target.closest(selector);
      if (el && root.contains(el)) {
        handler(el, e);
      }
    });
  }
  attachEvent(document, 'click', '.timeline-menu-toggle', onContent);
})();
