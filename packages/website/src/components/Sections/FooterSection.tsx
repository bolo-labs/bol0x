import * as React from 'react';
import Section from './Section';
import Typography from 'material-ui/Typography';

const styles = require('./FooterSection.scss');

export default class FooterSection extends React.Component<{}, {}> {
    render() {
        return (
            <Section divider>
                <Typography variant="display4">Footer</Typography>
            </Section>
        );
    }
}
