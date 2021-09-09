import React from 'react';
import { Route, Switch } from 'react-router-dom';
import LandingPage from '../../routes/LandingPage/LandingPage';
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    console.error(error);
    return { hasError: true };
  }

  render() {
    return (
      <div className='App'>
        <main className='App__main'>
          {this.state.hasError && (
            <p className='red'>There was an error! Oh no!</p>
          )}

          <Switch>
            <Route exact path={'/'} component={LandingPage} />
          </Switch>
        </main>
      </div>
    );
  }
}

export default App;
