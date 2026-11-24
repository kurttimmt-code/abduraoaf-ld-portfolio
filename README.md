# Abduraoaf Sandan: Learning & Development Portfolio

Static HTML/CSS/JavaScript source for https://abduraoafsandan.netlify.app.

This portfolio includes professional case studies, the independently developed AI at Work interactive course, instructional design framework, learning alignment matrix and evaluation strategy.

**Deploy on Netlify:** Existing site → Project configuration → Continuous deployment → Link repository → `kurttimmt-code/abduraoaf-ld-portfolio` → branch `main`, publish directory `.`; no build command.

**Visibility:** This repository and its portfolio content are public. The AI at Work course uses the updated Introduction_to_AI.mp4 video.

The latest portfolio files are maintained in this repository. Netlify and GitHub Pages publish from the repository's `main` branch.


## GitHub Pages preview (separate from Netlify)

A preview-only GitHub Actions workflow has been configured in
`.github/workflows/pages-preview.yml`.

**One-time setup by the repository owner:** Open
[Settings → Pages](https://github.com/kurttimmt-code/abduraoaf-ld-portfolio/settings/pages)
and change **Build and deployment → Source** to **GitHub Actions**.
Then run the **GitHub Pages portfolio preview** workflow from Actions
(or rerun its latest attempt).

Preview URL (after the first successful deployment):
https://kurttimmt-code.github.io/abduraoaf-ld-portfolio/

The workflow runs `scripts/build_pages_preview.py`, copies public static
assets into `_site`, rewrites domain-root URLs for the GitHub Pages project
subdirectory, checks file references, and deploys the result. It does **not**
edit the Netlify source files or deploy to Netlify. Subsequent relevant pushes
to `main` automatically update the preview. GitHub Pages is publicly visible.
