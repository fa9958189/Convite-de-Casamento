import { useId } from "react";
const art = "/images/capa-convite-premium.png";

/** Only the floral corners and the existing seal are sampled from the original. */
export function OriginalCoverArt({ seal = false }: { seal?: boolean }) {
  const id = useId();
  if (!seal) return <svg viewBox="0 0 430 300" aria-hidden="true" focusable="false"><image href={art} width="941" height="1672" /></svg>;
  return <svg viewBox="205 535 520 540" aria-hidden="true" focusable="false">
    <defs><clipPath id={id}><path d="M463 543C523 537 540 567 601 581C666 594 687 657 699 720C723 780 713 879 684 953C658 1015 550 1044 485 1062C417 1074 380 1044 324 1024C263 1007 231 952 228 886C205 806 218 708 250 649C275 601 353 593 395 566C420 550 441 543 463 543Z" /></clipPath></defs>
    <image href={art} width="941" height="1672" clipPath={`url(#${id})`} style={{filter:"hue-rotate(65deg) saturate(.55)"}} />
  </svg>;
}
