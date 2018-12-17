import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import EventCard from './EventCard';
import { Typography, Card, CardHeader } from '@material-ui/core';
import red from '@material-ui/core/colors/red';
import Dashboard from './Dashboard';

const styles = theme => ({
  cardVazio: {
    color: red[500],
    paddingLeft: theme.spacing.unit * 1,
    paddingRight: theme.spacing.unit * 1,
    margin: theme.spacing.unit * 2
  },
  container: {
    margin: 'auto'
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
      empresa
    } = this.props;

    return (
      <div>
        <Dashboard empresa={empresa} />
        <Grid
          className={classNames(classes.container)}
          container
          item
          direction="column"
          justify="center"
          alignItems="center"
          spacing={16}
          sm={12}
          md={12}
          lg={8}
        >
          {eventos.timeline ? (
            eventos.timeline.map((evento, index) => (
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
                Não há eventos para este cliente
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
