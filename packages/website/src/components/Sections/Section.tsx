import * as React from 'react';
import Divider from 'material-ui/Divider';

const styles = require('./Section.scss');
const classNames = require('classnames');

interface SectionProps {
    className?: string;
    children?: JSX.Element | JSX.Element[];
    divider?: boolean;
}

export default class Section extends React.Component<SectionProps, {}> {
    render() {
        return (
            <div>
                <div
                    className={classNames(
                        styles.container,
                        this.props.className
                    )}
                >
                    <div className={styles.innerCenteredContainer}>
                        {this.props.children}
                    </div>
                </div>
                {this.props.divider && <Divider />}
            </div>
        );
    }
}
