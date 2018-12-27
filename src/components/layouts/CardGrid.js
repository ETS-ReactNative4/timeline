import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import EventCard from './EventCard';
import { Typography, Card, Divider } from '@material-ui/core';
import red from '@material-ui/core/colors/red';
import Dashboard from './Dashboard';
import ToDo from './ToDo';

const styles = theme => ({
  root: {
    flexGrow: 1,
    paddingLeft: theme.spacing.unit * 2,
    paddingTop: theme.spacing.unit * 2
  },
  cardVazio: {
    color: red[500],
    paddingLeft: theme.spacing.unit * 1,
    paddingRight: theme.spacing.unit * 1,
    margin: theme.spacing.unit * 2
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
      <div>
        <Grid
          className={classes.root}
          container
          item
          direction="row"
          justify="center"
          alignItems="center"
          spacing={16}
          sm={12}
          md={12}
          lg={12}
        >
          <Grid item xs={12} md={12} lg={12} className={classes.root}>
            <Typography variant="h4">{empresa.nome}</Typography>
            <Typography variant="subtitle1" color="textSecondary">
              {empresa.pais}
            </Typography>
          </Grid>
          <Dashboard empresa={empresa} dados={dados} />
        </Grid>
        <Grid
          className={classes.root}
          container
          item
          direction="row"
          justify="center"
          alignItems="center"
          spacing={16}
          sm={12}
          md={12}
          lg={12}
        >
          <Grid item lg={6}>
            <ToDo
              tipoEvento={5}
              title={'Pendências BB'}
              user={user}
              empresa={empresa}
            />
          </Grid>
          <Grid item lg={6}>
            <ToDo
              tipoEvento={6}
              title={'Pendências Empresa'}
              user={user}
              empresa={empresa}
            />
          </Grid>
        </Grid>
        <Grid
          className={classes.root}
          container
          item
          direction="column"
          justify="center"
          alignItems="center"
          spacing={16}
          sm={12}
          md={12}
          lg={12}
        >
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
            <Card className={classes.cardVazio}>
              <Typography variant="h5" className={classes.cardVazio}>
                Tem sim eventos para este cliente
              </Typography>
            </Card>
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
