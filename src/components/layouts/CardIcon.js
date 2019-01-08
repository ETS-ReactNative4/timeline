import React from 'react';
import Card from '@material-ui/core/Card';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  card: {
    float: 'left',
    margin: '-10px 0px 0 10px',
    zIndex: 500,
    borderRadius: 3
  },
  icon: {
    float: 'right',
    width: 34,
    height: 34,
    padding: 14,
    color: '#fff'
  }
};

const CardIcon = ({ Icon, classes, bgColor }) => (
  <Card className={classes.card} style={{ backgroundColor: bgColor }}>
    <Icon className={classes.icon} />
  </Card>
);

export default withStyles(styles)(CardIcon);
