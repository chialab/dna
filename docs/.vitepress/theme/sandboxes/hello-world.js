export const files = {
    'HelloWorld.tsx': {
        code: `import {
    Component,
    customElement,
    listen,
    property
} from '@chialab/dna';

@customElement('hello-world')
export class HelloWorld extends Component {
    /* define an observable property */
    @property() name = '';

    render() {
        return (
            <>
                <h1>Hello {this.name || 'World'}!</h1>
                <input
                    name="firstName"
                    placeholder="Type your name"
                    value={this.name}
                />
            </>
        );
    }

    /* listen input changes */
    @listen('input', 'input[name="firstName"]')
    protected onInputChange(event: Event, target: HTMLInputElement) {
        this.name = target.value;
    }
}
`,
        active: true,
    },
    'index.ts': {
        code: `import './HelloWorld';
import './styles.css';
`,
        hidden: true,
    },
    'styles.css': {
        code: `
html {
    color-scheme: light dark;
    background: transparent;
    color: #3f3f46;
    font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

body {
    margin: 0;
    padding: 2em;
}

h1 {
    margin: 0 0 0.5em;
    font-size: 1.75em;
}

input {
    padding: 0.5em 0.75em;
    border: solid 1px #d4d4d8;
    border-radius: 6px;
    background-color: #fafafa;
    color: inherit;
    font-size: inherit;
    font-family: inherit;
}

@media (prefers-color-scheme: dark) {
    html {
        color: #e4e4e7;
        background-color: #18181b;
    }

    input {
        border-color: #3f3f46;
        background-color: #27272a;
    }
}`,
        hidden: true,
    },
    'tsconfig.json': {
        code: JSON.stringify(
            {
                compilerOptions: {
                    moduleResolution: 'bundler',
                    experimentalDecorators: true,
                    useDefineForClassFields: false,
                    jsx: 'react-jsx',
                    jsxImportSource: '@chialab/dna',
                },
            },
            null,
            4
        ),
        readOnly: true,
    },
    'index.html': {
        code: `<!doctype html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>DNA sandbox</title>
    </head>
    <body>
        <hello-world></hello-world>
        <script type="module" src="./index.ts"></script>
    </body>
</html>`,
        readOnly: true,
    },
};

export const customSetup = {
    entry: 'index.ts',
    dependencies: {
        '@chialab/dna': '^4.0.0',
    },
};
