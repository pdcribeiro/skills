import van from './third-party/van.js';
import { app } from './app.js';
// import { observeLifecycleEvents } from './utils.js';

// observeLifecycleEvents(document.body);

van.add(document.body, app());
