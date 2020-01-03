import 'babel-polyfill';
import Vue from 'vue';
import App from './App';
import store from './store';

import 'common/stylus/index.styl';

import router from './router';
import fastclick from 'fastclick';
import VueLazyLoad from 'vue-lazyload';

fastclick.attach(document.body);
fastclick.prototype.focus = function(targetElement) {
  var length;
  var isIOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
  // Issue #160: on iOS 7, some input elements (e.g. date datetime month) throw a vague TypeError on setSelectionRange. These elements don't have an integer value for the selectionStart and selectionEnd properties, but unfortunately that can't be used for detection because accessing the properties also throws a TypeError. Just check the type instead. Filed as Apple bug #15122724.
  if (isIOS && targetElement.setSelectionRange && targetElement.type.indexOf('date') !== 0 && targetElement.type !== 'time' && targetElement.type !== 'month') {
    length = targetElement.value.length;
    targetElement.focus();
    targetElement.setSelectionRange(length, length);
  } else {
    targetElement.focus();
  }
};

Vue.use(VueLazyLoad, {
  loading: require('common/image/default.png'),
  error: require('common/image/default.png')
});

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});
