/**
 * Single source of truth for the PDF parsing domain and the HTTP contract
 * shared between the API (`apps/api`) and the web client (`apps/web`).
 *
 * Anything that crosses the network boundary between the two apps belongs
 * here so the two sides cannot drift apart.
 */
export * from "./pdf-parse.ts";
