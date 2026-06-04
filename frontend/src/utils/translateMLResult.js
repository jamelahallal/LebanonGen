/**
 * translateMLResult
 *
 * The ML model always returns results in English.
 * This helper maps those English strings to whatever language
 * is currently selected — without touching the model at all.
 *
 * Usage in any component:
 *   import { translateMLResult } from "../utils/translateMLResult";
 *   const { riskLevel, recommendation } = translateMLResult(assessmentData, t);
 */

export function translateMLResult(assessmentData, t) {
  if (!assessmentData) return { riskLevel: "", recommendation: "" };

  const rawRisk = assessmentData.riskLevel || "";
  const rawRec = assessmentData.recommendation || "";

  // Try to find a matching translation key for the risk level
  const translatedRisk = t(`ml_results.risk_levels.${rawRisk}`, {
    defaultValue: rawRisk, // falls back to English if key not found
  });

  // Try to find a matching translation key for the recommendation
  const translatedRec = t(`ml_results.recommendations.${rawRec}`, {
    defaultValue: rawRec, // falls back to English if key not found
  });

  return {
    riskLevel: translatedRisk,
    recommendation: translatedRec,
  };
}
