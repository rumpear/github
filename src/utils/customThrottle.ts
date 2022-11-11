type TCustomThrottle = <A>(
  cb: Function,
  time: number
) => (...args: A[]) => void | undefined;

let throttlePause: any;

export const customThrottle = (cb: Function, time: number) => {
  console.log(1);
  // let timerId: number | NodeJS.Timeout | undefined;
  if (throttlePause) {
    return () => {};
  }

  console.log(2);
  throttlePause = true;
  console.log(3);

  const throttle = (...args: any[]) => {
    console.log(args, 'args');
    setTimeout(() => {
      cb(...args);
      throttlePause = false;
    }, time);
  };
  console.log(4);
  return throttle;
};

// export const customThrottle = (cb: Function, time: number) => {
//   if (throttlePause) {
//     return;
//   }
//   throttlePause = true;

//   setTimeout(() => {
//     cb();
//     throttlePause = false;
//   }, time);
// };

function throttle<Args extends unknown[]>(
  fn: (...args: Args) => void,
  cooldown: number
) {
  let lastArgs: Args | undefined;

  const run = () => {
    if (lastArgs) {
      fn(...lastArgs);
      lastArgs = undefined;
    }
  };

  const throttled = (...args: Args) => {
    const isOnCooldown = !!lastArgs;

    lastArgs = args;

    if (isOnCooldown) {
      return;
    }

    window.setTimeout(run, cooldown);
  };

  return throttled;
}
