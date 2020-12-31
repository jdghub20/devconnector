import { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/layouts/Navbar';
import Landing from './components/layouts/Landing';
import Routes from './components/routing/Routes';


// Redux
import { Provider } from 'react-redux';
import setAuthToken from './utils/setAuthToken';
import store from './store';
import { loadUser } from './actions/auth';

import './App.css';


if (localStorage.token) {
  // set the token with the header
  setAuthToken(localStorage.token);
}


const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <Router>
        {/* fragment is a ghost element will not show up in the DOM */}
        <Fragment>
          <Navbar />
          <Switch>
            <Route exact path='/' component={Landing} />
            <Route component={Routes} />
          </Switch>
        </Fragment>
      </Router>
    </Provider>
  )
};
export default App;
