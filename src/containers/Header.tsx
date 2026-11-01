import { Link } from "@tanstack/react-router";
import HeadroomModule from "react-headroom";

import Search from "./Search";
import { cleanName, nodeLink } from "../utils";
import { FiChevronLeft, FiUser, FiHome } from "react-icons/fi";
import { useAuth } from "../auth/auth";
import { ClientNode } from "../types";

import styles from "./Header.module.css";

// react-headroom is CommonJS, on the server Node's ESM loader
// wraps its export in an extra `default`
const Headroom = ((HeadroomModule as any).default ??
  HeadroomModule) as typeof HeadroomModule;

function isNotHome(url?: string) {
  return url !== "/" && url !== "/list/";
}

function canGoBack(url?: string) {
  return url && isNotHome(url) && url !== "/login";
}

function Home() {
  return (
    <Link to="/" className="Button Button--link" title="Back to Home">
      <FiHome />
    </Link>
  );
}

function Previous({ parent }: { parent?: ClientNode | null }) {
  if (!parent) {
    return null;
  }

  const title = parent.name;

  // TODO :: restore previousUrl feature
  /*const url = parent.path ? `/list/${parent.path}` : previousUrl;

  // If the url is identical to the previousUrl,
  // It means we can do the equivalent of the browser's back button.
  // And thus we can benefit from scroll restoration
  
  if (url === previousUrl) {
    return (
      <div className="Header__Section pull-left">
        <button
          className="Button Button--link Button--back"
          title={`Back to ${title}`}
          onClick={() => history.goBack()}
        >
          <IoIosArrowBack />
          {title}
        </button>
      </div>
    );
  }*/

  return (
    <div className={`${styles.Header__Section} ${styles.pullLeft}`}>
      <Link
        {...(parent.path ? nodeLink(parent) : { to: "/" as const })}
        className="Button Button--link Button--back"
        title={`Back to ${title}`}
      >
        <FiChevronLeft />
        {title}
      </Link>
    </div>
  );
}

function User() {
  return (
    <div className={`${styles.Dropdown__trigger} Button Button--link`}>
      <FiUser />
      <div className={styles.Dropdown__content}>
        <Link to="/change_password" className="Link">
          Change Password
        </Link>
        <Link to="/logout" className="Link">
          Logout
        </Link>
      </div>
    </div>
  );
}

interface HeaderProps {
  url?: string;
  current?: Pick<ClientNode, "name"> | null;
  parent?: ClientNode | null;
}

function Header({ url, current, parent }: HeaderProps) {
  const { token } = useAuth();

  const currentBook = current ? `- ${cleanName(current.name)}` : "";

  return (
    <>
      <title>{`Comics Reader ${currentBook}`}</title>
      <Headroom disableInlineStyles>
        <header className={styles.Header}>
          <div className={`${styles.Header__Section} ${styles.pullRight}`}>
            {(token || typeof url === "string") && <Search />}
            {canGoBack(url) && <Home />}
            {token && <User />}
          </div>
          {canGoBack(url) && <Previous parent={parent} />}
          <h1 className={styles.Header__title}>
            {current && cleanName(current.name)}
          </h1>
        </header>
      </Headroom>
    </>
  );
}

export default Header;
