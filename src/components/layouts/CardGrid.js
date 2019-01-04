import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import EventCard from './EventCard';
import { Typography, Paper } from '@material-ui/core';
import red from '@material-ui/core/colors/red';
import Dashboard from './Dashboard';
import ToDo from './ToDo';
import FormEvent from './FormEvent';
import AddIcon from '@material-ui/icons/Add';
import { Fab } from '@material-ui/core';
const styles = theme => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing.unit,
    [theme.breakpoints.up('lg')]: {
      paddingTop: theme.spacing.unit * 3,
      paddingLeft: theme.spacing.unit * 20,
      paddingRight: theme.spacing.unit * 20
    }
    /*paddingLeft: theme.spacing.unit * 2,*/
    /* paddingTop: theme.spacing.unit * 2*/
  },
  cardVazio: {
    flexGrow: 1,
    color: red[500],
    padding: theme.spacing.unit * 2
  },
  fab: {
    bottom: theme.spacing.unit,
    right: theme.spacing.unit,
    zIndex: 9,
    position: 'fixed',

    [theme.breakpoints.up('md')]: {
      position: 'absolute',
      top: 100,
      right: theme.spacing.unit * 20,
      marginBottom: -15
    }
  }
});

class CardGrid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      eventoEdit: {},
      tipoDialog: 'newEvent'
    };
  }

  handleClickOpen = () => {
    this.myCallbackOpenDialog(true, 'newEvent');
  };

  myCallbackOpenDialog = (open, target, evento) => {
    let eventoNew = {
      id: undefined,
      descricao: '',
      status: 1,
      tipo_evento_id: 1,
      dt_evento: new Date(),

      participantes: [],
      funcionarios: [],
      dependencias: [],
      empresas: []
    };
    if (target == 'newEvento') {
      this.state({
        eventoEdit: eventoNew
      });
    } else {
      this.setState({ eventoEdit: evento });
    }

    this.setState({ open: open });
  };

  render() {
    const {
      classes,
      eventos,
      setDados,
      setEventos,
      empresa,
      dados,
      user,
      language
    } = this.props;
    const { open, eventoEdit, tipoDialog } = this.state;
    return (
      <div className={classes.root}>
        <Grid container spacing={0}>
          <Fab
            aria-label="Add"
            variant="extended"
            className={classes.fab}
            color="secondary"
            onClick={this.handleClickOpen}
          >
            <AddIcon />

            <Typography color="button">NOVO EVENTO</Typography>
          </Fab>

          {this.state.open ? (
            <FormEvent
              open={open}
              myCallbackOpenDialog={this.myCallbackOpenDialog}
              empresa={empresa}
              eventoEdit={eventoEdit}
              user={user}
              setEventos={setEventos}
              setDados={setDados}
              tipoDialog={tipoDialog}
              language={language}
            />
          ) : (
            ''
          )}
          <Grid container spacing={8}>
            <Grid item xs={12} md={12} lg={12} className={classes.root}>
              <Typography variant="h4">{empresa.nome}</Typography>
              <Typography variant="subtitle1" color="textSecondary">
                {empresa.pais}
              </Typography>
            </Grid>
          </Grid>
          <Grid container spacing={8}>
            <Dashboard empresa={empresa} dados={dados} />
          </Grid>
          <Grid container spacing={8}>
            <Grid item lg={6} md={6} sm={12}>
              <ToDo
                tipoEvento={5}
                iconColor={'#ffcd38'}
                title={'Pendências BB'}
                user={user}
                empresa={empresa}
              />
            </Grid>
            <Grid item lg={6} md={6} sm={12}>
              <ToDo
                tipoEvento={6}
                iconColor={'#002884'}
                title={'Pendências Empresa'}
                user={user}
                empresa={empresa}
              />
            </Grid>
          </Grid>
          <Grid container spacing={8} style={{ marginTop: '8px' }}>
            {eventos.length > 0 ? (
              eventos.map((evento, index) => (
                <EventCard
                  language={language}
                  empresa={empresa}
                  evento={evento}
                  setEventos={setEventos}
                  setDados={setDados}
                  key={index}
                  myCallbackOpenDialog={this.myCallbackOpenDialog}
                />
              ))
            ) : (
              <Grid item lg={12} md={12} sm={12}>
                <Paper className={classes.root}>
                  <Typography variant="h5" className={classes.cardVazio}>
                    Não há eventos para o cliente selecionado
                  </Typography>
                </Paper>
              </Grid>
            )}
          </Grid>
        </Grid>
      </div>
    );
  }
}

CardGrid.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(CardGrid);
