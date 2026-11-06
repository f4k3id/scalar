import { useState } from 'react';

const PREFIX = 'calcbot.';

function readFileStore() {
  try {
    if (typeof window !== 'undefined' && window.scalarStore) {
      const data = window.scalarStore.load();
      if (data && typeof data === 'object') return data;
    }
  } catch {}
  return {};
}

function readLocal(key) {
  try {
    const s = localStorage.getItem(PREFIX + key);
    return s ? JSON.parse(s) : undefined;
  } catch {
    return undefined;
  }
}

function writeLocal(key, val) {
  try { localStorage.setItem(PREFIX + key, JSON.stringify(val)); } catch {}
}

const memory = readFileStore();

function writeFileStore() {
  try {
    if (typeof window !== 'undefined' && window.scalarStore) window.scalarStore.save(memory);
  } catch {}
}

export function usePersist(key, init) {
  const [v, setV] = useState(() => {
    if (Object.prototype.hasOwnProperty.call(memory, key)) return memory[key];
    const fromLocal = readLocal(key);
    if (fromLocal !== undefined) {
      memory[key] = fromLocal;
      writeFileStore();
      return fromLocal;
    }
    return init;
  });

  const setAndSave = (next) => {
    setV((cur) => {
      const val = typeof next === 'function' ? next(cur) : next;
      memory[key] = val;
      writeLocal(key, val);
      writeFileStore();
      return val;
    });
  };

  return [v, setAndSave];
}
