export function debounce<T extends (...args: any[]) => void>(func: T, wait: number) {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  function debouncedFunction(...args: Parameters<T>) {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func(...args);
    }, wait);
  }

  debouncedFunction.cancel = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return debouncedFunction;
}
