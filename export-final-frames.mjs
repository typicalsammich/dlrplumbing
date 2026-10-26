import sharp from 'file:///C:/Users/panse/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp/dist/index.mjs';
for(const variant of ['desktop','mobile'])await sharp('dist/assets/hero-final-'+variant+'.jpg').webp({quality:92}).toFile('dist/assets/hero-final-'+variant+'.webp');
