import React from 'react';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import { Grid, Card } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    flexGrow: 1
  },

  cardCategory: {
    color: '#999999',
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
    const { classes, empresa, dados } = this.props;

    return (
      <div className={classes.root}>
        <Grid
          container
          item
          direction="row"
          justify="center"
          alignItems="center"
          spacing={24}
          sm={12}
          md={12}
          lg={12}
        >
          <Grid item xs={12} md={12} lg={12}>
            <Typography variant="h5">{empresa.nome}</Typography>
            <Typography variant="subtitle1" color="textSecondary">
              {empresa.pais}
            </Typography>
          </Grid>

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
        </Grid>
      </div>
    );
  }
}
Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withStyles(styles)(Dashboard);
