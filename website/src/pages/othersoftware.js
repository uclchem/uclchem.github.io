/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';

function SpectralRadex() {
  return(
    <div className="softwarecontainer">
      <div className="softwarecontainer-div">
      <h2><a href="https://spectralradex.readthedocs.io">SpectralRadex</a></h2>
      <h4>Radex Wrapped</h4>
      <p>SpectralRadex makes use of numpy's F2PY compiler to create a python module. Run RADEX from within your python scripts with no subprocesses, no input files, and no fuss. We've even updated the base code to modern fortran to remove COMMON blocks and prevent any multiprocessing concerns. Use Python dictionaries to set parameters and receive results as pandas dataframes. Check <a href="https://spectralradex.readthedocs.io">our readthedocs</a> for an API guide to the functions we built around the core RADEX functionality.</p>
      <h4>Radex Extended</h4>
      <p>RADEX calculates the excitation temperature of every transition and the optical depth at line centre. SpectralRadex uses this output to generate model spectra by assuming the line profiles are Gaussian with a FWHM given by the linewidth parameter used by RADEX. By simply suppling the frequency values of your spectra, you can fit your data directly without assuming LTE.</p>
      </div>
    </div>
  );
}


function Chemulator() {
  return(
      <div className="softwarecontainer">
      <div className="softwarecontainer-div">
        <h2>  <a href="https://github.com/uclchem/Chemulator">Chemulator</a></h2>
        <h4> Fast, accurate chemistry for hydrodynamical models</h4>
        <p>Chemistry is important to hydrodynamical models as it effectively sets the gas temperature by determining the abundances of important coolants. However, full chemical networks such as those used in <i>UCLCHEM</i> are typically too computationally expensive to include in a hydrodynamical model. Similarly, solving the chemistry in a time dependent way can also be a huge computational burden and equilibrium is often assumed instead.</p>
        <p>Chemulator is a neural network based emulator which can calculate the time dependent temperature and chemical abundances of a gas. This significantly faster than solving the chemical network directly and can be embedded in hydrodynamical models to obtain accurate temperatures without the computational cost of a full chemical and radiative trasfer solver.</p>
        </div>
    </div>
    );
}

function HITS() {
  return(
    <div className="softwarecontainer">
      <div className="softwarecontainer-div">
      <h2><a href="https://uclchem.github.io/hits.html">HITs</a></h2>
      <h4>History Independent Tracers</h4>
      <p>Placeholder.</p>
      </div>
    </div>
  );
}



export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <SpectralRadex />
      <Chemulator />
      <HITS />
    </Layout>
  );
}