/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');

const MarkdownBlock = CompLibrary.MarkdownBlock; /* Used to read markdown */
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

class HomeSplash extends React.Component {
  render() {
    const {siteConfig, language = ''} = this.props;
    const {baseUrl, docsUrl} = siteConfig;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
    const langPart = `${language ? `${language}/` : ''}`;
    const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;

    const SplashContainer = props => (
      <div className="homeContainer">
        <div className="homeSplashFade">
          <div className="wrapper homeWrapper">{props.children}</div>
        </div>
      </div>
    );

    const Logo = props => (
      <div className="projectLogo">
        <img src={props.img_src} alt="Project Logo" />
      </div>
    );

    const ProjectTitle = props => (
      <h2 className="projectTitle">
        {props.title}
        <small>{props.tagline}</small>
      </h2>
    );

    const PromoSection = props => (
      <div className="section promoSection">
        <div className="promoRow">
          <div className="pluginRowBlock">{props.children}</div>
        </div>
      </div>
    );

    const Button = props => (
      <div className="pluginWrapper buttonWrapper">
        <a className="button" href={props.href} target={props.target}>
          {props.children}
        </a>
      </div>
    );

    return (
      <SplashContainer>
        <div className="inner">
          <ProjectTitle tagline={siteConfig.tagline} title={siteConfig.title} />
          <PromoSection>
            <Button href="https://github.com/uclchem/UCLCHEM">View on GitHub</Button>
            <Button href="https://github.com/uclchem/UCLCHEM/zipball/master">Get a Zip </Button>
            <Button href="https://github.com/uclchem/UCLCHEM/tarball/master">Get a Tarball</Button>
          </PromoSection>
        </div>
      </SplashContainer>
    );
  }
}

class Index extends React.Component {
  render() {
    const {config: siteConfig, language = ''} = this.props;
    const {baseUrl} = siteConfig;

    const Block = props => (
      <Container
        padding={['bottom', 'top']}
        id={props.id}
        background={props.background}>
        <GridBlock
          align="center"
          contents={props.children}
          layout={props.layout}
        />
      </Container>
    );

    const FeatureCallout = () => (
      <div
        className="productShowcaseSection paddingBottom"
        style={{textAlign: 'center'}}>
        <h2>Code Features</h2>
        <MarkdownBlock>These are features of this project</MarkdownBlock>
      </div>
    );

    const TryOut = () => (
      <Block id="try">
        {[
          {
            content:
              'To make your landing page more attractive, use illustrations! Check out ' +
              '[**unDraw**](https://undraw.co/) which provides you with customizable illustrations which are free to use. ' +
              'The illustrations you see on this page are from unDraw.',
            image: `${baseUrl}img/undraw_code_review.svg`,
            imageAlign: 'left',
            align: 'left',
            title: 'Wonderful SVG Illustrations',
          },
        ]}
      </Block>
    );

    const Description = () => (
      <Block background="light">
        {[
          {
            content:
              '<p>UCLCHEM is a gas-grain chemical code for astrochemical modelling that can be used as a stand alone Fortran program or a Python module. It propagates the abundances of chemical species through a network of'+
              ' user-defined reactions according to the physical conditions of the gas.' +
              '<p>Included in the repository is MakeRates, a python script to easily produce all the files related to the chemical network required by UCLCHEM.'+
              ' By combining a reaction list from an astrochemistry database such as UMIST with a custom list of reactions, the user can quickly generate a complex network. </p>'+
              '<p>UCLCHEM is freely available for use and/or modification for any astrochemical purpose. Please reference <a href="https://doi.org/10.3847/1538-3881/aa773f">'+
              'our release paper</a> if UCLCHEM is used for work in a publication and feel free to contact us with suggestions, questions or to ask for advice using the code.<p>',
            image: `${baseUrl}img/undraw_alien_science_nonm.svg`,
            imageAlt: 'An alien handing an astrochemist a vial of astrochemical liquid.',
            imageAlign: 'right',
            align:'left',
            title: 'Description',
          },
        ]}
      </Block>
    );

    const LearnHow = () => (
      <Block background="light">
        {[
          {
            content:
              'Each new Docusaurus project has **randomly-generated** theme colors.',
            image: `${baseUrl}img/undraw_youtube_tutorial.svg`,
            imageAlign: 'right',
            title: 'Randomly Generated Theme Colors',
          },
        ]}
      </Block>
    );

    const Features = () => (
      <Block layout="fourColumn">
        {[
          {
            content: 'Detailed, consistent treatment of chemistry across the gas-phase and a single solid phase.',
            image: `${baseUrl}img/undraw_react.svg`,
            imageAlign: 'top',
            imageAlt: 'An astrochemical model',
            title: 'Gas-Grain Chemistry',
          },
          {
            content: 'Flexible, interchangeable modules to model all kinds of astrophysical objects such as molecular clouds, protostellar cores and C/J-type shocks.',
            image: `${baseUrl}img/undraw_operating_system.svg`,
            imageAlign: 'top',
            imageAlt: 'flexible physics',
            title: 'Modular Physics',
          },
          {
            content: 'Teams at UCL and Leiden Observatory are working with international collaborators to extend and improve UCLCHEM. Check <a href=/blog>our blog for recent updates.</a>',
            image: `${baseUrl}img/undraw_version_control_9bpv.svg`,
            imageAlign: 'top',
            imageAlt: 'developed by astrochemists',
            title: 'Active Development',
          },
        ]}
      </Block>
    );

    const Showcase = () => {
      if ((siteConfig.users || []).length === 0) {
        return null;
      }

      const showcase = siteConfig.users
        .filter(user => user.pinned)
        .map(user => (
          <a href={user.infoLink} key={user.infoLink}>
            <img src={user.image} alt={user.caption} title={user.caption} />
          </a>
        ));

      const pageUrl = page => baseUrl + (language ? `${language}/` : '') + page;

      return (
        <div background="light" className="productShowcaseSection paddingBottom">
          <h2>Who is Using This?</h2>
          <p>This project is used by all these people</p>
          <div className="logos">{showcase}</div>
          <div className="more-users">
            <a className="button" href={pageUrl('users.html')}>
              More {siteConfig.title} Users
            </a>
          </div>
        </div>
      );
    };

    return (
      <div>
        <HomeSplash siteConfig={siteConfig} language={language} />
        <div className="mainContainer">
          <Description />
          <Features />
        </div>
      </div>
    );
  }
}

module.exports = Index;
