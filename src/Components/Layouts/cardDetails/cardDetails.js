import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Avatar } from '@material-ui/core';

const styles = theme => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
});

function SimpleExpansionPanel(props) {
  const { classes, evento   } = props;
  return (
    <div className={classes.root}>
      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.heading}>Funcionários</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>

          <div className={classes.cardFuncionariosEnvolvidos}>

            {evento.funcionarios ? evento.funcionarios.map(funci => {
              return <Avatar key={funci.chaveFunci} className={classes.smallAvatar} src={`https://humanograma.intranet.bb.com.br/avatar/${funci.chaveFunci}`} >
                    
                    </Avatar>

            }) : ''}

          </div>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.heading}>Empresas</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
        <Typography variant="caption" className={classes.tipoEventoTitle}  >
        {evento.empresas ? evento.empresas.map(empresa => {
              return   empresa.nome 
                      

            }) : ''}
            </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel >
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.heading}>Dependências</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <div className={classes.cardFuncionariosEnvolvidos}>
            <Typography variant="caption" className={classes.tipoEventoTitle}  >
              {evento.dependencias ? evento.dependencias.map(dep => {
                return   dep.prefixo 


              }) : ''}

            </Typography>

          </div>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel >
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.heading}>Comentários</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <div className={classes.cardFuncionariosEnvolvidos}>
            <Typography variant="caption" className={classes.tipoEventoTitle}  >
              {evento.dependencias ? evento.dependencias.map(dep => {
                return   dep.prefixo 


              }) : ''}

            </Typography>

          </div>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
}

SimpleExpansionPanel.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleExpansionPanel);
