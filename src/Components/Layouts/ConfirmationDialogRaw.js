/* eslint-disable react/no-multi-comp */

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Typography } from '@material-ui/core';


class ConfirmationDialogRaw extends React.Component {
    constructor(props) {
        super();
       
    }
 
    handleCancel = () => {
        this.props.handleOpenDialogExcluir();
    };

    handleOk = (event) => {

        this.props.excluir(event);
        this.props.handleOpenDialogExcluir();
    };
 
    render() {
        const { value,  handleOpenDialogExcluir, excluir,  ...other } = this.props;
   
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

                    <Typography>
                        Você confirma a exclusão do evento?
                    </Typography>
                    <Typography>
                        {value.id}
                    </Typography>
                    <Typography>
                        {value.empresas[0].nome}
                    </Typography> 
                    <Typography>
                        {value.dt_evento}
                    </Typography>

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
        width: '100%',
        
      
    },
    paper: {
        width: '80%',
        maxHeight: 435,
    },
});

export default withStyles(styles)(ConfirmationDialogRaw);
