export type Service = {
  init: () => Promise<void>;
  cleanup: () => Promise<void>;
};
