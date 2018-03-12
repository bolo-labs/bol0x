import * as React from 'react';
import { withRouter, Route, RouteComponentProps } from 'react-router-dom';
import Docs from './Docs';
import Main from './Main';

const styles = require('./AppRoutedComponents.scss');

class AppRoutedComponents extends React.Component<RouteComponentProps<void>, {}> {
    render() {
        return (
            <div className={styles.container}>
                <Route
                    exact
                    path='/'
                    component={Main} />
                <Route
                    exact
                    path='/docs'
                    component={Docs} />
            </div>
        );
    }
}

export default withRouter(AppRoutedComponents);