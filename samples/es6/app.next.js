import { Register } from 'dna/components';
import { SeedComponent } from './components/seed/seed-component.next.js';
// Register the component
var Seed = Register(SeedComponent);
document.body.appendChild(new Seed());
