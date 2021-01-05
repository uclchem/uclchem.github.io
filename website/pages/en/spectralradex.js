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
          <ProjectTitle tagline={"A spectral model and RADEX wrap in Python 3"} title="SpectralRadex" />
          <PromoSection>
            <Button href="https://github.com/jonholdship/spectralradex">View on GitHub</Button>
            <Button href="https://github.com/jonholdship/spectralradex/zipball/master">Get a Zip </Button>
            <Button href="https://github.com/jonholdship/spectralradex/tarball/master">Get a Tarball</Button>
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

    const Radex = () => (
      <Block background="light">
        {[
          {
            content:
              '<p>SpectralRadex makes use of numpy\'s F2PY compiler to create a python module. Run RADEX from within your python scripts with no subprocesses, no input files and no fuss. We\'ve even updated the base code to modern fortran to remove COMMON blocks and prevent any multiprocessing concerns. <p> Use Python dictionaries to set parameters and receive results as pandas dataframes. Check our readthedocs for an API guide to the functions we built around the core RADEX functionality',
            image: `${baseUrl}img/undraw_gift1_sgf8.svg`,
            imageAlign: 'right',
            align:'left',
            title: 'RADEX Wrapped',
          },
        ]}
      </Block>
    );

    const SpectralModel = () => (
      <Block >
        {[
          {
            content:
              'RADEX calculates the excitation temperature of every transition and optical depth from line centre. From this, a simple spectral model calculates the intensity at a supplied list of frequencies by assuming the optical depth of each line is .',
            image: `${baseUrl}img/undraw_upgrade_06a0.svg`,
            imageAlign: 'left',
            align:'right',
            title: 'RADEX Extended',
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
          <Radex />
          <SpectralModel />
        </div>
      </div>
    );
  }
}

module.exports = Index;
