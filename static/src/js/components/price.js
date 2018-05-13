import $style     from './price.m-scss';
import $bs        from '@/scss/styles.m-scss';
import {usd}      from "@/js/plugins/filters";
import capitalize from 'lodash/capitalize';

export default {
  functional: true,
  render(h, {props}) {
    const price = props.prices,
      original = usd(price.original),
      size = capitalize(props.size);
    let innerHTML, isSale;
    if (!price.sale || price.original <= price.sale) {
      isSale = false;
      innerHTML = (<span class={$style.originalPrice}>{original}</span>);
    } else {
      isSale = true;
      const sale = usd(price.sale),
        salePercentage = Math.round((price.original - price.sale) * 100 / price.original);
      innerHTML = [
        <span>from&nbsp;</span>,
        <span class={$style.salePrice}>{sale}</span>,
        <span>
          <del class={$style.originalPrice}>{original}</del>
        </span>
      ];
      if (props.hasSale)
        innerHTML.unshift(<span
          class={[$style.salePercentage, $style.badge, $bs.badge, $bs.badgePrimary]}>SALE {salePercentage}%</span>);
    }
    return (<span class={[$style.price, isSale ? $style.sale : null, $style['price' + size]]}>{innerHTML}</span>);
  },
  props: {
    prices: {
      type: Object,
      required: true
    },
    size: {
      type: String,
      default: 'md'
    },
    hasSale: {
      type: Boolean,
      default: true
    }
  }
};
