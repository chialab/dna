---
"@chialab/dna": minor
---

The hooks can be imported.

`useState`, `useRef`, `useMemo`, `useCallback`, `useEffect`, `useElement`, `useId` and `useRenderContext` are exported from the package and called like the functions they are. A hook is called from inside a function component, so the fragment it belongs to is the one the renderer is walking: there is nothing to hand over.

```tsx
import { render, useEffect, useState } from '@chialab/dna';

const Counter = () => {
    const [count, setCount] = useState(0);
    useEffect(() => document.title = `${count}`, [count]);

    return <button type="button" onclick={() => setCount(count + 1)}>{count}</button>;
};
```

The second argument a function component receives still holds them all, and goes on working unchanged — it is one object for the whole page now rather than one built for each fragment, so destructuring it gives the same functions every render. A hook called with no function component rendering throws instead of writing into whatever rendered last.
