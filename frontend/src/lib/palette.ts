// Paleta Davrant para las series de los gráficos.
export const PALETTE = ['#229cc0', '#00e5ff', '#7c5cff', '#ffb020', '#ff3366'];

/** Color de la serie i, ciclando la paleta. */
export const colorAt = (i: number): string => PALETTE[i % PALETTE.length];
