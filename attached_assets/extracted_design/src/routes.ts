import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { SignIn } from "./components/auth/SignIn";
import { SignUp } from "./components/auth/SignUp";
import { ForgotPassword } from "./components/auth/ForgotPassword";
import { MainMenu } from "./components/main/MainMenu";
import { Settings } from "./components/settings/Settings";
import { PersonalProfile } from "./components/profile/PersonalProfile";
import { VendorProfile } from "./components/profile/VendorProfile";
import { SubscriptionPackages } from "./components/subscription/SubscriptionPackages";
import { Wallet } from "./components/wallet/Wallet";
import { Notifications } from "./components/notifications/Notifications";
import { Messages } from "./components/messages/Messages";
import { Connections } from "./components/social/Connections";
import { Champions } from "./components/champions/Champions";
import { WallOfFame } from "./components/champions/WallOfFame";
import { MyRealDream } from "./components/realdream/MyRealDream";
import { CreateRealDream } from "./components/realdream/CreateRealDream";
import { RealDreamMarket } from "./components/market/RealDreamMarket";
import { NewsFeed } from "./components/social/NewsFeed";
import { Gallery } from "./components/gallery/Gallery";
import { LuckyWheel } from "./components/games/LuckyWheel";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: SignIn },
      { path: "signup", Component: SignUp },
      { path: "forgot-password", Component: ForgotPassword },
      { path: "menu", Component: MainMenu },
      { path: "settings", Component: Settings },
      { path: "profile", Component: PersonalProfile },
      { path: "vendor-profile", Component: VendorProfile },
      { path: "subscription", Component: SubscriptionPackages },
      { path: "wallet", Component: Wallet },
      { path: "notifications", Component: Notifications },
      { path: "messages", Component: Messages },
      { path: "connections", Component: Connections },
      { path: "champions", Component: Champions },
      { path: "wall-of-fame", Component: WallOfFame },
      { path: "my-realdream", Component: MyRealDream },
      { path: "create-realdream", Component: CreateRealDream },
      { path: "market", Component: RealDreamMarket },
      { path: "news-feed", Component: NewsFeed },
      { path: "gallery", Component: Gallery },
      { path: "lucky-wheel", Component: LuckyWheel },
    ],
  },
]);
