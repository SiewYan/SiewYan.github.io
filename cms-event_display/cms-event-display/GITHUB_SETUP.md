# Upload CMS // Event Display to GitHub

This is the complete portable source export, including the latest ttbar/Higgs channels and Data & fits workspace. The website is static HTML, CSS and JavaScript; no API key, server backend or paid hosting service is required. The bundled Three.js library and its license are included. Hosting-specific identity files and Git history are excluded.

## Upload through GitHub's website

1. Extract this ZIP. Open the extracted `cms-event-display` folder.
2. Create a repository on GitHub, choosing the name and visibility you want.
3. In the repository, choose **Add file → Upload files** (or **uploading an existing file** for an empty repository).
4. Upload the CONTENTS of the extracted folder, so `README.md`, `package.json` and `dist` appear at the repository's top level. Do not upload only the ZIP or wrap everything in an extra directory.
5. Commit the files. The source is now on GitHub.

The optional `.github` directory and `.gitignore` start with dots and may be hidden in your file manager. On macOS, Command–Shift–Period toggles hidden files. Include them if you want the prepared Pages workflow. If web upload omits `.github`, create `.github/workflows/pages.yml` using GitHub's **Add file → Create new file** and copy the supplied workflow into it.

GitHub upload instructions: https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository

## Optional: publish a live site with GitHub Pages

Uploading source does not itself publish the website. To publish:

1. Confirm `.github/workflows/pages.yml` is in the repository's default branch.
2. Open **Settings → Pages** and select **GitHub Actions** as the publishing source.
3. Open **Actions → Publish to GitHub Pages → Run workflow**. Choose the default branch.
4. After the workflow succeeds, open the URL shown by its `github-pages` deployment or in Settings → Pages.

The workflow publishes only `dist/`. Relative asset paths support a repository URL such as `https://YOUR_USERNAME.github.io/cms-event-display/`. This workflow runs only when you request it; run it again after future updates to publish those changes. GitHub Pages availability and site visibility depend on your repository/account settings; the private Sites audience does not carry over to GitHub.

Official Pages workflow documentation: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages

## Run locally

From the extracted folder, run:

```sh
python3 -m http.server 4173 --directory dist
```

Open http://localhost:4173. Serve it over HTTP instead of double-clicking `index.html`, because JavaScript modules need a web server.

With Node.js installed, run the numerical tests:

```sh
node tests.mjs
```

No npm installation or build step is required. Google Fonts is optional; system fonts work if unavailable. Browser sample data stays in local storage and is not part of this export. Starting on a new domain starts a separate sample; use the site's CSV export to preserve existing observations.

Read README.md and PHYSICS_AUDIT.md for physics assumptions and validation limits. The prepared GitHub Pages workflow follows the official documentation but has not been run in your GitHub account.

Exported source commit: 96b7b81b685f71c79ca47921375f6f5be5b82d6e
