import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import moment from 'moment';
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
  tracado: { textDecorationLine: 'line-through' },
  root: { position: 'relative', overflow: 'auto', maxHeight: 300 }
});

class ToDo extends React.Component {
  constructor(props) {
    super(props);
    this.addItem = this.addItem.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.getEventos = this.getEventos.bind(this);

    this.state = {
      tarefa: '',
      tarefas: [],
      tarefasTodas: [],
      checkedB: false
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.empresa !== this.props.empresa) {
      this.getEventos(this.props.empresa);
    }
  }

  handleChange = input => e => {
    this.setState({ [input]: e.target.value });
  };

  handleToggle = input => e => {
    let tarefa = input;

    if (tarefa.dt_delete) {
      delete tarefa.dt_delete;
    } else {
      tarefa.dt_delete = new Date();
    }
    this.editaEvento(tarefa);
  };

  handleChangeLista = name => event => {
    const { tarefasTodas } = this.state;
    this.setState({ [name]: event.target.checked });
    this.setState({
      tarefas: this.getVisibleTodos(tarefasTodas, event.target.checked)
    });
  };

  addItem = e => {
    if (this.state.tarefa === '') {
      return;
    }
    this.enviaEvento(this.criaTarefa());
    this.setState({
      tarefa: ''
    });
    e.preventDefault();
  };

  criaTarefa = () => {
    let { empresa, user } = this.props;
    empresa.tipo_envolvimento_id = 1;
    let tarefa = {
      descricao: this.state.tarefa,
      dt_evento: new Date(),
      tipo_envolvimento_id: 5,
      status: 3,
      funcionarios: [
        {
          id: 1,
          nome: user.NM_FUN,
          chave: user.CD_USU,
          tipo_envolvimento_id: 1,
          prefixo: user.CD_PRF_DEPE_ATU
        }
      ],
      dependencias: [
        {
          nome: user.NM_PSC_RDZ,
          uor: user.CD_UOR_PSC,
          tipo_envolvimento_id: 1,
          prefixo: user.CD_PRF_DEPE_ATU
        }
      ],
      empresas: [empresa]
    };

    return tarefa;
  };

  enviaEvento = () => {
    let { empresa } = this.props;
    const tarefa = this.criaTarefa();

    fetch(`https://uce.intranet.bb.com.br/api-timeline/v1/eventos`, {
      method: 'POST',
      body: JSON.stringify({
        evento: tarefa,
        empresa: this.props.empresa,
        tipoEvento: '[5,6]'
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
    fetch(`https://uce.intranet.bb.com.br/api-timeline/v1/eventos`, {
      method: 'PUT',
      body: JSON.stringify({
        evento: tarefa,
        empresa: this.props.empresa,
        tipoEvento: '[5,6]'
      }),
      headers: {
        'x-access-token': window.sessionStorage.token,
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(response => {
        const tarefasFiltradas = response.timeline;

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
  }

  render() {
    const { tarefas, tarefa } = this.state;
    const { classes } = this.props;

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
              <List dense className={classes.root}>
                {tarefas.map((tarefa, index) => (
                  <ListItem key={tarefa.id} button>
                    <ListItemText
                      primary={tarefa.descricao}
                      secondary={
                        tarefa.dt_delete
                          ? 'Concluído: ' +
                            moment(tarefa.dt_delete)
                              .locale('pt-BR')
                              .format('DD/MM/YYYY')
                          : moment(tarefa.dt_create)
                              .locale('pt-BR')
                              .format('DD/MM/YYYY')
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
