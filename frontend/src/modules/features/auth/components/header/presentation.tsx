import { User } from "@/utils/types/models";
import Link from "next/link";
import { HeaderMenuItem } from "./headerMenuItem";

const UnauthenticatedMenus = () => {
  return (
    <ul className="nav navbar-nav pull-xs-right">
      <li className="nav-item">
        <HeaderMenuItem href="/" segment={null}>
          Home
        </HeaderMenuItem>
      </li>
      <li className="nav-item">
        <HeaderMenuItem href="/login" segment="login">
          Sign in
        </HeaderMenuItem>
      </li>
      <li className="nav-item">
        <HeaderMenuItem href="/register" segment="register">
          Sign up
        </HeaderMenuItem>
      </li>
    </ul>
  );
};

const AuthenticatedMenus = ({ authUser }: { authUser: User }) => {
  return (
    <ul className="nav navbar-nav pull-xs-right">
      <li className="nav-item">
        <HeaderMenuItem href="/" segment={null}>
          Home
        </HeaderMenuItem>
      </li>
      <li className="nav-item">
        <HeaderMenuItem href="/editor" segment="editor">
          <i className="ion-compose"></i>&nbsp;New Article
        </HeaderMenuItem>
      </li>
      <li className="nav-item">
        <HeaderMenuItem href="/settings" segment="settings">
          <i className="ion-gear-a"></i>&nbsp;Settings
        </HeaderMenuItem>
      </li>
      <li className="nav-item">
        <HeaderMenuItem href={`/profile/${authUser.username}`} segment="profile">
          {authUser.image && <img src={authUser.image} alt="" className="user-pic" />}
          {authUser.username}
        </HeaderMenuItem>
      </li>
    </ul>
  );
};

export const Header = ({ authUser }: { authUser?: User }) => {
  return (
    <header>
      <nav className="navbar navbar-light">
        <div className="container">
          <Link className="navbar-brand" href="/">
            conduit
          </Link>
          {authUser ? <AuthenticatedMenus authUser={authUser} /> : <UnauthenticatedMenus />}
        </div>
      </nav>
    </header>
  );
};
