# Founders photos

This folder is served at `/founders/*` in production.

Drop the founder portraits here:

- `tej-singh.jpg` — referenced from About.tsx as `/founders/tej-singh.jpg`
- `rajath.jpg` — referenced from About.tsx as `/founders/rajath.jpg`

The About page is built to fail gracefully if either file is missing — the image element hides itself and the dark gradient overlay remains, so the page is still presentable while photos are pending.

Recommended:
- 4:5 portrait aspect ratio
- ~1600×2000 px (the layout downscales)
- JPEG, around 85% quality
- Subject's eye-level somewhere in the top third
