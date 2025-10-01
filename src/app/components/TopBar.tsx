import "./TopBar.css";

import settings from "../../assets/settings_24dp.svg";

export default function TopBar() {
  return (
    <div className="topbar">
      <p>Notes</p>
      <input type="image" src={settings} />
    </div>
  );
}
