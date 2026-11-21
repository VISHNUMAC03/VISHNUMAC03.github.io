# Vishnu Madhav Machineni · Data Engineering Portfolio

My personal portfolio website, built from scratch with plain HTML, CSS and JavaScript (no frameworks, no build step).

**Live site:** https://vishnumac03.github.io/

## Highlights

- **Living pipeline hero:** an animated data pipeline (sources → ingest → transform → warehouse → dashboard) that reacts to your cursor.
- **Latest project spotlight:** the newest project gets its own section right under the hero, with headline results and a link to the case study.
- **Pipeline explorer:** click through the six stages of how I build a pipeline, with tools and real examples from my projects.
- **Skills map:** the modern data engineering stack, filterable by category, searchable, and honestly labelled as *used at work*, *used in projects* or *currently learning*.
- **Project case studies:** problem, data flow, what I built, outcome and stack for each project.
- **SQL playground:** a tiny SQL engine in the browser. Query my résumé with `SELECT`, `WHERE`, `LIKE`, `GROUP BY`, `ORDER BY` and `LIMIT`.
- **Command palette:** press `Ctrl + K` to jump anywhere.
- Light and dark themes, a print-ready one-page résumé, mobile-friendly layout, keyboard accessible, and respects reduced-motion settings.

## Editing content

All content lives in [`assets/js/data.js`](assets/js/data.js). Update a skill, project or job there and every section (including the SQL playground and the printable résumé) updates automatically.

To feature a new project in the spotlight, add it to `projects` and point `spotlight.project` at its `id`.

## Run locally

```bash
python -m http.server 8000
```

Then open http://localhost:8000.

## Contact

vishnumachineni03@gmail.com · [LinkedIn](https://www.linkedin.com/in/vishnu-madhav-16ab6a1a2/) · Data engineering enthusiast, actively looking for full-time roles.
