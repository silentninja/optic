import React, { useEffect, useRef, useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Slide from '@material-ui/core/Slide';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import { useHistory } from '@docusaurus/router';

import { Link, Typography } from '@material-ui/core';
import { SubtleBlueBackground } from './theme';
import KeyConcepts from '../../docs/reference/key-concepts.mdx';
import Document from '../../docs/document/document.mdx';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { MuiThemeProvider } from './MuiIndexPage';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function PreviewPageModal(props) {
  const { Source, link, title, children } = props;

  const history = useHistory();
  const [open, setOpen] = React.useState(props.defaultOpen || false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <MuiThemeProvider>
      <span>
        <span onClick={handleClickOpen}>{children}</span>
        <Dialog
          open={open}
          maxWidth={'md'}
          fullWidth={true}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClose}
        >
          <DialogActions
            style={{
              backgroundColor: SubtleBlueBackground,
              borderBottom: '1px solid #e2e2e2',
              paddingLeft: 10,
            }}
          >
            <Typography
              variant="subtitle1"
              style={{ fontSize: 15, fontWeight: 600 }}
              color="primary"
            >
              {title}
            </Typography>
            <div style={{ flex: 1 }} />
            <Button
              endIcon={<OpenInNewIcon />}
              onClick={() => history.replace(link)}
              style={{ textDecoration: 'none' }}
              color="primary"
            >
              Open as Page
            </Button>
            <Button variant="contained" onClick={handleClose} color="primary">
              Done
            </Button>
          </DialogActions>
          <DialogContent
            style={{ padding: 20, paddingTop: 25, paddingBottom: 400 }}
          >
            {Source}
          </DialogContent>
        </Dialog>
      </span>
    </MuiThemeProvider>
  );
}

export function DemoPageModal(props) {
  const { demoKey, title, children } = props;

  const [value, setValue] = useLocalStorage(props.demoKey, true);
  const [open, setOpen] = React.useState(value);

  const handleClose = () => {
    setOpen(false);
    setValue(false);
  };

  return (
    <div>
      <Button
        size="small"
        color="primary"
        onClick={() => setOpen(true)}
        style={{ marginLeft: -5, marginBottom: 20 }}
      >
        Show Demo
      </Button>
      <Dialog
        open={open}
        maxWidth={'md'}
        fullWidth={true}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
      >
        <DialogActions
          style={{
            backgroundColor: SubtleBlueBackground,
            borderBottom: '1px solid #e2e2e2',
            paddingLeft: 10,
          }}
        >
          <Typography
            variant="subtitle1"
            style={{ fontSize: 15, fontWeight: 600 }}
            color="primary"
          >
            {title}
          </Typography>
          <div style={{ flex: 1 }} />
          <Button onClick={handleClose} color="primary" variant="contained">
            Get Started
          </Button>
        </DialogActions>
        <DialogContent style={{ minHeight: 500, padding: 20 }}>
          {children}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export const PreviewPageModalFakeLink = ({ link, title, source, linkText }) => {
  return (
    <PreviewPageModal link={link} title={title} Source={source}>
      <a style={{ cursor: 'pointer' }}>{linkText}</a>
    </PreviewPageModal>
  );
};

export const CommonLinks = {
  Coverage: () => (
    <PreviewPageModalFakeLink
      linkText={'API Coverage'}
      link={'/reference'}
      title={`Key Concepts`}
      source={<KeyConcepts />}
    />
  ),
  Document: ({ text }) => (
    <PreviewPageModalFakeLink
      linkText={text}
      link={'/document'}
      title={`Document your API with Optic`}
      source={<Document />}
    />
  ),
};
