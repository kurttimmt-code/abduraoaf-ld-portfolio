# Abduraoaf Sandan — Learning & Development Portfolio

Static HTML/CSS/JavaScript source for https://abduraoafsandan.netlify.app.

This portfolio includes professional case studies, an independently developed AI at Work course, video, instructional design framework, alignment matrix and evaluation strategy. The AI demonstration is not commissioned client work.

**Deploy on Netlify:** Existing site → Project configuration → Continuous deployment → Link repository → `kurttimmt-code/abduraoaf-ld-portfolio` → branch `main`, publish directory `.`; no build command.

**Note:** This repository is public, and contact information and portfolio PDF assets are publicly accessible. Verify all career claims and remove draft labels before recruiter distribution. The original AI explainer is currently embedded; a later Canva video may replace it.

The current deployed portfolio files have been imported into this repository. Future updates should be committed here after Netlify is linked to this GitHub repository.


## GitHub Pages preview (separate from Netlify)

A preview-only GitHub Actions workflow has been configured in
`.github/workflows/pages-preview.yml`.

**One-time setup by the repository owner:** Open
[Settings → Pages](https://github.com/kurttimmt-code/abduraoaf-ld-portfolio/settings/pages)
and change **Build and deployment → Source** to **GitHub Actions**.
Then run the **GitHub Pages — Portfolio preview** workflow from Actions
(or rerun its latest attempt).

Preview URL (after the first successful deployment):
https://kurttimmt-code.github.io/abduraoaf-ld-portfolio/

The workflow runs `scripts/build_pages_preview.py`, copies public static
assets into `_site`, rewrites domain-root URLs for the GitHub Pages project
subdirectory, checks file references, and deploys the result. It does **not**
edit the Netlify source files or deploy to Netlify. Subsequent relevant pushes
to `main` automatically update the preview. GitHub Pages is publicly visible.
