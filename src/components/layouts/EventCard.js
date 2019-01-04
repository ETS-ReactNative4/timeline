import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CardHeader from '@material-ui/core/CardHeader';
import moment from 'moment';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ConfirmationDialogRaw from './ConfirmationDialogRaw';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import classnames from 'classnames';

import {
  Menu,
  MenuItem,
  Divider,
  Paper,
  Hidden,
  Collapse,
  CardActions,
  TextField,
  Button
} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { green, blue, amber, purple } from '@material-ui/core/colors';
import 'moment/locale/pt-br';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import CommentCard from './CommentCard';
import Edit from '@material-ui/icons/Edit';
const styles = theme => ({
  flex: {
    display: 'flex'
  },
  actions: {
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

  tipoEventoColor8: {
    margin: '10px 10px 0px 10px',
    padding: 3,
    backgroundColor: '#009688'
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
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: 'rotate(180deg)'
  }
});

class EventCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
      expanded: true,
      open: false,
      newComment: '',
      comentarios: [],
      errors: {}
    };
    this.tipoEvento = this.tipoEvento.bind();
    this.excluir = this.excluir.bind();
    this.handleExpandClick = this.handleExpandClick.bind();
  }

  componentDidMount() {
    if (this.props.evento.comentarios) {
      this.setState({ comentarios: this.props.evento.comentarios });
    }
  }

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
    console.log(this.props.evento);

    if (this.props.evento.comentarios) {
      this.setState({ comentarios: this.props.evento.comentarios });
    }
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleOpenDialogExcluir = () => {
    this.setState({ open: !this.state.open });
    this.handleClose();
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleOpen = () => {
    const { evento, myCallbackOpenDialog } = this.props;

    myCallbackOpenDialog(true, 'editEvent', evento);
  };

  excluir = event => {
    event.preventDefault();

    let { evento, empresa } = this.props;
    evento.dt_delete = new Date();

    fetch(`https://uce.intranet.bb.com.br/api-timeline/v1/eventos`, {
      method: 'PUT',
      body: JSON.stringify({
        evento: evento,
        empresa: empresa,
        tipoEvento: '[1,2,3,4,7,8]'
      }),
      headers: {
        'x-access-token': window.sessionStorage.token,
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())

      .then(data => {
        const eventosFiltrado = data.timeline
          ? data.timeline.filter(el => {
              if (!el.dt_delete) {
                return el;
              }
            })
          : [];
        this.props.setEventos(eventosFiltrado);
        this.props.setDados(data.dados[0]);
      })
      .then(this.handleClose())
      .catch(function(err) {
        console.error(err);
      });
  };

  createComment() {
    const { user, evento } = this.props;
    const { newComment } = this.state;

    let comentario = {
      descricao: newComment,
      eventoId: evento.id,
      nome: user.NM_FUN,
      chaveFunci: user.CD_USU,
      prefixo: user.CD_PRF_DEPE_ATU,
      dt_create: new Date()
    };
    return comentario;
  }
  addItem = e => {
    let errors = {};

    if (this.state.newComment === '') {
      errors['evento.descricao'] = 'Não pode estar vazio';
    }

    this.setState({
      comentarios: [...this.state.comentarios, this.createComment()]
    });
    this.enviaComentario();
    this.setState({
      newComment: ''
    });

    this.setState({
      errors: errors
    });

    e.preventDefault();
  };
  tipoEvento(evento, classes) {
    switch (evento.tipo_evento_id) {
      case 1:
        return (
          <div className={classes.tipoEventoColor1}>
            <Typography variant="caption" className={classes.tipoEventoTitle}>
              {evento.tipo_envolvimento_descricao}
            </Typography>
          </div>
        );
        break;

      case 3:
        return (
          <div className={classes.tipoEventoColor2}>
            <Typography variant="caption" className={classes.tipoEventoTitle}>
              {evento.tipo_envolvimento_descricao}
            </Typography>
          </div>
        );
        break;

      case 8:
        return (
          <div className={classes.tipoEventoColor8}>
            <Typography variant="caption" className={classes.tipoEventoTitle}>
              {evento.tipo_envolvimento_descricao}
            </Typography>
          </div>
        );
        break;

      default:
        break;
    }
  }

  handleChange = input => e => {
    this.setState({ [input]: e.target.value });
  };

  render() {
    const { anchorEl, newComment, comentarios, errors } = this.state;
    const { classes, evento, language } = this.props;
    const open = Boolean(anchorEl);

    return (
      <Fragment>
        <Grid item className={classes.card}>
          <Paper>
            <div className={classes.tipoEvento}>
              {this.tipoEvento(evento, classes)}
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
                <div>
                  <Hidden mdDown>
                    <IconButton
                      background-color="inherit"
                      aria-label="More"
                      aria-owns={open ? 'long-menu' : undefined}
                      aria-haspopup="true"
                      onClick={this.handleOpen}
                    >
                      <Edit />
                    </IconButton>
                  </Hidden>
                  <IconButton
                    background-color="inherit"
                    aria-label="More"
                    aria-owns={open ? 'long-menu' : undefined}
                    aria-haspopup="true"
                    onClick={this.handleClick}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </div>
              }
              title={evento.empresas ? evento.empresas[0].nome : ''}
              subheader={moment
                .utc(evento.dt_evento)
                .locale(language)
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
                    <Typography variant="body1">
                      {dep.prefixo + ' - ' + dep.nome}
                    </Typography>
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
              <IconButton
                className={classnames(classes.expand, {
                  [classes.expandOpen]: this.state.expanded
                })}
                onClick={this.handleExpandClick}
                aria-expanded={this.state.expanded}
                aria-label="Show more"
              >
                <ExpandMoreIcon />
              </IconButton>
            </CardActions>
            <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
              <CardContent>
                <div>
                  <Typography variant="h6">Comentários</Typography>
                  <Divider />
                  {comentarios.map(comentario => (
                    <CommentCard comentario={comentario} />
                  ))}
                </div>

                <TextField
                  InputLabelProps={{
                    shrink: true
                  }}
                  label="Novo Comentário"
                  placeholder="Novo Comentário"
                  error={!errors['evento.descricao'] ? false : true}
                  helperText={errors['evento.descricao']}
                  className={classes.inputs}
                  margin="normal"
                  fullWidth
                  multiline
                  rows={3}
                  value={newComment}
                  onChange={this.handleChange('newComment')}
                />

                <Button
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  type="submit"
                  onClick={this.addItem}
                >
                  Adicionar Novo Comentário
                </Button>
              </CardContent>
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

  enviaComentario = () => {
    const { empresa } = this.props;
    let evento = this.props.evento;

    evento.comentarios = this.state.comentarios;
    console.log(this.state.comentarios);

    console.log(evento);

    fetch(`https://uce.intranet.bb.com.br/api-timeline/v1/eventos`, {
      method: 'PUT',
      body: JSON.stringify({
        evento: evento,
        empresa: empresa,
        tipoEvento: '[1, 2, 3, 4, 7, 8, 9]'
      }),
      headers: {
        'x-access-token': window.sessionStorage.token,
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        const eventosFiltrado = data.timeline
          ? data.timeline.filter(el => {
              if (!el.dt_delete) {
                return el;
              }
            })
          : [];
        this.props.setEventos(eventosFiltrado);
        this.props.setDados(data.dados[0]);
      })
      .catch(function(err) {
        console.error(err);
      });
  };
}

EventCard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(EventCard);
