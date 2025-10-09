import path from 'path';
import { fileURLToPath } from 'url';
import { ComponentLoader } from 'adminjs';

const componentLoader = new ComponentLoader();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const RefTableContentEditor = componentLoader.add(
  'RefTableContentEditor',
  path.join(__dirname, 'components/RefTableEditor.tsx')
);

export default componentLoader;
