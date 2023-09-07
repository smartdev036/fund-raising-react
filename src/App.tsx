import {WalletProvider, SuiMainnetChain} from '@suiet/wallet-kit'
import '@suiet/wallet-kit/style.css'

import Header from './components/header';
import IdoPage from './pages/ido'

import './assets/styles.scss'
import { ProgramProvider } from './utils/ProgramProvider';

function App() {
  return (
    <WalletProvider chains={[SuiMainnetChain]}>
      <ProgramProvider>
        <Header/>
        <IdoPage/>
      </ProgramProvider>
    </WalletProvider>
  );
}

export default App;