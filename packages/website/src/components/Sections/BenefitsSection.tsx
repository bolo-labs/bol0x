import * as React from 'react';
import Section from './Section';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import Card, { CardContent } from 'material-ui/Card';

const styles = require('./BenefitsSection.scss');

export default class BenefitsSection extends React.Component<{}, {}> {
    render() {
        return (
            <Section divider>
                <Typography variant="display1">Benefits</Typography>
                <Grid container>
                    <Grid item xs={4}>
                        <Card>
                            <CardContent>Benefit 1</CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={4}>
                        <Card>
                            <CardContent>Benefit 2</CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={4}>
                        <Card>
                            <CardContent>Benefit 3</CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Section>
        );
    }
}
