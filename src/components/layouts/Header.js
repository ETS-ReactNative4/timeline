import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { Route } from 'react-router-dom';
import FormEvent from './FormEvent';
import Busca from './busca/Busca';
import FormControl from '@material-ui/core/FormControl';
import logo from '../../bancodobrasil.png';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CardGrid from './CardGrid';
import { Avatar } from '@material-ui/core';

//https://uce.intranet.bb.com.br/timeline/?visao=1&bloco_origem=4&cnpj=05.721.752/0001-65&cod_pais=23&mci=509277368&nm_prefixo_redex=FRANKFURT%20ALEMANHA&nome=ADIDAS%20AG&pais=ALEMANHA&prefixo_redex=720&tabela_origem=2

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#1565c0',
      dark: '#0d47a1'
    }
  }
});

let counterDep = 0;
function createDependencia(nome, uor, envolvimento, prefixo) {
  counterDep += 1;
  return { id: counterDep, nome, uor, envolvimento, prefixo };
}

let counter = 0;
function createFuncionario(nome, chave, envolvimento, prefixo) {
  counter += 1;
  return { id: counter, nome, chave, envolvimento, prefixo };
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

class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      visao: 1,
      url: 'https://uce.intranet.bb.com.br/api-timeline/v1/empresas/',
      urlEventos:
        'https://uce.intranet.bb.com.br/api-timeline/v1/eventos/empresa/',
      eventos: [],
      empresa: window.sessionStorage.objetoBusca
        ? JSON.parse(window.sessionStorage.objetoBusca)
        : {},
      descricao: '',

      dt_evento: new Date(),
      funcionario: {},
      funcionarios: [],
      envolvimento: 1,
      empresas: [],
      envolvimentoEmpresa: 1,
      envolvimentoParticipantesEmpresa: 1,
      dependencias: [],
      envolvimentoDependencia: 1,
      tipo_envolvimento_id: 1,
      status: 1,
      comentario: '',
      id: undefined,

      dados: {}
    };
  }

  setSelectedDate = date => {
    this.setState({ dt_evento: date });
  };

  componentWillMount() {
    const { user } = this.props;
    this.setState({ visao: window.sessionStorage.visao || 1 });
    let empresa = window.sessionStorage.objetoBusca
      ? JSON.parse(window.sessionStorage.objetoBusca)
      : {};
    let params = new URLSearchParams(this.props.location.search);
    if (parseInt(params.get('visao'), 10)) {
      empresa = this.handleParams(params);
    }
    if (user) {
      this.myCallback({
        nome: user.NM_FUN,
        chave: user.CD_USU,
        envolvimento: 1,
        prefixo: user.CD_PRF_DEPE_ATU
      });
    }

    if (JSON.stringify(empresa) !== '{}') {
      this.getEventos(empresa);
    }
  }

  handleParams(params) {
    this.handleChangeSelect(1);
    let empresaParams = createEmpresa(
      params.get('nome'),
      parseInt(params.get('mci'), 10),
      parseInt(params.get('cod_pais'), 10),
      params.get('pais'),
      parseInt(params.get('tabela_origem')),
      parseInt(params.get('bloco_origem'))
    );

    return empresaParams;
  }

  handleChangeSelect(option) {
    switch (option) {
      case 1:
        this.setState({
          url: 'https://uce.intranet.bb.com.br/api-timeline/v1/empresas/',
          urlEventos:
            'https://uce.intranet.bb.com.br/api-timeline/v1/eventos/empresa/'
        });
        break;
      case 2:
        this.setState({
          url: 'https://uce.intranet.bb.com.br/api-timeline/v1/dependencias/',
          urlEventos:
            'https://uce.intranet.bb.com.br/api-timeline/v1/eventos/dependencias/'
        });
        break;
      case 3:
        this.setState({
          url: 'https://uce.intranet.bb.com.br/api-timeline/v1/funcionarios/',
          urlEventos:
            'https://uce.intranet.bb.com.br/api-timeline/v1/eventos/funcionarios/'
        });
        break;
      default:
        this.setState({
          url: 'https://uce.intranet.bb.com.br/api-timeline/v1/empresa/',
          urlEventos: 'https://uce.intranet.bb.com.br/api-timeline/v1/eventos/'
        });
        break;
    }
  }

  myCallbackBusca = empresaChild => {
    salvarUltimaPesaquisaCache(1, empresaChild);
    this.setState({ empresa: empresaChild });
    if (empresaChild !== {}) {
      this.getEventos(empresaChild);
    }
  };

  myCallbackOpenDialog = open => {
    this.setState({ open: open });
  };

  setEventos = data => {
    console.log(data);

    this.setState({ eventos: data });
  };

  clearEvento = () => {
    this.setState({ id: undefined });
    this.setState({ descricao: '' });
    this.setState({ dt_create: new Date() });
    this.setState({ dt_evento: new Date() });
    this.setState({ tipo_envolvimento_id: 1 });
    this.setState({ status: 1 });
    this.setState({ dependencias: [] });
    this.setState({ funcionarios: [] });
    this.setState({ empresas: [] });
  };
  setEvento = data => {
    this.setState({ id: data.id });
    this.setState({ descricao: data.descricao });
    this.setState({ dt_create: data.dt_create });
    this.setState({ dt_evento: data.dt_evento });
    this.setState({ tipo_envolvimento_id: data.tipo_envolvimento_id });
    this.setState({ status: data.status });

    this.setState({ dependencias: data.dependencias });
    this.setState({ funcionarios: data.funcionarios });
    this.setState({ empresas: data.empresas });
  };

  deleteItemListbyId = (id, target) => {
    switch (target) {
      case 'empresa':
        const { empresas } = this.state;
        this.setState({
          empresas: empresas.filter(item => {
            return item.id !== id;
          })
        });

        break;
      case 'funcionario':
        const { funcionarios } = this.state;
        this.setState({
          funcionarios: funcionarios.filter(item => {
            return item.id !== id;
          })
        });

        break;
      case 'dependencia':
        const { dependencias } = this.state;
        this.setState({
          dependencias: dependencias.filter(item => {
            return item.id !== id;
          })
        });

        break;

      default:
        break;
    }
  };

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
  myCallbackDependencia = dependenciaChild => {
    this.setState({
      dependencias: [
        ...this.state.dependencias,
        createDependencia(
          dependenciaChild.nome,
          dependenciaChild.uor,
          this.state.envolvimentoDependencia,
          dependenciaChild.prefixo
        )
      ]
    });
  };
  myCallback = funcionariosChild => {
    this.setState({
      funcionarios: [
        ...this.state.funcionarios,
        createFuncionario(
          funcionariosChild.nome,
          funcionariosChild.chave,
          this.state.envolvimento,
          funcionariosChild.prefixo
        )
      ]
    });
  };

  myCallbackEmpresas = empresaDataChild => {
    this.setState({
      empresas: [
        ...this.state.empresas,
        createEmpresa(
          empresaDataChild.nome,
          empresaDataChild.mci,
          empresaDataChild.cod_pais,
          empresaDataChild.pais,
          empresaDataChild.tabela_origem,
          empresaDataChild.bloco_origem,
          this.state.envolvimentoEmpresa
        )
      ]
    });
  };

  handleChange = input => e => {
    this.setState({ [input]: e.target.value });
  };

  handleChangeInput = event => {
    this.setState({ [event.target.name]: event.target.value });
    this.handleChangeSelect(event.target.value);
  };

  getEventos = empresa => {
    fetch(this.state.urlEventos, {
      method: 'POST',
      body: JSON.stringify({
        empresa: empresa,
        tipoEvento: '[1, 2, 3, 4]',
        excluidos: true
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

        this.setState({ eventos: eventosFiltrado });
      })
      .then(this.getDashboardData(empresa))

      .catch(function(err) {
        console.error(err);
      });
  };

  render() {
    const { classes } = this.props;
    const { url, eventos } = this.state;
    const { user } = this.props;
    const {
      descricao,
      tipo_envolvimento_id,
      status,
      dt_evento,
      envolvimento,
      empresas,
      envolvimentoEmpresa,
      dependencias,
      envolvimentoDependencia,
      empresa,
      funcionarios,
      id,
      dados
    } = this.state;
    const evento = {
      descricao,
      tipo_envolvimento_id,
      status,
      dt_evento,
      envolvimento,
      empresas,
      envolvimentoEmpresa,
      dependencias,
      envolvimentoDependencia,
      funcionarios,
      id
    };

    return (
      <div className={classes.root}>
        <MuiThemeProvider theme={theme}>
          <AppBar position="static" color="primary">
            <Toolbar>
              <img style={{ margin: 8 }} src={logo} alt="BB" />
              <Typography
                variant="h6"
                color="inherit"
                noWrap
                className={classes.topBar}
              >
                UCE Timeline
              </Typography>
              <Avatar
                alt={this.props.user.CD_USU}
                src={
                  'https://humanograma.intranet.bb.com.br/avatar/' +
                  this.props.user.CD_USU
                }
              />
            </Toolbar>
            <Toolbar className={classes.subBar}>
              <FormControl fullWidth>
                <Busca url={url} addSuggestion={this.myCallbackBusca} />
              </FormControl>
            </Toolbar>
          </AppBar>

          <Route
            path="/timeline"
            render={props => (
              <CardGrid
                empresa={empresa}
                eventos={eventos}
                dados={dados}
                getEventos={this.getEventos}
                myCallbackOpenDialog={this.myCallbackOpenDialog}
                setEvento={this.setEvento}
                user={user}
                {...props}
              />
            )}
          />

          <FormEvent
            open={this.state.open}
            myCallbackOpenDialog={this.myCallbackOpenDialog}
            myCallbackDependencia={this.myCallbackDependencia}
            myCallback={this.myCallback}
            myCallbackEmpresas={this.myCallbackEmpresas}
            deleteItemListbyId={this.deleteItemListbyId}
            setSelectedDate={this.setSelectedDate}
            empresa={empresa}
            empresas={this.state.empresas}
            funcionarios={this.state.funcionarios}
            dependencias={this.state.dependencias}
            clearEvento={this.clearEvento}
            handleChange={this.handleChange}
            setEventos={this.setEventos}
            evento={evento}
          />
        </MuiThemeProvider>
      </div>
    );
  }
}
function salvarUltimaPesaquisaCache(visao, objeto) {
  window.sessionStorage.visao = visao;
  window.sessionStorage.objetoBusca = JSON.stringify(objeto);
}

const styles = theme => ({
  subBar: {
    backgroundColor: '#0d47a1'
  },
  root: {
    width: '100%'
  },
  topBar: { flexGrow: 1 }
});

Header.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withStyles(styles)(Header);
