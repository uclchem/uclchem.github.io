import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';
import HomepageFeatures from '../components/HomepageFeatures';

function UCLCHEMCMCHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">Chemulator</h1>
        <div className="mybuttons">
          <Link
            className="mybuttons button button--secondary button--lg"
            to="https://github.com/Marcus-Keil/UCLCHEMCMC">
            View on GitHub
          </Link>
          <Link
            className="mybuttons button button--secondary button--lg"
            to="https://github.com/Marcus-Keil/UCLCHEMCMC/zipball/master">
            Get a Zip
          </Link>
            <Link
            className="mybuttons button button--secondary button--lg"
            to="https://github.com/Marcus-Keil/UCLCHEMCMC/tarball/master">
            Get a Tarball
          </Link>
          <Link
            className="mybuttons button button--secondary button--lg"
            to="https://arxiv.org/abs/2202.02343">
              View Article
          </Link>
        </div>
      </div>
    </header>
  );
}

function UCLCHEMCMCDescription() {
  return(
    <div className="mycontainer">
        <h3> A MCMC Inference tool for Physical Parameters of Molecular Clouds </h3>
        <p> UCLCHEMCMC performs a full forward modelling using chemistry and radiative transfer codes in order to calculate observable values which can be directly compared to observations, in order to run a Monte Carlo Markov Chain with a bayesian likelihood function.</p>
        <p> Models created using the tool are stored in a local database in order to increase performance for subsequent inferences using UCLCHEMCMC. </p>
        <p> Publically available, online version in construction for use by researcher, until then, the source code can be downloaded and used locally. </p>
    </div>
  );
}

function UCLCHEMCMCContributors() {
  return(
    <div className="mycontainer">
      <h2> Authors, Contributors </h2>
      <h3> Main author: Marcus Keil  </h3>
      <p> Contributors: S. Viti, and J. Holdship </p>
      <p> You are free to download, modify, and use the code for your work. This project has received funding from the European Union’s Horizon 2020 research and innovation programme under the Marie Sk lodowska-Curie grant agreement No 811312 for the project ”Astro-Chemical Origins” (ACO) as well as from the European Research Council (ERC) under the European Union’s Horizon 2020 research and innovation programme MOPPEX 833460.</p>
    </div>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`UCLCHEMCMC - ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <UCLCHEMCMCHeader />
      <div className="container">
      <UCLCHEMCMCDescription />
      </div>
      <div className="container">

      <UCLCHEMCMCContributors />
      </div>
    </Layout>
  );
}