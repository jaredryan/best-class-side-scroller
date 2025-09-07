import React, { Component } from 'react';
import Level1Container from './Level1Container';
import Level2Container from './Level2Container';
import Level3Container from './Level3Container';

class LevelSetter extends Component {
    render() {
        return (
            <div>
                {this.props.level === 1
                    ? <Level1Container
                        setLevel={this.props.setLevel}
                        level={this.props.level}
                        setHasPlayed={this.props.setHasPlayed}
                        hasPlayed={this.props.hasPlayed}
                    />
                    : this.props.level === 2
                        ? (
                            <Level2Container
                                setLevel={this.props.setLevel}
                                level={this.props.level}
                                setHasPlayed={this.props.setHasPlayed}
                                hasPlayed={this.props.hasPlayed}
                            />
                        ) : (
                            <Level3Container
                                setLevel={this.props.setLevel}
                                level={this.props.level}
                                setHasPlayed={this.props.setHasPlayed}
                                hasPlayed={this.props.hasPlayed}
                            />
                        )
                }
            </div>
        )
    }
}

export default LevelSetter
