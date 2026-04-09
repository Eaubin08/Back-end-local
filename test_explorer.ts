import { ExplorerService } from './app/services/explorer';

const tree = ExplorerService.scan(process.cwd());
console.log(JSON.stringify(tree, null, 2));
