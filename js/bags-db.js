// Reads bag catalog data from IndexedDB, seeding it from the BAGS array
// (js/bags-data.js) on first run so the site works offline after that.
(() => {
  const DB_NAME = 'niteStudioDB';
  const DB_VERSION = 1;
  const STORE_NAME = 'bags';

  function openDb() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  function getAll(db) {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const req = tx.objectStore(STORE_NAME).getAll();
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  function putAll(db, bags) {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      bags.forEach((bag) => store.put(bag));
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async function getBags(seed) {
    if (!('indexedDB' in window)) return seed;
    try {
      const db = await openDb();
      let bags = await getAll(db);
      if (bags.length === 0 && seed && seed.length) {
        await putAll(db, seed);
        bags = await getAll(db);
      }
      return bags.sort((a, b) => a.num.localeCompare(b.num));
    } catch (err) {
      console.error('BagsDB: falling back to static data', err);
      return seed;
    }
  }

  window.BagsDB = { getBags };
})();
