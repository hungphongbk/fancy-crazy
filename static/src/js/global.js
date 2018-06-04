// @flow
export const win: () => Window = () => SSR === 'client' ? window : global.window;
