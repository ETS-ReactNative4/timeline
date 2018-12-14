import React, { Fragment } from 'react';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import { Grid, Card, CardHeader } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: { flexGrow: 1, padding: theme.spacing.unit },
  cardCategory: {
    color: '#999999',
    margin: '0',
    fontSize: '14px',
    marginTop: '0',
    padding: '10px',
    marginBottom: '0'
  },
  cardTitle: {
    paddingRight: '10px',
    paddingBottom: '10px'
  },
  card: {
    textAlign: 'right'
  }
});

class Dashboard extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <Fragment>
        <Grid className={classes.root} spacing={16} justify="center" container>
          <Grid item xs={12} md={3} lg={3}>
            <Card className={classes.card}>
              <Typography variant="subtitle1" className={classes.cardCategory}>
                Total de Visitas
              </Typography>
              <Typography variant="h4" className={classes.cardTitle}>
                100
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={3} lg={3}>
            <Card className={classes.card}>
              <Typography variant="subtitle1" className={classes.cardCategory}>
                Total de Agendamentos
              </Typography>
              <Typography variant="h4" className={classes.cardTitle}>
                10
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={3} lg={3}>
            <Card className={classes.card}>
              <Typography variant="subtitle1" className={classes.cardCategory}>
                Agendamentos Pendentes
              </Typography>
              <Typography variant="h4" className={classes.cardTitle}>
                10
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={3} lg={3}>
            <Card className={classes.card}>
              <Typography variant="subtitle1" className={classes.cardCategory}>
                Total de Ligações
              </Typography>
              <Typography variant="h4" className={classes.cardTitle}>
                100
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Fragment>
    );
  }
}
Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withStyles(styles)(Dashboard);
