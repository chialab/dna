(function (scope, DNAComponents) {

    var SeedComponent = function SeedComponent() {};

    SeedComponent.css = function() {
        return `
            .seed-component {
                font-family: sans-serif;
            }

            .seed-component button {
                margin: 4px;
            }

            .seed__states {
                display: inline-block;
                margin: 0;
                padding: 0;
                list-style: none;
            }

            .seed__states li {
                display: inline-block;
                margin: 4px;
                color: #666;
            }

            .seed__state {
                color: red;
                font-size: 2em;
            }
        `;
    }

    SeedComponent.template = function() {
        return `
            <h1>Seed component :)</h1>
            <span>Seed state:
                <span class="seed__state">${this.state}</span>
            </span>
            <br />
            ${(!this.isDead()) ? '<button>Grow</button>' : ''}
            <br />
            <span>All states:</span>
            <ul class="seed__states">
                ${this.states.map(function(state) {
                    return `<li>${state}</li>`;
                }).join('')}
            </ul>
        `;
    }

    SeedComponent.prototype = {
        get bindEvents() {
            return {
                'click button': 'grow'
            }
        },

        createdCallback: function () {
            this.growth = 0;
        },

        attachedCallback: function() {
            this.style.width = this.parentNode.offsetWidth + 'px';
        },

        grow: function() {
            if (this.growth < this.states.length - 1) {
                this.growth++;
            }
            this.updateViewContent();
        },

        isDead: function() {
            return this.state === 'dead :(';
        },

        get states() {
            return ['planted', 'sprouted', 'flowered', 'wilted', 'dead :(']
        },

        get state() {
            return this.states[this.growth];
        }
    }

    scope.Seed = DNAComponents.Create('seed-component', {

        prototype: SeedComponent

    });

})(this, DNAComponents);
