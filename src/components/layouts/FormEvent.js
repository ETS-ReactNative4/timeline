import React from 'react';
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
import TableParticipante from './TableParticipantes';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';

// pick utils
import moment from 'moment';
import 'moment/locale/pt-br';
import 'moment/locale/pt-br';
import MomentUtils from '@date-io/moment';

import { TimePicker } from 'material-ui-pickers';
import { DatePicker } from 'material-ui-pickers';
import { Fab, Divider } from '@material-ui/core';

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
  formSection: {
    paddingTop: theme.spacing.unit * 2,
    /*background: 'linear-gradient(#e3f2fd, white, white)',*/

    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 4,
    [theme.breakpoints.up('md')]: {
      margin: theme.spacing.unit * 20,
      marginTop: theme.spacing.unit * 2,
      marginBottom: theme.spacing.unit * 6
    }
  },
  appBar: {
    position: 'relative'
  },

  buttons: {
    marginTop: theme.spacing.unit * 2
  },

  fab: {
    position: 'fixed',
    bottom: theme.spacing.unit,
    right: theme.spacing.unit
  },

  inputs: {
    marginTop: theme.spacing.unit * 4,
    flexGrow: 1
  }
});

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

const envolvimentos = [
  { id: 1, descricao: 'Visitou' },
  { id: 2, descricao: 'Gerente Brasil' }
];
const envolvimentosEmpresa = [
  { id: 1, descricao: 'Matriz Visitada' },
  { id: 2, descricao: 'Holding' },
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
      currentLocale: 'pt-br',
      telefone: '',
      email: '',
      envolvimento: '',
      nome: '',
      empresa: '',
      participantesEmpresa: [],
      errors: {}
    };

    this.enviaForm = this.enviaForm.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.addParticipante = this.addParticipante.bind(this);
  }

  handleClickOpen = () => {
    this.props.myCallbackOpenDialog(true);
  };

  handleClose = () => {
    this.props.myCallbackOpenDialog(false);
  };

  handleDateChange = date => {
    this.props.setSelectedDate(date);
  };
  handleChange = input => e => {
    this.props.handleChange(input, e);
  };

  handleChangeForm = input => e => {
    this.setState({ [input]: e.target.value });
  };

  handleValidation() {
    const { nome, telefone, email, envolvimento, empresa } = this.state;
    let errors = {};
    let formIsValid = true;

    if (!nome || nome === '') {
      formIsValid = false;
      errors['nome'] = 'Não pode estar vazio';
    }

    if (!telefone || telefone === '') {
      formIsValid = false;
      errors['telefone'] = 'Não pode estar vazio';
    }

    if (!email || email === '') {
      formIsValid = false;
      errors['email'] = 'Não pode estar vazio';
    }

    if (!envolvimento || envolvimento === '') {
      formIsValid = false;
      errors['envolvimento'] = 'Não pode estar vazio';
    }

    this.setState({ errors: errors });
    return formIsValid;
  }

  addParticipante = event => {
    const { nome, telefone, email, envolvimento, empresa } = this.state;
    event.preventDefault();
    if (this.handleValidation()) {
      this.setState({
        participantesEmpresa: [
          ...this.state.participantesEmpresa,
          {
            nome: nome,
            telefone: telefone,
            email: email,
            empresa: empresa,
            envolvimento: envolvimento
          }
        ]
      });

      this.setState({ empresa: '' });
      this.setState({ nome: '' });
      this.setState({ telefone: '' });
      this.setState({ email: '' });
      this.setState({ envolvimento: '' });
    }
  };

  handleValidationForm() {
    const { evento } = this.props;
    let errors = {};
    let formIsValid = true;

    if (evento.descricao === '') {
      formIsValid = false;
      errors['evento.descricao'] = 'Não pode estar vazio';
    }

    console.log(evento.dependencias.length < 1);

    if (evento.dependencias.length < 1) {
      formIsValid = false;
      errors['evento.dependencias'] = 'Não pode estar vazio';
    }

    if (evento.empresas.length < 1) {
      formIsValid = false;
      errors['evento.empresas'] = 'Não pode estar vazio';
    }

    if (evento.funcionarios.length < 1) {
      formIsValid = false;
      errors['evento.funcionarios'] = 'Não pode estar vazio';
    }

    this.setState({ errors: errors });
    return formIsValid;
  }
  enviaForm(event) {
    let { evento, empresa } = this.props;
    event.preventDefault();
    console.log(this.handleValidationForm());

    if (this.handleValidationForm()) {
      this.props.setFuncionarioCriou();
      this.props.setParticipantesOutros(this.state.participantesEmpresa);

      fetch(`https://uce.intranet.bb.com.br/api-timeline/v1/eventos`, {
        method: evento.id ? 'PUT' : 'POST',
        body: JSON.stringify({
          evento: evento,
          empresa: empresa,
          tipoEvento: '[1,2,3,4]'
        }),
        headers: {
          'x-access-token': window.sessionStorage.token,
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        }
      })
        .then(response => response.json())
        .then(response => {
          console.log(response.timeline);

          this.props.setEventos(response.timeline);
        })
        .then(this.props.getDashboardData(empresa))
        .then(this.props.myCallbackOpenDialog(false))
        .then(this.props.clearEvento())
        .catch(function(err) {
          console.error(err);
        });
    }
  }

  render() {
    const locale = localeMap[this.state.currentLocale];
    const {
      setFuncionario,
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

    const {
      nome,
      telefone,
      email,
      envolvimento,
      participantesEmpresa,
      empresa,
      errors
    } = this.state;
    const participanteEmpresa = {
      nome,
      telefone,
      empresa,
      email,
      envolvimento
    };

    return (
      <div>
        <MuiThemeProvider theme={theme}>
          <Fab
            className={classes.fab}
            color="primary"
            onClick={this.handleClickOpen}
          >
            <AddIcon />
          </Fab>

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

            <div className={classes.formDiv}>
              <form onSubmit={this.enviaForm}>
                <div className={classes.formSection}>
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
                  <TextField
                    InputLabelProps={{
                      shrink: true
                    }}
                    label="Assunto/Tema"
                    placeholder="Descrição"
                    error={!errors['evento.descricao'] ? false : true}
                    helperText={errors['evento.descricao']}
                    className={classes.inputs}
                    margin="normal"
                    fullWidth
                    multiline
                    value={evento.descricao}
                    onChange={handleChange('descricao')}
                  />

                  <FormControl fullWidth className={classes.inputs}>
                    <InputLabel htmlFor="tipo-evento-simple">
                      Tipo Evento
                    </InputLabel>
                    <Select
                      value={evento.tipo_envolvimento_id}
                      onChange={handleChange('tipo_envolvimento_id')}
                      inputProps={{
                        name: 'tipo_envolvimento_id',
                        id: 'tipo-evento-simple'
                      }}
                    >
                      <MenuItem value={1}>Visita</MenuItem>
                      <MenuItem value={3}>Ligação</MenuItem>
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
                      <MenuItem value={1}>Pendente</MenuItem>

                      <MenuItem value={2}>Concluído</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className={classes.formSection}>
                  <Typography variant="h5" gutterBottom>
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
                    errors={errors}
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
                </div>
                <div className={classes.formSection}>
                  <Typography variant="h5" gutterBottom>
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
                  <BuscaFunci setFuncionario={setFuncionario} errors={errors} />
                  <TableFunci
                    data={funcionarios}
                    className={classes.inputs}
                    deleteItemListbyId={deleteItemListbyId}
                  />
                </div>
                <div className={classes.formSection}>
                  <Typography variant="h5" gutterBottom>
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
                  <BuscaEmpresa
                    addSuggestion={myCallbackEmpresas}
                    errors={errors}
                  />
                  <TableEmpresa
                    data={empresas}
                    className={classes.inputs}
                    deleteItemListbyId={deleteItemListbyId}
                  />
                </div>
                <div className={classes.formSection}>
                  <Typography variant="h5" gutterBottom>
                    Participantes das Empresas/Outros
                  </Typography>
                  <Divider />
                  <TextField
                    InputLabelProps={{
                      shrink: true
                    }}
                    placeholder="Sócio, Diretor, Gerente, etc..."
                    id="standard-envolvimento"
                    label="Envolvimento"
                    fullWidth
                    error={!errors['envolvimento'] ? false : true}
                    helperText={errors['envolvimento']}
                    className={classes.textField}
                    value={envolvimento}
                    onChange={this.handleChangeForm('envolvimento')}
                    margin="normal"
                  />

                  <TextField
                    InputLabelProps={{
                      shrink: true
                    }}
                    id="standard-empresa"
                    label="Empresa"
                    fullWidth
                    error={!errors['empresa'] ? false : true}
                    helperText={errors['empresa']}
                    className={classes.textField}
                    value={empresa}
                    onChange={this.handleChangeForm('empresa')}
                    margin="normal"
                  />
                  <TextField
                    InputLabelProps={{
                      shrink: true
                    }}
                    id="standard-nome"
                    label="Nome"
                    fullWidth
                    error={!errors['nome'] ? false : true}
                    helperText={errors['nome']}
                    className={classes.textField}
                    value={nome}
                    onChange={this.handleChangeForm('nome')}
                    margin="normal"
                  />

                  <TextField
                    InputLabelProps={{
                      shrink: true
                    }}
                    id="standard-telefone"
                    label="Telefone"
                    placeholder="+55 555-555-55555"
                    fullWidth
                    error={!errors['telefone'] ? false : true}
                    helperText={errors['telefone']}
                    className={classes.textField}
                    value={telefone}
                    onChange={this.handleChangeForm('telefone')}
                    margin="normal"
                  />

                  <TextField
                    InputLabelProps={{
                      shrink: true
                    }}
                    id="standard-email"
                    label="Email"
                    placeholder="exemple@exemple.com"
                    error={!errors['email'] ? false : true}
                    helperText={errors['email']}
                    fullWidth
                    className={classes.textField}
                    value={email}
                    onChange={this.handleChangeForm('email')}
                    margin="normal"
                  />
                  <Button fullWidth onClick={this.addParticipante}>
                    Adicionar participante
                  </Button>
                  <TableParticipante data={participantesEmpresa} />

                  <div className={classes.buttons}>
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      fullWidth
                      className={classes.button}
                    >
                      {evento.id ? 'Editar' : 'Salvar'}
                    </Button>
                  </div>
                </div>
              </form>
            </div>
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
