// SEPARATE held-out TEST SET (45 messages: 15 EN, 15 FR, 15 DE, incl. off-topic).
// Written independently of the demo set and the bench; never used as prototypes
// or for threshold tuning. Only used by `bun scripts/bench.ts --set=test` to
// report real accuracy and the "Not sure" rate. Hand-written, not visitor data.
import type { Category } from "./taxonomy";
import type { BenchLang } from "./bench-set";

export interface TestItem { lang: BenchLang; expected: Category; text: string }

export const TEST_SET: TestItem[] = [
  // English
  { lang: "en", expected: "harvest_walk", text: "Is it possible to help with the picking this week?" },
  { lang: "en", expected: "harvest_walk", text: "We would like a tour through the plantation during harvest." },
  { lang: "en", expected: "coffee_tasting", text: "Can we taste the different coffees you grow?" },
  { lang: "en", expected: "coffee_tasting", text: "A tasting with explanations would be great." },
  { lang: "en", expected: "roasting", text: "I want to see how you roast the green beans." },
  { lang: "en", expected: "roasting", text: "Could we try roasting a small batch ourselves?" },
  { lang: "en", expected: "meals", text: "Do you serve lunch with local food?" },
  { lang: "en", expected: "meals", text: "We'd love a home-cooked dinner at the farm." },
  { lang: "en", expected: "prices", text: "How much does a visit cost per person?" },
  { lang: "en", expected: "prices", text: "What is the price of a bag of your coffee?" },
  { lang: "en", expected: "transport", text: "How do we get here from the bus station?" },
  { lang: "en", expected: "transport", text: "Can someone pick us up from the village?" },
  { lang: "en", expected: "other", text: "My phone battery died, is there a charger?" },
  { lang: "en", expected: "other", text: "What a beautiful sunset over the hills tonight." },
  { lang: "en", expected: "other", text: "Who won the football match yesterday?" },
  // French
  { lang: "fr", expected: "harvest_walk", text: "Peut-on participer à la récolte du café ?" },
  { lang: "fr", expected: "harvest_walk", text: "J'aimerais visiter les plantations pendant la cueillette." },
  { lang: "fr", expected: "coffee_tasting", text: "Est-ce qu'on peut goûter vos différents cafés ?" },
  { lang: "fr", expected: "coffee_tasting", text: "Une dégustation commentée nous plairait beaucoup." },
  { lang: "fr", expected: "roasting", text: "Je voudrais voir comment vous torréfiez les grains." },
  { lang: "fr", expected: "roasting", text: "Peut-on essayer de torréfier un petit lot nous-mêmes ?" },
  { lang: "fr", expected: "meals", text: "Servez-vous un déjeuner avec des produits locaux ?" },
  { lang: "fr", expected: "meals", text: "Un dîner fait maison à la ferme, ce serait parfait." },
  { lang: "fr", expected: "prices", text: "Combien coûte la visite par personne ?" },
  { lang: "fr", expected: "prices", text: "Quel est le prix d'un paquet de votre café ?" },
  { lang: "fr", expected: "transport", text: "Comment venir ici depuis la gare routière ?" },
  { lang: "fr", expected: "transport", text: "Quelqu'un peut-il venir nous chercher au village ?" },
  { lang: "fr", expected: "other", text: "Ma batterie est vide, avez-vous un chargeur ?" },
  { lang: "fr", expected: "other", text: "Quel beau coucher de soleil sur les collines ce soir." },
  { lang: "fr", expected: "other", text: "Qui a gagné le match de foot hier ?" },
  // German
  { lang: "de", expected: "harvest_walk", text: "Können wir diese Woche bei der Ernte helfen?" },
  { lang: "de", expected: "harvest_walk", text: "Wir möchten während der Ernte durch die Plantage gehen." },
  { lang: "de", expected: "coffee_tasting", text: "Können wir eure verschiedenen Kaffees probieren?" },
  { lang: "de", expected: "coffee_tasting", text: "Eine Verkostung mit Erklärungen wäre toll." },
  { lang: "de", expected: "roasting", text: "Ich möchte sehen, wie ihr die grünen Bohnen röstet." },
  { lang: "de", expected: "roasting", text: "Dürfen wir selbst eine kleine Menge rösten?" },
  { lang: "de", expected: "meals", text: "Gibt es ein Mittagessen mit regionalen Produkten?" },
  { lang: "de", expected: "meals", text: "Ein hausgemachtes Abendessen auf dem Hof wäre schön." },
  { lang: "de", expected: "prices", text: "Was kostet der Besuch pro Person?" },
  { lang: "de", expected: "prices", text: "Wie viel kostet eine Tüte von eurem Kaffee?" },
  { lang: "de", expected: "transport", text: "Wie kommen wir vom Busbahnhof hierher?" },
  { lang: "de", expected: "transport", text: "Kann uns jemand im Dorf abholen?" },
  { lang: "de", expected: "other", text: "Mein Akku ist leer, habt ihr ein Ladegerät?" },
  { lang: "de", expected: "other", text: "Was für ein schöner Sonnenuntergang über den Hügeln." },
  { lang: "de", expected: "other", text: "Wer hat gestern das Fußballspiel gewonnen?" },
];
