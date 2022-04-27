---
id: dev-web
title: Maintaining the Website
---

We use [Docusaurus](https://docusaurus.io) to maintain our website. The upside is that documentation and blog posts can all be created as simple markdown files. The downside is a slightly convoluted workflow which we explain here.


## Repository Structure

The website is generated from a [dedicated repository](https://github.com/uclchem/uclchem.github.io) which has two branches: **master** and **docusaurus**. Master is the branch from which the website is actually served and it is not to be edited by users. Instead, it is automatically generated from the source code by Docusaurus. **Users modify the docusaurus branch.**

## Setting Up

### Requirements

- You'll need yarn or npm installed to run docusaurus, we'll assume yarn as it's simplest but the [docusaurus docs](https://docusaurus.io/docs) explain how to use either.
- You need to set up github to use SSH keys to authenticate your pushes.

### Cloning
To get a copy of the website and start looking around, you can do the following:

```bash
git clone git@github.com:uclchem/uclchem.github.io.git
cd uclchem.github.io
git checkout docusaurus
```
which will clone the repository and move to the development branch. The parent directory is not particularly useful, most content is in `website/`, users can run the site locally with:

```bash
cd website
yarn start
```

## Making Changes

### Docs
`website/sidebars.json` has simple lists of the docs pages to be included in the site, `website/docs` holds all the markdown files which are used to generate those pages. The docs listed in sidebars.json should match the `id` at the top of each markdown file. If you want to update the parameters page or a tutorial, you can do this from the UCLCHEM repo using `utils/make_python_docs.sh` which automatically creates the markdown files and moves them to the correct location if  you tell it where your website directory is.

### Blog
We're attempting to add a blog post for each publication that uses UCLCHEM. Everything in `website/blog` is included in the blog, the date from the file name is used to order them.

### Main pages
The other pages on the site are either js files in `website/src/pages` or static html files in `website/static`. Docusaurus does not like you to work with the static files so where possible, you should use the js files. We use very simple js where we just put the HTML we would put into a normal webpage into functions and then call the functions in the main part of the file to produce a simple HMTL page. It's best to use existing pages as templates.

## Pushing Changes
Once you've made your edits, you do the following steps:

```bash
# Let docusaurus update the website
USE_SSH=true GIT_USER=you_username yarn deploy

# Push your changes to the docusaurus branch as normal
git add . -A
git commit -m "useful update message"
git push

```

If your github is set up with to use private key authentication and ssh (highly recommended), docusaurus will build the website and push it to master for you when you use yarn deploy. You then push to docusaurus branch as normal to make sure others work from your changes.