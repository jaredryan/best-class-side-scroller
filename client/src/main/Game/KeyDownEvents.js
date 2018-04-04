import React, {Component} from 'react';

const KEYS = [ 'shift+up', 'shift+down', 'enter', 'j', 'k', 'h', 'l' ];
@keydown( KEYS )
class KeyDownEvents extends React.Component {
    console.log(KEYS);
}

export default KeyDownEvents;
