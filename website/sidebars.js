module.exports = {
  docs: [
    //Complex category declaration with a link to a generated page that shows the contents of the category
    {
      type: 'category',
      label: 'Getting Started',
      link: {
        type: 'generated-index',
        title: 'Getting Started',
        description: 'Learn to install UCLCHEM, set basic parameters and create your own network',
      },
      items: ["install","network","parameters","pythonapi"],
    },
    //same again for tutorials
    {
      type: 'category',
      label: 'Tutorials',
      link: {
        type: 'generated-index',
        title: 'Tutorials',
        description: "A series of jupyter notebooks demonstrating how to use UCLCHEM are included in the `Tutorials` folder. They are also included here as docs pages.",
      },
      items: ["first_model","modelling_objects","running_a_grid","chemical_analysis"],
    },
    //Simple category declaration with no landing page, you have to pick a subpage
    {"Troubleshooting": ["trouble-compile","trouble-integration"]},
    //complex category declaration where the link takes you to one of the docs
    {
      type: 'category',
      label: 'Physics',
      link: {type: 'doc', id: 'physics-core'},
      items: ["physics-core","physics-cloud","physics-hotcore","physics-shocks","physics-collapse"],
    },
    {
      type: 'category',
      label: 'Chemistry',
      link: {
        type: 'generated-index',
        title: 'Chemistry',
        description: "In these pages, discuss aspects of the chemistry including how different reactions are treated, how the grain surface treatment works and so on.",
      },
      items: ["gas","grain","desorb","bulk"],
    },
    {
      type: 'category',
      label: 'Developer',
      link: {
        type: 'generated-index',
        title: 'Developer Notes',
        description: "These docs are intended for the UCLCHEM team to give knowledge on developing, debugging, and documenting the code. They won't be of interest to many users but if you intend to make modifications to the code, you may find some of it helpful.",
      },
      items: ["dev-overview","dev-python-wrap","dev-debugging","dev-web"],
    },
  ],
};