import React, { Fragment } from 'react';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import { Grid, Card, CardHeader } from '@material-ui/core';
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
  constructor(props) {
    super(props);
    this.state = {
      dados: {}
    };
    this.getDashboardData = this.getDashboardData.bind();
  }

  componentWillMount() {
    console.log('passou aqui');

    this.getDashboardData(this.props.empresa);
  }

  getDashboardData = empresa => {
    fetch('https://uce.intranet.bb.com.br/api-timeline/v1/eventos/dashboard', {
      method: 'POST',
      body: JSON.stringify({ empresa: empresa }),
      headers: {
        'x-access-token': window.sessionStorage.token,
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => this.setState({ dados: data.dados[0] }))
      .catch(function(err) {
        console.error(err);
      });
  };
  render() {
    const { dados } = this.state;
    const { classes, empresa } = this.props;

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
