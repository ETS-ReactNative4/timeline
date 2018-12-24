import React, { Component } from 'react';
import Header from './components/layouts/Header';
import { BrowserRouter as Router, Route } from 'react-router-dom';

function autentica() {
  fetch(
    `https://uce.intranet.bb.com.br/api-timeline/v1/autenticar/${getCookie(
      'BBSSOToken'
    )}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      }
    }
  )
    .then(response => {
      console.log(response.status);
      if (response.status > 300) {
        window.location =
          'https://login.intranet.bb.com.br/distAuth/UI/Login?goto=https://uce.intranet.bb.com.br/timeline/';
      }

      if (response.headers.get('x-access-token') != null) {
        window.sessionStorage.token = response.headers.get('x-access-token');
      }
      return response.json();
    })

    .catch(function(err) {
      console.error(err);
    });
}

function getCookie(cname) {
  var name = cname + '=';
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
}

class App extends Component {
  constructor(props) {
    super(props);
    autentica();
  }

  render() {
    return (
      <Router initialEntries={['/timeline']} initialIndex={0}>
        <div className="App">
          <Route render={props => <Header {...props} />} />
        </div>
      </Router>
    );
  }
}

export default App;
