import App from './src/App';
import {Store} from './src/store/StoreInterface';
import {Provider} from 'react-redux';

function Root() {
  return (
    <Provider store={Store}>
      <App />
    </Provider>
  );
}
export default Root;
