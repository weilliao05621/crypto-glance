const __DEV__ = import.meta.env.DEV;

const logInDevMode = (cb: VoidFunction) => {
  if (__DEV__) {
    cb();
  }
};

export const devLog = (...args: Parameters<typeof console.log>) =>
  logInDevMode(() => console.log(...args));

export const devErrorLog = (...args: Parameters<typeof console.error>) =>
  logInDevMode(() => console.error(...args));
