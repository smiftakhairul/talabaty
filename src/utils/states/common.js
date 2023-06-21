import { atom } from "recoil";

export const isHttpLoadingStateAtom = atom({
  key: 'isHttpLoadingStateAtom',
  default: false,
});
export const isLoggedInStateAtom = atom({
  key: 'isLoggedInStateAtom',
  default: false,
});
export const userStateAtom = atom({
  key: 'userStateAtom',
  default: null,
});
export const cartStateAtom = atom({
  key: 'cartStateAtom',
  default: [],
});

export const shopIdStateAtom = atom({
  key: 'shopIdStateAtom',
  default: null,
});

export const orderStateAtom = atom({
  key: 'orderStateAtom',
  default: null,
});
