import { DNAComponents } from 'dna/components';
import { SeedComponent } from './components/seed/seed-component.next.js';
// Register the component
var Seed = DNAComponents.register(SeedComponent);
document.body.appendChild(new Seed());
