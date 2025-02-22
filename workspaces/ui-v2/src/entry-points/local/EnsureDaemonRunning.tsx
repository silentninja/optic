import React, { FC, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core';
// import * as Sentry from '@sentry/react';

import { Client } from '@useoptic/cli-client';

import { FullPageLoader } from '<src>/components';
import * as SupportLinks from '<src>/constants/SupportLinks';
// const packageJson = require('../../../package.json');
// const uiPackageVersion = packageJson.version;

// TODO remove this and make sure the UI gets the latest side channel version attached when being built
// const trimPrereleaseVersions = (version: string): string =>
//   version.split('-')[0];

export const EnsureDaemonRunning: FC = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [hasMismatchedVersion] = useState(false);

  useEffect(() => {
    (async () => {
      const cliClient = new Client('/api');
      try {
        await cliClient.daemonStatus();
        // TODO - uncomment - there is currently an issue where chrome appears to aggressively cache
        // package.json or some other file where there is version mismatches from the UI - even if
        // the UI is correct - this is unvalidated and only from observations - not quite sure what's happening here
        // if (
        //   trimPrereleaseVersions(version) !==
        //   trimPrereleaseVersions(uiPackageVersion)
        // ) {
        //   Sentry.captureEvent({
        //     message: 'Mismatched UI and daemon versions',
        //     extra: {
        //       uiVersion: uiPackageVersion,
        //       daemonVersion: version,
        //       trimmedUiVersion: trimPrereleaseVersions(uiPackageVersion),
        //       trimmedDaemonVersion: trimPrereleaseVersions(version),
        //     },
        //   });
        //   setHasMismatchedVersions(true);
        // }
        setLoading(false);
      } catch (e) {
        setError(true);
        setLoading(false);
      }
    })();
  }, []);

  return loading ? (
    <FullPageLoader title="loading" />
  ) : hasMismatchedVersion ? (
    <HasMismatchedVersionsError />
  ) : error ? (
    <CliDaemonUnreachableError />
  ) : (
    <>{children}</>
  );
};

const HasMismatchedVersionsError: FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.errorContainer}>
      <h2>Mismatched UI and daemon versions detected</h2>
      <p>
        It appears you are running mismatched versions of the UI and daemon.
      </p>
      <p>
        This can happen when you have old daemon instances running in the
        background when starting a new Optic session.
      </p>
      <p>
        To fix this, you can run <code>api daemon:stop</code> and then rerun{' '}
        <code>api spec</code> or <code>api start</code> to restart the server
      </p>
      <p>
        If this continues to happen, please reach out to{' '}
        <a
          href={SupportLinks.Contact('Optic App has mismatched versions error')}
        >
          our team
        </a>{' '}
        for assistance. Further debug information can be found from our{' '}
        <a href={SupportLinks.DebugLink} target="_blank" rel="noreferrer">
          debugging instructions
        </a>
        .
      </p>
    </div>
  );
};

const CliDaemonUnreachableError: FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.errorContainer}>
      <h2>Error reaching daemon</h2>
      <p>
        It appears the cli daemon is unreachable. This usually means that the
        daemon crashed and needs to be restarted.
      </p>
      <p>
        You can restart the daemon by running <code>api spec</code> or
        <code>api start</code>.
      </p>
      <p>
        If this continues to happen, please reach out to{' '}
        <a href={SupportLinks.Contact('Optic App cli daemon unreachable')}>
          our team
        </a>{' '}
        for assistance. Further debug information can be found from our{' '}
        <a href={SupportLinks.DebugLink} target="_blank" rel="noreferrer">
          debugging instructions
        </a>
        .
      </p>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  errorContainer: {
    display: 'flex',
    margin: 'auto',
    flexDirection: 'column',
    maxWidth: 1000,
    width: '100%',
  },
}));
