// ===== XinDrive Router — Hash-based SPA Router =====
import Store from './store.js';

const Router = {
  routes: {},
  currentPage: null,
  _beforeEach: null,

  // --- Register routes ---
  register(path, loader) {
    this.routes[path] = loader;
  },

  // --- Start listening ---
  start() {
    window.addEventListener('hashchange', () => this._resolve());
    this._resolve();
  },

  // --- Navigate ---
  navigate(path) {
    window.location.hash = '#' + path;
  },

  // --- Get current path ---
  current() {
    return window.location.hash.slice(1) || '/login';
  },

  // --- Parse route params ---
  _matchRoute(hash) {
    const path = hash.slice(1) || '/login';

    // Exact match first
    if (this.routes[path]) return { route: path, params: {}, loader: this.routes[path] };

    // Param matching (e.g., /learn/course/:id)
    for (const route of Object.keys(this.routes)) {
      const routeParts = route.split('/');
      const pathParts = path.split('/');
      if (routeParts.length !== pathParts.length) continue;

      const params = {};
      let match = true;
      for (let i = 0; i < routeParts.length; i++) {
        if (routeParts[i].startsWith(':')) {
          params[routeParts[i].slice(1)] = pathParts[i];
        } else if (routeParts[i] !== pathParts[i]) {
          match = false;
          break;
        }
      }
      if (match) return { route, params, loader: this.routes[route] };
    }

    return null;
  },

  // --- Resolve current hash ---
  async _resolve() {
    const hash = window.location.hash || '#/login';
    const user = Store.getUser();

    // Auth guard
    if (!user && hash !== '#/login') {
      this.navigate('/login');
      return;
    }
    if (user && hash === '#/login') {
      this.navigate('/dashboard');
      return;
    }

    const matched = this._matchRoute(hash);
    if (!matched) {
      this.navigate(user ? '/dashboard' : '/login');
      return;
    }

    // Determine pillar
    const path = matched.route;
    if (path.startsWith('/learn')) Store.state.currentPillar = 'learn';
    else if (path.startsWith('/coach')) Store.state.currentPillar = 'coach';
    else if (path.startsWith('/boost')) Store.state.currentPillar = 'boost';
    else Store.state.currentPillar = null;

    // Load and render page
    try {
      const module = await matched.loader();
      const app = document.getElementById('app');
      app.innerHTML = '';

      if (module.render) {
        const content = module.render(matched.params);
        if (typeof content === 'string') {
          app.innerHTML = content;
        } else if (content instanceof HTMLElement) {
          app.appendChild(content);
        }
      }

      if (module.mount) {
        module.mount(matched.params);
      }

      this.currentPage = module;
    } catch (err) {
      console.error('Router error:', err);
    }
  },
};

export default Router;
