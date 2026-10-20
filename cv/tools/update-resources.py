#!/usr/bin/env python3
"""Regenerate the static student download catalogue from local course folders.

Run from any directory: python3 /path/to/website/tools/update-resources.py
No third-party dependencies or browser-side JavaScript are required.
"""
from pathlib import Path
from html import escape
from urllib.parse import quote
import re

ROOT = Path(__file__).resolve().parents[1]
COURSES = [
    ('phy107', 'PHY107', 'Ordinary Differential Equations'),
    ('phy106', 'PHY106', 'Physics Laboratory II'),
    ('phy212', 'PHY212', 'Physics Laboratory IV'),
    ('phy408', 'PHY408', 'Data Intensive Science'),
    ('g0385', 'G0385', 'From Physics to Finance: Quantitative Finance'),
    ('general', 'GENERAL', 'General study & research resources'),
]
ALLOWED = {'.pdf', '.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx', '.csv',
           '.txt', '.md', '.zip', '.ipynb', '.py', '.c', '.cpp', '.h', '.tex'}
START = '<!-- RESOURCE_CATALOG_START -->'
END = '<!-- RESOURCE_CATALOG_END -->'


def readable_size(size):
    for unit in ('B', 'KB', 'MB', 'GB'):
        if size < 1000 or unit == 'GB':
            return f'{size:.0f} {unit}' if unit == 'B' else f'{size:.1f} {unit}'
        size /= 1000


def catalogue(root=ROOT):
    groups = []
    for folder, code, name in COURSES:
        directory = root / 'assets/resources' / folder
        files = []
        if directory.exists():
            for file in sorted(directory.rglob('*'), key=lambda p: str(p).casefold()):
                # Only index ordinary local documents inside the course directory.
                if file.is_symlink() or not file.is_file() or file.suffix.lower() not in ALLOWED:
                    continue
                if any(part.startswith('.') for part in file.relative_to(directory).parts):
                    continue
                if not file.resolve().is_relative_to(directory.resolve()):
                    continue
                files.append(file)
        groups.append((folder, code, name, files))
    total = sum(len(files) for _, _, _, files in groups)
    if total:
        intro = f'<p class="resources-status">{total} document{"s" if total != 1 else ""} available. Select a course to browse its files.</p>'
    else:
        intro = '<div class="resources-empty"><span class="empty-document" aria-hidden="true">↓</span><div><h2>Course materials are on their way.</h2><p>No documents have been posted yet. Files will appear under each course as they become available.</p></div></div>'
    links = ''.join(f'<a href="#resources-{folder}">{escape(code if folder != "general" else "General")}<span>{len(files)}</span></a>' for folder, code, _, files in groups)
    parts = [intro, f'<nav class="resource-course-links" aria-label="Browse course resources">{links}</nav>']
    for folder, code, name, files in groups:
        n = len(files)
        parts.append(f'<section class="resource-course" id="resources-{folder}" aria-labelledby="heading-{folder}"><div class="resource-course-heading"><div><p class="eyebrow">{escape(code)}</p><h2 id="heading-{folder}">{escape(name)}</h2></div><span class="resource-count">{n} document{"s" if n != 1 else ""}</span></div>')
        if files:
            parts.append('<ul class="resource-file-list">')
            for file in files:
                title = re.sub(r'[_-]+', ' ', file.stem).strip() or file.name
                title = title[:1].upper() + title[1:]
                href = escape(quote(file.relative_to(root).as_posix(), safe='/'), quote=True)
                metadata = f'{file.suffix[1:].upper()} · {readable_size(file.stat().st_size)}'
                parts.append(f'<li><div><h3>{escape(title)}</h3><p>{escape(metadata)}</p></div><a class="resource-download" href="{href}" download="{escape(file.name, quote=True)}" aria-label="Download {escape(title, quote=True)}">Download <span aria-hidden="true">↓</span></a></li>')
            parts.append('</ul>')
        else:
            parts.append('<p class="course-empty">No documents posted yet.</p>')
        parts.append('</section>')
    return '\n'.join(parts), total


def update(root=ROOT):
    page = root / 'student-resources.html'
    source = page.read_text(encoding='utf-8')
    if source.count(START) != 1 or source.count(END) != 1:
        raise ValueError('The page must contain exactly one pair of RESOURCE_CATALOG markers.')
    before, rest = source.split(START, 1)
    _, after = rest.split(END, 1)
    rendered, total = catalogue(root)
    page.write_text(before + START + '\n' + rendered + '\n' + END + after, encoding='utf-8')
    return total


if __name__ == '__main__':
    count = update()
    print(f'Student Resources updated: {count} document(s) across {len(COURSES)} categories.')
