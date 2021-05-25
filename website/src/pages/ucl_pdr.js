import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';
import HomepageFeatures from '../components/HomepageFeatures';

function UCLPDRHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">UCLPDR</h1>
        <div className="mybuttons">
          <Link
            className="mybuttons button button--secondary button--lg"
            to="https://github.com/uclchem/uclpdr">
            View on GitHub
          </Link>
          <Link
            className="mybuttons button button--secondary button--lg"
            to="https://github.com/uclchem/uclpdr/zipball/master">
            Get a Zip
          </Link>
            <Link
            className="mybuttons button button--secondary button--lg"
            to="https://github.com/uclchem/uclpdr/tarball/master">
            Get a Tarball
          </Link>
        </div>
      </div>
    </header>
  );
}



function Description() {
  return(
    <div className="mycontainer">
        <p> UCL_PDR is a one dimensional PDR code written in Fortran. It treats UV and X-ray radiation, with the radiation field either one- or two-sided. UCL_PDR can treat arbitrary, user-defined chemical networks, and provided collisional excitation data is available can compute line emission from any included molecular or atomic/ionic species. It can optionally calculate photorates from the wavelength-dependent cross-sections, if these are provided. The GitHub package comes with a selection of model clouds, radiation fields, chemical networks (including and excluding X-ray reactions), molecular cross-sections and collisional rate data for the main coolants in PDRs.</p>
        <p> UCL_PDR uses the Sundials package to solve the chemical network ODEs, and is parallelised with OpenMP. This version is a substantially upgraded version of the original UCL_PDR (Bell et al. 2005, 2006, Bayet et al. 2011), written by Tom Bell and described in Priestley et al. (2017, in press). It currently compiles with ifort and gfortran.</p>
    </div>
  );
}

function Contributors() {
  return(
    <div className="mycontainer">
       <h2>Authors, Contributors and Users</h2>
      <h3>Main author: Tom Bell.</h3>
      <p>Contributors: Felix Priestley, Serena Viti, Michael J. Barlow, Jeremy Yates</p>
      <p>You are free to download, modify, and use the code for your work
    The development of the code has been funded by STFC grants ST/H001794/1 and ST/J001511/1.</p>
    </div>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`UCLPDR - ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <UCLPDRHeader />
      <div className="container">
      <Description />
      </div>
      <div className="container">

      <Contributors />
      </div>
    </Layout>
  );
}