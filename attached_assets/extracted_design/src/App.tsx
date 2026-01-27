import { BrowserRouter, Routes, Route } from 'react-router';
import { Root } from './components/Root';
import { SignIn } from './components/auth/SignIn';
import { SignUp } from './components/auth/SignUp';
import { ForgotPassword } from './components/auth/ForgotPassword';
import { MainMenu } from './components/main/MainMenu';
import { Settings } from './components/settings/Settings';
import { PersonalProfile } from './components/profile/PersonalProfile';
import { VendorProfile } from './components/profile/VendorProfile';
import { SubscriptionPackages } from './components/subscription/SubscriptionPackages';
import { Wallet } from './components/wallet/Wallet';
import { Notifications } from './components/notifications/Notifications';
import { Messages } from './components/messages/Messages';
import { Connections } from './components/social/Connections';
import { Champions } from './components/champions/Champions';
import { WallOfFame } from './components/champions/WallOfFame';
import { MyRealDream } from './components/realdream/MyRealDream';
import { CreateRealDream } from './components/realdream/CreateRealDream';
import { RealDreamMarket } from './components/market/RealDreamMarket';
import { NewsFeed } from './components/social/NewsFeed';
import { Gallery } from './components/gallery/Gallery';
import { LuckyWheel } from './components/games/LuckyWheel';

function App() {
  return (
    <BrowserRouter>
      <Root>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/menu" element={<MainMenu />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<PersonalProfile />} />
          <Route path="/vendor-profile" element={<VendorProfile />} />
          <Route path="/subscription" element={<SubscriptionPackages />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/connections" element={<Connections />} />
          <Route path="/champions" element={<Champions />} />
          <Route path="/wall-of-fame" element={<WallOfFame />} />
          <Route path="/my-realdream" element={<MyRealDream />} />
          <Route path="/create-realdream" element={<CreateRealDream />} />
          <Route path="/market" element={<RealDreamMarket />} />
          <Route path="/news-feed" element={<NewsFeed />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/lucky-wheel" element={<LuckyWheel />} />
        </Routes>
      </Root>
    </BrowserRouter>
  );
}

export default App;
