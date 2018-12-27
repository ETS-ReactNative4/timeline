/* eslint-disable react/no-multi-comp */

import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import { Typography } from '@material-ui/core';

class ConfirmationDialogRaw extends React.Component {
  handleCancel = () => {
    this.props.handleOpenDialogExcluir();
  };

  handleOk = event => {
    this.props.excluir(event);
    this.props.handleOpenDialogExcluir();
  };

  render() {
    const { value, handleOpenDialogExcluir, excluir, ...other } = this.props;

    return (
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        maxWidth="xs"
        /*  onEntering={this.handleEntering}*/
        aria-labelledby="confirmation-dialog-title"
        {...other}
      >
        <DialogTitle id="confirmation-dialog-title">Excluir Evento</DialogTitle>
        <DialogContent>
          <Typography>Você confirma a exclusão do evento?</Typography>
          <Typography>{value.id}</Typography>
          <Typography>{value.empresas[0].nome}</Typography>
          <Typography>{value.dt_evento}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleCancel} color="primary">
            Cancelar
          </Button>
          <Button onClick={this.handleOk} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

const styles = theme => ({
  root: {
    width: '100%'
  },
  paper: {
    width: '80%',
    maxHeight: 435
  }
});

export default withStyles(styles)(ConfirmationDialogRaw);
