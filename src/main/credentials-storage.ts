import { safeStorage } from 'electron';
const Store = require('electron-store');

const store = new Store({
  projectName: 'foo',
  encryptionKey: 'key-for-obfuscation',
});

const setItem = (key: string, value: string) => {
  const encryptedValue = value ? safeStorage.encryptString(value).toString('latin1') : '';
  store.set(key, encryptedValue)
}

const getItem = (key: string) => {
  const value = store.get(key)
  if (!value) {
    return '';
  }
  const buffer = Buffer.from(store.get(key), 'latin1');
  return safeStorage.decryptString(buffer);
}

const setCredentials = (token: string, url: string) => {
  setItem('token', token)
  setItem('ac_url', url)
}
const getCredentials = () => {
  return {
    token: getItem('token'),
    ac_url: getItem('ac_url')
  }
}

const clear = () => store.clear()

export { getCredentials, setCredentials, clear }
