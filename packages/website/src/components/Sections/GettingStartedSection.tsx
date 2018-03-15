import * as React from 'react';
import Section from './Section';
import Typography from 'material-ui/Typography';

const styles = require('./GettingStartedSection.scss');

export default class GettingStartedSection extends React.Component<{}, {}> {
    render() {
        return (
            <Section divider>
                <Typography variant="display4">Getting started</Typography>
            </Section>
        );
    }
}
