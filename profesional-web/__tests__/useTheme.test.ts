import { renderHook, act } from '@testing-library/react';
import { useTheme } from '@/hooks/useTheme';
import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('useTheme hook', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.dataset.theme = '';
  });

  it('should return default theme as olive', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('olive');
  });

  it('should toggle theme from olive to navy', () => {
    const { result } = renderHook(() => useTheme());
    
    act(() => {
      result.current.setTheme('navy');
    });
    
    expect(result.current.theme).toBe('navy');
  });

  it('should persist theme in localStorage', () => {
    const { result } = renderHook(() => useTheme());
    
    act(() => {
      result.current.setTheme('navy');
    });
    
    expect(localStorage.getItem('theme')).toBe('navy');
  });

  it('should apply theme to document element', () => {
    const { result } = renderHook(() => useTheme());
    
    act(() => {
      result.current.setTheme('navy');
    });
    
    expect(document.documentElement.dataset.theme).toBe('navy');
  });
});
