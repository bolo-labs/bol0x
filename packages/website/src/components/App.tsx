import * as React from 'react';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import AppTopPart from './AppTopPart';
import { HashRouter } from 'react-router-dom';
import AppRoutedComponents from './AppRoutedComponents';

const styles = require('./App.scss');

export default class App extends React.Component<{}, {}> {
    render() {
        return (
            <HashRouter>
                <div className={styles.rootContainer}>
                    <AppTopPart />
                    <AppRoutedComponents />
                </div>
            </HashRouter>
        );
    }
}
