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

import { MuiPickersUtilsProvider } from 'material-ui-pickers';

// pick utils
import moment from 'moment';

import 'moment/locale/pt-br';

import MomentUtils from '@date-io/moment';

import { TimePicker } from 'material-ui-pickers';
import { DatePicker } from 'material-ui-pickers';
import { Divider } from '@material-ui/core';

moment.locale('pt-br');

const localeMap = {
  en: 'en',
  pt: 'pt-br'
};

let counterDep = 0;
function createDependencia(nome, uor, envolvimento, prefixo, user) {
  counterDep += 1;
  return { id: counterDep, nome, uor, envolvimento, prefixo, user };
}

let counter = 0;
function createFuncionario(nome, chave, envolvimento, prefixo, user) {
  counter += 1;
  return { id: counter, nome, chave, envolvimento, prefixo, user };
}

let counterParte = 0;
function createParte(envolvimento, empresa, nome, telefone, email, user) {
  counterParte += 1;
  return {
    id: counterParte,
    envolvimento,
    empresa,
    nome,
    telefone,
    email,
    user
  };
}

let counterEmp = 0;
function createEmpresa(
  nome,
  mci,
  cod_pais,
  pais,
  tabela_origem,
  bloco_origem,
  envolvimento
) {
  counterEmp += 1;
  return {
    id: counterEmp,
    nome,
    mci,
    cod_pais,
    pais,
    tabela_origem,
    bloco_origem,
    envolvimento
  };
}
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

  inputs: {
    marginTop: theme.spacing.unit * 4,
    flexGrow: 1
  }
});

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

const envolvimentos = [
  { id: 2, descricao: 'Visitou' },
  { id: 3, descricao: 'Vínculo Brasil' }
];
const envolvimentosEmpresa = [
  { id: 1, descricao: 'Visitada' },
  { id: 2, descricao: 'Subsidiária Brasil' },
  { id: 3, descricao: 'Holding' }
];
const envolvimentosDependencia = [
  { id: 1, descricao: 'Rede Externa' },
  { id: 2, descricao: 'Gecex' },
  { id: 3, descricao: 'Brasil' }
];

class FormEvent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentLocale: 'pt-br',
      evento: {
        id: undefined,
        descricao: '',
        status: 1,
        tipo_evento_id: 1,
        dt_evento: new Date(),
        assunto: '',
        participantes: [],
        funcionarios: [],
        dependencias: [],
        empresas: []
      },
      participante: {
        nome: '',
        empresa: '',
        telefone: '',
        email: '',
        envolvimento: '',

        chave: ''
      },

      errors: {},

      envolvimentoFuncionario: 2,
      envolvimentoEmpresa: 1,
      envolvimentoParticipantesEmpresa: 1,
      envolvimentoDependencia: 1
    };
    this.enviaForm = this.enviaForm.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.addParticipante = this.addParticipante.bind(this);
  }

  componentDidMount() {
    if (this.props.eventoEdit) {
      this.setState({ evento: this.props.eventoEdit });
    }
  }

  handleChange = input => e => {
    this.setState(
      Object.assign(this.state.evento, { [input]: e.target.value })
    );
  };
  handleChangeParticipante = input => e => {
    this.setState(
      Object.assign(this.state.participante, { [input]: e.target.value })
    );
  };

  handleDateChange = date => {
    this.setState(
      Object.assign(this.state.evento, { dt_evento: moment.utc(date) })
    );
  };

  handleClickOpen = () => {
    this.props.myCallbackOpenDialog(true, 'newEvent');
  };

  handleClose = () => {
    this.props.myCallbackOpenDialog(false, 'newEvent');
  };

  clearEvento = () => {
    this.setState({
      evento: {
        id: undefined,
        descricao: '',
        status: 1,
        tipo_evento_id: 1,
        dt_evento: new Date(),
        assunto: '',
        participantes: [],
        funcionarios: [],
        dependencias: [],
        empresas: []
      }
    });
  };

  handleValidation() {
    const { participante } = this.state;
    let errors = {};
    let formIsValid = true;

    if (!participante.nome || participante.nome === '') {
      formIsValid = false;
      errors['participante.nome'] = 'Não pode estar vazio';
    }

    if (!participante.empresa || participante.empresa === '') {
      formIsValid = false;
      errors['participante.empresa'] = 'Não pode estar vazio';
    }
    if (!participante.telefone || participante.telefone === '') {
      formIsValid = false;
      errors['participante.telefone'] = 'Não pode estar vazio';
    }

    if (!participante.email || participante.email === '') {
      formIsValid = false;
      errors['participante.email'] = 'Não pode estar vazio';
    }

    if (!participante.envolvimento || participante.envolvimento === '') {
      formIsValid = false;
      errors['participante.envolvimento'] = 'Não pode estar vazio';
    }

    this.setState({ errors: errors });
    return formIsValid;
  }

  enviaForm = event => {
    event.preventDefault();
    if (this.handleValidationForm()) {
      let { evento } = this.state;
      console.log(evento);
      const { user, empresa } = this.props;
      let funcionario = {
        nome: user.NM_FUN,
        chave: user.CD_USU,
        envolvimento: 99,
        prefixo: user.CD_PRF_DEPE_ATU
      };
      this.setState({
        funcionarios: [...this.state.funcionarios, funcionario]
      });

      fetch(`https://uce.intranet.bb.com.br/api-timeline/v1/eventos`, {
        method: evento.id ? 'PUT' : 'POST',
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

        .then(this.props.myCallbackOpenDialog(false))
        .then(this.clearEvento())
        .catch(function(err) {
          console.error(err);
        });
    }
  };

  setDependencia = dependenciaChild => {
    let dependencias = [
      ...this.state.evento.dependencias,
      createDependencia(
        dependenciaChild.nome,
        dependenciaChild.uor,
        this.state.envolvimentoDependencia,
        dependenciaChild.prefixo,
        this.props.user.CD_USU
      )
    ];

    this.setState(
      Object.assign(this.state.evento, {
        dependencias: dependencias
      })
    );
  };

  setFuncionario = funcionariosChild => {
    let funcionarios = [
      ...this.state.evento.funcionarios,
      createFuncionario(
        funcionariosChild.nome,
        funcionariosChild.chave,
        funcionariosChild.envolvimento || this.state.envolvimento,
        funcionariosChild.prefixo,
        this.props.user.CD_USU
      )
    ];

    this.setState(
      Object.assign(this.state.evento, {
        funcionarios: funcionarios
      })
    );
  };

  setEmpresas = empresaDataChild => {
    let empresas = [
      ...this.state.evento.empresas,
      createEmpresa(
        empresaDataChild.nome,
        empresaDataChild.mci,
        empresaDataChild.cod_pais,
        empresaDataChild.pais,
        empresaDataChild.tabela_origem,
        empresaDataChild.bloco_origem,
        this.state.envolvimentoEmpresa,
        this.props.user.CD_USU
      )
    ];

    this.setState(
      Object.assign(this.state.evento, {
        empresas: empresas
      })
    );
  };

  addParticipante = event => {
    const { participante, evento } = this.state;
    event.preventDefault();

    if (this.handleValidation()) {
      let participantes = [
        ...evento.participantes,
        createParte(
          participante.envolvimento,
          participante.empresa,
          participante.nome,
          participante.telefone,
          participante.email
        )
      ];

      this.setState(
        Object.assign(this.state.evento, {
          participantes: participantes
        })
      );

      this.setState({
        participante: {
          nome: '',
          empresa: '',
          telefone: '',
          email: '',
          tipo_envolvimento_id: ''
        }
      });
    }
  };
  deleteItemListbyId = (id, target) => {
    switch (target) {
      case 'empresa':
        this.setState(
          Object.assign(this.state.evento, {
            empresas: this.state.evento.empresas.filter(item => {
              return item.id !== id[0];
            })
          })
        );

        break;
      case 'funcionario':
        this.setState(
          Object.assign(this.state.evento, {
            funcionarios: this.state.evento.funcionarios.filter(item => {
              return item.id !== id[0];
            })
          })
        );

        break;
      case 'dependencia':
        this.setState(
          Object.assign(this.state.evento, {
            dependencias: this.state.evento.dependencias.filter(item => {
              return item.id !== id[0];
            })
          })
        );

        break;

      case 'participantes':
        this.setState(
          Object.assign(this.state.evento, {
            participantes: this.state.evento.participantes.filter(item => {
              return item.id !== id[0];
            })
          })
        );

        break;

      default:
        break;
    }
  };

  handleValidationForm() {
    const { evento } = this.state;
    let errors = {};
    let formIsValid = true;

    if (evento.descricao === '') {
      formIsValid = false;
      errors['evento.descricao'] = 'Não pode estar vazio';
    }

    if (evento.assunto === '') {
      formIsValid = false;
      errors['evento.assunto'] = 'Não pode estar vazio';
    }

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

  render() {
    const locale = localeMap[this.state.currentLocale];

    const { classes, open, user } = this.props;
    console.log(user);
    const {
      evento,
      errors,
      participante,
      envolvimentoDependencia,
      envolvimentoFuncionario,
      envolvimentoEmpresa
    } = this.state;

    return (
      <div>
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
                {evento ? 'Editar Evento' : 'Novo Evento'}
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
                  placeholder="Assunto/Tema"
                  error={!errors['evento.assunto'] ? false : true}
                  helperText={errors['evento.assunto']}
                  className={classes.inputs}
                  margin="normal"
                  fullWidth
                  value={evento['assunto']}
                  onChange={this.handleChange('assunto')}
                />

                <TextField
                  InputLabelProps={{
                    shrink: true
                  }}
                  label="Descrição"
                  placeholder="Descrição"
                  error={!errors['evento.descricao'] ? false : true}
                  helperText={errors['evento.descricao']}
                  className={classes.inputs}
                  margin="normal"
                  fullWidth
                  multiline
                  rows={10}
                  value={evento['descricao']}
                  onChange={this.handleChange('descricao')}
                />

                <FormControl fullWidth className={classes.inputs}>
                  <InputLabel htmlFor="tipo-evento-simple">
                    Tipo Evento
                  </InputLabel>
                  <Select
                    value={evento['tipo_evento_id']}
                    onChange={this.handleChange('tipo_evento_id')}
                    inputProps={{
                      name: 'tipo_evento_id',
                      id: 'tipo-evento-simple'
                    }}
                  >
                    <MenuItem value={1}>Visita</MenuItem>
                    <MenuItem value={3}>Ligação</MenuItem>
                    <MenuItem value={8}>E-mail</MenuItem>
                    <MenuItem value={9}>Observações</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth className={classes.inputs}>
                  <InputLabel htmlFor="status-simple">Status</InputLabel>
                  <Select
                    value={evento.status}
                    onChange={this.handleChange('status')}
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
                    value={envolvimentoDependencia}
                    onChange={this.handleChange('envolvimentoDependencia')}
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
                  addSuggestion={this.setDependencia}
                  className={classes.inputs}
                />
                <TableDependencia
                  data={evento.dependencias || []}
                  className={classes.inputs}
                  deleteItemListbyId={this.deleteItemListbyId}
                />
              </div>
              <div className={classes.formSection}>
                <Typography variant="h5" gutterBottom>
                  Participantes BB
                </Typography>
                <Divider />
                <FormControl fullWidth className={classes.inputs}>
                  <InputLabel htmlFor="envolvimentoFuncionario-simple">
                    Envolvimento
                  </InputLabel>
                  <Select
                    value={envolvimentoFuncionario}
                    onChange={this.handleChange('envolvimentoFuncionario')}
                    className={classes.inputs}
                    inputProps={{
                      name: 'envolvimentoFuncionario',
                      id: 'envolvimentoFuncionario-simple'
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
                <BuscaFunci
                  setFuncionario={this.setFuncionario}
                  errors={errors}
                />
                <TableFunci
                  data={evento.funcionarios || []}
                  className={classes.inputs}
                  deleteItemListbyId={this.deleteItemListbyId}
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
                    value={envolvimentoEmpresa}
                    onChange={this.handleChange('envolvimentoEmpresa')}
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
                  addSuggestion={this.setEmpresas}
                  errors={errors}
                />
                <TableEmpresa
                  data={evento.empresas || []}
                  className={classes.inputs}
                  deleteItemListbyId={this.deleteItemListbyId}
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
                  error={!errors['participante.envolvimento'] ? false : true}
                  helperText={errors['participante.envolvimento']}
                  className={classes.textField}
                  value={participante['envolvimento']}
                  onChange={this.handleChangeParticipante('envolvimento')}
                  margin="normal"
                />

                <TextField
                  InputLabelProps={{
                    shrink: true
                  }}
                  id="standard-empresa"
                  label="Empresa"
                  fullWidth
                  error={!errors['participante.empresa'] ? false : true}
                  helperText={errors['participante.empresa']}
                  className={classes.textField}
                  value={participante['empresa']}
                  onChange={this.handleChangeParticipante('empresa')}
                  margin="normal"
                />
                <TextField
                  InputLabelProps={{
                    shrink: true
                  }}
                  id="standard-nome"
                  label="Nome"
                  fullWidth
                  error={!errors['participante.nome'] ? false : true}
                  helperText={errors['participante.nome']}
                  className={classes.textField}
                  value={participante['nome']}
                  onChange={this.handleChangeParticipante('nome')}
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
                  error={!errors['participante.telefone'] ? false : true}
                  helperText={errors['participante.telefone']}
                  className={classes.textField}
                  value={participante['telefone']}
                  onChange={this.handleChangeParticipante('telefone')}
                  margin="normal"
                />

                <TextField
                  InputLabelProps={{
                    shrink: true
                  }}
                  id="standard-email"
                  label="Email"
                  placeholder="example@example.com"
                  error={!errors['participante.email'] ? false : true}
                  helperText={errors['participante.email']}
                  fullWidth
                  className={classes.textField}
                  value={participante['email']}
                  onChange={this.handleChangeParticipante('email')}
                  margin="normal"
                />
                <Button fullWidth onClick={this.addParticipante}>
                  Adicionar participante
                </Button>
                <TableParticipante
                  data={evento.participantes || []}
                  deleteItemListbyId={this.deleteItemListbyId}
                />

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
      </div>
    );
  }
}

FormEvent.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(FormEvent);
