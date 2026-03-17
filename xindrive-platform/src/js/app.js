// ===== XinDrive AI Platform — Main Entry =====
import Store from './store.js';
import Router from './router.js';
import { seedDemoStory, isDemoSeeded } from './data/demo-story.js';

// --- Initialize Store & Seed Demo Data ---
Store.init();
if (!isDemoSeeded()) {
  seedDemoStory();
  Store.init(); // re-init to pick up seeded data
}

// --- Register Routes ---

// Auth
Router.register('/login', () => import('./pages/login.js'));

// Dashboard
Router.register('/dashboard', () => import('./pages/dashboard.js'));

// LEARN
Router.register('/learn', () => import('./pages/learn/index.js'));
Router.register('/learn/course/:id', () => import('./pages/learn/course.js'));
Router.register('/learn/progress', () => import('./pages/learn/progress.js'));
Router.register('/learn/manage', () => import('./pages/learn/manage.js'));

// COACH
Router.register('/coach', () => import('./pages/coach/index.js'));
Router.register('/coach/ai', () => import('./pages/coach/ai-coach.js'));
Router.register('/coach/session/:id', () => import('./pages/coach/session.js'));
Router.register('/coach/assessment', () => import('./pages/coach/assessment.js'));

// BOOST
Router.register('/boost', () => import('./pages/boost/index.js'));
Router.register('/boost/customers', () => import('./pages/boost/customers.js'));
Router.register('/boost/pipeline', () => import('./pages/boost/pipeline.js'));
Router.register('/boost/targets', () => import('./pages/boost/targets.js'));

// --- Start Router ---
Router.start();
