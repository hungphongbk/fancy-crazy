import Vue from 'vue'

Vue.directive('tooltip', (el, binding) => {
  const {modifiers, value} = binding;
  let placement = 'top';
  if (modifiers.length > 0)
    placement = modifiers[0]
  $(el).tooltip({
    title: value,
    placement
  })
})
