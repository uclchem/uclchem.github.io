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
          <ProjectTitle tagline="The first fully 3D code for PDRs" title="3D-PDR" />
          <PromoSection>
            <Button href="https://github.com/uclchem/3D-PDR">View on GitHub</Button>
            <Button href="https://github.com/uclchem/3D-PDR/zipball/master">Get a Zip </Button>
            <Button href="https://github.com/uclchem/3D-PDR/tarball/master">Get a Tarball</Button>
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
              '<p>3D-PDR is a three-dimensional photodissociation region code written in Fortran. It uses the Sundials package (written in C) to solve the '
              +'set of ordinary differential equations and it is the successor of UCL_PDR, a one-dimensional PDR code written at UCL. Using the HEALpix '
              +'ray-tracing scheme, 3D-PDR solves a three-dimensional escape probability routine and evaluates the attenuation of the far-ultraviolet '
              +'radiation in the PDR and the propagation of FIR/submm emission lines out of the PDR.</p>'
              + '<p>The code is parallelized (OpenMP) and can be applied to 1D and 3D problems. The GitHub package includes: the 3D-PDR code, three different '
              +'chemical networks (33, 58, and 128 species) and molecular data, the Sundials solver, and a set of various 1D uniform density clouds and a '
              +'uniform density spherical distribution to test the 3D version of the code. To make 3D-PDR, you will first need to install the Sundials '
              +'package and link 3D-PDR with the ODE solver. Please see the manual for instructions on how to do this step-by-step.</p>'

              +'<p>(Update: 05/05/2019) The file [3dpdr_cr.tgz] that can be found in the main tarball, contains a totally new version of 3D-PDR treating '
              +'cosmic-ray sources. This version was developed by Brandt Gaches [email: bgaches .at. astro.umass.edu] and is presented in Gaches et al. '
              +'(2019, submitted). The tarball contains a short additional manual. The code successfully runs using the ifort compiler '
              +'(for gfortran compilers further tests are need to be done). Please contact Brandt Gaches for any question regarding this version.</P>'

              +'3D-PDR works with the gfortran version 4.8.4 and the ifort version 14.0.4. Later compiler versions may require adjustments in the code. ',
            imageAlign: 'right',
            align:'left',
            title: 'Description',
          },
        ]}
      </Block>

    );

   const UCLPDRDescription = () => (
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
          {
            content:
              '<p>Main author: Thomas G. Bisbas (@tbisbas).<br> Contributors: Serena Viti, Michael J. Barlow, Jeremy Yates, Tom Bell, Brandt Gaches'
              + '<br>You are free to download and use the code for your work provided that you will cite the paper by '
              +'<a href="http://adsabs.harvard.edu/abs/2012MNRAS.427.2100B" target="_blank">T.G. et al., 2012, MNRAS, 427, 2100</a>'
              + '<p> A number of papers have been using 3D-PDR for studying Photodissociation Regions in 1D and 3D:</p>'
            +'<ul>'
            +'<li> <a href="https://ui.adsabs.harvard.edu/abs/2019ApJ...878..105G/abstract" target="_blank">Gaches B.A.L., Offner S.S.R., Bisbas T.G. (2019a)</a>'
            +'<li> <a href="https://ui.adsabs.harvard.edu/abs/2019arXiv190806999G/abstract" target="_blank">Gaches B.A.L., Offner S.S.R., Bisbas T.G. (2019b)</a>'
            +'<li> <a href="http://adsabs.harvard.edu/abs/2019MNRAS.485.3097B" target="_blank">Bisbas T.G., Schruba A., van Dishoeck E.F. (2019)</a>'
            +'<li> <a href="http://adsabs.harvard.edu/abs/2018MNRAS.479.1154B" target="_blank">Banerji M., Jones G.C., Wang J., et al. (2018)</a>'
            +'<li> <a href="http://adsabs.harvard.edu/abs/2018MNRAS.478.1716P" target="_blank">Papadopoulos P.P, Bisbas T.G., Zhang Z-Y (2018)</a>    '
            +'<li> <a href="http://adsabs.harvard.edu/abs/2018MNRAS.478L..54B" target="_blank">Bisbas T.G., Tan J.C., Csengeri T., et al., (2018)</a>'
            +'<li> <a href="http://adsabs.harvard.edu/abs/2017ApJ...850...23B" target="_blank">Bisbas T.G., Tanaka, K.E.I., Tan, J.C. et al., (2017)</a>'
            +'<li> <a href="http://adsabs.harvard.edu/abs/2017ApJ...839...90B" target="_blank">Bisbas T.G., van Dishoeck E.W., Papadopoulos P.P. et al., (2017)</a>'
            +'<li> <a href="http://adsabs.harvard.edu/abs/2017MNRAS.466.2825B" target="_blank">Bothwell M.S., Aguirre J.E., Aravena M., et al., (2017)</a>'
            +'<li> <a href="http://adsabs.harvard.edu/abs/2017MNRAS.464.3315A" target="_blank">Accurso G., Saintoge A., Bisbas T.G. and Viti S., (2016)</a>'
            +'<li> <a href="http://adsabs.harvard.edu/abs/2016MNRAS.457.3593F" target="_blank">Facchini S., Clarke C. and Bisbas T.G. (2016)</a>'
            +'<li> <a href="http://adsabs.harvard.edu/abs/2015MNRAS.454.2828B" target="_blank">Bisbas T.G., Haworth T.J., Barlow M.J., et al., (2015)</a>'
            +'<li> <a href="http://adsabs.harvard.edu/abs/2015ApJ...803...37B" target="_blank">Bisbas T.G., Papadopoulos P.P. and Viti S., (2015)</a>'
            +'<li> <a href="http://adsabs.harvard.edu/abs/2015ApJ...799..235G" target="_blank">Gaches B.A.L., Offner S.S.R., Rosolowsky E.W. and Bisbas T.G., (2015)</a>'
            +'<li> <a href="http://adsabs.harvard.edu/abs/2014MNRAS.440L..81O" target="_blank">Offner S.S.R., Bisbas T.G., Bell T.A. and Viti S. (2014)</a>'
            +'<li> <a href="http://adsabs.harvard.edu/abs/2014MNRAS.443..111B" target="_blank">Bisbas T.G., Bell T.A., Viti S., et al., (2014)</a>'
            +'<li> <a href="http://adsabs.harvard.edu/abs/2013ApJ...770...49O" target="_blank">Offner S.S.R., Bisbas T.G., Viti S. and Bell T.A. (2013)</a>'
            +'</ul>' ,
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
