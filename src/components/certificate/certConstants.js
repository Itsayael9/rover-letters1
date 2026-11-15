/** Design canvas (screen preview logical size, A4 landscape ratio). */
export const CERT_BASE_FONT_PX = 10;
export const CERT_DESIGN_WIDTH = 1050;
export const CERT_DESIGN_HEIGHT = Math.round(CERT_DESIGN_WIDTH * (210 / 297));

/** Print export — A4 landscape at ~300 DPI. */
export const CERT_EXPORT_WIDTH = 3508;
export const CERT_EXPORT_HEIGHT = 2480;

/** Scales em-based certificate typography from preview to export. */
export const CERT_EXPORT_FONT_PX = CERT_EXPORT_WIDTH / (CERT_DESIGN_WIDTH / 10);