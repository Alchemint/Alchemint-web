if (process.browser && process.env.NODE_ENV === 'production') {

  // Baidu statistics code
  var _hmt = _hmt || [];
  (function () {
    var hm = document.createElement("script");
    hm.src = "https://hm.baidu.com/hm.js?740101cd212a1290d2a8f38b5321b8bc";
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(hm, s);
  })();


  // Ga statistics code
  (function (i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r;
    i[r] = i[r] || function () {
      (i[r].q = i[r].q || []).push(arguments)
    }, i[r].l = 1 * new Date();
    a = s.createElement(o),
      m = s.getElementsByTagName(o)[0];
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m)
  })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

  ga('create', 'UA-122942337-1', 'auto');


  // Cnzz statistics code
  (function () {
    var hm = document.createElement("script");
    hm.src = "//w.cnzz.com/c.php?id=1274337839&async=1";
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(hm, s);
  })();
}


export default ({app: {router}, store}) => {
  router.afterEach((to, from) => {
    try {
      ga('set', 'page', to.fullPath);
      ga('send', 'pageview');

      window._hmt = window._hmt || [];
      window._hmt.push(['_trackPageview', to.fullPath]);

    } catch (e) {
    }
  })
}


// SEO event tracking code
export function seoEvent(category, action, label, value, nodeid) {
  if (process.env.NODE_ENV === 'production') {
    _czc.push(["_trackEvent", category, action, label, value, nodeid]);
    _hmt.push(['_trackEvent', category, action, label, value, nodeid]);
    ga('send', 'event', category, action, label, value, nodeid);
  }
}
