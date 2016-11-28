import React, {Component} from 'react';
import WebMidi from 'webmidi';

class App extends Component {

  componentDidMount() {
    WebMidi.enable(function (err) {

      if (err) {
        console.log(`WebMidi could not be enabled.`, err);
      } else {
        console.log(`WebMidi enabled!`);
      }

    });
  }

  render() {
    return (
        <main>
          HALLO KUT
        </main>
    );
  }
}

export default App;
