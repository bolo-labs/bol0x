import * as ReactDOM from 'react-dom';
import * as React from 'react';

class App extends React.Component<{}, {}> {
    render() {
        return <div>Hello World!</div>;
    }
}

const app = <App />;
ReactDOM.render(app, document.getElementById('main'));
