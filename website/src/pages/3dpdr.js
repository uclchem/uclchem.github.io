import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';
import HomepageFeatures from '../components/HomepageFeatures';

function PublicationList(){
  return(
    <div className="mycontainer">
      <h2>Authors, Contributors and Users</h2>
      <p>Main author: Thomas G. Bisbas (@tbisbas).</p><p>Contributors: Serena Viti, Michael J. Barlow, Jeremy Yates, Tom Bell, Brandt Gaches</p><p>You are free to download and use the code for your work provided that you will cite the paper by <a href="http://adsabs.harvard.edu/abs/2012MNRAS.427.2100B" target="_blank">Bisbas et al., 2012, MNRAS, 427, 2100</a></p>
      <p> A number of papers have been using 3D-PDR for studying Photodissociation Regions in 1D and 3D:</p>
      <ul>
      <li> <a href="https://ui.adsabs.harvard.edu/abs/2021MNRAS.502.2701B/abstract" target="_blank">Bisbas T.G., Tan J.C., Tanaka K.E.I (2021)</a></li>
      <li> <a href="https://ui.adsabs.harvard.edu/abs/2020PASJ..tmp..187L/abstract" target="_blank">Lim W., Nakamura F., Wu B., Bisbas T.G. et al. (2020)</a></li>
      <li> <a href="https://ui.adsabs.harvard.edu/abs/2019ApJ...878..105G/abstract" target="_blank">Gaches B.A.L., Offner S.S.R., Bisbas T.G. (2019a)</a></li>
      <li> <a href="https://ui.adsabs.harvard.edu/abs/2019arXiv190806999G/abstract" target="_blank">Gaches B.A.L., Offner S.S.R., Bisbas T.G. (2019b)</a></li>
      <li> <a href="http://adsabs.harvard.edu/abs/2019MNRAS.485.3097B" target="_blank">Bisbas T.G., Schruba A., van Dishoeck E.F. (2019)</a></li>
      <li> <a href="http://adsabs.harvard.edu/abs/2018MNRAS.479.1154B" target="_blank">Banerji M., Jones G.C., Wang J., et al. (2018)</a></li>
      <li> <a href="http://adsabs.harvard.edu/abs/2018MNRAS.478.1716P" target="_blank">Papadopoulos P.P, Bisbas T.G., Zhang Z-Y (2018)</a></li>
       <li> <a href="http://adsabs.harvard.edu/abs/2018MNRAS.478L..54B" target="_blank">Bisbas T.G., Tan J.C., Csengeri T., et al., (2018)</a></li>
      <li> <a href="http://adsabs.harvard.edu/abs/2017ApJ...850...23B" target="_blank">Bisbas T.G., Tanaka, K.E.I., Tan, J.C. et al., (2017)</a></li>
      <li> <a href="http://adsabs.harvard.edu/abs/2017ApJ...839...90B" target="_blank">Bisbas T.G., van Dishoeck E.W., Papadopoulos P.P. et al., (2017)</a></li>
      <li> <a href="http://adsabs.harvard.edu/abs/2017MNRAS.466.2825B" target="_blank">Bothwell M.S., Aguirre J.E., Aravena M., et al., (2017)</a></li>
      <li> <a href="http://adsabs.harvard.edu/abs/2017MNRAS.464.3315A" target="_blank">Accurso G., Saintoge A., Bisbas T.G. and Viti S., (2016)</a></li>
      <li> <a href="http://adsabs.harvard.edu/abs/2016MNRAS.457.3593F" target="_blank">Facchini S., Clarke C. and Bisbas T.G. (2016)</a></li>
      <li> <a href="http://adsabs.harvard.edu/abs/2015MNRAS.454.2828B" target="_blank">Bisbas T.G., Haworth T.J., Barlow M.J., et al., (2015)</a></li>
      <li> <a href="http://adsabs.harvard.edu/abs/2015ApJ...803...37B" target="_blank">Bisbas T.G., Papadopoulos P.P. and Viti S., (2015)</a></li>
      <li> <a href="http://adsabs.harvard.edu/abs/2015ApJ...799..235G" target="_blank">Gaches B.A.L., Offner S.S.R., Rosolowsky E.W. and Bisbas T.G., (2015)</a></li>
      <li> <a href="http://adsabs.harvard.edu/abs/2014MNRAS.440L..81O" target="_blank">Offner S.S.R., Bisbas T.G., Bell T.A. and Viti S. (2014)</a></li>
      <li> <a href="http://adsabs.harvard.edu/abs/2014MNRAS.443..111B" target="_blank">Bisbas T.G., Bell T.A., Viti S., et al., (2014)</a></li>
      <li> <a href="http://adsabs.harvard.edu/abs/2013ApJ...770...49O" target="_blank">Offner S.S.R., Bisbas T.G., Viti S. and Bell T.A. (2013)</a></li>
      </ul>
    </div>

    )
}

function THREEDPDRHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">3D-PDR</h1>
        <div className="mybuttons">
          <Link
            className="mybuttons button button--secondary button--lg"
            to="https://github.com/uclchem/3D-PDR">
            View on GitHub
          </Link>
          <Link
            className="mybuttons button button--secondary button--lg"
            to="https://github.com/uclchem/3D-PDR/zipball/master">
            Get a Zip
          </Link>
            <Link
            className="mybuttons button button--secondary button--lg"
            to="https://github.com/uclchem/3D-PDR/tarball/master">
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
      <p>3D-PDR is a three-dimensional photodissociation region code written in Fortran. It uses the <a href="http://computation.llnl.gov/projects/sundials">Sundials package </a>(written in C) to solve the set of ordinary differential equations and it is the successor of UCL_PDR, a one-dimensional PDR code written at UCL. Using the HEALpix ray-tracing scheme, 3D-PDR solves a three-dimensional escape probability routine and evaluates the attenuation of the far-ultraviolet radiation in the PDR and the propagation of FIR/submm emission lines out of the PDR.</p>
      <p>The code is parallelized (OpenMP) and can be applied to 1D and 3D problems. The GitHub package includes: the 3D-PDR code, three different chemical networks (33, 58, and 128 species) and molecular data, the Sundials solver, and a set of various 1D uniform density clouds and a uniform density spherical distribution to test the 3D version of the code. To `make' 3D-PDR, you will first need to install the Sundials package and link 3D-PDR with the ODE solver. Please see the <a href="3DPDR_manual.pdf"> manual </a> for instructions on how to do this step-by-step.</p>    
      <p>(Update: 23/04/2019) The file [3dpdr_cr.tar] that can be found in the main tarball, contains a totally new version of 3D-PDR treating cosmic-ray sources. This version was developed by Brandt Gaches [email: gaches .at. ph1.uni-koeln.de] and is presented in Gaches et al. (2019a). The tarball contains a short additional manual. Please contact Brandt Gaches for any question regarding this version.</p>
      <p>3D-PDR works with the gfortran version 4.8.4 and the ifort version 14.0.4. Later compiler versions may require adjustments in the code.</p>
    </div>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`3D-PDR - ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <THREEDPDRHeader />
      <Description />
      <PublicationList />
    </Layout>
  );
}
