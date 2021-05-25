import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';
import HomepageFeatures from '../components/HomepageFeatures';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="mybuttons button button--secondary button--lg"
            to="https://github.com/uclchem/UCLCHEM">
            View on GitHub
          </Link>
          <Link
            className="mybuttons button button--secondary button--lg"
            to="https://github.com/uclchem/UCLCHEM/zipball/master">
            Get a Zip
          </Link>
            <Link
            className="mybuttons button button--secondary button--lg"
            to="https://github.com/uclchem/UCLCHEM/tarball/master">
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
        <p>
        UCLCHEM is a gas-grain chemical code for astrochemical modelling that can be used as a stand alone Fortran program or a Python module. It propagates the abundances of chemical species through a network of user-defined reactions according to the physical conditions of the gas.
        </p>
        <p> 
        Included in the repository is MakeRates, a python script to easily produce all the files related to the chemical network required by UCLCHEM. By combining a reaction list from an astrochemistry database such as UMIST with a custom list of reactions, the user can quickly generate a complex network.
        </p>
        <p>
        UCLCHEM is freely available for use and/or modification for any astrochemical purpose. Please reference <a href="https://doi.org/10.3847/1538-3881/aa773f">our release paper</a> if UCLCHEM is used for work in a publication and feel free to contact us with suggestions, questions or to ask for advice using the code.
        </p>
    </div>
  );
}



export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <HomepageHeader />
      <div className="container">
      <Description />
      </div>
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
