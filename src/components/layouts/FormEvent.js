import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import TextField from '@material-ui/core/TextField';
import AddIcon from '@material-ui/icons/Add';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import BuscaFunci from './buscafunci/BuscaFunci';
import BuscaEmpresa from './buscaEmpresa/BuscaEmpresa';
import TableFunci from './buscafunci/TableFunci';
import TableEmpresa from './buscaEmpresa/TableEmpresa';
import BuscaDependencia from './buscaDependencia/BuscaDependencia';
import TableDependencia from './buscaDependencia/TableDependencia';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';

// pick utils
import moment from 'moment';
import 'moment/locale/pt-br';
import 'moment/locale/pt-br';
import MomentUtils from '@date-io/moment';

import { TimePicker } from 'material-ui-pickers';
import { DatePicker } from 'material-ui-pickers';
import { Card, CardContent, Grid, CardActions } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';

moment.locale('pt-br');

const localeMap = {
  en: 'en',
  pt: 'pt-br'
};
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#1565c0'
    }
  }
});

const styles = theme => ({
  appBar: {
    position: 'relative'
  },
  sessaoTitulo: {
    marginTop: theme.spacing.unit * 6
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  button: {
    marginTop: theme.spacing.unit * 3,
    marginLeft: theme.spacing.unit
  },
  fab: {
    position: 'fixed',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2
  },
  form: {
    [theme.breakpoints.up('md')]: {
      marginTop: theme.spacing.unit * 6,
      marginBottom: theme.spacing.unit * 6
    }
  },
  inputs: {
    marginTop: theme.spacing.unit * 2,
    flexGrow: 1
  }
});

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

const envolvimentos = [
  { id: 1, descricao: 'Visitou' },
  { id: 2, descricao: 'Sem idéia' }
];
const envolvimentosEmpresa = [
  { id: 1, descricao: 'Matriz Visitada' },
  { id: 2, descricao: 'Vínculo Brasil' }
];
const envolvimentosDependencia = [
  { id: 1, descricao: 'Do Cliente' },
  { id: 2, descricao: 'Vínculo Brasil' }
];

class FormEvent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentLocale: 'pt-br'
    };

    this.enviaForm = this.enviaForm.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
  }

  handleClickOpen = () => {
    this.props.myCallbackOpenDialog(true);
  };

  handleClose = () => {
    this.props.myCallbackOpenDialog(false);

    this.props.clearEvento();
  };

  handleDateChange = date => {
    this.props.setSelectedDate(date);
  };
  handleChange = input => e => {
    this.props.handleChange(input, e);
  };

  enviaForm(event) {
    event.preventDefault();
    let { evento, empresa } = this.props;

    const data = { evento: evento };
    console.log(evento);

    fetch(`https://uce.intranet.bb.com.br/api-timeline/v1/eventos`, {
      method: evento.id ? 'PUT' : 'POST',
      body: JSON.stringify(data),
      headers: {
        'x-access-token': window.sessionStorage.token,
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())

      .then(this.props.clearEvento())
      .then(this.props.myCallbackOpenDialog(false))
      .then(this.props.getEventos(empresa))
      .catch(function(err) {
        console.error(err);
      });
  }

  render() {
    const locale = localeMap[this.state.currentLocale];
    const {
      myCallback,
      myCallbackEmpresas,
      myCallbackDependencia
    } = this.props;
    const { funcionarios, empresas, dependencias } = this.props;
    const { classes, open } = this.props;
    const {
      handleChange,
      evento,
      deleteItemDependenciaListbyId,
      deleteItemListbyId
    } = this.props;

    return (
      <div>
        <MuiThemeProvider theme={theme}>
          <Button
            variant="fab"
            mini
            className={classes.fab}
            color="primary"
            onClick={this.handleClickOpen}
          >
            <AddIcon />
          </Button>

          <Dialog
            fullScreen
            open={open}
            onClose={this.handleClose}
            TransitionComponent={Transition}
          >
            <AppBar className={classes.appBar} color="primary">
              <Toolbar>
                <IconButton
                  color="inherit"
                  onClick={this.handleClose}
                  aria-label="Close"
                >
                  <CloseIcon />
                </IconButton>
                <Typography variant="h6" color="inherit">
                  {evento.id ? 'Editar Evento' : 'Novo Evento'}
                </Typography>
              </Toolbar>
            </AppBar>

            <Grid container justify="center" className={classes.form}>
              <Grid item xs={12} sm={12} md={8}>
                <Card>
                  <CardContent>
                    <form onSubmit={this.enviaForm} method="post">
                      <div className={classes.inputsTime}>
                        <Typography
                          variant="h6"
                          gutterBottom
                          className={classes.sessaoTitulo}
                        >
                          Evento
                        </Typography>
                        <Divider />
                        <MuiPickersUtilsProvider
                          utils={MomentUtils}
                          locale={locale}
                          moment={moment}
                        >
                          <DatePicker
                            label="Data"
                            fullWidth
                            value={evento.dt_evento}
                            onChange={this.handleDateChange}
                            className={classes.inputs}
                          />

                          <TimePicker
                            label="Hora"
                            fullWidth
                            value={evento.dt_evento}
                            onChange={this.handleDateChange}
                            className={classes.inputs}
                          />
                        </MuiPickersUtilsProvider>
                      </div>
                      <TextField
                        label="Assunto/Tema"
                        placeholder="Descrição"
                        multiline
                        className={classes.inputs}
                        margin="normal"
                        fullWidth
                        value={evento.descricao}
                        onChange={handleChange('descricao')}
                      />

                      <FormControl fullWidth className={classes.inputs}>
                        <InputLabel htmlFor="tipo-evento-simple">
                          Tipo Evento
                        </InputLabel>
                        <Select
                          value={evento.tipoEvento}
                          onChange={handleChange('tipoEvento')}
                          inputProps={{
                            name: 'tipoEvento',
                            id: 'tipo-evento-simple'
                          }}
                        >
                          <MenuItem value={1}>Agendamento</MenuItem>
                          <MenuItem value={2}>Visita</MenuItem>
                          <MenuItem value={3}>Ligação</MenuItem>
                          <MenuItem value={4}>Tarefa</MenuItem>
                        </Select>
                      </FormControl>

                      <FormControl fullWidth className={classes.inputs}>
                        <InputLabel htmlFor="status-simple">Status</InputLabel>
                        <Select
                          value={evento.status}
                          onChange={handleChange('status')}
                          inputProps={{
                            name: 'status',
                            id: 'status-simple'
                          }}
                        >
                          <MenuItem value={1}>Iniciado</MenuItem>
                          <MenuItem value={2}>Andamento</MenuItem>
                          <MenuItem value={3}>Concluído</MenuItem>
                        </Select>
                      </FormControl>

                      <Typography
                        variant="h6"
                        gutterBottom
                        className={classes.sessaoTitulo}
                      >
                        Dependências
                      </Typography>
                      <Divider />
                      <FormControl fullWidth className={classes.inputs}>
                        <InputLabel htmlFor="envolvimento-dependencia">
                          Envolvimento
                        </InputLabel>
                        <Select
                          value={evento.envolvimentoDependencia}
                          onChange={handleChange('envolvimentoDependencia')}
                          inputProps={{
                            name: 'envolvimentoDependencia',
                            id: 'envolvimento-dependencia'
                          }}
                        >
                          {envolvimentosDependencia.map(envolvimento => (
                            <MenuItem
                              key={envolvimento.descricao}
                              value={envolvimento.id}
                            >
                              {envolvimento.descricao}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <BuscaDependencia
                        addSuggestion={myCallbackDependencia}
                        className={classes.inputs}
                      />
                      <TableDependencia
                        data={dependencias}
                        className={classes.inputs}
                        deleteItemDependenciaListbyId={
                          deleteItemDependenciaListbyId
                        }
                      />

                      <Typography
                        variant="h6"
                        gutterBottom
                        className={classes.sessaoTitulo}
                      >
                        Participantes BB
                      </Typography>
                      <Divider />

                      <FormControl fullWidth className={classes.inputs}>
                        <InputLabel htmlFor="envolvimento-simple">
                          Envolvimento
                        </InputLabel>
                        <Select
                          value={evento.envolvimento}
                          onChange={handleChange('envolvimento')}
                          className={classes.inputs}
                          inputProps={{
                            name: 'envolvimento',
                            id: 'envolvimento-simple'
                          }}
                        >
                          {envolvimentos.map(envolvimento => (
                            <MenuItem
                              key={envolvimento.descricao}
                              value={envolvimento.id}
                            >
                              {envolvimento.descricao}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <BuscaFunci addFuncionario={myCallback} />
                      <TableFunci
                        data={funcionarios}
                        className={classes.inputs}
                        deleteItemListbyId={deleteItemListbyId}
                      />
                      <Typography
                        variant="h6"
                        gutterBottom
                        className={classes.sessaoTitulo}
                      >
                        Empresas
                      </Typography>
                      <Divider />

                      <FormControl fullWidth className={classes.inputs}>
                        <InputLabel htmlFor="envolvimento-empresa">
                          Envolvimento
                        </InputLabel>
                        <Select
                          value={evento.envolvimentoEmpresa}
                          onChange={handleChange('envolvimentoEmpresa')}
                          inputProps={{
                            name: 'envolvimentoEmpresa',
                            id: 'envolvimento-empresa'
                          }}
                        >
                          {envolvimentosEmpresa.map(envolvimento => (
                            <MenuItem
                              key={envolvimento.descricao}
                              value={envolvimento.id}
                            >
                              {envolvimento.descricao}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <BuscaEmpresa addSuggestion={myCallbackEmpresas} />
                      <TableEmpresa
                        data={empresas}
                        className={classes.inputs}
                        deleteItemListbyId={deleteItemListbyId}
                      />
                      <Typography
                        variant="h6"
                        gutterBottom
                        className={classes.sessaoTitulo}
                      >
                        Participantes das Empresas
                      </Typography>
                      <Divider />

                      <TextField
                        id="standard-envolvimentoParticipantesEmpresa"
                        label="Envolvimento do participante"
                        fullWidth
                        className={classes.textField}
                        value={this.state.envolvimentoParticipantesEmpresa}
                        onChange={this.handleChange(
                          'envolvimentoParticipantesEmpresa'
                        )}
                        margin="normal"
                      />

                      <TextField
                        id="standard-envolvimentoParticipantesEmpresa"
                        label="Participante Empresa"
                        fullWidth
                        className={classes.textField}
                        value={this.state.participanteEmpresa}
                        onChange={this.handleChange(
                          'envolvimentoParticipantesEmpresa'
                        )}
                        margin="normal"
                      />
                      <Button fullWidth className={classes.button}>
                        Adicionar participante
                      </Button>

                      <div className={classes.buttons}>
                        <Button
                          variant="contained"
                          color="primary"
                          type="submit"
                          className={classes.button}
                        >
                          {evento.id ? 'Editar' : 'Salvar'}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Dialog>
        </MuiThemeProvider>
      </div>
    );
  }
}

FormEvent.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(FormEvent);
