import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  Paper,
  FormControlLabel,
  Checkbox,
  TextField,
  Button,
  ListItemSecondaryAction,
  ListItem,
  ListItemText,
  List,
  Switch
} from '@material-ui/core';
import Divider from '@material-ui/core/Divider';

const styles = theme => ({
  paper: { padding: theme.spacing.unit * 2 },
  tracado: { textDecorationLine: 'line-through' }
});

class ToDo extends React.Component {
  constructor(props) {
    super(props);
    this.addItem = this.addItem.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.getEventos = this.getEventos.bind(this);

    this.state = {
      ...props,
      tarefa: '',
      tarefas: [],
      tarefasTodas: [],
      checkedB: false
    };
  }

  componentWillMount() {
    const { empresa } = this.props;
    this.getEventos(empresa);
  }

  handleChange = input => e => {
    this.setState({ [input]: e.target.value });
  };

  handleToggle = input => e => {
    let tarefa = input;

    tarefa.concluida = !tarefa.concluida;
    if (!tarefa.concluida) {
      delete tarefa.dt_delete;
    } else {
      tarefa.dt_delete = new Date();
    }

    /* this.handleCommentEdit(tarefa.id, !tarefa.concluida);*/

    this.editaEvento(tarefa);
  };

  /*handleCommentEdit = (key, checked) => {
    this.setState({
      tarefas: this.state.tarefas.map(el =>
        el.id === key ? Object.assign({}, el  )
    });
  };*/

  handleChangeLista = name => event => {
    const { tarefasTodas, tarefas } = this.state;

    this.setState({ [name]: event.target.checked });
    this.setState({
      tarefas: this.getVisibleTodos(tarefasTodas, event.target.checked)
    });
  };

  addItem = e => {
    let { empresa, user } = this.props;
    if (this.state.tarefa == '') {
      return;
    }
    let tarefa = {
      descricao: this.state.tarefa,
      id: Date.now(),
      dt_evento: new Date(),
      tipo_envolvimento_id: 5,
      status: 3,
      funcionarios: [
        {
          id: 1,
          nome: user.NM_FUN,
          chave: user.CD_USU,
          envolvimento: 1,
          prefixo: user.CD_PRF_DEPE_ATU
        }
      ],
      dependencias: [
        {
          nome: user.NM_PSC_RDZ,
          uor: user.CD_UOR_PSC,
          envolvimentoDependencia: 1,
          prefixo: user.CD_PRF_DEPE_ATU
        }
      ]
    };
    this.setState({
      tarefas: [...this.state.tarefas, tarefa]
    });
    this.setState({
      tarefa: ''
    });

    this.enviaEvento(tarefa);
    e.preventDefault();
  };

  enviaEvento(tarefa) {
    let { empresa, user } = this.props;

    empresa.envolvimentoEmpresa = 1;
    tarefa.empresas = [empresa];
    tarefa.funcionarios = [
      {
        id: 1,
        nome: user.NM_FUN,
        chave: user.CD_USU,
        envolvimento: 1,
        prefixo: user.CD_PRF_DEPE_ATU
      }
    ];

    const data = { evento: tarefa };

    fetch(`https://uce.intranet.bb.com.br/api-timeline/v1/eventos`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'x-access-token': window.sessionStorage.token,
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      }
    })
      .then(response => console.log(response.json()))
      .then(this.getEventos(empresa))
      .catch(function(err) {
        console.error(err);
      });
  }

  getEventos = empresa => {
    fetch('https://uce.intranet.bb.com.br/api-timeline/v1/eventos/empresa', {
      method: 'POST',
      body: JSON.stringify({
        empresa: empresa,
        tipoEvento: '[5,6]',
        excluidos: false
      }),

      headers: {
        'x-access-token': window.sessionStorage.token,
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        const tarefasFiltradas = data.timeline;

        this.setState({
          tarefas: this.getVisibleTodos(tarefasFiltradas, this.state.checkedB)
        });

        this.setState({
          tarefasTodas: tarefasFiltradas
        });
      })

      .catch(function(err) {
        console.error(err);
      });
  };

  getVisibleTodos = (tarefas, filter) => {
    switch (filter) {
      case false:
        return tarefas.filter(t => !t.dt_delete);
      case true:
      default:
        return tarefas;
    }
  };
  editaEvento(tarefa) {
    let { empresa } = this.props;
    empresa.envolvimentoEmpresa = 1;
    tarefa.empresas = [empresa];
    const data = { evento: tarefa };

    fetch(`https://uce.intranet.bb.com.br/api-timeline/v1/eventos`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'x-access-token': window.sessionStorage.token,
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(this.getEventos(empresa))
      .catch(function(err) {
        console.error(err);
      });
  }

  render() {
    const { tarefas } = this.state;
    const { classes } = this.props;
    const { tarefa, checkedB } = this.state;

    return (
      <div>
        <Grid
          className={classNames(classes.container)}
          container
          item
          direction="row"
          justify="center"
          alignItems="center"
          spacing={16}
          sm={12}
          md={12}
          lg={12}
        >
          <Grid item lg={6}>
            <Paper className={classes.paper}>
              <Typography variant="subtitle1">Pendências BB</Typography>

              <FormControlLabel
                control={
                  <Switch
                    checked={this.state.checkedB}
                    onChange={this.handleChangeLista('checkedB')}
                    value="checkedB"
                    color="primary"
                  />
                }
                label="Exibe concluídas"
              />
              <List dense>
                {tarefas.map(tarefa => (
                  <ListItem key={tarefa.id} button>
                    <ListItemText
                      primary={tarefa.descricao}
                      className={
                        tarefa.dt_delete ? classes.tracado : classes.naoTracado
                      }
                    />
                    <ListItemSecondaryAction>
                      <Checkbox
                        onClick={this.handleToggle(tarefa)}
                        checked={tarefa.dt_delete}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>

              <TextField
                label="Tarefa"
                placeholder="Tarefa"
                multiline
                className={classes.inputs}
                margin="normal"
                fullWidth
                value={tarefa}
                onChange={this.handleChange('tarefa')}
              />
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                type="submit"
                onClick={this.addItem}
              >
                Adicionar Tarefa
              </Button>
            </Paper>
          </Grid>
          <Grid item lg={6}>
            <Paper>
              <Typography variant="h5">Pendências Empresa</Typography>
              <Divider />
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

ToDo.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ToDo);
