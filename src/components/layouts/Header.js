import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { Route } from 'react-router-dom';

import Busca from './busca/Busca';
import FormControl from '@material-ui/core/FormControl';
import logo from '../../bancodobrasil.png';
import flag from '../../eng.png';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CardGrid from './CardGrid';
import { Avatar } from '@material-ui/core';

//https://uce.intranet.bb.com.br/timeline/?visao=1&bloco_origem=4&cnpj=05.721.752/0001-65&cod_pais=23&mci=509277368&nm_prefixo_redex=FRANKFURT%20ALEMANHA&nome=ADIDAS%20AG&pais=ALEMANHA&prefixo_redex=720&tabela_origem=2

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#1565c0',
      dark: '#0d47a1'
    },
    secondary: {
      main: '#FEDA19'
    }
  }
});

class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visao: 1,
      url: 'https://uce.intranet.bb.com.br/api-timeline/v1/empresas/',
      urlEventos:
        'https://uce.intranet.bb.com.br/api-timeline/v1/eventos/empresa/',

      empresa: window.sessionStorage.objetoBusca
        ? JSON.parse(window.sessionStorage.objetoBusca)
        : {},

      eventos: [],
      eventoEdita: {},
      dados: {},
      language: 'pt-BR'
    };
  }
  userLanguege() {
    const language = window.navigator.userLanguage || window.navigator.language;

    this.setState({ language: language });
  }

  componentWillMount() {
    this.setState({ visao: window.sessionStorage.visao || 1 });
    let empresa = window.sessionStorage.objetoBusca
      ? JSON.parse(window.sessionStorage.objetoBusca)
      : {};
    let params = new URLSearchParams(this.props.location.search);
    if (parseInt(params.get('visao'), 10)) {
      empresa = this.handleParams(params);
    }

    if (JSON.stringify(empresa) !== '{}') {
      this.getEventos(empresa);
    }
    this.userLanguege();
  }

  handleParams(params) {
    this.handleChangeSelect(1);
    let empresaParams = {
      nome: params.get('nome'),
      mci: parseInt(params.get('mci'), 10),
      cod_pais: parseInt(params.get('cod_pais'), 10),
      pais: params.get('pais'),
      tabela_origem: parseInt(params.get('tabela_origem')),
      bloco_origem: parseInt(params.get('bloco_origem'))
    };

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

  setDados = dados => {
    this.setState({ dados: dados });
  };

  setEventos = data => {
    this.setState({ eventos: data });
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
        tipoEvento: '[1, 2, 3, 4, 7, 8, 9]',
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

        this.setDados(data.dados[0]);
      })

      .catch(function(err) {
        console.error(err);
      });
  };

  render() {
    const { classes } = this.props;
    const { url, eventos, language } = this.state;
    const { user } = this.props;
    const { empresa, dados } = this.state;

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
              <img
                style={{ margin: 8 }}
                id="eng"
                src={flag}
                alt="Flag English"
              />
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
                language={language}
                empresa={empresa}
                eventos={eventos}
                dados={dados}
                getEventos={this.getEventos}
                setEventos={this.setEventos}
                setEvento={this.setEvento}
                setDados={this.setDados}
                user={user}
                {...props}
              />
            )}
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
