import React, { useMemo } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useSharedDiffContext } from '<src>/pages/diffs/contexts/SharedDiffContext';
import {
  useShapeDiffInterpretations,
  useNewBodyDiffInterpretations,
} from '<src>/pages/diffs/hooks/useDiffInterpretations';
import { useAnalytics } from '<src>/contexts/analytics';

export default function ApproveAll(props: { disabled?: boolean }) {
  const [open, setOpen] = React.useState(false);

  const analytics = useAnalytics();
  const { context, approveCommandsForDiff } = useSharedDiffContext();

  const diffsGroupedByEndpoints = context.results.diffsGroupedByEndpoint;
  console.log(diffsGroupedByEndpoints);

  const allShapeDiffs = useMemo(
    () => diffsGroupedByEndpoints.flatMap((i) => i.shapeDiffs),
    [diffsGroupedByEndpoints]
  );
  const allRegionDiffs = useMemo(
    () => diffsGroupedByEndpoints.flatMap((i) => i.newRegionDiffs),
    [diffsGroupedByEndpoints]
  );

  const shapeDiffs = useShapeDiffInterpretations(
    allShapeDiffs,
    context.results.trailValues
  );

  const newRegionDiffs = useNewBodyDiffInterpretations(allRegionDiffs);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    if (shapeDiffs.loading || newRegionDiffs.loading) {
      return;
    }
    analytics.userApprovedAll(
      shapeDiffs.results.length,
      newRegionDiffs.results.length
    );
    [...shapeDiffs.results, ...newRegionDiffs.results].forEach((i) => {
      approveCommandsForDiff(
        i.diffDescription?.diffHash!,
        i.toCommands(i.updateSpecChoices)
      );
    });
    setOpen(false);
  };

  return (
    <>
      <Button
        onClick={handleClickOpen}
        size="small"
        color="primary"
        disabled={props.disabled}
      >
        Approve All
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          Approve All Diffs for Existing Endpoints
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to approve all diffs for existing endpoints?
            You should only do this if you are trying to extend your API's
            baseline spec.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="default">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            color="secondary"
            disabled={shapeDiffs.loading}
          >
            Yes, I am sure
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
