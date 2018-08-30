# fancy-crazy

## Yêu cầu
1. Sử dụng thành thạo Vue.js (phiên bản 2.x) và Webpack (phiên bản 3.x)
2. Sử dụng thành thạo Shopify Theme Development

## Đặc tả mã nguồn
### Mã nguồn frontend
1. Shopify theme: không render nhiều, chỉ output ra cây trạng thái dùng cho **Vuex**. Chỉnh sửa mã nguồn Shopify theme, truy cập trực tiếp vào trang admin của Shopify
2. Vue.js theme: trong thư mục `assets-src/src/js`, các thư mục được chia nhỏ rất rõ ràng về chức năng:
  * `pages` các trang chính của web app (index, collection, product, ...). Render page theo biến toàn cục chỉ định rõ trong `theme.liquid` của Shopify theme, chưa có giải pháp sử dụng Vue-router.
  * `fragments` chứa các component thành phần được sử dụng trực tiếp trên các component page
  * `components` chứa các component primitive được sử dụng nhiều lần trong toàn bộ webapp.
  * `store` store và modules của Vuex 
  * `plugins` c

## Thao tac dev & build
1. DEV: npm run app:dev
2. BUILD & DEPLOY: npm run app:deploy
