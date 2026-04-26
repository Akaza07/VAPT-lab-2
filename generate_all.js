const { build } = require('./generator');

// Load configurations
require('./batch1.js');
require('./batch2.js');
require('./batch3.js');
require('./batch4.js');

// Optional: Filter out any duplicates if the user already did SQL Auth and AI Prompt Injection manually.
// We generated those first. We can either overwrite them or leave them. Let's let the builder build.

build();
