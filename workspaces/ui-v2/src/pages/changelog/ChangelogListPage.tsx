import React, { FC, useMemo } from 'react';
import {
  RouteComponentProps,
  useHistory,
  useRouteMatch,
} from 'react-router-dom';
import groupBy from 'lodash.groupby';
import classNames from 'classnames';

import {
  CenteredColumn,
  EndpointName,
  Loading,
  PageLayout,
} from '<src>/components';
import { useEndpoints } from '<src>/hooks/useEndpointsHook';
import { Box, List, ListItem, Typography } from '@material-ui/core';
import makeStyles from '@material-ui/styles/makeStyles';
import { useChangelogStyles } from '<src>/pages/changelog/components/ChangelogBackground';
import { IEndpoint } from '<src>/types';

import {
  ChangelogPageAccessoryNavigation,
  ValidateBatchId,
} from './components';

export const ChangelogListPage: FC<
  RouteComponentProps<{
    batchId: string;
  }>
> = (props) => {
  return (
    <PageLayout AccessoryNavigation={ChangelogPageAccessoryNavigation}>
      <ValidateBatchId batchId={props.match.params.batchId}>
        <ChangelogRootPage
          {...props}
          changelogBatchId={props.match.params.batchId}
        />
      </ValidateBatchId>
    </PageLayout>
  );
};

export function ChangelogRootPage(props: { changelogBatchId: string }) {
  const { endpoints, loading } = useEndpoints(props.changelogBatchId);
  const history = useHistory();
  const match = useRouteMatch();

  const grouped = useMemo(() => groupBy(endpoints, 'group'), [endpoints]);
  const tocKeys = Object.keys(grouped).sort();
  const changelogStyles = useChangelogStyles();
  const styles = useStyles();

  if (loading) {
    return <Loading />;
  }

  if (tocKeys.length === 0) {
    return (
      <Box
        display="flex"
        height="100%"
        alignItems="center"
        justifyContent="center"
      >
        <Typography
          variant="h6"
          style={{ fontFamily: 'Ubuntu Mono', marginBottom: '25%' }}
        >
          No endpoints have been documented yet
        </Typography>
      </Box>
    );
  }

  return (
    <CenteredColumn maxWidth="md" style={{ marginTop: 35 }}>
      <List dense>
        {tocKeys.map((tocKey) => {
          return (
            <div key={tocKey}>
              <Typography
                variant="h6"
                style={{ fontFamily: 'Ubuntu Mono', fontWeight: 600 }}
              >
                {tocKey}
              </Typography>
              {grouped[tocKey].map((endpoint: IEndpoint, index: number) => {
                return (
                  <ListItem
                    key={index}
                    button
                    disableRipple
                    disableGutters
                    style={{ display: 'flex' }}
                    onClick={() =>
                      history.push(
                        `${match.url}/paths/${endpoint.pathId}/methods/${endpoint.method}`
                      )
                    }
                    // TODO fetch these changes differently
                    className={classNames({
                      [changelogStyles.added]: endpoint.changelog?.added,
                      [changelogStyles.updated]: endpoint.changelog?.changed,
                    })}
                  >
                    <div style={{ flex: 1 }}>
                      <EndpointName
                        method={endpoint.method}
                        fullPath={endpoint.fullPath}
                        leftPad={6}
                      />
                    </div>
                    <div style={{ paddingRight: 15 }}>
                      <Typography className={styles.smallField}>
                        {endpoint.purpose || 'Unnamed Endpoint'}
                      </Typography>
                    </div>
                  </ListItem>
                );
              })}
            </div>
          );
        })}
      </List>
    </CenteredColumn>
  );
}

const useStyles = makeStyles((theme) => ({
  smallField: {
    fontSize: 12,
    fontWeight: 400,
    fontFamily: 'Ubuntu',
    pointerEvents: 'none',
    color: '#2a2f45',
  },
}));
