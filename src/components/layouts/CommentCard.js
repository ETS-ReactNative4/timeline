import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Typography, Divider, Grid, Avatar, Hidden } from '@material-ui/core';
import moment from 'moment';
import 'moment/locale/pt-br';

const styles = theme => ({
  comment: {
    margin: theme.spacing.unit,
    marginTop: theme.spacing.unit,
    padding: theme.spacing.unit
  },
  header: {
    display: 'flex',
    fontSize: '1em'
  },
  headerNome: {
    marginRight: theme.spacing.unit,
    fontWeight: 'bold',
    color: '#646464',
    textTransform: 'uppercase'
  },
  headerChave: {
    color: '#646464',
    flexGrow: 1
  },
  content: {
    marginTop: theme.spacing.unit
  },
  headerDate: {
    color: '#646464',
    textAlign: 'right',
    marginRight: theme.spacing.unit * 2,
    marginLeft: theme.spacing.unit * 2
  }
});

class CommentCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { classes, comentario, language } = this.props;

    return (
      <Fragment>
        <Grid container spacing={8} className={classes.comment}>
          <Grid item xs={2} md={1} lg={1}>
            <Avatar
              alt={comentario.nome}
              src={
                'https://humanograma.intranet.bb.com.br/avatar/' +
                comentario.chaveFunci
              }
            />
          </Grid>
          <Grid item xs={10} md={11} lg={11}>
            <Grid item className={classes.header}>
              <Typography className={classes.headerNome}>
                {comentario.nome}
              </Typography>
              <Typography className={classes.headerChave}>
                {comentario.chaveFunci}
              </Typography>
              <Hidden mdDown>
                <Typography className={classes.headerDate}>
                  {moment
                    .utc(comentario.dt_create)
                    .locale(language)
                    .format('LLLL')}
                </Typography>
              </Hidden>
              <Hidden mdUp>
                <Typography className={classes.headerDate}>
                  {moment
                    .utc(comentario.dt_create)
                    .locale(language)
                    .format('L')}
                </Typography>
              </Hidden>
            </Grid>
            <Typography className={classes.content}>
              {comentario.descricao}
            </Typography>
          </Grid>
        </Grid>
        <Divider />
      </Fragment>
    );
  }
}

CommentCard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(CommentCard);
