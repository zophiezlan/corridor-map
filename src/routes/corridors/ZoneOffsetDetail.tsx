import {
  CorridorFrame,
  MathRow,
  Section,
} from "../../components/CorridorFrame";
import { Money } from "../../components/Money";
import { zoneOffsetCorridor } from "../../calc/corridors";
import { ZONE_OFFSET_BASE_AMOUNTS } from "../../calc/constants";
import { useInputs } from "../../state/useInputs";

const ZONE_LABELS: Record<string, string> = {
  "zone-a": "Zone A",
  "zone-b": "Zone B",
  "special-area": "Special area (within Zone A or B)",
};

export function ZoneOffsetDetail() {
  const { inputs, derived } = useInputs();
  const summary = zoneOffsetCorridor(inputs, derived);

  if (inputs.zoneTaxResidency === "none") {
    return (
      <CorridorFrame
        title="Zone Tax Offset"
        status={summary.status}
        headline={summary.headline}
      >
        <Section title="In plain terms">
          <p>
            The <strong>zone tax offset</strong> is a lump-sum tax offset for
            people whose usual place of residence is a designated remote or
            isolated area of Australia. It&rsquo;s compensation built into the
            tax system for the higher cost of living, distance from services,
            and isolation that come with living in these places.
          </p>
          <p>
            You haven&rsquo;t flagged a zone residence, so this corridor
            doesn&rsquo;t apply. If you do live regional, head back to{" "}
            <a
              href="/inputs"
              className="underline underline-offset-2 decoration-stone-300 hover:decoration-stone-900 dark:decoration-stone-600 dark:hover:decoration-stone-100"
            >
              inputs
            </a>{" "}
            and check the ATO zone list &mdash; the boundaries are narrower than
            you&rsquo;d guess, but many regional towns qualify.
          </p>
        </Section>

        <Section title="Who this reaches">
          <p>
            Rural and remote sector workers &mdash; community health, Aboriginal
            medical services, NT and WA outreach roles, remote-area nursing,
            regional hospital staff &mdash; and many eligible people never claim
            it because the ATO&rsquo;s standalone calculator was retired from
            2024-25 onwards. It&rsquo;s now a line on your tax return; if you
            don&rsquo;t know to tick it, it&rsquo;s gone.
          </p>
        </Section>
      </CorridorFrame>
    );
  }

  return (
    <CorridorFrame
      title="Zone Tax Offset"
      status={summary.status}
      headline={summary.headline}
    >
      <Section title="In plain terms">
        <p>
          The <strong>zone tax offset</strong> is a lump-sum tax offset for
          residents of designated remote or isolated areas of Australia. You
          selected <strong>{ZONE_LABELS[inputs.zoneTaxResidency]}</strong>, so
          you&rsquo;re eligible provided your usual place of residence was in a
          qualifying locality for at least 183 days of the income year.
        </p>
        <p>
          From 2024-25 onwards the ATO retired its standalone calculator.
          It&rsquo;s now a line on your tax return at{" "}
          <em>Zone or overseas forces</em>. No separate form, no separate claim
          &mdash; but if you don&rsquo;t tick it, it&rsquo;s gone.
        </p>
      </Section>

      <Section title="Where you are">
        <div>
          <MathRow
            label="Your zone"
            value={ZONE_LABELS[inputs.zoneTaxResidency]}
          />
          <MathRow
            label="Base offset for this zone"
            value={<Money value={derived.zoneOffsetBase} />}
          />
        </div>
        <p className="mt-3 text-sm text-stone-600 dark:text-stone-400">
          The base is the floor. If you have dependents, are a single parent,
          qualify for an invalid or invalid-carer offset, or receive a remote
          area allowance, the number changes &mdash; usually upward, sometimes
          by several hundred or thousand dollars.
        </p>
      </Section>

      <Section title="All three zones">
        <div>
          <MathRow
            label="Special area (within Zone A or B)"
            value={<Money value={ZONE_OFFSET_BASE_AMOUNTS["special-area"]} />}
          />
          <MathRow
            label="Zone A"
            value={<Money value={ZONE_OFFSET_BASE_AMOUNTS["zone-a"]} />}
          />
          <MathRow
            label="Zone B"
            value={<Money value={ZONE_OFFSET_BASE_AMOUNTS["zone-b"]} />}
          />
        </div>
        <p className="mt-3 text-sm text-stone-600 dark:text-stone-400">
          &ldquo;Special areas&rdquo; are pockets inside Zone A or B that carry
          the higher rate &mdash; the ATO&rsquo;s zone list identifies them.
          Most remote towns sit in Zone A; Zone B is the next band out.
        </p>
      </Section>

      <Section title="How to check your address">
        <p>
          The ATO publishes an{" "}
          <a
            href="https://www.ato.gov.au/calculators-and-tools/tax-offsets-australian-zones"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 decoration-stone-300 hover:decoration-stone-900 dark:decoration-stone-600 dark:hover:decoration-stone-100"
          >
            Australian zone list
          </a>{" "}
          &mdash; postcodes and localities grouped by zone. The list isn&rsquo;t
          exhaustive (some newer remote localities aren&rsquo;t included yet),
          but it covers most eligible addresses. If you&rsquo;re unsure, the
          ATO&rsquo;s{" "}
          <a
            href="https://www.ato.gov.au/calculators-and-tools/tax-offsets-zone-or-overseas-forces"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 decoration-stone-300 hover:decoration-stone-900 dark:decoration-stone-600 dark:hover:decoration-stone-100"
          >
            Zone or overseas forces tax offset calculator
          </a>{" "}
          still works as a reference even though the claim process has moved
          into the return itself.
        </p>
      </Section>

      <Section title="What the tax system is steering">
        <p>
          The offset is compensation, not an incentive. It exists to offset the
          genuinely higher cost of living in remote areas &mdash; groceries,
          fuel, services, travel to see a specialist. The amounts look small
          compared to the packaging caps, but they&rsquo;re pure tax back in
          your pocket, claimed with a single line on your return.
        </p>
      </Section>

      <Section title="If you want to act on this">
        <p>
          At tax time, claim at <em>Zone or overseas forces</em> and answer the
          eligibility questions. If you have dependents or receive a remote area
          allowance, the ATO calculator walks you through the multi-dependant
          &ldquo;notional offset&rdquo; math that can increase your claim.
        </p>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          Verify eligibility with your tax agent if your residence arrangement
          is unusual &mdash; FIFO, shared residences, or mid-year moves all have
          specific rules.
        </p>
      </Section>

      <Section title="Gotchas">
        <ul className="list-disc list-inside space-y-1 text-sm text-stone-700 dark:text-stone-300">
          <li>
            <strong>FIFO workers don&rsquo;t qualify.</strong> Eligibility is
            based on your <em>usual place of residence</em>, not where you work.
            Flying in for 183 days doesn&rsquo;t make Kununurra your residence
            if your home base is Perth.
          </li>
          <li>
            <strong>183-day rule.</strong> Your residence has to be in the zone
            for 183 days or more of the income year. A carry-over rule covers
            the first year if you moved mid-year.
          </li>
          <li>
            <strong>Remote area allowance reduces it.</strong> Any Centrelink
            remote area allowance you receive reduces the zone offset
            dollar-for-dollar.
          </li>
          <li>
            <strong>Offshore oil/gas rigs don&rsquo;t count</strong> as
            residence in a zone.
          </li>
          <li>
            <strong>You can&rsquo;t double-dip</strong> with the overseas forces
            tax offset &mdash; pick whichever gives the larger amount.
          </li>
        </ul>
      </Section>
    </CorridorFrame>
  );
}
