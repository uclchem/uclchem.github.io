import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';

const FeatureList = [
  {
    title: 'Gas-Grain Chemistry',
    Svg: require('@site/static/img/undraw_react.svg').default,
    description: (
      <>
        Detailed, consistent treatment of chemistry across the gas phase and both the surface and the
        bulk of the ice mantles around dust grains.
      </>
    ),
  },
  {
    title: 'Modular Physics',
    Svg: require('@site/static/img/undraw_operating_system.svg').default,
    description: (
      <>
        Flexible, interchangeable modules to model all kinds of astrophysical objects
         such as molecular clouds, protostellar cores and C/J-type shocks.
      </>
    ),
  },
  {
    title: 'Active Development',
    Svg: require('@site/static/img/undraw_version_control_9bpv.svg').default,
    description: (
      <>
        Teams at UCL and Leiden Observatory are working with international collaborators to
         extend and improve UCLCHEM. Check our [blog](/blog) for recent updates.
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} alt={title} />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
