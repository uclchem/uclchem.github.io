import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';
import HomepageFeatures from '../components/HomepageFeatures';

function ChemulatorHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">Chemulator</h1>
        <div className="mybuttons">
          <Link
            className="mybuttons button button--secondary button--lg"
            to="https://github.com/uclchem/Chemulator">
            View on GitHub
          </Link>
          <Link
            className="mybuttons button button--secondary button--lg"
            to="https://github.com/uclchem/Chemulator/zipball/master">
            Get a Zip
          </Link>
            <Link
            className="mybuttons button button--secondary button--lg"
            to="https://github.com/uclchem/Chemulator/tarball/master">
            Get a Tarball
          </Link>
          <Link
            className="mybuttons button button--secondary button--lg"
            to="https://arxiv.org/abs/2106.14789">
              View Article
          </Link>
        </div>
      </div>
    </header>
  );
}

function ChemulatorDescription() {
  return(
    <div className="mycontainer">
        <h3> Fast, accurate chemistry for hydrodynamical models </h3>
        <p> Chemistry is important to hydrodynamical models as it effectively sets the gas temperature by determining the abundances of important coolants. However, full chemical networks such as those used in UCLCHEM are typically too computationally expensive to include in a hydrodynamical model. Similarly, solving the chemistry in a time dependent way can also be a huge computational burden and equilibrium is often assumed instead. </p>
        <p> Chemulator is a neural network based emulator which can calculate the time dependent temperature and chemical abundances of a gas. This significantly faster than solving the chemical network directly and can be embedded in hydrodynamical models to obtain accurate temperatures without the computational cost of a full chemical and radiative trasfer solver. </p>
    </div>
  );
}

function ChemulatorContributors() {
  return(
    <div className="mycontainer">
      <h2> Authors, Contributors </h2>
      <h3> Main author: Jonathan Holdship  </h3>
      <p> Contributors: S. Viti, T. J. Haworth and J. D. Ilee </p>
      <p> You are free to download, modify, and use the code for your work. The development of the code has been funded by STFC grants ST/H001794/1 and ST/J001511/1. </p>
    </div>
  );
}


function EmulchemHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">Emulchem</h1>
        <div className="mybuttons">
          <Link
            className="mybuttons button button--secondary button--lg"
            to="https://github.com/drd13/emulchem">
            View on GitHub
          </Link>
          <Link
            className="mybuttons button button--secondary button--lg"
            to="https://github.com/drd13/emulchem/zipball/master">
            Get a Zip
          </Link>
            <Link
            className="mybuttons button button--secondary button--lg"
            to="https://github.com/drd13/emulchem/tarball/master">
            Get a Tarball
          </Link>
          <Link
            className="mybuttons button button--secondary button--lg"
            to="https://arxiv.org/abs/1907.07472">
              View Article
          </Link>
        </div>
      </div>
    </header>
  );
}

function EmulchemDescription() {
  return(
    <div className="mycontainer">
        <h3> Fast, accurate chemistry for hydrodynamical models </h3>
        <p> A collection of statistical emulators for the UCLCHEM and RADEX astronomical codes. The UCLCHEM emulators can be used to obtain chemical abundances for various molecules under varying physical conditions. The RADEX emulator can be used to estimate the strength of molecular lines. Both emulators are built using neural networks. For more detail on the emulation procedure and its applications, please refer to the associated paper. </p>
    </div>
  );
}

function EmulchemContributors() {
  return(
    <div className="mycontainer">
      <h2> Authors, Contributors </h2>
      <h3> Main author: Damien de Mijolla  </h3>
      <p> Contributors:  Serena Viti, Jonathan Holdship, Ioanna Manolopoulou, Jeremy Yates </p>
      <p> The software is released, as is, under an MIT license. </p>
    </div>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Chemulator - ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <ChemulatorHeader />
      <div className="container">
      <ChemulatorDescription />
      </div>
      <div className="container">

      <ChemulatorContributors />
      </div>

      <EmulchemHeader />
      <div className="container">
      <EmulchemDescription />
      </div>
      <div className="container">

      <EmulchemContributors />
      </div>
    </Layout>
  );
}