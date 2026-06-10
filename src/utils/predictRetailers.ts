import type {
  PokemonRelease,
  PreviousReleasePattern,
  RetailerPrediction,
  Likelihood,
} from "../types/release";
import patterns from "../data/previous-release-patterns.json";

function getReleaseDayOfWeek(releaseDate?: string): string | undefined {
  if (!releaseDate) return undefined;
  const date = new Date(releaseDate);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toLocaleDateString("en-AU", {
    timeZone: "Australia/Brisbane",
    weekday: "long",
  });
}

function buildLikelihood(hasExactDayMatch: boolean): Likelihood {
  return hasExactDayMatch ? "very_likely" : "likely";
}

function buildReason(
  retailerName: string,
  releaseDay: string | undefined,
  matchedPatterns: PreviousReleasePattern[]
): string {
  if (matchedPatterns.length === 0) {
    return "No strong previous patterns are stored for this product type yet.";
  }

  const exactMatch = matchedPatterns.some(
    (pattern) => pattern.previousDropDay === releaseDay
  );
  if (exactMatch && releaseDay) {
    return `Similar ${matchedPatterns[0].productType} products have previously appeared at ${retailerName} on ${releaseDay} around release week.`;
  }

  return `Similar ${matchedPatterns[0].productType} products have previously appeared at ${retailerName} around release week.`;
}

function buildPredictedCheckDay(
  releaseDay: string | undefined,
  matchedPatterns: PreviousReleasePattern[]
): string {
  const exactPattern = matchedPatterns.find(
    (pattern) => pattern.previousDropDay === releaseDay
  );
  if (exactPattern && releaseDay) return releaseDay;
  if (matchedPatterns[0]?.previousDropDay) return matchedPatterns[0].previousDropDay;
  return releaseDay ?? "release week";
}

function buildPredictedWindow(matchedPatterns: PreviousReleasePattern[]): string {
  return matchedPatterns[0]?.typicalWindow ?? "release week";
}

export function predictRetailers(release: PokemonRelease): RetailerPrediction[] {
  const releaseDay = getReleaseDayOfWeek(release.releaseDate);

  const matchedPatterns = patterns.filter(
    (pattern) => pattern.productType === release.productType
  );

  if (matchedPatterns.length === 0) {
    return [];
  }

  const grouped = new Map<string, PreviousReleasePattern[]>();
  matchedPatterns.forEach((pattern) => {
    const key = `${pattern.retailerId}|${pattern.retailerName}`;
    const collector = grouped.get(key) ?? [];
    collector.push(pattern);
    grouped.set(key, collector);
  });

  return Array.from(grouped.values())
    .map((patternsForRetailer) => {
      const hasExactDayMatch = patternsForRetailer.some(
        (pattern) => pattern.previousDropDay === releaseDay
      );
      const predictedCheckDay = buildPredictedCheckDay(releaseDay, patternsForRetailer);
      const likelihood = buildLikelihood(hasExactDayMatch);

      return {
        retailerId: patternsForRetailer[0].retailerId,
        retailerName: patternsForRetailer[0].retailerName,
        likelihood,
        predictedCheckDay,
        predictedWindow: buildPredictedWindow(patternsForRetailer),
        reason: buildReason(patternsForRetailer[0].retailerName, releaseDay, patternsForRetailer),
        matchedPatterns: patternsForRetailer,
      };
    })
    .sort((a, b) => {
      const order = ["very_likely", "likely", "possible", "unclear"];
      return order.indexOf(a.likelihood) - order.indexOf(b.likelihood);
    });
}
