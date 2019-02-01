import { GET_EMPRESA } from './types';
import axios from 'axios';

export const getEmpresa = (cod_pais, nome) => async dispatch => {
  const res = await axios.get(
    `https://uce.intranet.bb.com.br/api-timeline/v1/empresa/${cod_pais}/${nome}`,
    {
      method: 'GET',
      headers: {
        'x-access-token': window.sessionStorage.token,
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      }
    }
  );

  dispatch({ type: GET_EMPRESA, payload: res.data.empresa[0] });
};
