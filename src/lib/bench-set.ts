// Held-out multilingual TEST BENCH, built the FLORES way: every line N means the
// same thing in every language (aligned rows), so per-language results are
// directly comparable. These sentences are NOT used as prototypes — they only
// measure the classifier. Hand-written for this prototype; not real visitor data.
import type { Category } from "./taxonomy";

// es/it rows kept as data only; visitor languages are EN/FR/DE.
export const BENCH_LANGS = ["en", "fr", "de"] as const;
export type BenchLang = (typeof BENCH_LANGS)[number];

export interface BenchRow {
  expected: Category;
  text: Record<BenchLang | "es" | "it", string>;
}

export const BENCH: BenchRow[] = [
  { expected: "harvest_walk", text: {
    en: "Could we join the pickers in the coffee field tomorrow?",
    fr: "Pourrions-nous rejoindre les cueilleurs dans le champ de café demain ?",
    de: "Könnten wir morgen die Pflücker im Kaffeefeld begleiten?",
    es: "¿Podríamos acompañar a los recolectores en el cafetal mañana?",
    it: "Potremmo unirci ai raccoglitori nel campo di caffè domani?" } },
  { expected: "harvest_walk", text: {
    en: "I'd love a guided walk among the coffee trees.",
    fr: "J'adorerais une promenade guidée parmi les caféiers.",
    de: "Ich hätte gern einen geführten Spaziergang zwischen den Kaffeebäumen.",
    es: "Me encantaría un paseo guiado entre los cafetos.",
    it: "Mi piacerebbe una passeggiata guidata tra le piante di caffè." } },
  { expected: "harvest_walk", text: {
    en: "My kids want to see the red cherries being picked.",
    fr: "Mes enfants veulent voir la cueillette des cerises rouges.",
    de: "Meine Kinder wollen sehen, wie die roten Kirschen gepflückt werden.",
    es: "Mis hijos quieren ver cómo se recogen las cerezas rojas.",
    it: "I miei figli vogliono vedere come si raccolgono le ciliegie rosse." } },
  { expected: "coffee_tasting", text: {
    en: "Do you offer a cupping session with your best beans?",
    fr: "Proposez-vous une séance de dégustation avec vos meilleurs grains ?",
    de: "Bietet ihr eine Verkostung mit euren besten Bohnen an?",
    es: "¿Ofrecen una cata con sus mejores granos?",
    it: "Offrite una degustazione con i vostri chicchi migliori?" } },
  { expected: "coffee_tasting", text: {
    en: "We want to compare the taste of two or three coffees.",
    fr: "Nous voulons comparer le goût de deux ou trois cafés.",
    de: "Wir wollen den Geschmack von zwei oder drei Kaffees vergleichen.",
    es: "Queremos comparar el sabor de dos o tres cafés.",
    it: "Vogliamo confrontare il sapore di due o tre caffè." } },
  { expected: "coffee_tasting", text: {
    en: "Teach us how to recognise the aromas in a cup.",
    fr: "Apprenez-nous à reconnaître les arômes dans une tasse.",
    de: "Bringt uns bei, die Aromen in einer Tasse zu erkennen.",
    es: "Enséñennos a reconocer los aromas en una taza.",
    it: "Insegnateci a riconoscere gli aromi in una tazza." } },
  { expected: "roasting", text: {
    en: "How dark do you roast the beans, can we watch?",
    fr: "Vous torréfiez les grains à quel point, peut-on regarder ?",
    de: "Wie dunkel röstet ihr die Bohnen, dürfen wir zusehen?",
    es: "¿Qué tan oscuro tuestan los granos? ¿Podemos mirar?",
    it: "Quanto scuri tostate i chicchi, possiamo guardare?" } },
  { expected: "roasting", text: {
    en: "I'd like a short roasting workshop.",
    fr: "J'aimerais un petit atelier de torréfaction.",
    de: "Ich hätte gern einen kurzen Röstkurs.",
    es: "Me gustaría un pequeño taller de tueste.",
    it: "Vorrei un breve laboratorio di tostatura." } },
  { expected: "roasting", text: {
    en: "Can we roast our own bag of coffee to take home?",
    fr: "Peut-on torréfier notre propre sac de café à emporter ?",
    de: "Können wir unsere eigene Tüte Kaffee zum Mitnehmen rösten?",
    es: "¿Podemos tostar nuestra propia bolsa de café para llevar?",
    it: "Possiamo tostare il nostro sacchetto di caffè da portare a casa?" } },
  { expected: "meals", text: {
    en: "Is it possible to have dinner with the family here?",
    fr: "Est-il possible de dîner avec la famille ici ?",
    de: "Kann man hier mit der Familie zu Abend essen?",
    es: "¿Es posible cenar con la familia aquí?",
    it: "È possibile cenare qui con la famiglia?" } },
  { expected: "meals", text: {
    en: "We would pay for a home-cooked vegetarian lunch.",
    fr: "Nous paierions pour un déjeuner végétarien fait maison.",
    de: "Wir würden für ein hausgemachtes vegetarisches Mittagessen zahlen.",
    es: "Pagaríamos por un almuerzo vegetariano casero.",
    it: "Pagheremmo per un pranzo vegetariano fatto in casa." } },
  { expected: "meals", text: {
    en: "Please serve some local dishes after the visit.",
    fr: "Servez quelques plats locaux après la visite, s'il vous plaît.",
    de: "Bitte serviert nach dem Besuch ein paar lokale Gerichte.",
    es: "Por favor, sirvan algunos platos locales después de la visita.",
    it: "Per favore, servite qualche piatto locale dopo la visita." } },
  { expected: "prices", text: {
    en: "What is the entrance fee per person?",
    fr: "Quel est le prix d'entrée par personne ?",
    de: "Wie hoch ist der Eintritt pro Person?",
    es: "¿Cuál es el precio de entrada por persona?",
    it: "Qual è il prezzo d'ingresso a persona?" } },
  { expected: "prices", text: {
    en: "A price list at the gate would help.",
    fr: "Une liste des tarifs à l'entrée aiderait.",
    de: "Eine Preisliste am Eingang wäre hilfreich.",
    es: "Una lista de precios en la entrada ayudaría.",
    it: "Un listino prezzi all'ingresso sarebbe utile." } },
  { expected: "prices", text: {
    en: "Do students get a discount?",
    fr: "Les étudiants ont-ils une réduction ?",
    de: "Bekommen Studenten eine Ermäßigung?",
    es: "¿Los estudiantes tienen descuento?",
    it: "Gli studenti hanno uno sconto?" } },
  { expected: "transport", text: {
    en: "Could someone drive us back to the bus station?",
    fr: "Quelqu'un pourrait-il nous ramener à la gare routière ?",
    de: "Könnte uns jemand zum Busbahnhof zurückfahren?",
    es: "¿Alguien podría llevarnos de vuelta a la estación de autobuses?",
    it: "Qualcuno potrebbe riportarci alla stazione degli autobus?" } },
  { expected: "transport", text: {
    en: "We got lost, a map or signs to the farm are needed.",
    fr: "Nous nous sommes perdus, il faut une carte ou des panneaux vers la ferme.",
    de: "Wir haben uns verirrt, eine Karte oder Schilder zur Farm fehlen.",
    es: "Nos perdimos, hacen falta un mapa o señales hacia la finca.",
    it: "Ci siamo persi, servono una mappa o cartelli per la fattoria." } },
  { expected: "transport", text: {
    en: "Is there a shuttle from the hotel?",
    fr: "Y a-t-il une navette depuis l'hôtel ?",
    de: "Gibt es einen Shuttle vom Hotel?",
    es: "¿Hay un traslado desde el hotel?",
    it: "C'è una navetta dall'hotel?" } },
  { expected: "other", text: {
    en: "Your dog is very friendly.",
    fr: "Votre chien est très gentil.",
    de: "Euer Hund ist sehr freundlich.",
    es: "Su perro es muy simpático.",
    it: "Il vostro cane è molto socievole." } },
  { expected: "other", text: {
    en: "We had a lovely day, thanks.",
    fr: "Nous avons passé une belle journée, merci.",
    de: "Wir hatten einen schönen Tag, danke.",
    es: "Pasamos un día precioso, gracias.",
    it: "Abbiamo passato una bella giornata, grazie." } },
  { expected: "other", text: {
    en: "Is there wifi somewhere?",
    fr: "Y a-t-il du wifi quelque part ?",
    de: "Gibt es irgendwo WLAN?",
    es: "¿Hay wifi en algún sitio?",
    it: "C'è il wifi da qualche parte?" } },
];
