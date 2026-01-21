# UCLCHEM Documentation Style Guide

**Derived from user writing samples — use this as a reference when writing or reviewing content.**

---

## Target Audience
Computational and observational astrochemists who are comfortable with day-to-day scripting but do not have formal computer-science training.

---

## Voice & Tone

| Attribute | Guideline |
|-----------|-----------|
| **Person** | Use **"we"** when describing the project or walking through steps ("we'll create…", "we recommend…"). Use **"the user"** or **"users"** when referring to them in third person context. Avoid overusing "you". |
| **Tone** | Concise, informative, practical. Not overly casual, but approachable. |
| **Authority** | Confident without being prescriptive — explain *why* a recommendation exists. |
| **Technicality** | Assume familiarity with Python, conda, and basic shell commands. Define domain-specific UCLCHEM terms (e.g., "chemical network", "multi-stage modeling") briefly on first use. |

---

## Sentence Style

- **Length:** Medium-length sentences (15–25 words typical). Avoid long run-ons; break into two sentences when a clause adds a new idea.
- **Structure:** Lead with the action or outcome, then provide context. Example: "Clone the repository from GitHub; pip install will compile UCLCHEM and install it to your local environment."
- **Lists:** Use bullet points for prerequisites or steps; keep each item to one sentence.
- **Code blocks:** Introduce with a brief lead-in sentence ending in a colon or period. Place the block immediately after.

---

## Preferred Phrasing

| Instead of… | Prefer… |
|-------------|---------|
| "you should" | "we recommend" |
| "simply do X" | "X will…" (state the outcome) |
| "click here" | Use descriptive link text |
| "allows you to" | "allows users to" or rephrase ("enables…") |
| Passive ("is compiled") | Active where natural ("pip install compiles…") |

---

## Formatting Conventions

- **Headings:** Sentence case ("Installation on macOS", not "Installation On MacOS").
- **Code/commands:** Use backticks for inline (`pip install .`) and fenced blocks for multi-line.
- **File paths & env names:** Inline code style (`uclchem_osx`, `UCLCHEM/`).
- **Version numbers:** Include "v" for releases in announcements ("UCLCHEM v3.5") but may omit in prose ("UCLCHEM 4.0 introduces…").
- **Links:** Use relative links within the docs site (`/docs/parameters`); full URLs for external resources.

---

## Example Rewrites (aligned to your style)

### Blog post intro
> UCLCHEM 4.0 introduces a new object-oriented programming interface. This allows users to more easily set up multi-stage modelling, provide custom modelling stages, and run large grids of models. In this post we introduce UCLCHEM by showing how to run a basic cloud model.

### Installation snippet
> Clone the repository from GitHub; `pip install` will compile UCLCHEM and install it to your local environment.
> ```bash
> git clone git@github.com:uclchem/uclchem
> cd uclchem
> pip install .
> ```
> We recommend using virtual environments or conda when installing UCLCHEM, since each install can only have a single chemical network compiled into it. For macOS we recommend that users manage their `gfortran` installation via conda (preferably Miniconda or Miniforge).

### Quickstart lead-in
> First, we'll create a simple cloud model and plot the evolution of species abundances over time.

### Release announcement
> UCLCHEM v3.5 released — faster grids, improved API, and updated tutorial notebooks.

---

## Checklist for Content Review

- [ ] Uses "we" for project voice; "users" in third person.
- [ ] Sentences are concise (≤25 words on average).
- [ ] Technical terms defined on first use.
- [ ] Code blocks introduced with a lead-in sentence.
- [ ] Links use descriptive text, not "click here".
- [ ] Consistent heading case and formatting.

---

*Last updated: 17 January 2026*
