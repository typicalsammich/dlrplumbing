# The Invisible Infrastructure — production specification
Current deployed version: a 10.5-second image-based architectural camera animation is rendered and enabled. See README.md for its actual scope. The following document is the future full-3D production specification; no full-3D scene or physical fluid simulation has been produced.

## Art direction
One believable two-story American home at blue hour. Warm occupied interior, restrained landscaping, true material scale and imperfections. The exterior, underground routing, and kitchen must be the same modeled property. Use a single coherent water-supply route to the kitchen. The plumbing explorer on the website is only a simplified educational diagram and is not a layout specification for this film.

## Blender-compatible scene organization
Use collections SITE, HOUSE_SHELL, FOUNDATION, SOIL_SECTION, SUPPLY, DRAIN_WASTE_VENT, KITCHEN, LIGHTS, CAMERA_RIG, REVEAL_MASKS.
Use meters. Reference actual manufacturer dimensions and reviewed construction details. Supply and gravity drainage must remain distinct networks. A plumbing professional should review the layout, pipe sizing, material transitions, slopes, supports, service entries, and penetrations. Do not treat this art plan as a construction design.

Model foundation, soil layers, framing, cabinet clearances, sink, faucet, and penetrations before camera blocking. Set a stable world origin and link the kitchen fixture to the same spatial routing. Build the local cutaway using animated masks/holdouts or geometry visibility driven along the camera path, not uniform whole-house transparency.

Camera: full-frame equivalent roughly 28–40 mm for architectural shots, 50–70 mm for detail. Animate a rig on a spline with continuous position and orientation. Use Bezier easing and a look-at target with no abrupt direction changes. Render consistent motion blur with a restrained shutter. Avoid effects that hide geometry errors.

Materials: physically based copper with fine roughness variation, matte PVC rather than chrome plastic, plausible PEX where appropriate, concrete with scale-correct roughness, and stratified soil. Use measured IOR for water and appropriate roughness, not a glass cylinder as the faucet stream.

Lighting: blue-hour environment, warm interior area sources, practical exterior fixtures, restrained cutaway fill. Blue supply trace is an explanatory overlay, not emission from the actual pipe. Preserve scene exposure through the underground-to-interior move.

## Timeline at 24 fps / approximately 10.5 seconds
Frames 1–48 / 0–2s: 1.6–2m camera height, wide house view, slow dolly forward with very small lateral shift. Warm windows, subtle leaves, real shadows. No branding or navigation.
Frames 49–108 / 2–4.5s: lower toward the foundation. Reveal only a localized architectural section. Lawn remains outside the section; show soil, concrete, service entry, and separate drain route. Expand the cutaway with camera descent.
Frames 109–156 / 4.5–6.5s: track alongside the main supply, showing realistic supports and fittings. Use a short localized inspection section to explain contained water flow. Do not fly through solid pipe.
Frames 157–204 / 6.5–8.5s: rise toward the kitchen through a plausible opening/cutaway. Hide a continuity edit behind a structural foreground surface if required; never visibly clip through walls. Keep direction and pipe endpoints consistent.
Frames 205–252 / 8.5–10.5s: reveal faucet, then believable aerated water into the basin. Small splashes and wet-surface highlights. Settle camera and preserve negative space at left for the headline. Last 18–24 frames must hold the exact final composition for the still/video fade.
Desktop focus: faucet in right third; headline occupies left 50–55%. Test existing 4-line H1 placement with the framing.
Mobile focus: separately author vertical framing preserving each discovery beat; do not derive it by a destructive center crop.

## Water and audio
Use Mantaflow or an equivalent production fluid workflow, or a properly designed mesh/cached liquid simulation that passes close-up realism review. Simulate downward acceleration, aerator breakup, stream contraction, basin contact, restrained secondary droplets, and correct reflection. Review temporal stability frame by frame.
Sound stem: faint outdoor air → low restrained architectural tone → quiet contained supply flow → kitchen room tone → natural faucet. No forced loud score. Website starts muted. Sound control exists only when manifest.hasAudio is true; unmute requires a user click.

## Render and delivery
Render Cycles with sufficient samples for clean metals and water. Adaptive sampling and denoising must preserve detail and temporal consistency. Use a consistent documented color-management transform. Render high-bit-depth EXR masters, then encode the web delivery in display-referred sRGB/Rec.709 consistently. Fix flicker before encoding; do not disguise it with blur.

Deliver:
- entrance-desktop.mp4: H.264 high profile, yuv420p, faststart, 1920x1080 or reviewed desktop aspect, 24 fps, CRF approximately 19–22 as a starting point.
- entrance-desktop.webm: VP9 fallback/alternative, same frames and color.
- entrance-mobile.mp4 and .webm: separately framed 720x1280 or reviewed vertical aspect, 24 fps.
- hero-final-desktop.webp and hero-final-mobile.webp: exported from the EXACT last encoded composition, matching grade and crop.
- optional lossless master stills, audio master, project file, texture licenses, and shot continuity notes.
Aim around 3–6 MB desktop / 1.5–3 MB mobile but prioritize observed quality and ordinary-device playback. These are budgets, not claims about files already produced.

Use ffmpeg faststart for MP4. Example starting point, adjust after visual inspection:
ffmpeg -i master.mov -c:v libx264 -crf 21 -preset slow -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 96k entrance-desktop.mp4
For final stills, ensure the source frame and encoding color transform match. Do not capture a browser screenshot to substitute for the master final frame.

## Integration and acceptance
Replace the stock hero and image preload with the exact final still. Update cinematic-manifest.json paths, enable the sequence, and verify selected desktop/mobile sources before release. Inspect header/hero positioning: the current playback architecture requires final media geometry to match the actual hero rectangle. The video is positioned to the hero rectangle while the intro layer masks navigation; resize exits to the functional static hero. Validate this framing with real footage.
Compare overlay video and still at 50% opacity: edges, reflections, sink, cabinetry, horizon lines, and exposure should remain stable. Match object-fit and object-position at each breakpoint. No black flash, crop jump, layout shift, or inaccessible phone CTA.

Test desktop 1440/1920; tablet 768/1024; mobile 320/375/390/430. Check slow network, failed source, autoplay rejection, image error, storage denial, reduced motion, save-data, repeat visits, rapid skip, keyboard Escape/Tab, pagehide, background/restore, resize/orientation, and refresh. No long-lived scroll lock or audible sound after dismissal.

Creative review must reject floating fittings, impossible drainage, disconnected supply, inconsistent geometry, implausible water, emissive sci-fi pipes, and visible edits. This checklist becomes executable film QA only when actual renders exist.


