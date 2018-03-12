import * as React from 'react';

const styles = require('./Docs.scss');

export default class Docs extends React.Component<{}, {}> {
    render() {
        return (
            <iframe className={styles.container} src='./static/docs/index.html' />
        );
    }
}