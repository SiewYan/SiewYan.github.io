# How to edit your academic website

 Most changes need just a text editor, Save, and a browser refresh. This is a plain HTML website; no website builder or package installation is required.

## Quick start

1. Keep a backup of the website folder before a large change.
2. Open the relevant file in a code editor such as VS Code. Do not use Word. If using TextEdit, choose plain text and disable smart quotes.
3. Search (`Cmd+F` on Mac) for the exact heading or sentence you see on the page.
4. Edit, save, and refresh your preview.
5. Upload the changed files to GitHub when ready to publish. Saving locally does not publish your changes.

| What to change | File | Search for |
| --- | --- | --- |
| Introduction, role and profile | `index.html` | The displayed sentence |
| Research themes | `index.html` | `id="research"` |
| Featured papers | `index.html` | `class="publication-list"` |
| Funding and appointments | `index.html` | `id="background"` |
| Teaching | `index.html` | `id="teaching"` |
| Supervision | `index.html` | `id="supervision"` |
| Contact | `index.html` | `id="contact"` |
| Full selected publication list | `publications.html` | `class="publication-list full-list"` |
| Student Resources introduction | `student-resources.html` | The displayed sentence |
| Student documents | `assets/resources/` | The course folder |
| XMUM HEP members and interests | `xmum-hep.html` | The person's name or interest |
| Fonts, colours and spacing | `assets/css/site.css` | The relevant style rule |
| Downloadable CV | `assets/documents/faculty_cv.pdf` | Replace this PDF |
| Downloadable citations | `assets/documents/publications.bib` | The paper's record |

Research, Teaching, Supervision and Contact are sections of the homepage, not separate files.

## The basic editing rule

An entry has an opening and closing tag, for example:

```html
<article class="course">
  <p class="course-code">PHY999 <span>Undergraduate · Physics</span></p>
  <h3>Your course title</h3>
  <p>Your brief course description.</p>
</article>
```

- **Edit:** change the words between tags; keep the tags and `class` values.
- **Add:** copy one complete entry, including its closing tag, beside another entry inside the same list or grid. Replace all copied details.
- **Delete:** remove the complete entry from opening tag to matching closing tag.
- **Reorder:** move the complete entry above or below another in the same list.

`<h3>` is a heading, `<p>` a paragraph, `<a href="…">` a link, and `<img src="…">` an image. Update both a link's destination and its visible text when needed. Keep quotes around paths. Use `&amp;` for an ampersand in HTML text. Copied entries with an `id` need a new, unique ID.

Examples in this guide are templates only; replace sample details before using them.

## 1. Homepage

### Research

Find `id="research"`. Each theme starts with `<article class="research-card"` and ends with `</article>`.

Copy a complete card inside `class="research-grid"` to add a theme. Change its ID, heading, description, evidence bullets and paper link. Update the displayed number. Keep its illustration, or remove the complete `research-symbol` div if you do not want one. To delete a theme, remove the whole article. Each evidence bullet is one `<li>…</li>` inside `class="research-evidence"`.

### Teaching

Find `id="teaching"`. Each current course is one `<article class="course">…</article>` inside `class="courses-grid"`.

Copy a course (or the example above) and edit its code, level, title and description. To delete it, remove its complete article. Keep the surrounding grid. The separate `aside` labelled Earlier teaching can be edited independently.

Current course descriptions are brief drafts; replace them with your preferred or official descriptions. Adding a teaching card does not automatically add a Student Resources category; see section 3.

### Supervision

Find `id="supervision"`, then `class="project-list"`. Each project is one `<li>…</li>`:

```html
<li>
  <p class="project-level">Undergraduate · Ongoing</p>
  <h3>Your project title</h3>
  <p>A short description of the research question and the student's work.</p>
</li>
```

Paste a new entry before the list's closing `</ol>`. Remove a complete entry to delete it. Update the level and status when a project changes. Update the student counts in `class="supervision-summary"`; they do not change automatically.

Earlier mentoring is in `class="mentoring-history"`, with one `<article>…</article>` per period. The student achievement is in `class="student-outcome"`. Edit these separately from current projects.

### Funding, appointments and honours

Find `id="background"`:

| Entry | Block to copy or remove |
| --- | --- |
| Grant | One `<div class="grant">…</div>` |
| Appointment | One `<li>…</li>` inside `<ol class="timeline">` |
| Leadership or honour | Find its wording inside the expandable `<details>` section and edit the corresponding entry |

Update dates, roles and amounts. Keep the grant note accurate: amounts are allocations to your institution. The confirmed TDLI end date is December 2025.

### Profile, portrait, CV and contact

- Replace `assets/img/portrait.jpg` with a new JPG using the same filename. Update its HTML `width` and `height` if the pixel dimensions change. Keep the orbit elements to retain the animation; the existing styling preserves colour and a rectangular frame.
- Replace `assets/documents/faculty_cv.pdf` to update the CV everywhere. Update the homepage's `PDF · 6 pages` label if its length changes.
- For email changes, search all HTML files for the old address. Update both displayed addresses and `mailto:` links, including those on XMUM HEP and Student Resources.
- If your name or role changes, also check the title, description, social-sharing metadata and `application/ld+json` profile data near the top of `index.html`.

## 2. Publications

Open `publications.html`. Each paper is one `<li class="publication" …>…</li>` inside `class="publication-list full-list"`. Copy a paper and change its year, title, authors, citation, link and category:

```html
<li class="publication" data-category="journal">
  <div class="pub-year">2026<span>Journal article</span></div>
  <div>
    <h3><a href="https://doi.org/REPLACE-WITH-DOI">Your paper title <span aria-hidden="true">↗</span></a></h3>
    <p class="citation">Author names · <cite>Journal, volume, article number</cite></p>
  </div>
</li>
```

Use exactly `journal`, `preprint` or `proceedings` for `data-category`, with the matching visible label: Journal article, Preprint or Conference paper. To delete a paper, remove its complete `li`. When a preprint becomes a journal article, revise its existing entry rather than leaving a duplicate. Keep the newest papers first.

After changing the list:

1. Update the total in the introduction, the filter button counts, and the initial `Showing … publications` message in `id="filter-status"`.
2. Update the selected-paper total on `index.html` (search for `21` in the current version).
3. Update the matching record in `assets/documents/publications.bib`.
4. If featured on the homepage, update that separate entry in `index.html` too.

The filter counts visible results after a click, but the introductory counts and homepage selection are maintained manually.

## 3. Student Resources

### Add a document

1. Copy it into the matching folder:

   | Course | Folder |
   | --- | --- |
   | PHY107 | `assets/resources/phy107/` |
   | PHY106 | `assets/resources/phy106/` |
   | PHY212 | `assets/resources/phy212/` |
   | PHY408 | `assets/resources/phy408/` |
   | G0385 | `assets/resources/g0385/` |
   | General | `assets/resources/general/` |

2. Use a clear filename, such as `Lecture 01 - Introduction.pdf`. Its name becomes the displayed title.
3. Open Terminal in the website folder and run:

   ```bash
   python3 tools/update-resources.py
   ```

4. Refresh Student Resources and try the download.
5. Upload both the document and the updated `student-resources.html` when publishing.

The helper needs Python 3.9 or newer and no extra packages. It generates titles, links, file types, sizes and counts. PDFs, Office documents, CSV/text/Markdown, ZIPs, notebooks, Python/C/C++ and LaTeX files are supported. Subfolders, spaces and Chinese filenames work. Hidden files, symlinks and unsupported formats are skipped.

### Replace, rename or delete a document

Overwrite, rename or remove the file, then run the helper again. Publish the updated page and changed files together. When deleting or renaming, also delete the old file on GitHub; uploading the remaining files does not remove old copies. If a download appears outdated, refresh or give the revision a new filename.

### Add or remove a course category

Open `tools/update-resources.py` and find `COURSES`. Each line contains the folder name, displayed code and title. For example:

```python
    ('phy999', 'PHY999', 'Your New Course'),
```

Add the line inside the list, create `assets/resources/phy999/`, add documents and rerun the helper. Use a unique lowercase folder name without spaces. The list order controls the page order. Edit titles here too. To remove a category, remove its line and rerun the helper; separately delete any files you no longer want hosted.

Teaching cards in `index.html` are separate; update them if appropriate.

You can directly edit the introduction and help text in `student-resources.html`. **Do not edit between `RESOURCE_CATALOG_START` and `RESOURCE_CATALOG_END`**: the helper replaces this area. Keep both markers intact.

There is no upload button or student login. Run the helper on your computer; the current GitHub Pages setup does not run it automatically when files are uploaded.

## 4. XMUM HEP

Open `xmum-hep.html`. Find the group: `id="faculty"`, `id="postgraduate"` or `id="undergraduate"`.

Each person is one `<article class="member" …>…</article>`. Copy a complete entry inside the appropriate `member-grid`, then change:

- `data-member` to a unique short label, such as `new-member`.
- Image `src` to the new photo in `assets/img/members/`.
- Image `alt` to the person's name, and `width`/`height` to the photo's actual pixel dimensions.
- Name in `<h3>`, including any Chinese-name span.
- English and Chinese designation paragraphs.

Add the photo file before previewing. Existing styles display colour rectangular portraits. To delete a person, remove their complete article. To move a student between groups, move their article and revise the designation. Only delete an unused photo after checking no other entry uses it.

Update the counts in `class="members-jump-links"` near the top (currently 04, 02 and 05). They do not update automatically. Use official spellings and designations; “Part-time Assistant Professor” currently translates the supplied 兼职助理教授 literally.

For research interests, find `class="group-interests"`. Copy, edit or delete one `<li><span>01</span>Interest name</li>`, then renumber the displayed numbers.

## 5. Navigation, new pages and appearance

The navigation is repeated in `index.html`, `publications.html`, `student-resources.html` and `xmum-hep.html`, inside `<nav id="navigation" …>`. Update all four when adding, deleting or renaming a menu item.

- Homepage section link: `href="#teaching"`.
- Link to that section from another page: `href="index.html#teaching"`.
- Separate-page link: `href="student-resources.html"`.
- Keep Student Resources immediately after Supervision to retain the current order.

To add a page, copy an existing HTML page to a new filename. Keep its header/footer and stylesheet/script links, replace the content inside `<main>…</main>`, and change its title and description. Remove any copied `aria-current="page"` from menu links and apply it only to the new page's link. If copying Student Resources, replace its entire main content, including resource markers. Add the new menu link to every page, including the new one.

To remove a page or homepage section, remove links pointing to it too. Search all HTML files for the deleted filename or section ID. `404.html` is the missing-page screen and has no main navigation.

For fonts, colours and spacing, edit `assets/css/site.css` and check desktop and phone layouts. Content changes usually do not require editing `assets/js/site.js`, which handles the mobile menu and publication filters.

Update the footer's “Updated …” date on all four main pages after a content revision.

## 6. Preview and check

For a quick preview, open `index.html` in your browser. For the local link used during prototyping, open Terminal in the website folder and run:

```bash
python3 -m http.server 8765 --bind 127.0.0.1
```

Visit [http://127.0.0.1:8765/](http://127.0.0.1:8765/). Keep Terminal open; press `Ctrl+C` there to stop the server. If the port is already in use, try the existing preview rather than starting another server. This address works only on your computer.

Save and refresh after editing. Try `Cmd+Shift+R` on Mac if the old version remains visible.

Before uploading:

- Read changed text and check counts and dates.
- Try changed links and downloads; check photographs load.
- Narrow the browser to phone size and try the menu.
- Check copied entries have unique IDs.
- For resources, run the helper and include its updated HTML.

If the layout breaks, undo the last edit and check closing tags and quotes. For missing images or downloads, check the exact filename, uppercase letters and extension (`.jpg` versus `.png`).

## 7. Can I host this from a private GitHub repository?

**Yes. For a personal account, GitHub Pages supports private repositories with GitHub Pro. GitHub Free requires a public repository.** Organization-owned private repositories can use eligible Team or Enterprise plans. [GitHub's plan requirements](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages).

**A private repository does not make the published website private.** Visitors can access its pages, browser-delivered HTML/CSS/JavaScript, photos and downloads. Treat files in the published folder as public, even without a visible link. This includes Student Resources; use your university's authenticated learning platform for restricted materials. [GitHub's publishing guidance](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site).

Restricted-access Pages is a separate feature for eligible organization-owned project sites on Enterprise Cloud. It is not the standard personal private-repository setup. [Private site access rules](https://docs.github.com/en/enterprise-cloud@latest/pages/getting-started-with-github-pages/changing-the-visibility-of-your-github-pages-site).

For your public academic profile, a private repository with GitHub Pro fits if you want repository access restricted while keeping the website public. During private prototyping, keep using the local preview and leave Pages disabled until ready. Rules checked on 19 October 2026; consult the linked documentation for current requirements.

### Publishing when ready

1. Use `siewyan.github.io` as the repository name for `https://siewyan.github.io/`.
2. Upload the **contents** of this website folder. `index.html`, the other pages, `assets/` and `.nojekyll` must be at the repository root, not inside an extra folder. Upload the extracted files, not just the ZIP.
3. In **Settings → Pages**, choose **Deploy from a branch**, select the website branch (usually `main`), choose **/(root)**, and save.
4. Wait for deployment, then use **Visit site** in Pages settings.

Keep `.nojekyll` for static-file hosting. Preserve any existing custom-domain `CNAME` and unrelated repository files. The old Tailwind build files are not needed by this version. For another domain or a project-site subfolder, adjust the homepage social-image URL and leading-slash paths in `404.html`.

For small edits directly on GitHub, open the HTML file, choose Edit, change the content and commit. Changes on the publishing branch trigger deployment. For student resources, prepare the catalogue locally first, then upload the files and generated page together.

This website has been prepared locally; these instructions do not enable publishing.
