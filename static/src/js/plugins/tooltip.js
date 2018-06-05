import Vue from 'vue';

if (SSR === 'client') {
  const VTooltip = require('v-tooltip/src/directives/v-tooltip');
  Vue.directive('tooltip', VTooltip);
}
