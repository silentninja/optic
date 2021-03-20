import * as React from 'react';
import { NavigationRoute } from '../navigation/NavigationRoute';
import {
  useDiffReviewPageLink,
  useDiffReviewPagePendingEndpoint,
} from '../navigation/Routes';
import { useHistory } from 'react-router-dom';

import { TwoColumnFullWidth } from '../layouts/TwoColumnFullWidth';
import { DocumentationRootPage } from './DocumentationPage';
import { ContributionEditingStore } from '../hooks/edit/Contributions';
import { DiffHeader } from '../diffs/DiffHeader';
import { Box, List, TextField } from '@material-ui/core';
import { useUndocumentedUrls } from '../hooks/diffs/useUndocumentedUrls';
import { UndocumentedUrl } from '../diffs/UndocumentedUrl';
import {
  SharedDiffStore,
  useSharedDiffContext,
} from '../hooks/diffs/SharedDiffContext';
import { AuthorIgnoreRules } from '../diffs/AuthorIgnoreRule';
import { PendingEndpointPageSession } from './PendingEndpointPage';
import { useDebugValue, useEffect, useState } from 'react';
import { useDebounce } from '../hooks/ui/useDebounceHook';

export function DiffReviewPages(props: any) {
  const diffReviewPageLink = useDiffReviewPageLink();
  const diffReviewPagePendingEndpoint = useDiffReviewPagePendingEndpoint();

  return (
    <SharedDiffStore>
      <ContributionEditingStore>
        <NavigationRoute
          path={diffReviewPageLink.path}
          Component={DiffUrlsPage}
          AccessoryNavigation={() => <div></div>}
        />
        <NavigationRoute
          path={diffReviewPagePendingEndpoint.path}
          Component={PendingEndpointPageSession}
          AccessoryNavigation={() => <div></div>}
        />
      </ContributionEditingStore>
    </SharedDiffStore>
  );
}

export function DiffUrlsPage(props: any) {
  const urls = useUndocumentedUrls();
  const history = useHistory();
  const { documentEndpoint } = useSharedDiffContext();
  const diffReviewPagePendingEndpoint = useDiffReviewPagePendingEndpoint();

  const [filteredUrls, setFilteredUrls] = useState(urls);

  const name = `${urls.filter((i) => !i.hide).length} unmatched URLs observed${
    filteredUrls.length !== urls.length
      ? `. Showing ${filteredUrls.length}`
      : ''
  }`;

  return (
    <TwoColumnFullWidth
      left={
        <>
          <DiffHeader name={name}>
            <Box display="flex" flexDirection="row">
              <UrlFilterInput
                onDebouncedChange={(query) => {
                  setFilteredUrls(urls.filter((i) => i.path.startsWith(query)));
                }}
              />
            </Box>
          </DiffHeader>
          <List style={{ paddingTop: 0, overflow: 'scroll' }}>
            {filteredUrls.map((i, index) => (
              <UndocumentedUrl
                {...i}
                key={i.method + i.path}
                onFinish={(pattern, method) => {
                  const pendingId = documentEndpoint(pattern, method);
                  const link = diffReviewPagePendingEndpoint.linkTo(pendingId);
                  setTimeout(() => history.push(link), 500);
                }}
              />
            ))}
          </List>
          <div style={{ flex: 1 }} />
          <AuthorIgnoreRules />
        </>
      }
      right={<DocumentationRootPage />}
    />
  );
}

function UrlFilterInput(props: { onDebouncedChange: (value: string) => void }) {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 600);

  useEffect(() => {
    if (debouncedSearchQuery) {
      props.onDebouncedChange(debouncedSearchQuery);
    }
  }, [debouncedSearchQuery]);

  return (
    <TextField
      size="small"
      value={searchQuery}
      inputProps={{ style: { fontSize: 10, width: 140 } }}
      placeholder="filter urls"
      onChange={(e: any) => {
        const newValue = e.target.value.replace(/\s+/g, '');
        if (!newValue.startsWith('/')) {
          setSearchQuery('/' + newValue);
        } else {
          setSearchQuery(newValue);
        }
      }}
    />
  );
}
