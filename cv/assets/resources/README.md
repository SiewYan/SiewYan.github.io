# Add student documents here

Put files into the appropriate course folder: `phy107`, `phy106`, `phy212`, `phy408`, `g0385`, or `general`.

From the website root, run:

```bash
python3 tools/update-resources.py
```

The script updates the Student Resources page with file titles, types, sizes, and working download links. Upload the updated `student-resources.html` and resource files with the website. It uses Python's standard library; nothing needs to be installed.

Use descriptive filenames, for example `Lecture 01 - Introduction.pdf`. Nested folders are supported. Hidden files and unsupported formats are ignored. The `.gitkeep` files simply keep empty course folders in Git and never appear on the resource page.
