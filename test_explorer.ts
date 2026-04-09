import { ExplorerService } from './app/services/explorer';
import path from 'path';

const tree = ExplorerService.scan(process.cwd());
console.log(JSON.stringify(tree, null, 2));
