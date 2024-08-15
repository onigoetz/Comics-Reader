import "normalize.css/normalize.css";
import "photoswipe/dist/photoswipe.css";
import "photoswipe/dist/default-skin/default-skin.css";
import "../css/variables.css";
import "../css/base.css";
import "../css/headroom.css";
import "../css/Button.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* Layout UI */}
        <main>{children}</main>
      </body>
    </html>
  );
}
