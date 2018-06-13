import ReviewsIndex from '@settings/pages/Reviews/index.vue';

export default [
  {path: '/', redirect: '/reviews'},
  {
    path: '/reviews',
    name: 'reviews.index',
    component: ReviewsIndex
  }
];
