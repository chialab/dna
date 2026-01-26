# Testing

DNA components are Web Components that follow the Custom Elements specification, making them highly testable with standard tools. This guide covers how to test DNA components using Vitest with browser automation.

## Setup

DNA's test suite is configured with **Vitest in browser mode**, which runs tests in a real browser environment using Playwright. This ensures your components work exactly as they will in production.

### Installation

Your project comes pre-configured with Vitest 4 for browser testing. The relevant configuration is:

::: code-group

```json [package.json]
{
  "scripts": {
    "test": "vitest run --config vitest.browser.ts"
  }
}
```

```ts [vitest.config.ts]
import viteConfig from './vite.config'
import { defineConfig, mergeConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';

export default mergeConfig(
    viteConfig,
    defineConfig({
        test: {
            browser: {
                enabled: true,
                provider: playwright(),
                headless: true,
                instances: [
                    { browser: 'chromium' },
                    { browser: 'webkit' },
                    { browser: 'firefox' }
                ]
            }
        }
    })
);
```

:::

## Unit Tests

Unit tests verify the behavior of your component in isolation, including property changes, state management, and rendering logic.

### Basic Component Test

::: code-group

```tsx [x-button.spec.tsx]
import { customElement, HTML } from '@chialab/dna';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Button } from './x-button';

describe('Button Component', () => {
    let container: HTMLElement;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    afterEach(() => {
        container.remove();
    });

    it('should render the button', () => {
        const button = new Button();
        container.appendChild(button);

        expect(button.textContent).toBe('Click me');
    });
});
```

```tsx [x-button.tsx]
import { customElement, HTML } from '@chialab/dna';

@customElement('x-button', {
    extends: 'button',
})
export class Button extends HTML.Button {
    render() {
        return 'Click me';
    }
}
```

:::

### Testing Properties

Test that properties are correctly synced with attributes and trigger re-renders:

::: code-group

```tsx [x-counter.spec.tsx]
it('should update when property changes', async () => {
    const observer = vi.fn();
    const counter = new Counter();
    counter.observe('count', observer);
    container.appendChild(counter);

    expect(counter.textContent).toBe('0');
    expect(counter.count).toBe(0);
    expect(observer).not.toHaveBeenCalled();

    counter.count = 5;

    expect(counter.textContent).toBe('5');
    expect(counter.count).toBe(5);
    expect(observer).toHaveBeenCalledWith(0, 5);
});
```

```tsx [x-counter.tsx]
import { customElement, Component, property } from '@chialab/dna';

@customElement('x-counter')
export class Counter extends Component {
  @property() count = 0;

  render() {
    return this.count;
  }
}
```

:::

## Interaction Tests

For integration testing, use **userEvent** from Vitest's browser module to simulate real user interactions like clicks, typing, and form submissions.

### Importing `userEvent`

In Vitest 4 browser mode, `userEvent` is available through the `vitest/browser` module:

```tsx
import { describe, beforeAll, beforeEach, afterEach, test, expect } from 'vitest';
import { userEvent } from 'vitest/browser';

describe('User Interactions', () => {
  let container: HTMLElement;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    afterEach(() => {
        container.remove();
    });

    // Your tests here
});
```

### Clicking Elements

Test toggle click interactions:

::: code-group

```tsx [x-toggle.spec.tsx]
it('should handle click events', async () => {
    const toggle = new Button();
    container.appendChild(toggle);

    await userEvent.click(toggle);

    expect(toggle.on).toBeTruthy();
});
```

```tsx [x-toggle.tsx]
import { customElement, HTML, property, listen } from '@chialab/dna';

@customElement('x-toggle')
export class Button extends HTML.Button {
    @property({ type: Boolean }) on = false;

    @listen('click')
    toggle() {
        this.on = !this.on;
    }

    render() {
        return this.on ? 'ON' : 'OFF';
    }
}
```

:::

### Testing Custom Events

Verify that components dispatch and handle custom events:

::: code-group

```tsx [x-input-field.spec.tsx]
it('should dispatch custom events', async () => {
  const field = new InputField();
  container.appendChild(field);

  const callback = vi.fn();
  field.addEventListener('change', callback);
  await userEvent.type(input, 'hello');

  expect(callback).toHaveBeenCalled();
});
```

```tsx [x-input-field.tsx]
import { customElement, Component, property, listen } from '@chialab/dna';

@customElement('x-input-field')
export class InputField extends Component {
    render() {
        return <input type="text" class="text-field" />;
    }
}
```

:::

## Best Practices

### Use `beforeEach` and `afterEach`

Always clean up the DOM between tests:

```tsx
beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
});

afterEach(() => {
    container.remove();
});
```

### Test Accessibility

Ensure your components are accessible using the [aXe plugin for Vitest](https://www.npmjs.com/package/vitest-axe).

```tsx
it('should not have accessibility violations', async () => {
    const button = new Button();
    container.appendChild(button);

    expect(await axe(button)).toHaveNoViolations();
});
```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Vitest Browser Mode](https://vitest.dev/guide/browser.html)
