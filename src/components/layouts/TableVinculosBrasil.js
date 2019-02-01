import React from 'react';
import {
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  table: { marginTop: 16 }
};

const TableVinculosBrasil = props => {
  const { empresas, classes } = props;
  console.log(empresas);

  return (
    <Paper className={classes.table}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Vínculo</TableCell>
            <TableCell align="right">Informações</TableCell>
            <TableCell align="right">CNPJ</TableCell>
            <TableCell align="right">Empresa</TableCell>
            <TableCell align="right">Prefixo</TableCell>
            <TableCell align="right">Diretoria</TableCell>

            <TableCell align="right">Pref. Gecex</TableCell>
            <TableCell align="right">Gecex</TableCell>
            <TableCell align="right">Responsável</TableCell>
            <TableCell align="right">Visitado Últimos 180 Dias</TableCell>
            <TableCell align="right">Visita Agendada</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {empresas.map((row, index) => (
            <TableRow key={row.index}>
              <TableCell component="th" scope="row">
                {row.nm_vinculo_visao_ext}
              </TableCell>
              <TableCell component="th" scope="row">
                {row.info_vinculo}
              </TableCell>
              <TableCell align="right">{row.cnpj}</TableCell>
              <TableCell align="right">{row.nm_cliente}</TableCell>
              <TableCell align="right">{row.prefixo_cliente}</TableCell>
              <TableCell align="right">{row.nm_diretoria_cliente}</TableCell>

              <TableCell align="right">{row.prefixo_gecex}</TableCell>
              <TableCell align="right">{row.nm_gecex}</TableCell>
              <TableCell align="right">{row.nm_genin}</TableCell>
              <TableCell align="right">{row.protein}</TableCell>
              <TableCell align="right">{row.protein}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default withStyles(styles)(TableVinculosBrasil);
