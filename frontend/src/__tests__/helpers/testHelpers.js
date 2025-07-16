import { vi } from 'vitest';
import userEvent from '@testing-library/user-event';

// Helper para simular user events
export const createUser = (options = {}) => userEvent.setup(options);

// Helper para criar mocks de API
export const createApiMock = (data, options = {}) => {
  const { delay = 0, shouldReject = false, status = 200 } = options;
  
  return vi.fn().mockImplementation(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (shouldReject) {
          reject(new Error(data.message || 'API Error'));
        } else {
          resolve({
            ok: status >= 200 && status < 300,
            status,
            json: () => Promise.resolve(data),
          });
        }
      }, delay);
    });
  });
};

export const waitForLoadingToFinish = async () => {
  const { waitForElementToBeRemoved, screen } = await import('@testing-library/react');
  try {
    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i), {
      timeout: 3000,
    });
  } catch (error) {
  }
};

export const resizeWindow = (width, height) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  });
  window.dispatchEvent(new Event('resize'));
};

export const simulateScroll = (element, scrollTop) => {
  element.scrollTop = scrollTop;
  element.dispatchEvent(new Event('scroll'));
};

export const createLocalStorageMock = () => {
  const store = new Map();
  
  return {
    getItem: vi.fn((key) => store.get(key) || null),
    setItem: vi.fn((key, value) => {
      store.set(key, value);
    }),
    removeItem: vi.fn((key) => {
      store.delete(key);
    }),
    clear: vi.fn(() => {
      store.clear();
    }),
    key: vi.fn((index) => {
      const keys = Array.from(store.keys());
      return keys[index] || null;
    }),
    get length() {
      return store.size;
    },
  };
};

export const createFetchMock = (responses = []) => {
  const mockFetch = vi.fn();
  
  responses.forEach((response, index) => {
    mockFetch.mockImplementationOnce(() => {
      if (response.shouldReject) {
        return Promise.reject(new Error(response.error || 'Network error'));
      }
      
      return Promise.resolve({
        ok: response.status >= 200 && response.status < 300,
        status: response.status || 200,
        statusText: response.statusText || 'OK',
        json: () => Promise.resolve(response.data),
        text: () => Promise.resolve(JSON.stringify(response.data)),
      });
    });
  });
  
  return mockFetch;
};

export const expectElementToHaveText = (element, text) => {
  expect(element).toBeInTheDocument();
  expect(element).toHaveTextContent(text);
};

export const expectElementToBeVisible = (element) => {
  expect(element).toBeInTheDocument();
  expect(element).toBeVisible();
};

export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
