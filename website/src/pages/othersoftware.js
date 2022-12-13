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

function HITS() {
  return(
    <div className="softwarecontainer">
      <div className="softwarecontainer-div">
      <h2><a href="https://uclchem.github.io/hits.html">HITs</a></h2>
      <h4>History Independent Tracers</h4>
      <p>A lot of UCLCHEM work revolves around interpreting molecular observations to understand the underlying physical conditions of some gas. In <a href="https://ui.adsabs.harvard.edu/abs/2022A%26A...658A.103H/abstract">our HITs paper</a>, we describe a method for determining which observations will most constrain parameter of interest.</p>
      <p>As a result of this work, you can use <a href="https://uclchem.github.io/hits.html">our HITs website</a> to plan your own observations. Simply specify the parameter you'd like to measure and it will suggest the molecular transitions that will most constrain that parameter when you try to model it with RADEX and UCLCHEM.</p>
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
      <HITS />
    </Layout>
  );
}