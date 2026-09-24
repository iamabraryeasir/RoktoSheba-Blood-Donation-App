import { useQuery } from "@tanstack/react-query";
import { profileService, UserStats } from "../services/profileService";

export function useDonationEligibility(
  dateOfBirth: string | null | undefined,
  lastDonationDate: string | null | undefined,
) {
  const today = new Date();

  // 1. First Check: Birth Date / Age Eligibility (Must be >= 18 years old)
  let age: number | null = null;
  let isAgeEligible = true;
  let ageReason: string | null = null;

  if (dateOfBirth) {
    const dob = new Date(dateOfBirth);
    age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    if (age < 18) {
      isAgeEligible = false;
      ageReason = `You are ${age} years old. Donors must be at least 18 years old to donate blood.`;
    }
  } else {
    isAgeEligible = false;
    ageReason =
      "Please set your Date of Birth in Edit Profile to verify donor eligibility.";
  }

  // 2. Second Check: Last Donation Date & 90-Day Rest Period
  let isRestEligible = true;
  let daysUntilEligible = 0;
  let daysPassed = 999;
  let formattedNextDate: string | null = null;
  let restReason: string | null = null;

  if (lastDonationDate) {
    const lastDate = new Date(lastDonationDate);
    const diffTime = today.getTime() - lastDate.getTime();
    daysPassed = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    const REST_PERIOD_DAYS = 90; // 90 days minimum rest period
    isRestEligible = daysPassed >= REST_PERIOD_DAYS;
    daysUntilEligible = isRestEligible ? 0 : REST_PERIOD_DAYS - daysPassed;

    const nextEligibleDate = new Date(lastDate);
    nextEligibleDate.setDate(nextEligibleDate.getDate() + REST_PERIOD_DAYS);
    formattedNextDate = nextEligibleDate.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    if (!isRestEligible) {
      restReason = `You must wait ${daysUntilEligible} more days (90-day rest period). Next eligible date: ${formattedNextDate}.`;
    }
  }

  // Overall eligibility requires BOTH age and rest period checks to pass
  const isEligible = isAgeEligible && isRestEligible;
  const reason = !isAgeEligible
    ? ageReason
    : !isRestEligible
      ? restReason
      : null;

  return {
    isEligible,
    isAgeEligible,
    isRestEligible,
    age,
    daysUntilEligible,
    daysPassed,
    formattedNextDate,
    reason,
  };
}

export function useUserStats(userId: string | undefined) {
  return useQuery<UserStats>({
    queryKey: ["profile", "stats", userId],
    queryFn: () =>
      userId
        ? profileService.fetchUserStats(userId)
        : { totalRequests: 0, activeRequests: 0, totalDonations: 0 },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
}
