# Evaluator Notes

Use this file privately. Do not share it with candidates before the exercise.

Intentional functional issues included:

1. Traveller maximum is shown as 1-9, but the form does not enforce total traveller count.
2. Children are counted for flights but not for stay calculation, creating inconsistent budget totals.
3. Same itinerary can be saved repeatedly without duplicate warning.
4. Expired promo code `EARLYBIRD` still applies a discount during confirmation.
5. Deleted trip can remain open in the detail modal until manually closed.
6. Download button is visible but does not generate a file.
7. Passport pending profile can still confirm international travel without warning.
8. Cancelled trip does not show refund amount or cancellation policy detail.

Suggested evaluation areas:

- Requirement understanding
- Exploratory testing depth
- Validation coverage
- Severity and priority judgement
- Expected vs actual clarity
- UI/UX observations
- Edge cases and negative scenarios
