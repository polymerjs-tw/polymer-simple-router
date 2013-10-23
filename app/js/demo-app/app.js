(function (window, document, undefined) {
  'use strict';
  
  document.addEventListener('WebComponentsReady', function () {
    console.log('WebComponentsReady');

    var router = document.querySelector('sr-router');
    var btn = document.querySelector('.btn');

    window.router = router;

    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();

      var target = e.target;
      var stateName = target.dataset.state;
      var data = JSON.parse(target.dataset.data || '{}');

      router.go(stateName, data);
    });

    router.addEventListener('sr-state-changed', function () {
      console.log(123);
    });

  });
})(this, this.document);
