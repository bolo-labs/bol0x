import * as React from 'react';
import Section from './Section';
import Typography from 'material-ui/Typography';

const styles = require('./IntroductionSection.scss');

export default class IntroductionSection extends React.Component<{}, {}> {
    render() {
        return (
            <Section divider>
                <Typography variant="display4">Introduction</Typography>
            </Section>
        );
    }
}
