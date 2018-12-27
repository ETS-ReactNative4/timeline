import React, { Fragment } from 'react';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import { Grid, Card } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  cardCategory: {
    margin: '0',
    fontSize: '14px',
    padding: '10px'
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
    const { classes, dados } = this.props;

    return (
      <Fragment>
        <Grid item xs={12} md={3} lg={3}>
          <Card className={classes.card}>
            <Typography variant="subtitle1" className={classes.cardCategory}>
              Total de Eventos
            </Typography>
            <Typography variant="h4" className={classes.cardTitle}>
              {dados.Total_de_Eventos}
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={3} lg={3}>
          <Card className={classes.card}>
            <Typography variant="subtitle1" className={classes.cardCategory}>
              Visitas Concluídas
            </Typography>
            <Typography variant="h4" className={classes.cardTitle}>
              {dados.Visitas_Concluidas}
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={3} lg={3}>
          <Card className={classes.card}>
            <Typography variant="subtitle1" className={classes.cardCategory}>
              Visitas Pendentes
            </Typography>
            <Typography variant="h4" className={classes.cardTitle}>
              {dados.Visitas_Pendentes}
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={3} lg={3}>
          <Card className={classes.card}>
            <Typography variant="subtitle1" className={classes.cardCategory}>
              Total de Ligações
            </Typography>
            <Typography variant="h4" className={classes.cardTitle}>
              {dados.ligacoes}
            </Typography>
          </Card>
        </Grid>
      </Fragment>
    );
  }
}
Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withStyles(styles)(Dashboard);
