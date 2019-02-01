import React from 'react';
import { Typography, Avatar, Paper } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  cardProfileCarteira: {
    display: 'flex',
    flexDirection: 'column'
  },
  cardHeader: { background: '#1565c02e' },
  cardContent: {
    padding: 16,
    paddingTop: 16,
    display: 'flex',
    justifyContent: 'space-evenly',
    flexDirection: 'column'
  },
  parentGroupInformation: {
    display: 'flex',

    flexWrap: 'wrap'
  },
  groupInformation: {
    display: 'flex',
    justifyContent: 'space-evenly',
    flexDirection: 'column',
    flexGrow: 1,
    paddingRight: 12,
    paddingLeft: 12,
    marginBottom: 24
  },
  cardLabel: {
    fontSize: 16,
    fontWeight: '500',
    flexGrow: 1,
    borderBottom: '1px solid #e0e0e0'
  },
  cardInformation: {
    fontSize: 16,
    flexGrow: 1,
    borderBottom: '1px solid #e0e0e0'
  },
  bigAvatar: {
    marginTop: 0,
    marginLeft: 24,
    bottom: -24,
    width: 100,
    height: 100
  }
};

const ProfileItem = props => {
  const { classes, title, information } = props;
  return (
    <div className={classes.groupInformation}>
      <Typography className={classes.cardLabel}>{title}</Typography>
      <Typography className={classes.cardInformation}>
        {information || ' - '}
      </Typography>
    </div>
  );
};

const ProfileEmpresa = props => {
  const { empresa, classes } = props;

  return (
    <Paper>
      <div className={classes.cardHeader}>
        {empresa.genin ? (
          <Avatar
            className={classes.bigAvatar}
            alt={empresa.chave}
            src={
              'https://humanograma.intranet.bb.com.br/avatar/' + empresa.chave
            }
          />
        ) : null}
      </div>

      <div className={classes.cardContent}>
        <div className={classes.parentGroupInformation}>
          <ProfileItem
            classes={classes}
            title={'MCI'}
            information={empresa.mci}
          />

          <ProfileItem
            classes={classes}
            title={'CNPJ'}
            information={empresa.cnpj}
          />
          <ProfileItem
            classes={classes}
            title={'Grupo Econômico'}
            information={empresa.grupo}
          />

          <ProfileItem
            classes={classes}
            title={'Prefixo Responsável'}
            information={empresa.cnpj}
          />

          <ProfileItem
            classes={classes}
            title={'Situação CNPJ RFB'}
            information={empresa.receita_nm_situacao}
          />

          <ProfileItem
            classes={classes}
            title={'Situação Empresa'}
            information={empresa.cnpj}
          />
          <ProfileItem
            classes={classes}
            title={'País'}
            information={empresa.pais}
          />
          <ProfileItem
            classes={classes}
            title={'Município'}
            information={empresa.municipio}
          />
          <ProfileItem
            classes={classes}
            title={'Estado'}
            information={empresa.estado}
          />
        </div>
      </div>
    </Paper>
  );
};

export default withStyles(styles)(ProfileEmpresa);
