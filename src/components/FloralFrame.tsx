import { useId } from "react";

/** Independent botanical artwork. Replace this component to change the floral identity. */
function Bouquet() {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 400 720" fill="none" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${id}-leaf`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#b5bea2" />
          <stop offset=".48" stopColor="#809575" />
          <stop offset="1" stopColor="#3e624a" />
        </linearGradient>
        <radialGradient id={`${id}-petal`} cx=".4" cy=".3" r=".75">
          <stop stopColor="#fffef7" />
          <stop offset=".6" stopColor="#f3efdf" />
          <stop offset="1" stopColor="#c9ccb6" />
        </radialGradient>
        <path
          id={`${id}-leaf-shape`}
          d="M0 0C-28-15-32-56 0-88C25-61 24-23 0 0Z"
        />
        <g id={`${id}-leaf-unit`}>
          <use href={`#${id}-leaf-shape`} fill={`url(#${id}-leaf)`} />
          <path
            d="M0-4 0-76M0-26 11-42M0-40-12-57"
            stroke="#d3d8be"
            strokeWidth=".7"
            opacity=".6"
          />
        </g>
        <g id={`${id}-rose`}>
          {[0, 51, 103, 154, 206, 257, 309].map((a) => (
            <ellipse
              key={a}
              cx="0"
              cy="-22"
              rx="25"
              ry="35"
              transform={`rotate(${a})`}
              fill={`url(#${id}-petal)`}
              stroke="#d8d7c2"
              strokeWidth=".6"
            />
          ))}
          {[20, 92, 164, 236, 308].map((a) => (
            <path
              key={a}
              d="M-19 5C-33-11-19-37 2-31C25-29 30-6 10 10C1 16-10 14-19 5Z"
              transform={`rotate(${a}) scale(.72)`}
              fill={`url(#${id}-petal)`}
              stroke="#d0cbb3"
              strokeWidth=".7"
            />
          ))}
          <path
            d="M-10 4C-19-12 6-20 12-7C19 8-4 15-7 3C-10-5 7-9 6 1C5 7-2 5-2 1"
            stroke="#c5b48c"
            strokeWidth="1.5"
          />
        </g>
      </defs>
      <g stroke="#607d57" strokeWidth="1.7" opacity=".85">
        <path d="M5 711C71 572 36 474 119 352S225 114 184-27" />
        <path d="M32 648C128 540 154 477 215 418M62 478C123 380 64 257 44 193M116 351C210 264 242 176 310 117M163 237C81 176 128 66 99 11M13 658C11 534-35 351 26 279" />
      </g>
      <g>
        {[
          [33, 640, -31, 1],
          [63, 586, 48, 0.8],
          [55, 544, -48, 1.1],
          [81, 482, 37, 0.85],
          [87, 425, -62, 1],
          [118, 367, 44, 1],
          [142, 319, -52, 0.9],
          [167, 252, 56, 0.85],
          [178, 190, -36, 0.95],
          [185, 132, 43, 0.8],
          [185, 76, -29, 0.8],
          [137, 535, 50, 0.72],
          [166, 483, -20, 0.7],
          [197, 449, 46, 0.66],
          [81, 334, -42, 0.8],
          [73, 287, 20, 0.7],
          [56, 237, -35, 0.65],
          [226, 229, 54, 0.75],
          [254, 179, 34, 0.65],
          [293, 138, 45, 0.6],
          [111, 161, -41, 0.7],
          [104, 108, 28, 0.65],
          [20, 581, -38, 0.8],
          [15, 398, 40, 0.65],
        ].map(([x, y, a, s], i) => (
          <use
            key={i}
            href={`#${id}-leaf-unit`}
            transform={`translate(${x} ${y}) rotate(${a}) scale(${s})`}
          />
        ))}
      </g>
      <g stroke="#b2b696" strokeWidth="1.2">
        <path d="M105 354Q222 369 250 311M178 155Q267 104 253 47M40 607Q138 642 167 605" />
        {[
          [223, 342],
          [238, 325],
          [250, 308],
          [254, 48],
          [259, 69],
          [257, 91],
          [143, 626],
          [162, 609],
        ].map(([x, y], i) => (
          <ellipse
            key={i}
            cx={x}
            cy={y}
            rx="5"
            ry="8"
            fill="#f4f0de"
            transform={`rotate(30 ${x} ${y})`}
          />
        ))}
      </g>
      {[
        [103, 410, 0.94, -20],
        [159, 281, 0.64, 16],
        [165, 87, 0.78, -12],
        [36, 594, 0.67, 35],
        [63, 153, 0.45, 10],
      ].map(([x, y, s, a], i) => (
        <use
          key={i}
          href={`#${id}-rose`}
          transform={`translate(${x} ${y}) scale(${s}) rotate(${a})`}
        />
      ))}
    </svg>
  );
}
export function FloralFrame({ subtle = false }: { subtle?: boolean }) {
  return (
    <div
      className={`floral-frame${subtle ? " floral-frame--subtle" : ""}`}
      aria-hidden="true"
    >
      <div className="bouquet bouquet--left">
        <Bouquet />
      </div>
      <div className="bouquet bouquet--right">
        <Bouquet />
      </div>
    </div>
  );
}
