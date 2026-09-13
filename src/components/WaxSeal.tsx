import { wedding } from "../config/wedding";
export function WaxSeal({
  onOpen,
  disabled,
}: {
  onOpen: () => void;
  disabled: boolean;
}) {
  return (
    <button
      className="wax-seal"
      aria-label="Abrir convite"
      onClick={onOpen}
      disabled={disabled}
    >
      <span className="wax-seal__ring" aria-hidden="true">
        <span className="wax-seal__sprig">❧</span>
        <span className="wax-seal__monogram">{wedding.monogram}</span>
        <span className="wax-seal__sprig wax-seal__sprig--bottom">❧</span>
      </span>
    </button>
  );
}
