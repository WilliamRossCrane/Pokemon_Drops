import type { PokemonRelease } from "../types/release";

function normalizeReleaseDate(value: string): Date {
  return new Date(`${value}T00:00:00`);
}

function normalizeToday(today = new Date()): Date {
  return new Date(today.toISOString().slice(0, 10));
}

export function isFutureDatedRelease(release: PokemonRelease, today = new Date()) {
  if (!release.releaseDate) return false;
  const releaseDate = normalizeReleaseDate(release.releaseDate);
  return releaseDate >= normalizeToday(today);
}

export function isUpcomingWatchlist(release: PokemonRelease) {
  if (release.releaseDate) return false;

  const text = `${release.name} ${release.notes ?? ""}`.toLowerCase();
  const hasFutureKeywords =
    text.includes("future") ||
    text.includes("upcoming") ||
    text.includes("announced") ||
    text.includes("expected") ||
    text.includes("later 2026") ||
    text.includes("tbc");

  return (
    release.availabilityStatus === "announced" ||
    hasFutureKeywords
  );
}

export function isRestockWatch(release: PokemonRelease) {
  const text = `${release.name} ${release.notes ?? ""}`.toLowerCase();
  return (
    release.availabilityStatus === "restock_possible" ||
    text.includes("restock") ||
    text.includes("rerelease") ||
    text.includes("reprint") ||
    text.includes("returning")
  );
}

export function isPastRelease(release: PokemonRelease, today = new Date()) {
  if (!release.releaseDate) return false;
  const releaseDate = normalizeReleaseDate(release.releaseDate);
  return releaseDate < normalizeToday(today);
}
