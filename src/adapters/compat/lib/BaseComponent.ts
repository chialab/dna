import { Component } from '../../../lib/Component';

export class BaseComponent extends Component {
    get node() {
        return this;
    }
}
