const __DEV__ = import.meta.env.DEV;

const logInDevMode = (cb: VoidFunction) => {
  if (__DEV__) {
    cb();
  }
};

export const logging = (...args: Parameters<typeof console.log>) =>
  logInDevMode(() => console.log(...args));
