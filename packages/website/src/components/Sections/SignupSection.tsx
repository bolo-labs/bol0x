import * as React from 'react';
import Section from './Section';
import Typography from 'material-ui/Typography';

const styles = require('./SignupSection.scss');

export default class SignupSection extends React.Component<{}, {}> {
    render() {
        return (
            <Section divider>
                <Typography variant="display4">Sign up</Typography>
            </Section>
        );
    }
}
