---
id: dev-web
title: Maintaining the Website
---

We use [Docusaurus](https://docusaurus.io) to maintain our website. The upside is that documentation and blog posts can all be created as simple markdown files. The downside is a slightly convoluted workflow which we explain here.


## Repository Structure

The website is generated from a [dedicated repository](https://github.com/uclchem/uclchem.github.io) which has two branches: **master** and **docusaurus**. Master is the branch from which the website is actually served and it is not to be edited by users. Instead, it is automatically generated from the source code by Docusaurus. **Users modify the docusaurus branch.**

## Setting Up

### Requirements

- You'll need [yarn](https://classic.yarnpkg.com/lang/en/docs/install/#debian-stable) or npm installed to run docusaurus, we'll assume yarn as it's simplest but the [docusaurus docs](https://docusaurus.io/docs) explain how to use either.
- You need to set up github to use SSH keys to authenticate your pushes. [The github docs explain this](https://docs.github.com/en/authentication/connecting-to-github-with-ssh)

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
The docs pages are generated from markdown files in `website/docs`. There's a script in the `utils` directory of the main UCLCHEM repository (`utils/make_python_docs.sh`) to automatically generate the parameters docs, the Python API reference, and the tutorial pages from the code and tutorial files. You need to supply the path to your uclchem.github.io repository to have it automatically move the files there. If you want to add or modify any other docs, you can just create or edit a markdown file.

The only docs that are actually included in the side are those listed in `website/sidebars.json`. There's some structure to it but we define categories in a simple JSON format and then each cateogory has an items list where you can add new pages. If you want to add a completely new category, just compare the category declaration in this file with the docs online. The docs listed in sidebars.json should match the `id` at the top of each markdown file.

### Blog
We're attempting to add a blog post for each publication that uses UCLCHEM. Blog posts are again just markdown files which can be found in `website/blog`. Everything in that directory is included in the blog, the date from the file name is used to order them.

### Main pages
The other pages on the site are either js files in `website/src/pages` or static html files in `website/static`. Docusaurus does not like you to work with the static files so where possible, you should use the js files. We use very simple js where we just put the HTML we would put into a normal webpage into functions and then call the functions in the main part of the file to produce a simple HMTL page. It's best to use existing pages as templates.

## Pushing Changes
Once you've made your edits, you do the following steps:

```bash
# Let docusaurus update the website
USE_SSH=true GIT_USER=gijsvermarien DEPLOYMENT_BRANCH=master yarn deploy

# Push your changes to the docusaurus branch as normal
git add . -A
git commit -m "useful update message"
git push

```
If your github is set up with to use private key authentication and ssh (highly recommended), docusaurus will build the website and push it to master for you when you use yarn deploy. You then push to docusaurus branch as normal to make sure others work from your changes.

If there is a major release, one should make a new version, which can be done using:
```
yarn docusaurus docs:version 3.X
```
Between the patch numbers, the documentation should only change little, so either you can leave the documentation identical, or if changes were made, just supersede the lower patch number and upload the newer documentation. Depending on how many version we support, one can delete older documentation versions or deprecate them.
