import { BackIcon } from "../Sakura/MainIcons/SvgIcons";

export default function EgaPanel({ setRole }) {
  return (
    <main className="ega-coming-soon role-management-page">
      <button type="button" className="role-back-button" onClick={() => setRole?.("")} aria-label="Orqaga">
        <BackIcon />
      </button>
      Tez kunda
    </main>
  );
}
