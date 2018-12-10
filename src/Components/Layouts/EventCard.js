import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import moment from 'moment'
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import blue from '@material-ui/core/colors/blue';
import red from '@material-ui/core/colors/red';
import purple from '@material-ui/core/colors/purple';
import ConfirmationDialogRaw from './ConfirmationDialogRaw';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SimpleExpansionPanel from './cardDetails/cardDetails'
import { Menu, MenuItem } from '@material-ui/core';


const styles = theme => ({
  card:{ 
    width : '100%' ,
    marginTop:  theme.spacing.unit,

  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
 
  blueAvatar: {
    margin: 10,
    backgroundColor: blue[800],

  },
  cardFuncionariosEnvolvidos: {
    display: 'flex',

  },
  tipoEvento: {
    display: 'flex',
  },
  tipoEventoColor1:{ margin: '10px 10px 0px 10px',
  padding: 10,
  backgroundColor: red[800],},

  tipoEventoColor2:{ margin: '10px 10px 0px 10px',
  padding: 10,
  backgroundColor: purple[800],},

  tipoEventoColorBlue: {
    margin: '10px 10px 0px 10px',
    padding: 10,
    backgroundColor: blue[800],
  },
  tipoEventoTitle: {
    marginTop: 13,
  },

  cardHeader: {
    margin: '0px 16px 0px 0px',
    padding: 8,
  },
  smallAvatar: {
    width: 25,
    height: 25,
    margin: 5,
  },
});


class EventCard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {  
      anchorEl: null,  
      expanded: false,
      open: false,
      
      };

    this.excluir = this.excluir.bind()
  }
  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
 
  };

  handleOpenDialogExcluir = ()=>{

    this.setState({ open: !this.state.open });
  }

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleOpen = () => {
    const {evento , setEvento, myCallbackOpenDialog } = this.props
    myCallbackOpenDialog(true)
    setEvento(evento)
  };
 

  excluir = (event) =>{
    event.preventDefault();

    let {evento, empresa } = this.props
    evento.dt_delete = new Date()
   
    const data = {evento: evento,
                  empresa: empresa}

    fetch(`https://uce.intranet.bb.com.br/api-timeline/v1/eventos`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "x-access-token": window.sessionStorage.token,
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      
      .then(data => {

        this.props.setEventos(data)
      }).then(
        this.handleExpandClick()
      )
      .catch(function (err) { console.error(err); });
 
  }

  render() {
    const { anchorEl } = this.state;
    const { classes, evento } = this.props;
    const open = Boolean(anchorEl);
    
    return (
      <Fragment>
      <Card className={classes.card}  > 
        <div className={classes.tipoEvento} >
          <div className={classes.tipoEventoColor1}> </div>
          <Typography variant="caption" className={classes.tipoEventoTitle}  >
            {evento.tipo_envolvimento_descricao}
          </Typography>
        </div>

        <CardHeader className={classes.cardHeader}

        /*  avatar={
            <Avatar className={classes.blueAvatar} src={src} >
              UCE
            </Avatar>
          }*/
          action={
            <IconButton   aria-label="More"
            aria-owns={open ? 'long-menu' : undefined}
            aria-haspopup="true"
            onClick={this.handleClick}
             >
              <MoreVertIcon />
            </IconButton>
          }
 

         title={evento.empresas?evento.empresas[0].nome:''}
          subheader={moment(evento.dt_evento).locale('pt-BR').format('LLLL')  }

        />

        <CardContent>
          <Typography component="p">
            {evento.descricao}
          </Typography>
          <div>
           
            <div className={classes.cardFuncionariosEnvolvidos}>

              {evento.funcionarios?evento.funcionarios.map(funci => {
                return   < Avatar  key={funci.chaveFunci} className={ classes.smallAvatar } src={`https://humanograma.intranet.bb.com.br/avatar/${funci.chaveFunci}`} >
                   
                </Avatar>

              }):''}
          
          </div>
  
          <div className={classes.cardFuncionariosEnvolvidos}>
              <Typography variant="caption" className={classes.tipoEventoTitle}  >
                Dependências:  {evento.dependencias?evento.dependencias.map(dep => {
                            return   ` ${dep.prefixo}, `

                          }):''}
              </Typography>
          
          </div>
          </div>
        </CardContent>
        <CardActions className={classes.actions} disableActionSpacing>
          <SimpleExpansionPanel evento={evento}  />
        </CardActions>


        <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
          <CardContent>
            
          </CardContent>
        </Collapse>
        
      </Card>

<Menu
  id="long-menu"
  anchorEl={anchorEl}
  open={open}
  onClose={this.handleClose}
  >
  
  <MenuItem   onClick={this.handleOpen}>
    Editar
  </MenuItem>
  <MenuItem   onClick={this.handleOpenDialogExcluir}>
    Excluir
  </MenuItem>
 
</Menu> 

  <ConfirmationDialogRaw
                        classes={{
                            paper: classes.paper,
                        }}
                        handleOpenDialogExcluir={this.handleOpenDialogExcluir}
                        excluir={this.excluir}
                        open={this.state.open}
                      
                        value={this.props.evento}
                    />
</Fragment>
    );
  }
}


EventCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EventCard);
