import React, { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import classNames from 'classnames';
import { Check, Delete as DeleteIcon } from '@material-ui/icons';
import {
  Divider,
  List,
  ListItem,
  Typography,
  makeStyles,
} from '@material-ui/core';

import {
  TwoColumnFullWidth,
  CenteredColumn,
  EndpointName,
  PageLayout,
} from '<src>/components';
import { useDiffReviewPagePendingEndpoint } from '<src>/components/navigation/Routes';

import { useUndocumentedUrls } from '<src>/pages/diffs/hooks/useUndocumentedUrls';
import { useSharedDiffContext } from '<src>/pages/diffs/contexts/SharedDiffContext';
import { AuthorIgnoreRules } from '<src>/pages/diffs/components/AuthorIgnoreRule';
import { FixedSizeList } from 'react-window';
// @ts-ignore
import AutoSizer from 'react-virtualized-auto-sizer';
import { IPendingEndpoint } from '<src>/pages/diffs/contexts/SharedDiffState';
import { useChangelogStyles } from '<src>/pages/changelog/components/ChangelogBackground';
import { useRunOnKeypress } from '<src>/hooks/util';
import { useGroupedEndpoints } from '<src>/hooks/useGroupedEndpoints';
import { DiffAccessoryNavigation } from '<src>/pages/diffs/components/DiffAccessoryNavigation';
import { selectors, useAppSelector } from '<src>/store';
import { IEndpoint } from '<src>/types';

import {
  AddEndpointDiffHeader,
  BulkLearnModal,
  ExistingEndpointNameField,
  PendingEndpointNameField,
  UndocumentedUrl,
} from './components';
import { useCheckboxState } from './hooks';

import { useAnalytics } from '<src>/contexts/analytics';
import { PathComponentAuthoring } from '<src>/utils';

export function DiffUrlsPage() {
  const undocumentedUrls = useUndocumentedUrls();
  const history = useHistory();
  const { documentEndpoint } = useSharedDiffContext();
  const diffReviewPagePendingEndpoint = useDiffReviewPagePendingEndpoint();
  const classes = useStyles();
  const analytics = useAnalytics();
  const [showBulkModal, setShowBulkModal] = useState(false);
  const closeBulkModal = useCallback(() => setShowBulkModal(false), []);
  const [selectedUrls, setSelectedUrls] = useState<Set<string>>(new Set());

  const [searchQuery, setSearchQuery] = useState('');
  const [bulkMode, setBulkMode] = useState<boolean>(false);
  const unmatchedUrlLengths = undocumentedUrls.length;
  const visibleUrls = undocumentedUrls.filter((url) =>
    url.path.startsWith(searchQuery)
  );
  const bulkSelectedUrls = undocumentedUrls.filter((url) =>
    selectedUrls.has(url.path + url.method)
  );

  const { checkboxState, toggleSelectAllCheckbox } = useCheckboxState(
    visibleUrls,
    selectedUrls,
    setSelectedUrls
  );

  return (
    <PageLayout AccessoryNavigation={DiffAccessoryNavigation}>
      <TwoColumnFullWidth
        left={
          <>
            <AddEndpointDiffHeader
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              bulkMode={bulkMode}
              setBulkMode={setBulkMode}
              numberOfUnmatchedUrl={unmatchedUrlLengths}
              numberOfVisibleUrls={visibleUrls.length}
              numberOfSelectedUrls={bulkSelectedUrls.length}
              checkboxState={checkboxState}
              toggleSelectAllCheckbox={toggleSelectAllCheckbox}
              setShowBulkModal={setShowBulkModal}
            />
            <div style={{ flex: 1 }}>
              {visibleUrls.length > 0 ? (
                <AutoSizer>
                  {({ height, width }: any) => (
                    <FixedSizeList
                      height={height}
                      width={width}
                      itemSize={47}
                      itemCount={visibleUrls.length}
                      itemKey={(index, data) => {
                        const item = data.undocumentedUrls[index];
                        return item.method + item.path;
                      }}
                      itemData={{
                        handleBulkModeSelection: (
                          path: string,
                          method: string
                        ) => {
                          analytics.userDocumentedEndpoint(false);
                          setSelectedUrls((previousState) => {
                            const key = path + method;
                            const newState = new Set(previousState);
                            newState.has(key)
                              ? newState.delete(key)
                              : newState.add(key);
                            return newState;
                          });
                        },
                        handleSelection: (
                          pattern: string,
                          method: string,
                          pathComponents: PathComponentAuthoring[]
                        ) => {
                          const pendingId = documentEndpoint(
                            pattern,
                            method,
                            pathComponents
                          );
                          analytics.userDocumentedEndpoint(true);
                          const link = diffReviewPagePendingEndpoint.linkTo(
                            pendingId
                          );
                          history.push(link);
                        },
                        undocumentedUrls: visibleUrls,
                        isBulkMode: bulkMode,
                        isSelected: (path: string, method: string) =>
                          selectedUrls.has(`${path}${method}`),
                      }}
                    >
                      {UndocumentedUrl}
                    </FixedSizeList>
                  )}
                </AutoSizer>
              ) : unmatchedUrlLengths === 0 ? (
                <div className={classes.noResultsContainer}>
                  <Check fontSize="large" />
                  All observed endpoints have been documented
                </div>
              ) : (
                <div className={classes.noResultsContainer}>
                  No urls match the current filter
                </div>
              )}
            </div>
            <AuthorIgnoreRules />
          </>
        }
        right={<DocumentationRootPageWithPendingEndpoints />}
      />
      {showBulkModal && (
        <BulkLearnModal
          undocumentedEndpointsToLearn={bulkSelectedUrls}
          closeModal={closeBulkModal}
        />
      )}
    </PageLayout>
  );
}

export function DocumentationRootPageWithPendingEndpoints() {
  const endpoints = selectors.filterRemovedItems(
    useAppSelector((state) => state.endpoints.results.data?.endpoints || [])
  );
  const {
    pendingEndpoints,
    setCommitModalOpen,
    hasDiffChanges,
    discardEndpoint,
  } = useSharedDiffContext();
  const pendingEndpointsToRender = pendingEndpoints.filter((i) => i.staged);
  const classes = useStyles();

  const diffReviewPagePendingEndpoint = useDiffReviewPagePendingEndpoint();
  const groupedEndpoints = useGroupedEndpoints(endpoints);

  const tocKeys = Object.keys(groupedEndpoints).sort();
  const changelogStyles = useChangelogStyles();

  const history = useHistory();
  const onKeyPress = useRunOnKeypress(
    () => {
      if (hasDiffChanges()) {
        setCommitModalOpen(true);
      }
    },
    {
      keys: new Set(['Enter']),
      inputTagNames: new Set(['input']),
    }
  );

  return (
    <CenteredColumn maxWidth="md" style={{ marginTop: 35 }}>
      <List dense onKeyPress={onKeyPress}>
        {pendingEndpointsToRender.length > 0 && (
          <div style={{ paddingBottom: 25 }}>
            <Typography
              variant="subtitle2"
              style={{ fontFamily: 'Ubuntu Mono' }}
            >
              Recently Added
            </Typography>
            {pendingEndpointsToRender.map((endpoint: IPendingEndpoint) => {
              return (
                <ListItem
                  key={endpoint.id}
                  button
                  disableRipple
                  disableGutters
                  style={{ display: 'flex' }}
                  onClick={() =>
                    history.push(
                      diffReviewPagePendingEndpoint.linkTo(endpoint.id)
                    )
                  }
                  className={classNames(
                    changelogStyles.added,
                    classes.endpointRow
                  )}
                >
                  <div className={classes.endpointNameContainer}>
                    <EndpointName
                      method={endpoint.method}
                      fullPath={endpoint.pathPattern}
                      leftPad={6}
                    />
                  </div>
                  <div
                    className={classes.endpointContributionContainer}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <PendingEndpointNameField endpoint={endpoint} />
                    <DeleteIcon
                      onClick={() => {
                        discardEndpoint(endpoint.id);
                      }}
                      fontSize="small"
                    />
                  </div>
                </ListItem>
              );
            })}
            <Divider style={{ marginTop: 15 }} />
          </div>
        )}
        {tocKeys.map((tocKey) => {
          return (
            <div key={tocKey}>
              <Typography
                variant="subtitle2"
                style={{ fontFamily: 'Ubuntu Mono' }}
              >
                {tocKey}
              </Typography>
              {groupedEndpoints[tocKey].map((endpoint: IEndpoint) => {
                return (
                  <ListItem
                    key={endpoint.pathId + endpoint.method}
                    style={{ display: 'flex' }}
                    className={classes.endpointRow}
                  >
                    <div className={classes.endpointNameContainer}>
                      <EndpointName
                        method={endpoint.method}
                        fullPath={endpoint.fullPath}
                        leftPad={6}
                      />
                    </div>
                    <div
                      className={classes.endpointContributionContainer}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExistingEndpointNameField endpoint={endpoint} />
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
  endpointRow: {
    display: 'flex',
    padding: theme.spacing(0, 0.5),
    margin: theme.spacing(0.5, 0),
    '@media (max-width: 1250px)': {
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
  },
  endpointNameContainer: {
    overflowX: 'auto',
    flexGrow: 1,
  },
  endpointContributionContainer: {
    display: 'flex',
    alignItems: 'center',
    paddingRight: 15,
    '@media (max-width: 1250px)': {
      paddingLeft: 20,
    },
  },
  noResultsContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    flexDirection: 'column',
  },
}));
