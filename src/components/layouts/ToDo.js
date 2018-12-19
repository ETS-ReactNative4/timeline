import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';

import { Typography, Paper } from '@material-ui/core';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
const styles = theme => ({});

class ToDo extends React.Component {
  render() {
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
            <Paper>
              <Typography variant="h5">Pendencias BB</Typography>
              <Fab color="primary" aria-label="Add" className={classes.fab}>
                <AddIcon />
              </Fab>
            </Paper>
          </Grid>
          <Grid item lg={6}>
            <Paper>
              <Typography variant="h5">Pendencias Empresa</Typography>
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
