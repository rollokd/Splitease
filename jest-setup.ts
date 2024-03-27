import '@testing-library/jest-dom/jest-globals';

interface ResizeObserverCallback {
  (entries: ResizeObserverEntry[], observer: ResizeObserver): void;
}

class MockResizeObserver {
  private cb: ResizeObserverCallback;

  constructor(cb: ResizeObserverCallback) {
    this.cb = cb;
  }

  observe(target: Element): void {}

  unobserve(target: Element): void {}

  disconnect(): void {}
}

global.ResizeObserver = MockResizeObserver as any;
