import React from 'react';

import PreviewPageModal from './Modal';
import { Grid, Link, Typography } from '@material-ui/core';
import { SubtleBlueBackground } from './theme';

const ciProviders = require('../../generate/results/ci-providers');

export function ShowAllCIProviders() {
  return (
    <div style={{ marginTop: 20, marginBottom: 20 }}>
      <Grid
        container
        style={{
          padding: 15,
        }}
      >
        {ciProviders.data.map((i, index) => {
          const Component = ciProviders.components[i.slug] ? (
            ciProviders.components[i.slug].default
          ) : (
            <></>
          );
          return (
            <Grid item xs={12} sm={2}>
              <PreviewPageModal
                key={index}
                link={i.link}
                title={`Collect traffic from ${i.name}`}
                Source={<Component />}
              >
                <img
                  src={'/img/langs/rust.svg'}
                  height={13}
                  style={{ marginRight: 10 }}
                />
                <Typography
                  variant="subtitle2"
                  style={{ fontSize: 17, cursor: 'pointer' }}
                  component={Link}
                >
                  {i.name}
                </Typography>
              </PreviewPageModal>
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
}
