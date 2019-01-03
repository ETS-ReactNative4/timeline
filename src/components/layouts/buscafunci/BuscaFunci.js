import React from 'react';
import PropTypes from 'prop-types';
import deburr from 'lodash/deburr';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';

const WAIT_INTERVAL = 1500;

const suggestions = [];

function renderInputComponent(inputProps) {
  const { classes, errors, inputRef = () => {}, ref, ...other } = inputProps;

  return (
    <TextField
      fullWidth
      error={!errors['evento.empresas'] ? false : true}
      helperText={errors['evento.empresas']}
      InputLabelProps={{
        shrink: true
      }}
      InputProps={{
        inputRef: node => {
          ref(node);
          inputRef(node);
        },
        classes: {
          input: classes.input
        }
      }}
      {...other}
    />
  );
}

function renderSuggestion(suggestion, { query, isHighlighted }) {
  const matches = match(suggestion.nome, query);
  const parts = parse(suggestion.nome, matches);

  return (
    <MenuItem selected={isHighlighted} component="div">
      <div>
        {parts.map((part, index) => {
          return part.highlight ? (
            <span key={String(index)} style={{ fontWeight: 500 }}>
              {part.text}
            </span>
          ) : (
            <strong key={String(index)} style={{ fontWeight: 300 }}>
              {part.text}
            </strong>
          );
        })}
      </div>
    </MenuItem>
  );
}

function getSuggestions(value) {
  const inputValue = deburr(value.trim()).toLowerCase();
  const inputLength = inputValue.length;
  let count = 0;

  return inputLength === 0
    ? []
    : suggestions.filter(suggestion => {
        const keep =
          count < 5 &&
          suggestion.nome.slice(0, inputLength).toLowerCase() === inputValue;

        if (keep) {
          count += 1;
        }

        return keep;
      });
}

function getSuggestionValue(suggestion) {
  return '';
}

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  container: {
    position: 'relative',
    marginTop: theme.spacing.unit * 2
  },
  suggestionsContainerOpen: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0
  },
  suggestion: {
    display: 'block'
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none'
  },

  divider: {
    height: theme.spacing.unit * 2
  }
});

class BuscaFunci extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      popper: '',
      suggestions: [],
      selected: []
    };
    this.triggerChange = this.triggerChange.bind(this);
  }

  componentWillMount() {
    this.timer = null;
  }

  handleSuggestionSelected = (
    event,
    { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }
  ) => {
    this.props.setFuncionario(suggestion);
  };
  handleSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: getSuggestions(value)
    });
  };

  handleSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  search = event => {
    clearTimeout(this.timer);
    this.setState({ value: event.target.value });

    this.timer = setTimeout(this.triggerChange, WAIT_INTERVAL);
  };

  triggerChange() {
    const { value } = this.state;
    const url = new URL(
      'https://uce.intranet.bb.com.br/api-timeline/v1/funcionarios/' +
        value.replace(/\s/g, '')
    );
    //Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))

    fetch(url, {
      method: 'GET',
      headers: {
        'x-access-token': window.sessionStorage.token,
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        this.setState({ suggestions: data.users[0] });
      })
      .catch(function(err) {
        console.error(err);
      });
  }

  handleChange = name => (event, { newValue }) => {
    //this.props.addFuncionario(newValue)

    this.setState({
      [name]: newValue
    });
  };

  render() {
    const { classes, errors } = this.props;

    const { value } = this.state;

    const autosuggestProps = {
      renderInputComponent,
      suggestions: this.state.suggestions,
      onSuggestionsFetchRequested: this.handleSuggestionsFetchRequested,
      onSuggestionsClearRequested: this.handleSuggestionsClearRequested,

      onSuggestionSelected: this.handleSuggestionSelected,
      getSuggestionValue,
      renderSuggestion
    };

    return (
      <div className={classes.root}>
        <Autosuggest
          {...autosuggestProps}
          inputProps={{
            classes,
            errors,
            label: 'Buscar funcionários',
            placeholder: 'Buscar por Chave, Nome',
            value: value,
            onKeyUp: this.search,
            onChange: this.handleChange('value')
          }}
          theme={{
            container: classes.container,
            suggestionsContainerOpen: classes.suggestionsContainerOpen,
            suggestionsList: classes.suggestionsList,
            suggestion: classes.suggestion
          }}
          renderSuggestionsContainer={options => (
            <Paper {...options.containerProps} square>
              {options.children}
            </Paper>
          )}
        />
      </div>
    );
  }
}

BuscaFunci.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(BuscaFunci);
