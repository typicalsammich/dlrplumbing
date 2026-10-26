# DLR Plumbing Solutions Inc. — current handoff
Updated October 26, 2026.

## Run and edit
Node 22+: npm run build; npm run check; npm run dev (http://127.0.0.1:4173).
Buildless static hosting. No npm install is required for the website. Keep dist/assets tracked: those files are authored source assets.
build.mjs generates the crawlable HTML. city-copy.mjs contains all 52 individually authored location records and official source URLs. cities-geodata.json contains map points; 51 come from the U.S. Census 2025 Gazetteer, and Sun City is a separate Menifee-community locator.

## Current revision
80 HTML pages: 79 indexable pages plus custom 404. All 52 requested cities/communities have a page and a grouped dropdown link. Each page has local utility/context information, a source link, practical plumbing guidance, selected related services, FAQs, nearby location links, and a real local map. Pages request address-level availability; they do not invent DLR offices, arrival times, or verified blanket coverage.

The Service Areas index now uses Leaflet 1.9.4 and live OpenStreetMap tiles, with 52 keyboard-accessible markers, region filtering, global city search, selection updates, zoom controls, attribution, and direct page links. Marker positions locate communities, not dispatch offices or service boundaries. Maps require network access to OpenStreetMap; the complete HTML directory works when tiles or JavaScript are unavailable. Tile requests are disclosed in the Privacy Policy.

Decorative northeast/down arrows have been removed from authored page and browser-generated links. Functional dropdown indicators and map zoom controls remain. The color balance now uses navy, deep blue, slate, and muted blue panels with fewer white sections and restrained red CTAs.

## Actual cinematic
A working 10.5-second image-based architectural camera animation is now integrated and enabled. It is built from two newly generated photorealistic architectural images, not stock footage. It uses a moving camera crop through the exterior/cutaway, an edit to the kitchen, and restrained supply/water highlights. It is NOT a physically simulated continuous 3D flight; the water and scene geometry are not fully dynamic 3D simulations. The full-3D production plan remains in CINEMATIC-PRODUCTION.md.

Desktop: dist/assets/entrance-desktop.mp4 (1440×810, 24 fps, about 5.5 MB).
Mobile: dist/assets/entrance-mobile.mp4 (720×1280, 24 fps, about 2.7 MB), with separately authored framing.
Matching WebP hero images are extracted from the decoded ending of each actual MP4. The video uses the hero rectangle and the same object-fit/crop; it fades over the matching poster during the final hold. The browser starts muted, with no audio track. Skip, Escape, manual Watch the entrance replay, session tracking, reduced-motion/save-data fallbacks, load/stall recovery, visibility cleanup, and scroll unlock are implemented.

The replay button resets scroll to the top. Refreshing or navigating home in the same session does not force another viewing; the replay button starts it explicitly.
Remotion source is in cinematic/src/Composition.tsx and the generated source images are in cinematic/public/. Image generation used the built-in ImageGen tool. Prompts are recorded in ASSET-PROMPTS.md.

## Video rebuild
The Remotion project is separate from the website runtime. Its dependencies are not deployed. From cinematic/, npm ci, then npm run dev to open Studio.
The local Remotion encoder binary failed with write EOF, so the verified render used Remotion JPEG sequences followed by FFmpeg H.264 encoding:
- npx remotion render src/index.ts InvisibleInfrastructureDesktop frames-desktop --sequence --image-format=jpeg --concurrency=2
- npx remotion render src/index.ts InvisibleInfrastructureMobile frames-mobile --sequence --image-format=jpeg --concurrency=2
- ffmpeg -framerate 24 -i frames-desktop/element-%03d.jpeg -c:v libx264 -preset slow -crf 21 -pix_fmt yuv420p -movflags +faststart entrance-desktop.mp4
Use the equivalent mobile paths. Frame 251 is the final frame. Extract it from the encoded video and export the two final WebP images. This host used installed Chrome explicitly for the sequence renderer. Frame sequences and node_modules are ignored; the encoded delivery files are tracked.

## Verification
Build and contract checks: 80 HTML pages, unique H1s/titles, parseable JSON-LD, 52 page destinations in every dropdown, all 11 services, every local reference, all decorative arrows removed, both real videos/posters present, sitemap, and 404.
Browser modules pass syntax checks.
Cinematic fallback unit checks cover disabled config, reduced motion, returning session, save-data, denied storage, fetch failure, and cleanup.
Browser QA in the available narrow viewport verified visible real map tiles and markers, Bonsall search and page navigation, all dropdown destinations, cinematic playback/completion, manual replay, skip, restored navigation, and repeat-visit behavior. The map page has no horizontal overflow in that viewport. Wider desktop layout is implemented but not fully visually tested in this session.

## Existing production inputs
Authentic DLR project photos, verified reviews, and a secure direct-mail form backend are still not supplied. No fabricated customer work or reviews are used. The form accurately prepares an email in the visitor’s mail app; it never claims that delivery occurred. Visitors must press Send in their mail app. A documented HTTPS endpoint integration remains in app.js for later server-side delivery with validation, rate limits, bot protection, and server-held mail credentials.

All existing contact details, license information, logos, resource pages, and service content remain. The site remains owner-private. A public launch or custom domain requires separate audience/domain configuration.

## Mobile playback and original logo update
The header, footer, and favicon now use the supplied original DLR badge, enhanced through ImageGen and exported with a verified transparent alpha channel. The tiny source was cropped at its sides; the enhanced asset reconstructs those edges while preserving its flag, metallic lettering, water motif, and slogan. Download dist/assets/dlr-original-transparent.png for the full-resolution PNG; the site uses an optimized transparent WebP.

The player now attaches the inline video before loading/playing, embeds its configuration in HTML so a Play tap calls video.play() synchronously, recovers from autoplay rejection with a Play button, tolerates height-only browser-toolbar changes, and allows longer mobile loading/stall windows. Reduced motion still uses a static hero. Source and stylesheet URLs are versioned to refresh older mobile caches. The check-cinematic-mobile.mjs regression covers these failure modes. Browser QA confirms the mobile MP4 starts with one tap and skip releases scrolling. This session did not have a physical iPhone Safari device for direct verification.
