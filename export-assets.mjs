import sharp from 'file:///C:/Users/panse/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp/dist/index.mjs';
for (const name of ['primary','dark','white','stacked','square','icon','mobile','favicon']) { await sharp('dist/assets/logo-'+name+'.svg').resize({width: name==='favicon'?96:1560}).png().toFile('dist/assets/logo-'+name+'.png'); }
await sharp('dist/assets/kitchen.jpg').resize(900,1200,{fit:'cover',position:'right'}).webp({quality:83}).toFile('dist/assets/kitchen-mobile.webp');
console.log('Eight transparent PNG logos and mobile hero exported.');

