# siewyan.github.io

Academic homepage of Hoh Siew Yan (何守仁), Associate Professor of Physics at Xiamen University Malaysia.

A static site: plain HTML, Tailwind CSS compiled to one stylesheet, Lucide icons inlined as SVG. There is no build step on GitHub's side; what is in this repository is what gets served.

## Publish on GitHub Pages

1. Create a **public** repository named exactly `SiewYan.github.io` (your GitHub username followed by `.github.io`).
2. Put these files at the **root** of the repository, so that `index.html` sits at the top level and not inside a subfolder.

   With git:

   ```bash
   cd siewyan.github.io
   git init -b main
   git add .
   git commit -m "Initial site"
   git remote add origin https://github.com/SiewYan/SiewYan.github.io.git
   git push -u origin main
   ```

   Or in the browser: open the new repository, choose **Add file → Upload files**, drag in everything inside this folder (including the `assets` and `src` folders), and commit.

3. In the repository, open **Settings → Pages** and check that the source is **Deploy from a branch**, branch `main`, folder `/ (root)`.

The site appears at <https://siewyan.github.io> a minute or two after the push.

## What is in here

```
index.html              the whole page
404.html                shown for any address that does not exist
favicon.svg             browser-tab icon
assets/css/site.css     compiled stylesheet (generated, do not edit by hand)
assets/js/site.js       email assembly and the copy button
assets/img/portrait.jpg hero portrait
src/input.css           stylesheet source (Tailwind directives + custom rules)
tailwind.config.js      Tailwind configuration (fonts, content paths)
package.json            build scripts
.nojekyll               tells GitHub Pages to serve the files as they are
```

## Editing

**Text, publications, grants, courses.** Edit `index.html` directly and push. To add a publication, copy one `<li>` block in the "Selected publications" list, paste it at the top, and change the year, title, link and citation. No rebuild is needed as long as you reuse classes that are already on the page.

**Portrait.** Replace `assets/img/portrait.jpg`. A photo on a plain white background, about 3:4 portrait, works best: the page shows it in greyscale and blends the white into the panel behind it.

**Styling.** If you add Tailwind classes that are not used anywhere else on the page, or change `src/input.css`, rebuild the stylesheet and commit the result:

```bash
npm install      # first time only
npm run build    # writes assets/css/site.css
```

`npm run watch` rebuilds on every save while you work.

**Icons.** Icons are from [Lucide](https://lucide.dev), pasted inline as SVG. To add one, copy its SVG from lucide.dev and give it the same `class` and `stroke-width="1.5"` as the existing ones.

**Email.** The address in the footer is put together by `assets/js/site.js` from the `data-user` and `data-domain` attributes on the link, so it does not sit in the HTML for scrapers. Change those two attributes to change the address.

## If you use a different repository name

A repository with any other name (say `homepage`) is served at `https://siewyan.github.io/homepage/`. The site itself works unchanged there because every path in `index.html` is relative. Only the "Back to the homepage" link in `404.html` needs changing, from `/` to `/homepage/`.
