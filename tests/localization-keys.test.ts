import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import test from "node:test";
import {
  buildLocalizedPath,
  isValidLocale,
  switchLocaleInPath,
} from "../src/lib/i18n.ts";

const LOCALES_ROOT = path.resolve(process.cwd(), "src", "locales");

function readJson(locale: "ar" | "en", namespace: string): unknown {
  const filePath = path.join(LOCALES_ROOT, locale, `${namespace}.json`);
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw) as unknown;
}

/**
 * Deeply compares two data structures (ar and en) to ensure complete key symmetry,
 * matching array lengths, and non-empty strings.
 */
function assertStructureSymmetry(
  ar: unknown,
  en: unknown,
  keyPath = "root"
): void {
  const typeAr = typeof ar;
  const typeEn = typeof en;

  assert.equal(
    typeAr,
    typeEn,
    `Type mismatch at ${keyPath}: AR is "${typeAr}", EN is "${typeEn}"`
  );

  if (ar === null || ar === undefined) {
    assert.equal(en, ar, `Null mismatch at ${keyPath}`);
    return;
  }

  if (typeof ar === "string") {
    assert.ok(
      ar.trim().length > 0,
      `AR string at ${keyPath} is empty or only whitespace`
    );
    assert.ok(
      (en as string).trim().length > 0,
      `EN string at ${keyPath} is empty or only whitespace`
    );
    return;
  }

  if (typeof ar === "boolean" || typeof ar === "number") {
    return;
  }

  if (Array.isArray(ar)) {
    assert.ok(Array.isArray(en), `Expected array in EN at ${keyPath}`);
    assert.equal(
      ar.length,
      (en as unknown[]).length,
      `Array length mismatch at ${keyPath}: AR=${ar.length}, EN=${(en as unknown[]).length}`
    );
    for (let i = 0; i < ar.length; i++) {
      assertStructureSymmetry(ar[i], (en as unknown[])[i], `${keyPath}[${i}]`);
    }
    return;
  }

  if (typeof ar === "object") {
    assert.ok(
      typeof en === "object" && !Array.isArray(en),
      `Expected object in EN at ${keyPath}`
    );

    const keysAr = Object.keys(ar as Record<string, unknown>).sort();
    const keysEn = Object.keys(en as Record<string, unknown>).sort();

    const missingInEn = keysAr.filter((k) => !keysEn.includes(k));
    assert.deepEqual(
      missingInEn,
      [],
      `Keys in AR missing from EN at ${keyPath}: [${missingInEn.join(", ")}]`
    );

    const missingInAr = keysEn.filter((k) => !keysAr.includes(k));
    assert.deepEqual(
      missingInAr,
      [],
      `Keys in EN missing from AR at ${keyPath}: [${missingInAr.join(", ")}]`
    );

    for (const key of keysAr) {
      assertStructureSymmetry(
        (ar as Record<string, unknown>)[key],
        (en as Record<string, unknown>)[key],
        `${keyPath}.${key}`
      );
    }
  }
}

test("Modular Locale Files Completeness (src/locales/ar vs src/locales/en)", async (t) => {
  const arFiles = fs
    .readdirSync(path.join(LOCALES_ROOT, "ar"))
    .filter((f) => f.endsWith(".json"))
    .sort();
  const enFiles = fs
    .readdirSync(path.join(LOCALES_ROOT, "en"))
    .filter((f) => f.endsWith(".json"))
    .sort();

  await t.test("ar and en contain identical namespace JSON files", () => {
    assert.deepEqual(arFiles, enFiles);
    assert.ok(arFiles.includes("common.json"));
    assert.ok(arFiles.includes("home.json"));
    assert.ok(arFiles.includes("about.json"));
    assert.ok(arFiles.includes("guide.json"));
    assert.ok(arFiles.includes("privacy.json"));
    assert.ok(arFiles.includes("admin.json"));
  });

  for (const file of arFiles) {
    const ns = file.replace(/\.json$/, "");
    await t.test(`namespace '${ns}' has full AR/EN symmetry`, () => {
      const arData = readJson("ar", ns);
      const enData = readJson("en", ns);
      assertStructureSymmetry(arData, enData, ns);
    });
  }
});

test("Domain-Specific Localization Rules", async (t) => {
  const homeAr = readJson("ar", "home") as {
    featuresSection: { cards: Array<{ id: string; techBadges: string[] }> };
    faqSection: { items: Array<{ q: string; a: string }> };
  };
  const homeEn = readJson("en", "home") as typeof homeAr;
  const guideAr = readJson("ar", "guide") as {
    brandsSection: { brands: Array<{ id: string; steps: string[] }> };
  };
  const guideEn = readJson("en", "guide") as typeof guideAr;
  const adminAr = readJson("ar", "admin") as { allAdmins: string };

  await t.test("native card techBadges contain Arabic explanation in AR locale", () => {
    const arNative = homeAr.featuresSection.cards.find((c) => c.id === "native");
    const enNative = homeEn.featuresSection.cards.find((c) => c.id === "native");
    assert.ok(arNative && arNative.techBadges.length === 3);
    assert.ok(enNative && enNative.techBadges.length === 3);

    for (const badge of arNative.techBadges) {
      assert.ok(
        /[\u0600-\u06FF]/.test(badge),
        `Expected Arabic explanation in badge "${badge}"`
      );
    }
  });

  await t.test("guide OEM phone brands match by ID and step count", () => {
    const arBrands = guideAr.brandsSection.brands;
    const enBrands = guideEn.brandsSection.brands;
    assert.ok(arBrands.length >= 7);
    assert.equal(arBrands.length, enBrands.length);
    for (let i = 0; i < arBrands.length; i++) {
      assert.equal(arBrands[i].id, enBrands[i].id);
      assert.equal(arBrands[i].steps.length, enBrands[i].steps.length);
    }
  });

  await t.test("FAQ items contain at least 5 Q&A pairs", () => {
    assert.ok(homeAr.faqSection.items.length >= 5);
    assert.equal(homeAr.faqSection.items.length, homeEn.faqSection.items.length);
  });

  await t.test("admin namespace has localized Arabic strings", () => {
    assert.ok(/[\u0600-\u06FF]/.test(adminAr.allAdmins));
  });
});

test("i18n Path & Locale Helpers", async (t) => {
  await t.test("isValidLocale accepts only ar and en", () => {
    assert.equal(isValidLocale("ar"), true);
    assert.equal(isValidLocale("en"), true);
    assert.equal(isValidLocale("fr"), false);
    assert.equal(isValidLocale(undefined), false);
  });

  await t.test("buildLocalizedPath uses unprefixed routes for primary Arabic locale", () => {
    assert.equal(buildLocalizedPath("ar", "/"), "/");
    assert.equal(buildLocalizedPath("ar", "/guide"), "/guide");
    assert.equal(buildLocalizedPath("ar", "/#download"), "/#download");
    assert.equal(buildLocalizedPath("en", "/"), "/en");
    assert.equal(buildLocalizedPath("en", "/guide"), "/en/guide");
    assert.equal(buildLocalizedPath("en", "/#download"), "/en#download");
  });

  await t.test("switchLocaleInPath preserves current route across locales", () => {
    assert.equal(switchLocaleInPath("/", "en"), "/en");
    assert.equal(switchLocaleInPath("/guide", "en"), "/en/guide");
    assert.equal(switchLocaleInPath("/en", "ar"), "/");
    assert.equal(switchLocaleInPath("/en/privacy", "ar"), "/privacy");
  });
});
