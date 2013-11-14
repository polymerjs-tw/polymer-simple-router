(function (window, document, undefined) {
  'use strict';
  
  document.addEventListener('WebComponentsReady', function () {
    console.log('WebComponentsReady');

    var routes = document.querySelector('app-routes');
    var btn = document.querySelector('.btn');

    routes.addEventListener('routerReady', function () {
      var router = routes.router;

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

  });
})(this, this.document);
