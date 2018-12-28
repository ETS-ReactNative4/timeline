import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import moment from 'moment';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import blue from '@material-ui/core/colors/blue';
import amber from '@material-ui/core/colors/amber';
import purple from '@material-ui/core/colors/purple';
import ConfirmationDialogRaw from './ConfirmationDialogRaw';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SimpleExpansionPanel from './cardDetails/cardDetails';
import { Menu, MenuItem, Divider, Paper } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { green } from '@material-ui/core/colors';

const styles = theme => ({
  flex: {
    display: 'flex'
  },
  card: {
    width: '100%'
  },
  media: {
    height: 0,
    paddingTop: '56.25%' // 16:9
  },

  blueAvatar: {
    margin: 10,
    backgroundColor: blue[800]
  },
  cardFuncionariosEnvolvidos: {
    display: 'flex'
  },
  tipoEvento: {
    display: 'flex'
  },
  tipoEventoColor1: {
    margin: '10px 10px 0px 10px',
    padding: 3,
    backgroundColor: amber[700]
  },
  tipoEventoColor3: {
    margin: '10px 10px 0px 10px',
    padding: 3,
    backgroundColor: amber[900]
  },

  tipoEventoColor4: {
    margin: '10px 10px 0px 10px',
    padding: 3,
    backgroundColor: green[600]
  },

  tipoEventoColor2: {
    margin: '10px 10px 0px 10px',
    padding: 3,
    backgroundColor: purple[800]
  },
  sessaoTitulo: { marginTop: 24 },
  tipoEventoTitle: {
    color: 'white',
    e: 'bold'
  },

  cardHeader: {
    margin: '0px 16px 0px 0px',
    padding: 8
  },
  smallAvatar: {
    width: 25,
    height: 25,
    margin: 5
  }
});

class EventCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
      expanded: false,
      open: false
    };

    this.excluir = this.excluir.bind();
  }
  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleOpenDialogExcluir = () => {
    this.setState({ open: !this.state.open });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleOpen = () => {
    const { evento, setEvento, myCallbackOpenDialog } = this.props;
    myCallbackOpenDialog(true);
    setEvento(evento);
  };

  excluir = event => {
    event.preventDefault();

    let { evento, empresa } = this.props;
    evento.dt_delete = new Date();

    fetch(`https://uce.intranet.bb.com.br/api-timeline/v1/eventos`, {
      method: 'PUT',
      body: { evento: evento, empresa: empresa, tipoEvento: '[1,2,3,4]' },
      headers: {
        'x-access-token': window.sessionStorage.token,
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())

      .then(data => {
        this.props.getEventos(empresa);
      })
      .then(this.handleExpandClick())
      .catch(function(err) {
        console.error(err);
      });
  };

  render() {
    const { anchorEl } = this.state;
    const { classes, evento } = this.props;
    const open = Boolean(anchorEl);
    console.log(evento);

    return (
      <Fragment>
        <Grid item className={classes.card}>
          <Paper>
            <div className={classes.tipoEvento}>
              {evento.tipo_envolvimento_id === 1 ? (
                <div className={classes.tipoEventoColor1}>
                  <Typography
                    variant="caption"
                    className={classes.tipoEventoTitle}
                  >
                    {evento.tipo_envolvimento_descricao}
                  </Typography>
                </div>
              ) : (
                <div className={classes.tipoEventoColor2}>
                  <Typography
                    variant="caption"
                    className={classes.tipoEventoTitle}
                  >
                    {evento.tipo_envolvimento_descricao}
                  </Typography>
                </div>
              )}

              {evento.status === 1 ? (
                <div className={classes.tipoEventoColor3}>
                  <Typography
                    variant="caption"
                    className={classes.tipoEventoTitle}
                  >
                    {evento.status_descricao}
                  </Typography>
                </div>
              ) : (
                <div className={classes.tipoEventoColor4}>
                  <Typography
                    variant="caption"
                    className={classes.tipoEventoTitle}
                  >
                    {evento.status_descricao}
                  </Typography>
                </div>
              )}
            </div>

            <CardHeader
              className={classes.cardHeader}
              action={
                <IconButton
                  aria-label="More"
                  aria-owns={open ? 'long-menu' : undefined}
                  aria-haspopup="true"
                  onClick={this.handleClick}
                >
                  <MoreVertIcon />
                </IconButton>
              }
              title={evento.empresas ? evento.empresas[0].nome : ''}
              subheader={moment(evento.dt_evento)
                .locale('pt-BR')
                .format('LLLL')}
            />

            <CardContent>
              <Typography component="p">{evento.descricao}</Typography>

              <Typography
                variant="caption"
                gutterBottom
                className={classes.sessaoTitulo}
              >
                Participantes BB
              </Typography>
              <Divider />
              <div className={classes.flex}>
                {evento.funcionarios
                  ? evento.funcionarios.map(funci => {
                      return (
                        <div>
                          <Avatar
                            alt={funci.nome}
                            key={funci.chave}
                            className={classes.smallAvatar}
                            src={`https://humanograma.intranet.bb.com.br/avatar/${
                              funci.chave
                            }`}
                          />
                        </div>
                      );
                    })
                  : ''}
              </div>
              <Typography
                variant="caption"
                gutterBottom
                className={classes.sessaoTitulo}
              >
                Dependências BB
              </Typography>
              <Divider />

              {evento.dependencias
                ? evento.dependencias.map(dep => (
                    <Typography variant="body1">{dep.prefixo}</Typography>
                  ))
                : ''}

              <Typography
                variant="caption"
                gutterBottom
                className={classes.sessaoTitulo}
              >
                Empresas
              </Typography>
              <Divider />

              {evento.empresas
                ? evento.empresas.map(empresa => (
                    <Typography variant="body1"> {empresa.nome}</Typography>
                  ))
                : ''}
            </CardContent>
            <CardActions className={classes.actions} disableActionSpacing>
              <SimpleExpansionPanel evento={evento} />
            </CardActions>

            <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
              <CardContent />
            </Collapse>
          </Paper>
        </Grid>
        <Menu
          id="long-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={this.handleClose}
        >
          <MenuItem onClick={this.handleOpen}>Editar</MenuItem>
          <MenuItem onClick={this.handleOpenDialogExcluir}>Excluir</MenuItem>
        </Menu>

        <ConfirmationDialogRaw
          classes={{
            paper: classes.paper
          }}
          handleOpenDialogExcluir={this.handleOpenDialogExcluir}
          excluir={this.excluir}
          open={this.state.open}
          value={this.props.evento}
        />
      </Fragment>
    );
  }
}

EventCard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(EventCard);
