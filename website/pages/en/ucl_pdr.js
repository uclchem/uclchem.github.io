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

class PDRSplash extends React.Component {
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
          <ProjectTitle tagline="" title="UCLPDR" />
          <PromoSection>
            <Button href="https://github.com/uclchem/uclpdr">View on GitHub</Button>
            <Button href="https://github.com/uclchem/uclpdr/zipball/master">Get a Zip </Button>
            <Button href="https://github.com/uclchem/uclpdr/tarball/master">Get a Tarball</Button>
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

   const PDRDescription = () => (
      <Block background="light">
        {[
          {
            content:
            'UCL_PDR is a one dimensional PDR code written in Fortran. It treats UV and X-ray radiation, with the radiation field either one- or two-sided. UCL_PDR can treat '
            +'arbitrary, user-defined chemical networks, and provided collisional excitation data is available can compute line emission from any included molecular or '
            +'atomic/ionic species. It can optionally calculate photorates from the wavelength-dependent cross-sections, if these are provided. The GitHub package comes with a '
            +'selection of model clouds, radiation fields, chemical networks (including and excluding X-ray reactions), molecular cross-sections and collisional rate data for '
            +'the main coolants in PDRs.'
            +'<p>UCL_PDR uses the Sundials package to solve the chemical network ODEs, and is parallelised with OpenMP. This version is a substantially upgraded version of the original '
            +'UCL_PDR (Bell et al. 2005, 2006, Bayet et al. 2011), written by Tom Bell and described in Priestley et al. (2017, in press). It currently compiles with ifort and gfortran',
            imageAlign: 'right',
            align:'left',
            title: 'Description',
          },
        ]}
      </Block>

    );


    const PDRAuthors = () => (

          <Block >
        {[
          {content:
              '<p>Main author: Tom Bell.<br> Contributors: Felix Priestley, Serena Viti, Michael J. Barlow, Jeremy Yates'
              + '<br>You are free to download and use the code for your work'
              +'<br>The development of the code has been funded by STFC grants ST/H001794/1 and ST/J001511/1.',
            imageAlign: 'right',
            align:'left',
            title: 'Authors, Contributors and Users',
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
            title: 'Gas-Grain Chemistry',
          },
          {
            content: 'Flexible, interchangeable modules to model clouds, cores and shocks ',
            image: `${baseUrl}img/undraw_operating_system.svg`,
            imageAlign: 'top',
            title: 'Modular Physics',
          },
          {
            content: 'Teams at UCL and Leiden Observatory are working with international collaborators to extend and improve UCLCHEM.',
            image: `${baseUrl}img/undraw_version_control_9bpv.svg`,
            imageAlign: 'top',
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
        <PDRSplash siteConfig={siteConfig} language={language} />
        <div className="mainContainer">
          <PDRDescription />
          <PDRAuthors />
        </div>
      </div>
    );
  }
}

module.exports = Index;
