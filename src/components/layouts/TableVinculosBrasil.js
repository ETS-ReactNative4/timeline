import React from 'react';
import {
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  table: { marginTop: 8 },
  cardCategory: {
    margin: 0,
    fontSize: '18px',
    paddingLeft: 16,
    paddingTop: 16,
    paddingBottom: 0
  },
  tableWrapper: {
    overflowX: 'auto'
  }
};

const TableVinculosBrasil = props => {
  const { empresas, classes } = props;

  return (
    <Paper className={classes.table}>
      <Typography className={classes.cardCategory}>Vínculos Brasil</Typography>
      <div className={classes.tableWrapper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="none" align="center">
                Vínculo
              </TableCell>
              <TableCell padding="none" align="center">
                Informações
              </TableCell>
              <TableCell padding="none" align="center">
                CNPJ
              </TableCell>
              <TableCell padding="none" align="center">
                Empresa
              </TableCell>
              <TableCell padding="none" align="center">
                Prefixo Cliente
              </TableCell>
              <TableCell padding="none" align="center">
                Super
              </TableCell>

              <TableCell padding="none" align="center">
                Gecex
              </TableCell>
              <TableCell padding="none" align="center">
                Genin
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {empresas.map((row, index) => (
              <TableRow key={index}>
                <TableCell padding="none" align="center">
                  {row.nm_vinculo_visao_ext}
                </TableCell>
                <TableCell padding="none" align="center">
                  {row.info_vinculo}
                </TableCell>
                <TableCell padding="none" align="center">
                  {row.cnpj}
                </TableCell>
                <TableCell padding="none" align="center">
                  {row.nm_cliente_brasil}
                </TableCell>
                <TableCell padding="none" align="center">
                  {row.prefixo_cliente}
                </TableCell>
                <TableCell padding="none" align="center">
                  {row.nm_super_cliente}
                </TableCell>

                <TableCell padding="none" align="center">
                  {row.nm_gecex}
                </TableCell>
                <TableCell padding="none" align="center">
                  {row.nm_genin}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Paper>
  );
};

export default withStyles(styles)(TableVinculosBrasil);
