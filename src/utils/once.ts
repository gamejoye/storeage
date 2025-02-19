export function once<T extends (...args: any[]) => any>(func: T): T {
  let firstCall: ReturnType<T>;
  let firstTag = true;
  return function (...args: Parameters<T>) {
    if (firstTag) {
      firstTag = false;
      firstCall = func(...args);
      return firstCall;
    }
    return firstCall;
  } as T;
}
