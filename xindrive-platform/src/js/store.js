// ===== XinDrive Store — 狀態管理 + localStorage =====
const STORAGE_KEY = 'xindrive_data';

const Store = {
  _data: {},
  _listeners: {},

  // --- Initialize ---
  init() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { this._data = JSON.parse(saved); } catch { this._data = {}; }
    }
  },

  // --- Persistence ---
  _save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this._data));
  },

  // --- CRUD ---
  get(collection) {
    return this._data[collection] || [];
  },

  set(collection, data) {
    this._data[collection] = data;
    this._save();
    this.emit('change', { collection });
  },

  find(collection, id) {
    return this.get(collection).find(item => item.id === id) || null;
  },

  query(collection, filterFn) {
    return this.get(collection).filter(filterFn);
  },

  add(collection, item) {
    if (!item.id) item.id = crypto.randomUUID();
    if (!item.created_at) item.created_at = new Date().toISOString();
    const arr = this.get(collection);
    arr.push(item);
    this._data[collection] = arr;
    this._save();
    this.emit('change', { collection, action: 'add', item });
    return item;
  },

  update(collection, id, patch) {
    const arr = this.get(collection);
    const idx = arr.findIndex(item => item.id === id);
    if (idx === -1) return null;
    arr[idx] = { ...arr[idx], ...patch, updated_at: new Date().toISOString() };
    this._data[collection] = arr;
    this._save();
    this.emit('change', { collection, action: 'update', item: arr[idx] });
    return arr[idx];
  },

  remove(collection, id) {
    const arr = this.get(collection);
    this._data[collection] = arr.filter(item => item.id !== id);
    this._save();
    this.emit('change', { collection, action: 'remove', id });
  },

  // --- Session State (not persisted to collections) ---
  state: {
    currentUser: null,
    currentPillar: null,
  },

  setUser(user) {
    this.state.currentUser = user;
    localStorage.setItem('xindrive_user', JSON.stringify(user));
    this.emit('auth', { user });
  },

  getUser() {
    if (this.state.currentUser) return this.state.currentUser;
    const saved = localStorage.getItem('xindrive_user');
    if (saved) {
      try {
        this.state.currentUser = JSON.parse(saved);
        return this.state.currentUser;
      } catch { return null; }
    }
    return null;
  },

  logout() {
    this.state.currentUser = null;
    localStorage.removeItem('xindrive_user');
    this.emit('auth', { user: null });
  },

  isSeeded() {
    return this.get('users').length > 0;
  },

  clearAll() {
    this._data = {};
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('xindrive_user');
    this.state.currentUser = null;
  },

  // --- Event System ---
  on(event, callback) {
    if (!this._listeners[event]) this._listeners[event] = [];
    this._listeners[event].push(callback);
    return () => {
      this._listeners[event] = this._listeners[event].filter(cb => cb !== callback);
    };
  },

  emit(event, data) {
    (this._listeners[event] || []).forEach(cb => cb(data));
  },
};

export default Store;
