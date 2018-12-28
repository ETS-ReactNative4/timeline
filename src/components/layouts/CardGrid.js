import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import EventCard from './EventCard';
import { Typography, Paper } from '@material-ui/core';
import red from '@material-ui/core/colors/red';
import Dashboard from './Dashboard';
import ToDo from './ToDo';

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
  }
});

class CardGrid extends React.Component {
  render() {
    const {
      classes,
      eventos,
      myCallbackOpenDialog,
      setEvento,
      setEventos,
      empresa,
      dados,
      user
    } = this.props;

    return (
      <div className={classes.root}>
        <Grid container spacing={8}>
          <Grid item xs={12} md={12} lg={12} className={classes.root}>
            <Typography variant="h4">{empresa.nome}</Typography>
            <Typography variant="subtitle1" color="textSecondary">
              {empresa.pais}
            </Typography>
          </Grid>
          <Dashboard empresa={empresa} dados={dados} />

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

          {eventos.length > 0 ? (
            eventos.map((evento, index) => (
              <EventCard
                empresa={empresa}
                evento={evento}
                setEventos={setEventos}
                key={index}
                myCallbackOpenDialog={myCallbackOpenDialog}
                setEvento={setEvento}
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
      </div>
    );
  }
}

CardGrid.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(CardGrid);
