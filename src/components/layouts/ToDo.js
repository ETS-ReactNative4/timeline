import React from 'react';
import PropTypes from 'prop-types';
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
import CardIcon from './CardIcon';
import PlaylistAddCheck from '@material-ui/icons/PlaylistAddCheck';

const styles = theme => ({
  paper: { padding: theme.spacing.unit * 2 },
  tracado: { textDecorationLine: 'line-through' },
  cardCategory: {
    margin: 0,
    fontSize: '18px',
    paddingBottom: 10
  },
  root: {
    position: 'relative',
    overflow: 'auto',
    maxHeight: 250,
    minHeight: 250
  },
  divRoot: { marginTop: 25 },
  header: { textAlign: 'right' },
  exibeConcluidas: { marginRight: '0' }
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

    if (this.props.empresa !== {}) {
      this.getEventos(this.props.empresa);
    }
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
      tipo_evento_id: this.props.tipoEvento,
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
    const tarefa = this.criaTarefa();

    fetch(`https://uce.intranet.bb.com.br/api-timeline/v1/eventos`, {
      method: 'POST',
      body: JSON.stringify({
        evento: tarefa,
        empresa: this.props.empresa,
        tipoEvento: '[' + this.props.tipoEvento + ']'
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
        tipoEvento: '[' + this.props.tipoEvento + ']',
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
        const tarefasFiltradas = data.timeline || [];

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
        tipoEvento: '[' + this.props.tipoEvento + ']'
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
    const { classes, title, iconColor } = this.props;

    return (
      <div className={classes.divRoot}>
        <CardIcon bgColor={iconColor} Icon={PlaylistAddCheck} />
        <Paper className={classes.paper}>
          <div className={classes.header}>
            <Typography className={classes.cardCategory}>{title}</Typography>
            <Typography variant="h4">{tarefas.length}</Typography>
            <FormControlLabel
              className={classes.exibeConcluidas}
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
          </div>

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
            Adicionar Nova {title}
          </Button>
        </Paper>
      </div>
    );
  }
}

ToDo.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ToDo);
