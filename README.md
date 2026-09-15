# WWU Class Prerequisites

An interactive graph of course prerequisites and corequisites at Walla Walla University, scraped from the
[undergraduate bulletin](https://wallawalla.smartcatalogiq.com/en/current/undergraduate-bulletin/courses/).

**Live site: https://anna-st-40.github.io/wwu-class-prereqs/**

Each node is a course; an arrow points from a prerequisite (or corequisite) to the course that requires it.
Nodes are colored by department prefix. The graph can be panned, zoomed, and dragged.

The current dataset covers 1090 courses across 75 department prefixes: 502 have at least one prerequisite
and 119 have at least one corequisite.

## Notes

- The scraper reads the `current` bulletin, so the data is a snapshot of whenever it was last run —
  it is not updated automatically.
- Prerequisites are taken as a flat list of course codes. The bulletin's "one of A or B" style requirements
  lose that distinction.
- Only edges between courses that both exist in the dataset are drawn.
