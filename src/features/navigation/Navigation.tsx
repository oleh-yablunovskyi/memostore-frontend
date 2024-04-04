import { useRoutes } from 'react-router-dom';
import { routes } from './routes';

function Navigation() {
  const element = useRoutes(routes);

  return element;
}

export default Navigation;
