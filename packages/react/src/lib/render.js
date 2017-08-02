import React from 'react';
import ReactDOM from 'react-dom';

export function render(parent, Component, props) {
    return ReactDOM.render(
        React.createElement(Component, props),
        parent
    );
}
