import * as React from 'react';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Menu, { MenuItem } from 'material-ui/Menu';
import { withRouter, RouteComponentProps, Link } from 'react-router-dom';

const styles = require('./AppTopPart.scss');

export interface AppTopPartState {
    developerMenuAnchorElem: HTMLElement;
}

class AppTopPart extends React.Component<RouteComponentProps<void>, AppTopPartState> {

    constructor(props: RouteComponentProps<void>) {
        super(props);

        this.state = {
            developerMenuAnchorElem: null
        };
    }

    render() {
        return (
            <div className={styles.container}>
                <AppBar position="static" className={styles.appBar}>
                    <Link to='/' className={styles.title}>
                        <Typography variant="title" color="inherit">
                            bol0x
                        </Typography>
                    </Link>
                    <div className={styles.menuContainer}>
                        {this.renderDeveloperMenuButton()}
                        <Button color="inherit">About</Button>
                    </div>
                </AppBar>
            </div>
        );
    }

    renderDeveloperMenuButton() {
        return (
            <Button
                color="inherit"
                aria-owns={this.state.developerMenuAnchorElem ? 'simple-menu' : null}
                aria-haspopup="true"
                onMouseOver={this.openDeveloperMenu}>
                Developer
                <Menu
                    id="simple-menu"
                    anchorEl={this.state.developerMenuAnchorElem}
                    open={!!this.state.developerMenuAnchorElem}
                    onClose={this.closeDeveloperMenu}>
                    <Link to='/docs'>
                        <MenuItem>bol0x.js</MenuItem>
                    </Link>
                    <MenuItem onClick={this.navigate.toGithub}>Github</MenuItem>
                </Menu>
            </Button>
        );
    }

    private openDeveloperMenu = (event: React.MouseEvent<HTMLElement>) => {
        this.setState({ ...this.state, developerMenuAnchorElem: event.currentTarget });
    }

    private closeDeveloperMenu = (event: React.MouseEvent<HTMLElement>) => {
        this.setState({ ...this.state, developerMenuAnchorElem: null });
    }

    private navigate = {
        toGithub: () => {
            window.open('https://github.com/zabirauf/bol0x', '_blank');
        }
    };
}

export default withRouter(AppTopPart);