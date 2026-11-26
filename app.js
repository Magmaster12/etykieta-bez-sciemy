/* =========================================================================
   ETYKIETA BEZ ŚCIEMY – Baza danych i logika aplikacji (app.js)
   Struktura pliku:
     1. Konfiguracja warstw i baza 5 produktów (Rentgen Etykiety)
     2. Baza 12 pytań quizowych z 3 kategorii (Sprawdź się!)
     3. Autorskie makiety SVG produktów (gotowe do podmiany na PNG Karoliny)
     4. Zarządzanie stanem i zapisem w localStorage
     5. Narzędzia interfejsu (toasty, przełączanie zakładek, liczniki)
     6. Silnik modułu 1: Rentgen Etykiety
     7. Silnik modułu 2: Quiz „Sprawdź się!”
     8. Generator Ściągawki PNG (HTML5 Canvas), kopiowanie i ankieta Forum
     9. Inicjalizacja aplikacji (DOMContentLoaded)
   ========================================================================= */

'use strict';

/* =========================================================================
   1. KONFIGURACJA WARSTW I BAZA 5 PRODUKTÓW
   ========================================================================= */
const LAYER_META = {
  chemia: {
    label: 'Chemia',
    icon: '🧪',
    pinBg: 'bg-sky-600',
    pinBorder: 'border-sky-200',
    activeTab: 'bg-sky-600 text-white border-sky-600 shadow-sm',
    inactiveTab: 'bg-sky-50/70 text-sky-900 border-sky-200 hover:bg-sky-100',
    boxClass: 'bg-sky-50/50 border-sky-300',
    tagClass: 'bg-sky-100 text-sky-900'
  },
  prawo: {
    label: 'Prawo',
    icon: '⚖️',
    pinBg: 'bg-indigo-600',
    pinBorder: 'border-indigo-200',
    activeTab: 'bg-indigo-600 text-white border-indigo-600 shadow-sm',
    inactiveTab: 'bg-indigo-50/70 text-indigo-900 border-indigo-200 hover:bg-indigo-100',
    boxClass: 'bg-indigo-50/50 border-indigo-300',
    tagClass: 'bg-indigo-100 text-indigo-900'
  },
  jakosc: {
    label: 'Jakość',
    icon: '🏅',
    pinBg: 'bg-amber-500',
    pinBorder: 'border-amber-200',
    activeTab: 'bg-amber-500 text-white border-amber-500 shadow-sm',
    inactiveTab: 'bg-amber-50/70 text-amber-900 border-amber-200 hover:bg-amber-100',
    boxClass: 'bg-amber-50/50 border-amber-300',
    tagClass: 'bg-amber-100 text-amber-900'
  },
  grafika: {
    label: 'Grafika',
    icon: '🎨',
    pinBg: 'bg-rose-600',
    pinBorder: 'border-rose-200',
    activeTab: 'bg-rose-600 text-white border-rose-600 shadow-sm',
    inactiveTab: 'bg-rose-50/70 text-rose-900 border-rose-200 hover:bg-rose-100',
    boxClass: 'bg-rose-50/50 border-rose-300',
    tagClass: 'bg-rose-100 text-rose-900'
  }
};

const PRODUCTS = [
  {
    id: 'magnelek-b6',
    mainCategory: 'leki',
    shortName: 'MagneLek B6 (Lek)',
    name: 'MagneLek B6 100 mg – Produkt leczniczy (OTC)',
    category: '💊 Lek (Produkt leczniczy OTC)',
    verdict: 'kupuje',
    teaser: 'Porównujesz magnez w aptece. Na prostym pudełku widnieje wyraźny napis „Produkt leczniczy”, numer pozwolenia URPL oraz konkretna dawka dobrze przyswajalnego mleczanu magnezu. Jak oceniasz to oznaczenie?',
    verdictHeadlineKupuje: 'Trafna ocena! To przykład transparentnie oznaczonego produktu leczniczego.',
    verdictHeadlineSciema: 'Warto przyjrzeć się bliżej – to produkt o wysokim standardzie kontroli (Lek OTC).',
    verdictSummary: 'Status produktu leczniczego oznacza potwierdzoną badaniami jakość i skuteczność oraz nadzór GIF/URPL. Mimo to każdy lek wymaga przestrzegania dawkowania i przeciwwskazań z ulotki.',
    pros: [
      'Status produktu leczniczego (OTC) – potwierdzona zawartość substancji czynnej i kontrola jakości GMP.',
      'Organiczna, lepiej przyswajalna sól (mleczan magnezu) z jasno podaną dawką jonów Mg²⁺.',
      'Czytelna informacja o temperaturze przechowywania (poniżej 25°C) oraz pełna ulotka.'
    ],
    cons: [
      'Wymaga przestrzegania przeciwwskazań (np. ciężka niewydolność nerek) i nie powinien być stosowany „na zapas” bez potrzeby.',
      'Bywa droższy w przeliczeniu na opakowanie niż podstawowe suplementy z tlenkiem magnezu.'
    ],
    layers: {
      chemia: {
        x: 50, y: 54,
        title: 'Organiczna sól magnezu i precyzyjna dawka jonów',
        text: 'Mleczan lub cytrynian magnezu charakteryzują się wyższą biodostępnością niż tani tlenek magnezu. Etykieta wyraźnie odróżnia masę całej soli od realnej dawki jonów magnezu (Mg²⁺).',
        source: 'Charakterystyka Produktu Leczniczego (ChPL); farmakologia kliniczna'
      },
      prawo: {
        x: 50, y: 80,
        title: 'Status Produktu Leczniczego (URPL / GIF)',
        text: 'Przed dopuszczeniem do sprzedaży lek musi przejść procedurę rejestracji w URPL, udowodnić jakość, bezpieczeństwo i skuteczność, a każda seria podlega nadzorowi Głównego Inspektoratu Farmaceutycznego.',
        source: 'Ustawa – Prawo farmaceutyczne; Rejestr Produktów Leczniczych'
      },
      jakosc: {
        x: 74, y: 26,
        title: 'Standard wytwarzania GMP i warunki przechowywania',
        text: 'Produkcja leków odbywa się w rygorystycznym standardzie GMP (Good Manufacturing Practice). Opakowanie podaje dokładną temperaturę przechowywania (do 25°C), co gwarantuje stabilność substancji czynnej.',
        source: 'Wymagania Dobrej Praktyki Wytwarzania (GMP)'
      },
      grafika: {
        x: 28, y: 34,
        title: 'Przejrzysty układ informacyjny bez haseł reklamowych',
        text: 'Widoczna nazwa substancji czynnej, dawka, postać farmaceutyczna oraz oznaczenie „Lek OTC” bez krzykliwych sloganów i niezweryfikowanych pieczątek.',
        source: 'Rozporządzenie MZ w sprawie wymagań dotyczących oznakowania opakowań produktu leczniczego'
      }
    }
  },
  {
    id: 'krem-purebio',
    mainCategory: 'kosmetyki',
    shortName: 'Krem PureBio',
    name: 'Krem „PureBio – 100% Bez Chemii”',
    category: '✨ Kosmetyki',
    verdict: 'sciema',
    teaser: 'Widzisz ten słoiczek w drogerii. Estetyczne eko-opakowanie, złota pieczątka gwarancji i hasło o całkowitym braku chemii. Jak oceniasz rzetelność komunikatów na etykiecie?',
    verdictHeadlineSciema: 'Celna obserwacja! Na tej etykiecie kilka komunikatów wymaga krytycznej weryfikacji.',
    verdictHeadlineKupuje: 'Warto przyjrzeć się bliżej – estetyka „eko” może odwracać uwagę od nieścisłych haseł.',
    verdictSummary: 'Sam krem może dobrze nawilżać (zawiera masło shea), jednak hasło „100% bez chemii” jest nieścisłe naukowo i niezgodne z unijnymi wytycznymi oświadczeń kosmetycznych.',
    pros: [
      'Zawiera sprawdzone emolienty nawilżające (np. masło shea – Butyrospermum Parkii Butter).',
      'Pełna, zgodna z prawem lista składników INCI umieszczona na etykiecie.'
    ],
    cons: [
      'Hasło „100% bez chemii” jest fizycznie niemożliwe i wykorzystuje lęk przed słowem chemia.',
      'Zawiera substancje zapachowe (Parfum, Limonene), które mogą podrażniać bardzo wrażliwą cerę.',
      'Złota pieczątka „Eko Gwarancja” jest własną grafiką bez zewnętrznej certyfikacji (np. COSMOS).'
    ],
    layers: {
      chemia: {
        x: 50, y: 78,
        title: 'Nieścisłość hasła „bez chemii” i alergeny zapachowe',
        text: 'Wszystko, co istnieje – włącznie z wodą (Aqua), masłem shea i ekstraktem roślinnym – składa się ze związków chemicznych. Warto też zauważyć obecność naturalnych składników zapachowych (Limonene), które u części osób wrażliwych mogą powodować reakcje alergiczne.',
        source: 'Baza CosIng Komisji Europejskiej; toksykologia kosmetyczna'
      },
      prawo: {
        x: 42, y: 46,
        title: 'Kryteria unijne dla oświadczeń kosmetycznych',
        text: 'Unijne rozporządzenie wymaga, aby oświadczenia na kosmetykach były zgodne z prawdą i nie dyskredytowały legalnych, przebadanych składników dopuszczonych do obrotu (np. dopuszczonych konserwantów).',
        source: 'Rozporządzenie Komisji (UE) nr 655/2013; Dokument techniczny KE'
      },
      jakosc: {
        x: 76, y: 34,
        title: 'Znak własny a niezależny certyfikat',
        text: 'Złota pieczątka „Eko Gwarancja 2026” nie odwołuje się do akredytowanej jednostki (jak COSMOS czy ECOCERT). Warto traktować ją jako element graficzny, a nie dowód niezależnego audytu.',
        source: 'Standardy certyfikacji COSMOS / ISO 14024'
      },
      grafika: {
        x: 24, y: 34,
        title: 'Efekt „green-cueing” w projektowaniu opakowań',
        text: 'Połączenie zieleni, papierowej tekstury i liścia aloesu buduje pozytywne skojarzenie z naturą, co może sprawiać, że konsument rzadziej weryfikuje skład INCI i cenę produktu.',
        source: 'Psychologia opakowań i neuromarketing'
      }
    }
  },
  {
    id: 'suplement-neurocalm',
    mainCategory: 'suplementy',
    shortName: 'NeuroCalm Forte',
    name: 'Suplement „NeuroCalm Forte – Stop Stresowi”',
    category: '🧴 Suplementy diety',
    verdict: 'sciema',
    teaser: 'Widzisz to pudełko w poleceniach online z kodem rabatowym -20%. Stylistyka przypomina produkt apteczny, a na froncie obiecuje ulgę w nerwicy. Jak oceniasz przejrzystość tej etykiety?',
    verdictHeadlineSciema: 'Dobra czujność! Warto odróżnić suplement diety od produktu leczniczego.',
    verdictHeadlineKupuje: 'Warto sprawdzić drobny druk – mimo „aptecznego” wyglądu to nie jest lek.',
    verdictSummary: 'Suplementy mogą stanowić uzupełnienie diety, ale w świetle prawa nie są lekami i nie mogą obiecywać leczenia schorzeń takich jak nerwica czy bezsenność.',
    pros: [
      'Zawiera znany składnik roślinny (ekstrakt z melisy) oraz magnez w wygodnej formie kapsułek.',
      'Na opakowaniu umieszczono wymagane prawem określenie „Suplement diety”.'
    ],
    cons: [
      'Obietnica leczenia nerwicy i bezsenności wykracza poza dozwolony prawnie zakres oświadczeń dla żywności/suplementów.',
      'Zastosowano tlenek magnezu o niższej przyswajalności i nie podano standaryzacji ekstraktu.',
      'Współpraca z kodem rabatowym wymaga wyraźnego oznaczenia komercyjnego (rekomendacje UOKiK).'
    ],
    layers: {
      chemia: {
        x: 50, y: 58,
        title: 'Forma chemiczna magnezu i brak standaryzacji',
        text: 'Warto zwrócić uwagę na formę składnika: tlenek magnezu przyswaja się słabiej niż sole organiczne (np. cytrynian czy mleczan). Brak informacji o standaryzacji ekstraktu z melisy utrudnia ocenę realnej zawartości związków czynnych.',
        source: 'Opinie naukowe EFSA (Europejski Urząd ds. Bezpieczeństwa Żywności)'
      },
      prawo: {
        x: 72, y: 84,
        title: 'Suplement diety ma status żywności, nie leku',
        text: 'Suplement diety wprowadza się do obrotu poprzez powiadomienie GIS – bez obowiązkowych badań klinicznych skuteczności wymaganych dla leków. Przepisy zabraniają przypisywania suplementom właściwości leczenia chorób.',
        source: 'Ustawa o bezpieczeństwie żywności i żywienia; Rozporządzenie (WE) nr 1924/2006'
      },
      jakosc: {
        x: 34, y: 38,
        title: 'Hasło „Polecane przez ekspertów” bez metodologii',
        text: 'Ogólna deklaracja bez wskazania grupy ekspertów i metodyki badania ma charakter marketingowy. W przeciwieństwie do leków (nadzór GIF), suplementy podlegają normom bezpieczeństwa żywności.',
        source: 'Rejestr Produktów Leczniczych vs. Rejestr GIS'
      },
      grafika: {
        x: 76, y: 24,
        title: 'Stylistyka medyczna i ekspozycja informacji',
        text: 'Białe opakowanie, krzyżyk i nazwa „Forte” mogą sugerować status leku, podczas gdy informacja „Suplement diety” ma mniejszy kontrast. Przy zakupie z kodem rabatowym warto sprawdzić, czy polecenie jest reklamą.',
        source: 'Analiza projektowania opakowań; Rekomendacje Prezesa UOKiK'
      }
    }
  },
  {
    id: 'baton-fitzero',
    mainCategory: 'zywnosc',
    shortName: 'Baton FitZero*',
    name: 'Baton „FitZero* – Bez Dodatku Cukru”',
    category: '🥗 Żywność (Przekąski)',
    verdict: 'sciema',
    teaser: 'Szybka przekąska po treningu: na froncie „0% dodanego cukru” i „140 kcal!*”. Na odwrocie okazuje się, że 140 kcal dotyczy połowy batona, a bazą jest pasta daktylowa. Jak oceniasz czytelność przekazu?',
    verdictHeadlineSciema: 'Słuszna uwaga! Warto zawsze porównywać kalorie i cukry w kolumnie na 100 g.',
    verdictHeadlineKupuje: 'Warto zajrzeć na tył opakowania – kluczowa jest wielkość porcji i zawartość cukrów naturalnych.',
    verdictSummary: 'Baton może być wygodnym źródłem szybkiej energii (np. na długiej wycieczce górskiej), ale dla osoby szukającej niskocukrowej przekąski front opakowania może być mylący.',
    pros: [
      'Nie zawiera dosypanej białej sacharozy – słodycz pochodzi m.in. z owoców (daktyli).',
      'Szybkie źródło węglowodanów i błonnika, przydatne przy intensywnym wysiłku wytrzymałościowym.'
    ],
    cons: [
      'Wartość „140 kcal” dotyczy połowy batona (30 g), podczas gdy cały baton (60 g) ma 280 kcal.',
      'Wysoka zawartość cukrów prostych (42 g / 100 g, czyli ok. 25 g w całym batonie) z daktyli i syropu z agawy.',
      'Obecność oleju palmowego w składzie, mimo sportowego wizerunku na froncie.'
    ],
    layers: {
      chemia: {
        x: 52, y: 74,
        title: 'Cukry naturalne vs. brak dodanej sacharozy',
        text: 'Pasta daktylowa (45%) i syrop z agawy dostarczają znacznej ilości glukozy i fruktozy (ponad 25 g cukru w całym batonie). Z punktu widzenia organizmu cukry proste z zagęszczonych syropów również podnoszą glikemię.',
        source: 'NCEŻ – Narodowe Centrum Edukacji Żywieniowej'
      },
      prawo: {
        x: 74, y: 50,
        title: 'Zasady oświadczenia i „sugerowana porcja”',
        text: 'Hasło „bez dodatku cukrów” wymaga dopisku „Zawiera naturalnie występujące cukry”. Podawanie wartości dla porcji mniejszej niż opakowanie jest dopuszczalne, dlatego najbardziej miarodajna pozostaje kolumna na 100 g.',
        source: 'Rozporządzenie (WE) nr 1924/2006; Rozporządzenie (UE) nr 1169/2011'
      },
      jakosc: {
        x: 28, y: 74,
        title: 'Kolejność składników od największego udziału',
        text: 'Lista składników jest zawsze uporządkowana malejąco. Pierwsze trzy pozycje (pasta daktylowa, syrop z agawy, olej palmowy) pokazują, że jest to głównie baton energetyczno-węglowodanowy, nie niskokaloryczny.',
        source: 'Rozporządzenie (UE) nr 1169/2011 – zasady znakowania składu'
      },
      grafika: {
        x: 28, y: 34,
        title: 'Efekt aureoli zdrowotnej (Health Halo)',
        text: 'Duże „0%” i motyw sportowy budują skojarzenie z produktem dietetycznym, podczas gdy odnośnik gwiazdki wyjaśniający wielkość porcji jest wyraźnie mniejszy.',
        source: 'Ekonomia behawioralna i framing wizualny'
      }
    }
  },
  {
    id: 'woda-alkaline',
    mainCategory: 'zywnosc',
    shortName: 'Woda pH 9.5',
    name: 'Woda „Alkaline Detox pH 9.5” (14,99 zł)',
    category: '🥗 Żywność (Napoje)',
    verdict: 'sciema',
    teaser: 'Designerska butelka za 14,99 zł z hasłami „odkwasza organizm”, „usuwa toksyny” i „100% przyjazna planecie”. Jak oceniasz relację obietnic naukowych i ceny?',
    verdictHeadlineSciema: 'Świetna analiza! Warto oddzielić podstawową funkcję nawodnienia od haseł marketingowych.',
    verdictHeadlineKupuje: 'Warto zweryfikować te obietnice – z perspektywy fizjologii i ceny płacisz głównie za marketing.',
    verdictSummary: 'Woda oczywiście bezpiecznie nawadnia organizm, jednak u zdrowego człowieka nie „odkwasza” krwi, a ogólne deklaracje ekologiczne bez dowodu wymagają weryfikacji w świetle prawa UE.',
    pros: [
      'Bezpieczny napój bez cukru i kalorii – spełnia podstawową funkcję nawadniania organizmu.',
      'Wygodna, estetyczna butelka do zabrania w podróż.'
    ],
    cons: [
      'Kwaśne środowisko żołądka (pH 1,5–2) neutralizuje wodę alkaliczną; za pH krwi i usuwanie toksyn odpowiadają nerki, płuca i wątroba.',
      'Cena (14,99 zł) jest kilkukrotnie wyższa niż zwykłej wody źródlanej lub filtrowanej kranówki o tym samym efekcie nawodnienia.',
      'Ogólne hasło „100% przyjazna planecie” i własny znaczek ekologiczny bez certyfikatu nie spełniają wymogów Dyrektywy UE 2024/825.'
    ],
    layers: {
      chemia: {
        x: 50, y: 44,
        title: 'Fizjologia pH krwi i rola kwasu żołądkowego',
        text: 'Zdrowy organizm samodzielnie utrzymuje pH krwi w wąskim zakresie 7,35–7,45 dzięki płucom i nerkom. Woda o wyższym pH zostaje zneutralizowana w żołądku, więc nie zmienia pH krwi ani nie zastępuje pracy wątroby i nerek.',
        source: 'Podstawy fizjologii człowieka; opinie EFSA'
      },
      prawo: {
        x: 50, y: 68,
        title: 'Dyrektywa UE 2024/825 przeciw ogólnym eko-hasłom',
        text: 'Przepisy UE ograniczają stosowanie ogólnych deklaracji typu „przyjazna planecie” bez rzetelnego dowodu dla całego cyklu życia produktu oraz własnych znaków ekologicznych bez zewnętrznej certyfikacji.',
        source: 'Dyrektywa (UE) 2024/825 ws. transformacji ekologicznej'
      },
      jakosc: {
        x: 74, y: 78,
        title: 'Własne logo vs. oficjalne oznakowanie EU Ecolabel',
        text: 'Znak „Eko-Planet Approved” nie należy do niezależnego, publicznie weryfikowalnego systemu certyfikacji (takiego jak EU Ecolabel czy normy ISO 14024).',
        source: 'System oznakowania EU Ecolabel / ISO 14024'
      },
      grafika: {
        x: 34, y: 30,
        title: 'Zjawisko „science-washing” i pozycjonowanie premium',
        text: 'Minimalistyczny styl oraz wyeksponowany parametr „pH 9.5” tworzą naukowy wizerunek, który uzasadnia znacznie wyższą cenę detaliczną w porównaniu do standardowej wody.',
        source: 'Analiza strategii science-washing w komunikacji marek'
      }
    }
  },
  {
    id: 'mus-owocowy',
    mainCategory: 'zywnosc',
    shortName: 'Mus E300/E440',
    name: 'Mus owocowy „Jabłko-Porzeczka” (z E300, E330, E440)',
    category: '🥗 Żywność (Test na chemofobię)',
    verdict: 'kupuje',
    teaser: 'Skromna saszetka bez haseł „fit/superfood”. Na froncie wypisano pełny skład z trzema symbolami E (E440, E330, E300), a w rogu widnieje znak Euroliścia z kodem PL-EKO-01. Jak oceniasz ten produkt?',
    verdictHeadlineKupuje: 'Bardzo dobra ocena! Symbole E nie oznaczają tu zagrożenia, a certyfikat jest oficjalny.',
    verdictHeadlineSciema: 'Ciekawy przypadek – symbole E często budzą niepokój, choć tu kryją witaminę C i pektyny!',
    verdictSummary: 'To przykład rzetelnego znakowania: 99% składu to przeciery owocowe, symbole E to zwykłe, przebadane dodatki (witamina C, kwas cytrynowy, pektyny), a Euroliść z kodem jest oficjalnym certyfikatem UE.',
    pros: [
      '99% przecierów owocowych bez dosypanego cukru i bez wprowadzających w błąd obietnic zdrowotnych.',
      'Oficjalny, prawnie kontrolowany certyfikat rolnictwa ekologicznego UE (Euroliść + kod PL-EKO-01).',
      'Symbole E300 (witamina C), E330 (kwas cytrynowy) i E440 (pektyny) są w pełni bezpieczne i rzetelnie opisane.'
    ],
    cons: [
      'Jak każdy mus owocowy, zawiera naturalne cukry w formie rozdrobnionej (dla zębów i sytości lepiej na co dzień wybierać całe owoce, a mus traktować jako wygodną przekąskę).',
      'Jednorazowa saszetka wielomateriałowa jest trudniejsza w recyklingu niż świeży owoc.'
    ],
    layers: {
      chemia: {
        x: 50, y: 56,
        title: 'Co oznaczają symbole E300, E330 i E440?',
        text: 'Symbol „E” potwierdza, że dodatek przeszedł ocenę bezpieczeństwa EFSA. E300 to kwas askorbinowy (witamina C chroniąca owoce przed utlenianiem), E330 to kwas cytrynowy, a E440 to pektyny naturalnie obecne w jabłkach.',
        source: 'EFSA – unijny wykaz dodatków do żywności'
      },
      prawo: {
        x: 30, y: 40,
        title: 'Przejrzyste i zgodne z prawem znakowanie',
        text: 'Producent uczciwie podał skład w kolejności malejącej, wskazał funkcję technologiczną każdego dodatku i zrezygnował z wyolbrzymionych haseł zdrowotnych.',
        source: 'Rozporządzenie (UE) nr 1169/2011; Rozporządzenie (WE) nr 1333/2008'
      },
      jakosc: {
        x: 72, y: 78,
        title: 'Oficjalny certyfikat ekologiczny UE (Euroliść)',
        text: 'Zielony Euroliść umieszczony razem z kodem jednostki certyfikującej (PL-EKO-01) to prawnie chronione oznaczenie potwierdzające coroczne, niezależne kontrole produkcji ekologicznej.',
        source: 'Rozporządzenie (UE) 2018/848 w sprawie produkcji ekologicznej'
      },
      grafika: {
        x: 50, y: 24,
        title: 'Uczciwa prostota zamiast krzykliwych sloganów',
        text: 'Brak haseł typu „100% bez chemii” i brak ukrytych gwiazdek. Ten produkt pokazuje, że prosty projekt z jawnymi symbolami E bywa bardziej transparentny niż „zielone” opakowanie z ogólnymi obietnicami.',
        source: 'Zasady transparentnego projektowania informacji'
      }
    }
  }
];

/* =========================================================================
   1B. BAZA DANYCH SKANERA: ULOTKI LEKÓW ORAZ CERTYFIKATY / ZNAKI JAKOŚCI
   ========================================================================= */
const SCANNER_DRUGS = [
  {
    id: 'magnelek-b6',
    name: 'MagneLek B6 100 mg (tabletki powlekane)',
    barcode: '5909990012345',
    status: 'Produkt leczniczy (OTC)',
    statusType: 'lek',
    activeSubstance: 'Magnezu mleczan dwuwodny (48 mg jonów Mg²⁺) + Pirydoksyny chlorowodorek (wit. B6 – 5 mg)',
    storageTemp: 'Przechowywać w temperaturze poniżej 25°C, w oryginalnym opakowaniu w celu ochrony przed wilgocią. Przechowywać w miejscu niewidocznym i niedostępnym dla dzieci.',
    dosage: 'Dorośli: zwykle 6 do 8 tabletek na dobę w 2–3 dawkach podzielonych, podczas posiłku. Dzieci (powyżej 6 lat): wg masy ciała zgodnie z ulotką lub zaleceniem lekarza.',
    contraindications: 'Nadwrażliwość na substancje czynne, ciężka niewydolność nerek (klirens kreatyniny < 30 ml/min), hipermagnezemia, jednoczesne stosowanie lewodopy bez inhibitora dekarboksylazy.',
    pros: [
      'Status leku gwarantuje przebadaną zawartość substancji czynnej w każdej tabletce (nadzór URPL/GIF).',
      'Organiczna sól magnezu w połączeniu z witaminą B6 wspierającą jego wchłanianie.'
    ],
    cons: [
      'Wymaga przyjmowania kilku tabletek dziennie w dawkach podzielonych dla pełnej dawki terapeutycznej.',
      'Możliwe łagodne dolegliwości żołądkowo-jelitowe przy przekroczeniu zalecanej dawki.'
    ],
    sourceLabel: 'Rejestr Produktów Leczniczych (URPL / e-Zdrowie)',
    sourceUrl: 'https://rejestry.ezdrowie.gov.pl/rpl/search/public'
  },
  {
    id: 'ibuprofen-400',
    name: 'Ibuprofen Max 400 mg (kapsułki miękkie)',
    barcode: '5909990054321',
    status: 'Produkt leczniczy (OTC)',
    statusType: 'lek',
    activeSubstance: 'Ibuprofen (Ibuprofenum) – 400 mg (NLPZ – niesteroidowy lek przeciwzapalny)',
    storageTemp: 'Przechowywać w temperaturze poniżej 25°C, chronić przed światłem i wilgocią. Nie zamrażać. Nie przechowywać w łazience ani w nagrzanym samochodzie.',
    dosage: 'Dorośli i młodzież powyżej 12 lat (masa > 40 kg): 1 kapsułka (400 mg) co 4–6 godzin po posiłku. Maksymalna dawka dobowa bez konsultacji z lekarzem: 1200 mg (3 kapsułki).',
    contraindications: 'Czynna lub przebyta choroba wrzodowa żołądka/dwunastnicy, uczulenie na NLPZ (np. aspirynę), ciężka niewydolność serca, wątroby lub nerek, III trymestr ciąży, skaza krwotoczna.',
    pros: [
      'Szybkie, dobrze udokumentowane działanie przeciwbólowe, przeciwzapalne i przeciwgorączkowe.',
      'Jasne limity dawkowania i dostępna pełna Charakterystyka Produktu Leczniczego (ChPL).'
    ],
    cons: [
      'Może podrażniać błonę śluzową żołądka (zaleca się przyjmowanie po posiłku i możliwie krótko).',
      'Wchodzi w interakcje z niektórymi lekami (m.in. przeciwzakrzepowymi i na nadciśnienie).'
    ],
    sourceLabel: 'Rejestr Produktów Leczniczych (URPL / e-Zdrowie)',
    sourceUrl: 'https://rejestry.ezdrowie.gov.pl/rpl/search/public'
  },
  {
    id: 'melatonina-lek',
    name: 'Melatonina 3 mg (tabletki – Lek OTC)',
    barcode: '5909990077889',
    status: 'Produkt leczniczy (OTC)',
    statusType: 'lek',
    activeSubstance: 'Melatonina (Melatoninum) – 3 mg',
    storageTemp: 'Przechowywać w temperaturze poniżej 25°C, w szczelnie zamkniętym opakowaniu, z dala od bezpośredniego światła słonecznego.',
    dosage: 'W zaburzeniach rytmu snu i czuwania (np. praca zmianowa, zmiana stref czasowych): zwykle 1 tabletka (3 mg) na ok. 1 godzinę przed snem. Nie przekraczać dawki zalecanej w ulotce.',
    contraindications: 'Nadwrażliwość na składniki, ciąża i okres karmienia piersią (brak wystarczających danych), spożycie alkoholu (osłabia działanie), ostrożność przy chorobach wątroby i depresji.',
    pros: [
      'W przeciwieństwie do wielu suplementów z melatoniną, lek gwarantuje stałą, zweryfikowaną dawkę 3 mg.',
      'Pomocny przy jet-lagu i pracy zmianowej.'
    ],
    cons: [
      'Może powodować poranną senność – nie prowadzić pojazdów bezpośrednio po zażyciu.',
      'Nie zastępuje higieny snu ani diagnostyki przewlekłej bezsenności.'
    ],
    sourceLabel: 'Rejestr Produktów Leczniczych (URPL / e-Zdrowie)',
    sourceUrl: 'https://rejestry.ezdrowie.gov.pl/rpl/search/public'
  },
  {
    id: 'neurocalm-scan',
    name: 'NeuroCalm Forte (Suplement diety – kontrast)',
    barcode: '5901234999001',
    status: 'Suplement diety (Żywność – GIS)',
    statusType: 'suplement',
    activeSubstance: 'Ekstrakt z liści melisy (niestandaryzowany), tlenek magnezu (56 mg)',
    storageTemp: 'Przechowywać w suchym miejscu w temperaturze pokojowej (15–25°C), w sposób niedostępny dla małych dzieci.',
    dosage: 'Zalecana porcja do spożycia w ciągu dnia wg producenta: 1 kapsułka dziennie. Uwaga: w przypadku suplementów nie stosuje się pojęcia „dawkowania leczniczego”.',
    contraindications: 'Brak oficjalnej ulotki ChPL (nie jest lekiem). Osoby w ciąży, karmiące oraz przyjmujące leki uspokajające powinny skonsultować stosowanie z lekarzem lub farmaceutą.',
    pros: [
      'Łatwo dostępny bez recepty, prosty w stosowaniu jako uzupełnienie codziennej diety.',
      'Zawiera łagodny składnik roślinny (melisę).'
    ],
    cons: [
      'To środek spożywczy, nie lek – nie przeszedł badań klinicznych potwierdzających skuteczność w leczeniu stresu czy bezsenności.',
      'Tlenek magnezu wchłania się słabiej niż organiczne sole magnezu obecne w lekach.'
    ],
    sourceLabel: 'Rejestr Produktów (Główny Inspektorat Sanitarny – GIS)',
    sourceUrl: 'https://powiadomienia.gis.gov.pl/'
  }
];

const SCANNER_CERTS = [
  {
    id: 'cert-teraz-polska',
    name: 'Godło Promocyjne „Teraz Polska”',
    badgeType: 'verified',
    verdictLabel: 'Rozpoznawalne Godło Konkursowe (Fundacja PGN)',
    issuer: 'Fundacja Polskiego Godła Promocyjnego (Kapituła Konkursu i eksperci branżowi)',
    meaning: 'Wyróżnienie przyznawane w corocznym konkursie produktom, usługom i innowacjom wyróżniającym się wysoką jakością rynkową na rynku polskim.',
    pros: [
      'Wieloletnia, rozpoznawalna i niezależna procedura konkursowa z udziałem ekspertów branżowych i Kapituły.',
      'Pomaga zidentyfikować docenione przez rynek polskie produkty i usługi.'
    ],
    cons: [
      'Jest to godło promocyjne jakości rynkowej – NIE jest certyfikatem ekologicznym, medycznym ani potwierdzeniem niskiej zawartości cukru czy naturalności składu.',
      'Licencja na używanie godła jest czasowa i wymaga odnawiania; nadal warto czytać tabelę wartości odżywczych lub INCI.'
    ],
    sourceLabel: 'Fundacja Polskiego Godła Promocyjnego – terazpolska.pl',
    sourceUrl: 'https://terazpolska.pl/',
    svg: `<svg viewBox="0 0 120 80" class="w-24 h-16"><rect x="4" y="4" width="112" height="72" rx="10" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/><path d="M18 22 H102 V38 H18 Z" fill="#ffffff"/><path d="M18 38 H102 V54 H18 Z" fill="#dc2626"/><text x="60" y="34" text-anchor="middle" font-size="11" font-weight="900" fill="#0f172a">TERAZ</text><text x="60" y="50" text-anchor="middle" font-size="11" font-weight="900" fill="#ffffff">POLSKA</text><text x="60" y="67" text-anchor="middle" font-size="7" font-weight="700" fill="#64748b">GODŁO PROMOCYJNE</text></svg>`
  },
  {
    id: 'cert-eurolisc',
    name: 'Euroliść (Logo produkcji ekologicznej UE)',
    badgeType: 'official',
    verdictLabel: 'Oficjalny certyfikat prawny UE',
    issuer: 'Akredytowane jednostki certyfikujące pod nadzorem IJHARS (z obowiązkowym kodem np. PL-EKO-01)',
    meaning: 'Jedyny prawnie wiążący w całej UE znak żywności ekologicznej. Potwierdza, że min. 95% składników rolnych pochodzi z kontrolowanych upraw ekologicznych.',
    pros: [
      'Obowiązkowe, regularne i niezależne kontrole producenta oraz całego łańcucha dostaw.',
      'Weryfikowalny kod jednostki certyfikującej (np. PL-EKO-01) oraz informacja o pochodzeniu surowców (Rolnictwo UE / spoza UE).'
    ],
    cons: [
      'Certyfikat ekologiczny potwierdza sposób uprawy, ale nie oznacza automatycznie, że produkt ma mało kalorii lub cukru (np. ekologiczny syrop nadal jest cukrem).',
      'Znak bez towarzyszącego kodu jednostki certyfikującej wymaga wzmożonej ostrożności.'
    ],
    sourceLabel: 'Rozporządzenie (UE) 2018/848 / Komisja Europejska',
    sourceUrl: 'https://agriculture.ec.europa.eu/farming/organic-farming/organic-logo_pl',
    svg: `<svg viewBox="0 0 120 80" class="w-24 h-16"><rect x="12" y="8" width="96" height="54" rx="6" fill="#65a30d"/><path d="M34 45 C46 18, 76 16, 92 28 C78 48, 52 52, 34 45 Z" fill="none" stroke="#ffffff" stroke-width="3" stroke-dasharray="4 3.5"/><text x="60" y="75" text-anchor="middle" font-size="9" font-weight="800" fill="#365314">PL-EKO-01</text></svg>`
  },
  {
    id: 'cert-ecolabel',
    name: 'EU Ecolabel (Stokrotka UE)',
    badgeType: 'official',
    verdictLabel: 'Oficjalny certyfikat środowiskowy UE (ISO 14024)',
    issuer: 'Komisja Europejska / w Polsce: Polskie Centrum Badań i Certyfikacji (PCBC)',
    meaning: 'Dobrowolny, rygorystyczny certyfikat środowiskowy dla kosmetyków spłukiwanych, detergentów, papieru i usług – bada wpływ produktu w całym cyklu życia (od surowca po utylizację).',
    pros: [
      'Niezależny audyt naukowy oparty na normie ISO 14024 (oznakowanie typu I).',
      'Ogranicza stosowanie substancji uciążliwych dla środowiska wodnego i wymusza recyklingowalność opakowań.'
    ],
    cons: [
      'Nie dotyczy żywności ani suplementów – skupia się głównie na produktach chemicznych, higienicznych i usługach.',
      'Nie zastępuje indywidualnej oceny tolerancji skóry na dany składnik.'
    ],
    sourceLabel: 'System EU Ecolabel (PCBC / Komisja Europejska)',
    sourceUrl: 'https://environment.ec.europa.eu/topics/circular-economy/eu-ecolabel_en',
    svg: `<svg viewBox="0 0 120 80" class="w-24 h-16"><rect x="8" y="6" width="104" height="68" rx="10" fill="#f0fdf4" stroke="#86efac" stroke-width="2"/><circle cx="60" cy="34" r="16" fill="#0284c7"/><text x="60" y="39" text-anchor="middle" font-size="14" font-weight="900" fill="#ffffff">ε</text><text x="60" y="63" text-anchor="middle" font-size="9" font-weight="800" fill="#166534">EU ECOLABEL</text></svg>`
  },
  {
    id: 'cert-cosmos',
    name: 'COSMOS Organic / ECOCERT',
    badgeType: 'official',
    verdictLabel: 'Niezależny standard certyfikacji kosmetyków',
    issuer: 'Międzynarodowe stowarzyszenie COSMOS (m.in. ECOCERT, BDIH, Soil Association)',
    meaning: 'Jednolity europejski standard potwierdzający minimalny udział składników pochodzenia naturalnego i organicznego oraz restrykcje co do metod przetwarzania i opakowań.',
    pros: [
      'Jasne, publicznie dostępne kryteria i coroczny audyt niezależnej jednostki.',
      'Oddziela kosmetyki z realną kontrolą składu od zwykłych deklaracji marketingowych „bio”.'
    ],
    cons: [
      'Kosmetyk certyfikowany jako organiczny może nadal zawierać naturalne olejki eteryczne, które u osób z alergią wymagają ostrożności.',
      'Brak certyfikatu nie oznacza, że inny kosmetyk jest gorszy – wiele dobrych dermokosmetyków nie ubiega się o płatną certyfikację.'
    ],
    sourceLabel: 'Standard COSMOS (cosmos-standard.org)',
    sourceUrl: 'https://www.cosmos-standard.org/',
    svg: `<svg viewBox="0 0 120 80" class="w-24 h-16"><rect x="8" y="6" width="104" height="68" rx="10" fill="#ecfeff" stroke="#67e8f9" stroke-width="2"/><circle cx="60" cy="34" r="17" fill="#0f766e"/><text x="60" y="37" text-anchor="middle" font-size="8.5" font-weight="900" fill="#ffffff">COSMOS</text><text x="60" y="63" text-anchor="middle" font-size="8.5" font-weight="800" fill="#115e59">ORGANIC CERT</text></svg>`
  },
  {
    id: 'cert-wlasny',
    name: 'Znak własny (np. „Eko Gwarancja / 100% Natura”)',
    badgeType: 'caution',
    verdictLabel: 'Znak marketingowy producenta – wymaga weryfikacji',
    issuer: 'Dział marketingu danego podmiotu (brak niezależnej jednostki certyfikującej)',
    meaning: 'Element graficzny zaprojektowany bezpośrednio na potrzeby opakowania. Sam w sobie nie potwierdza przejścia zewnętrznego audytu jakościowego ani ekologicznego.',
    pros: [
      'Sam produkt może mimo to mieć poprawny skład – warto oceniać go po tabeli i INCI, nie po samym znaczku.'
    ],
    cons: [
      'Brak zewnętrznej kontroli i jasnych, publicznie weryfikowalnych kryteriów przyznania.',
      'W świetle Dyrektywy UE 2024/825 stosowanie niezweryfikowanych własnych znaków ekologicznych jest ograniczane jako praktyka mogąca wprowadzać konsumentów w błąd.'
    ],
    sourceLabel: 'Dyrektywa (UE) 2024/825 / UOKiK',
    sourceUrl: 'https://uokik.gov.pl/',
    svg: `<svg viewBox="0 0 120 80" class="w-24 h-16"><rect x="8" y="6" width="104" height="68" rx="10" fill="#fffbeb" stroke="#fcd34d" stroke-width="2"/><circle cx="60" cy="40" r="24" fill="#fbbf24" stroke="#b45309" stroke-width="2" stroke-dasharray="4 3"/><text x="60" y="38" text-anchor="middle" font-size="8" font-weight="900" fill="#78350f">EKO</text><text x="60" y="48" text-anchor="middle" font-size="6.5" font-weight="800" fill="#78350f">GWARANCJA</text></svg>`
  }
];

/* =========================================================================
   1C. BAZA PRODUKTÓW DO PLANERA ZAKUPÓW (Sklepy codzienne + Plusy/Minusy)
   ========================================================================= */
const PLANNER_PRODUCTS = [
  {
    id: 'plan-krem-ceramidowy',
    name: 'Krem barierowy z ceramidami i niacynamidem (50 ml)',
    category: 'kosmetyki',
    categoryLabel: '✨ Kosmetyk · Krem do twarzy',
    stores: ['Rossmann', 'Hebe'],
    price: 29,
    prefs: ['dobra-cena', 'bezzapachowy', 'prosty-sklad'],
    ingredients: 'Aqua, Glycerin, Caprylic/Capric Triglyceride, Niacinamide (2%), Ceramide NP, Cholesterol, Panthenol, Squalane, Carbomer, Phenoxyethanol.',
    pros: [
      'Dobry stosunek jakości do ceny – zawiera sprawdzone składniki wspierające barierę skórną (ceramidy, niacynamid, pantenol).',
      'Formuła bezzapachowa (brak Parfum i olejków eterycznych) – odpowiednia także dla skóry wrażliwej.'
    ],
    cons: [
      'Bogatsza konsystencja z trójglicerydami – u osób z bardzo tłustą cerą może być bardziej odpowiedni na noc niż pod makijaż.',
      'Nie posiada płatnego certyfikatu ekologicznego (co jednak pozwala utrzymać niższą cenę).'
    ],
    priceVerdict: 'Płacisz głównie za realne składniki aktywne, a nie za kosztowny marketing.',
    sourceLabel: 'Baza CosIng (Komisja Europejska)',
    sourceUrl: 'https://ec.europa.eu/growth/tools-databases/cosing/'
  },
  {
    id: 'plan-krem-eko-premium',
    name: 'Krem nawilżający „Botanica Organic” z certyfikatem COSMOS (50 ml)',
    category: 'kosmetyki',
    categoryLabel: '✨ Kosmetyk · Krem do twarzy',
    stores: ['Hebe', 'Rossmann'],
    price: 58,
    prefs: ['certyfikat-lub-lek'],
    ingredients: 'Aqua, Aloe Barbadensis Leaf Juice*, Butyrospermum Parkii Butter*, Simmondsia Chinensis Seed Oil*, Cetearyl Alcohol, Glycerin, Parfum (Natural Essential Oils), Limonene, Linalool.',
    pros: [
      'Posiada niezależny, weryfikowalny certyfikat COSMOS Organic potwierdzający pochodzenie surowców.',
      'Przyjemne, naturalne emolienty (masło shea, olej jojoba) i szklany słoiczek łatwiejszy w recyklingu.'
    ],
    cons: [
      'Wyższa cena (58 zł) częściowo wynika z kosztów certyfikacji i szklanego opakowania premium.',
      'Zawiera naturalne olejki eteryczne (Limonene, Linalool) – przy cerze atopowej lub wrażliwej warto wcześniej wykonać próbę uczuleniową.'
    ],
    priceVerdict: 'Dopłacasz za niezależny certyfikat organiczny i opakowanie szklane – dobry wybór, jeśli to dla Ciebie priorytet, lecz podstawowe nawilżenie uzyskasz taniej.',
    sourceLabel: 'Standard COSMOS / Baza CosIng',
    sourceUrl: 'https://www.cosmos-standard.org/'
  },
  {
    id: 'plan-krem-spf',
    name: 'Lekki krem ochronny SPF 50+ bez zapachu (50 ml)',
    category: 'kosmetyki',
    categoryLabel: '✨ Kosmetyk · Ochrona UV',
    stores: ['Rossmann', 'Hebe', 'Apteka'],
    price: 39,
    prefs: ['dobra-cena', 'bezzapachowy'],
    ingredients: 'Aqua, Dibutyl Adipate, Diethylamino Hydroxybenzoyl Hexyl Benzoate, Ethylhexyl Triazone, Bis-Ethylhexyloxyphenol Methoxyphenyl Triazine, Glycerin, Tocopherol.',
    pros: [
      'Nowoczesne, fotostabilne filtry organiczne zapewniające wysoką ochronę UVA i UVB.',
      'Brak substancji zapachowych – mniejsze ryzyko szczypania w okolicy oczu.'
    ],
    cons: [
      'Wymaga nakładania odpowiedniej ilości (ok. 1–1,25 ml na twarz) i reaplikacji przy długiej ekspozycji na słońce.',
      'Przy cerze mieszanej może wymagać przypudrowania po ok. 15 minutach.'
    ],
    priceVerdict: 'Rozsądna cena w klasie nowoczesnych filtrów SPF 50+ (często porównywalny skład do kremów aptecznych za 80+ zł).',
    sourceLabel: 'Baza CosIng / Zalecenia dermatologiczne UV',
    sourceUrl: 'https://ec.europa.eu/growth/tools-databases/cosing/'
  },
  {
    id: 'plan-lek-magnez',
    name: 'MagneLek B6 100 mg – Produkt leczniczy OTC (50 tabl.)',
    category: 'leki',
    categoryLabel: '💊 Lek (Produkt leczniczy OTC)',
    stores: ['Apteka'],
    price: 24,
    prefs: ['dobra-cena', 'certyfikat-lub-lek', 'prosty-sklad'],
    ingredients: 'Substancje czynne: Magnezu mleczan dwuwodny (48 mg jonów Mg²⁺), Pirydoksyny chlorowodorek (5 mg). Substancje pomocnicze wg ChPL.',
    pros: [
      'Status leku (URPL) – potwierdzona badaniami dawka i jakość każdej partii.',
      'Dobrze przyswajalna forma organiczna (mleczan magnezu) w przystępnej cenie.'
    ],
    cons: [
      'Dostępny wyłącznie w aptece (lub punkcie aptecznym).',
      'Jak każdy lek wymaga zapoznania się z przeciwwskazaniami w ulotce (np. choroby nerek).'
    ],
    priceVerdict: 'Wysoka przewidywalność składu i dawki – często korzystniejszy koszt realnie przyswojonego magnezu niż w suplementach.',
    sourceLabel: 'Rejestr Produktów Leczniczych (URPL)',
    sourceUrl: 'https://rejestry.ezdrowie.gov.pl/rpl/search/public'
  },
  {
    id: 'plan-lek-witd',
    name: 'Witamina D3 2000 IU – Produkt leczniczy OTC (60 tabl.)',
    category: 'leki',
    categoryLabel: '💊 Lek (Produkt leczniczy OTC)',
    stores: ['Apteka'],
    price: 22,
    prefs: ['dobra-cena', 'certyfikat-lub-lek', 'prosty-sklad'],
    ingredients: 'Substancja czynna: Cholekalcyferol (witamina D3) 50 µg (2000 IU).',
    pros: [
      'Status produktu leczniczego zapewnia kontrolę stabilności witaminy D3 do końca terminu ważności.',
      'Dawka 2000 IU odpowiada standardowym rekomendacjom profilaktycznym dla większości dorosłych w Polsce w okresie jesienno-zimowym.'
    ],
    cons: [
      'W przypadku stwierdzonego dużego niedoboru dawkę należy dobrać indywidualnie z lekarzem na podstawie badania 25(OH)D.',
      'Wymaga przyjmowania z posiłkiem zawierającym tłuszcz dla lepszego wchłaniania.'
    ],
    priceVerdict: 'Bardzo korzystny koszt miesięcznej suplementacji przy pełnej kontroli farmaceutycznej.',
    sourceLabel: 'Wytyczne suplementacji wit. D w Polsce / URPL',
    sourceUrl: 'https://rejestry.ezdrowie.gov.pl/rpl/search/public'
  },
  {
    id: 'plan-supl-omega',
    name: 'Suplement Omega-3 (EPA 330 mg / DHA 220 mg, wskaźnik TOTOX < 10)',
    category: 'suplementy',
    categoryLabel: '🧴 Suplement diety',
    stores: ['Apteka', 'Rossmann'],
    price: 45,
    prefs: ['prosty-sklad'],
    ingredients: 'Olej z ryb pelagicznych standaryzowany na 65% kwasów Omega-3 (EPA 330 mg, DHA 220 mg w 1 kapsułce), przeciwutleniacz: mieszanina tokoferoli (witamina E), żelatyna.',
    pros: [
      'Jawnie podana konkretna zawartość EPA i DHA (nie tylko ogólna masa oleju rybiego) oraz niski parametr świeżości oleju (TOTOX).',
      'Przydatne uzupełnienie diety u osób rzadko jedzących tłuste ryby morskie.'
    ],
    cons: [
      'Ma status suplementu diety (żywności), a nie leku – jakość zależy od transparentności i badań udostępnianych przez producenta.',
      'Kapsułka żelatynowa nie jest odpowiednia dla wegan (alternatywa: olej z mikroalg).'
    ],
    priceVerdict: 'Wyższa cena niż najtańsze kapsułki z marketu, ale wyższe stężenie realnego EPA+DHA w jednej kapsułce.',
    sourceLabel: 'Opinie naukowe EFSA ws. EPA i DHA',
    sourceUrl: 'https://www.efsa.europa.eu/'
  },
  {
    id: 'plan-zywnosc-skyr',
    name: 'Jogurt naturalny typu Skyr (150 g)',
    category: 'zywnosc',
    categoryLabel: '🥗 Żywność · Nabiał',
    stores: ['Biedronka', 'Lidl'],
    price: 3.5,
    prefs: ['dobra-cena', 'prosty-sklad'],
    ingredients: 'Mleko pasteryzowane odtłuszczone, żywe kultury bakterii jogurtowych. Wartość w 100 g: 64 kcal, Białko 12 g, Cukry 4,1 g (wyłącznie naturalna laktoza).',
    pros: [
      'Bardzo krótki, przejrzysty skład (tylko 2 składniki) i wysoka zawartość białka (18 g w kubeczku).',
      'Bardzo niski koszt porcji białka bez dopłaty za etykiety „Protein / Fit”.'
    ],
    cons: [
      'Zawiera naturalną laktozę (osoby z nietolerancją powinny wybrać wariant bez laktozy).',
      'Kwaśny, neutralny smak – wymaga samodzielnego dodania owoców lub orzechów zamiast gotowego wsadu.'
    ],
    priceVerdict: 'Jeden z najlepszych stosunków wartości odżywczej do ceny w codziennych dyskontach.',
    sourceLabel: 'NCEŻ – Narodowe Centrum Edukacji Żywieniowej',
    sourceUrl: 'https://ncez.pzh.gov.pl/'
  },
  {
    id: 'plan-zywnosc-mus-eko',
    name: 'Mus owocowy „Jabłko-Porzeczka” EKO (100 g, z E300/E440)',
    category: 'zywnosc',
    categoryLabel: '🥗 Żywność · Przekąski',
    stores: ['Biedronka', 'Lidl', 'Rossmann'],
    price: 4.5,
    prefs: ['dobra-cena', 'certyfikat-lub-lek', 'prosty-sklad'],
    ingredients: 'Przecier jabłkowy* (75%), przecier z czarnej porzeczki* (24%), substancja żelująca: E440 (pektyny), regulator kwasowości: E330, przeciwutleniacz: E300 (witamina C). *Certyfikat PL-EKO-01.',
    pros: [
      '99% owoców, oficjalny unijny certyfikat Euroliścia (PL-EKO-01) i bezpieczne dodatki (witamina C i pektyny).',
      'Uczciwa etykieta bez wyolbrzymionych haseł marketingowych.'
    ],
    cons: [
      'Rozdrobnione owoce sycą krócej niż całe jabłko i mają wyższy indeks glikemiczny.',
      'W cenie ok. 4,50 zł za 100 g jest droższy niż zakup świeżych jabłek luzem (płacisz za wygodę podania i certyfikat EKO).'
    ],
    priceVerdict: 'Dobra, uczciwa przekąska w podróży; na co dzień w domu korzystniej cenowo i zdrowotnie wypadają całe owoce.',
    sourceLabel: 'EFSA / Rozporządzenie (UE) 2018/848',
    sourceUrl: 'https://agriculture.ec.europa.eu/farming/organic-farming/organic-logo_pl'
  }
];

/* =========================================================================
   2. BAZA 12 PYTAŃ QUIZOWYCH (3 KATEGORIE)
   ========================================================================= */
const CATEGORY_LABELS = {
  odzywianie: 'Zdrowe odżywianie i etykiety',
  chemia: 'Chemia bez strachu',
  prawo: 'Prawo, certyfikaty i manipulacje'
};

const QUESTIONS = [
  // Kategoria A: Zdrowe odżywianie i pułapki w tabelach
  {
    id: 1,
    category: 'odzywianie',
    type: 'Jednokrotny wybór',
    question: 'Na płatkach śniadaniowych widzisz wielki napis „Bez dodatku cukru”. Co to dokładnie oznacza?',
    options: [
      'Produkt ma 0 g cukru w 100 g.',
      'Nie dosypano cukru ani substancji słodzących, ale produkt może zawierać dużo cukru naturalnie (np. z suszonych owoców).',
      'Produkt jest słodzony wyłącznie cukrem trzcinowym lub miodem.'
    ],
    correctIndex: 1,
    explanation: 'Prawo zabrania wtedy dodawania cukrów (w tym miodu i syropów), ale producent może użyć np. koncentratu soku owocowego lub daktyli. Zawsze sprawdzaj wiersz „w tym cukry” w tabeli wartości odżywczych.',
    source: 'Rozporządzenie (WE) nr 1924/2006'
  },
  {
    id: 2,
    category: 'odzywianie',
    type: 'Jednokrotny wybór',
    question: 'W jakiej kolejności wypisane są składniki na etykiecie produktu spożywczego?',
    options: [
      'Alfabetycznej.',
      'Od najzdrowszych do najmniej zdrowych.',
      'Malejącej – od składnika, którego jest wagowo najwięcej, do tego, którego jest najmniej.'
    ],
    correctIndex: 2,
    explanation: 'Składniki podaje się w kolejności malejącej według masy w momencie ich użycia. Jeśli cukier lub syrop glukozowo-fruktozowy jest na 1. lub 2. miejscu, stanowi fundament tego produktu.',
    source: 'Rozporządzenie (UE) nr 1169/2011'
  },
  {
    id: 3,
    category: 'odzywianie',
    type: 'Prawda / Mit',
    question: 'Produkt z napisem „Light” zawsze ma bardzo mało kalorii i świetnie nadaje się na dietę redukcyjną.',
    options: ['Prawda', 'Mit'],
    correctIndex: 1,
    explanation: 'Oświadczenie „light” oznacza jedynie, że wartość energetyczną (lub wybrany składnik, np. tłuszcz) obniżono o co najmniej 30% względem podobnego produktu. Majonez „light” nadal może mieć ponad 300–400 kcal w 100 g, a jogurt „0% tłuszczu” bywa dosładzany cukrem.',
    source: 'Rozporządzenie (WE) nr 1924/2006'
  },
  {
    id: 4,
    category: 'odzywianie',
    type: 'Jednokrotny wybór',
    question: 'Chcesz uczciwie porównać zawartość cukru w dwóch różnych jogurtach na półce sklepowej. Na którą kolumnę w tabeli powinieneś spojrzeć?',
    options: [
      'Wartość w 1 porcji, bo każdy producent liczy porcję tak samo.',
      'Wartość w 100 g lub 100 ml produktu.',
      'Procent referencyjnej wartości spożycia (% RWS) na froncie opakowania.'
    ],
    correctIndex: 1,
    explanation: 'Producenci sami ustalają wielkość „sugerowanej porcji” (często zaniżonej, np. 1/3 opakowania). Tylko obowiązkowa kolumna na 100 g / 100 ml daje uczciwe porównanie dwóch produktów.',
    source: 'Rozporządzenie (UE) nr 1169/2011'
  },

  // Kategoria B: Chemia bez strachu
  {
    id: 5,
    category: 'chemia',
    type: 'Jednokrotny wybór',
    question: 'W składzie soku owocowego widzisz tajemniczy dodatek E300. Co kryje się pod tym symbolem?',
    options: [
      'Syntetyczny konserwant zakazany dla dzieci.',
      'Kwas askorbinowy, czyli zwykła witamina C.',
      'Barwnik z ropy naftowej.'
    ],
    correctIndex: 1,
    explanation: 'Symbol „E” oznacza, że substancja przeszła ocenę bezpieczeństwa w Europie (EFSA) i ma swój numer identyfikacyjny. E300 to witamina C, która chroni sok przed brązowieniem.',
    source: 'Baza dodatków do żywności EFSA'
  },
  {
    id: 6,
    category: 'chemia',
    type: 'Prawda / Mit',
    question: 'Woda alkaliczna (o wysokim pH, np. 9.0) skutecznie „odkwasza organizm” i chroni przed chorobami.',
    options: ['Prawda', 'Mit'],
    correctIndex: 1,
    explanation: 'Kwas solny w żołądku błyskawicznie neutralizuje zasadową wodę. Prawidłowe pH krwi (7,35–7,45) regulują nerki i płuca – u zdrowego człowieka dieta ani woda nie zmieniają pH krwi.',
    source: 'Podstawy fizjologii człowieka'
  },
  {
    id: 7,
    category: 'chemia',
    type: 'Prawda / Mit',
    question: 'Składniki pochodzenia naturalnego w kosmetykach i żywności są zawsze bezpieczniejsze i mniej uczulające niż składniki syntetyczne.',
    options: ['Prawda', 'Mit'],
    correctIndex: 1,
    explanation: 'Natura produkuje zarówno bezpieczne substancje, jak i silne alergeny czy toksyny (np. jad kiełbasiany, olejki eteryczne). O bezpieczeństwie decyduje konkretna cząsteczka i jej dawka, a nie samo pochodzenie.',
    source: 'Zasada Paracelsusa / toksykologia'
  },
  {
    id: 8,
    category: 'chemia',
    type: 'Jednokrotny wybór',
    question: 'Producent chwali się na etykiecie, że jego produkt jest „w 100% wolny od chemii”. Jak nauka ocenia takie hasło?',
    options: [
      'To znak najwyższej czystości ekologicznej.',
      'To fizycznie niemożliwe – woda, witaminy i białka to też związki chemiczne.',
      'Oznacza to jedynie, że produkt nie zawiera wody.'
    ],
    correctIndex: 1,
    explanation: 'Cała materia (w tym nasze ciało i ekologiczne jabłko) składa się ze związków chemicznych. Hasło „bez chemii” to klasyczny chwyt wykorzystujący lęk przed słowem „chemia” (chemofobię).',
    source: 'Polskie Towarzystwo Chemiczne / komunikacja nauki'
  },

  // Kategoria C: Prawo, certyfikaty i manipulacje marketingowe
  {
    id: 9,
    category: 'prawo',
    type: 'Jednokrotny wybór',
    question: 'Czym pod względem prawa różni się suplement diety od leku (produktu leczniczego)?',
    options: [
      'Suplement jest po prostu tańszą wersją leku bez recepty i ma takie same badania skuteczności.',
      'Suplement to środek spożywczy – przed sprzedażą nie musi mieć badań klinicznych potwierdzających, że działa.',
      'Nie ma żadnej różnicy, oba kontroluje wyłącznie Urząd Rejestracji Produktów Leczniczych.'
    ],
    correctIndex: 1,
    explanation: 'Lek musi udowodnić skuteczność i bezpieczeństwo w badaniach przed dopuszczeniem do obrotu. Suplement diety traktuje się jak żywność – wystarczy powiadomić GIS o zamiarze sprzedaży.',
    source: 'Ustawa o bezpieczeństwie żywności i żywienia; Prawo farmaceutyczne'
  },
  {
    id: 10,
    category: 'prawo',
    type: 'Jednokrotny wybór',
    question: 'Na kremie widnieje napis „Przebadany dermatologicznie”. Co ten napis realnie gwarantuje?',
    options: [
      'Że krem na pewno nikogo nie uczuli i leczy trądzik.',
      'Że produkt przeszedł obowiązkowe testy w państwowym instytucie medycznym.',
      'Wyłącznie to, że wykonano test z udziałem dermatologa – brak informacji o skali testu, grupie badanych i wynikach.'
    ],
    correctIndex: 2,
    explanation: 'To jedno z najczęstszych pustych haseł marketingowych. Każdy kosmetyk sprzedawany w UE i tak musi mieć ocenę bezpieczeństwa, a samo hasło „przebadany” nie mówi nic o jego przewadze nad innymi.',
    source: 'Rozporządzenie (WE) nr 1223/2009 i (UE) nr 655/2013'
  },
  {
    id: 11,
    category: 'prawo',
    type: 'Jednokrotny wybór',
    question: 'Twój ulubiony influencer wrzuca relację, w której chwali nowy suplement i podaje swój kod rabatowy, ale nie zaznacza, że to reklama. Co na to prawo i UOKiK?',
    options: [
      'Wszystko jest w porządku, o ile influencer naprawdę lubi ten produkt.',
      'To kryptoreklama – twórca ma obowiązek wyraźnie i czytelnie oznaczyć współpracę (np. #reklama, #współpracapłatna).',
      'Obowiązek oznaczania dotyczy tylko reklam w telewizji, nie na TikToku ani Instagramie.'
    ],
    correctIndex: 1,
    explanation: 'Zgodnie z wytycznymi Prezesa UOKiK każda korzyść materialna (pieniądze, paczka PR, prowizja z kodu rabatowego) wymaga jasnego, widocznego oznaczenia komercyjnego charakteru posta.',
    source: 'Rekomendacje Prezesa UOKiK ws. oznaczania treści reklamowych'
  },
  {
    id: 12,
    category: 'prawo',
    type: 'Jednokrotny wybór',
    question: 'Który z poniższych znaków na opakowaniu żywności jest oficjalnym, prawnie kontrolowanym certyfikatem ekologicznym w Unii Europejskiej?',
    options: [
      'Zielony listek z białych gwiazdek (Euroliść) z numerem jednostki certyfikującej (np. PL-EKO-01).',
      'Złoty medal „100% Eko Wybór Natury” zaprojektowany przez producenta.',
      'Napis „Przyjazne planecie” wydrukowany zieloną czcionką na brązowym papierze.'
    ],
    correctIndex: 0,
    explanation: 'Tylko Euroliść z kodem jednostki certyfikującej gwarantuje, że produkt spełnia rygorystyczne normy rolnictwa ekologicznego UE. Własne „zielone pieczątki” bez niezależnego systemu certyfikacji są zakazane przez unijną dyrektywę anty-greenwashingową.',
    source: 'Rozporządzenie (UE) 2018/848; Dyrektywa (UE) 2024/825'
  }
];

/* =========================================================================
   3. AUTORSKIE MAKIETY OPAKOWAŃ SVG
   WSKAZÓWKA: Gdy Karolina przygotuje pliki PNG (np. assets/krem.png),
   możesz w funkcji poniżej zwrócić po prostu:
   `<img src="assets/${productId}.png" alt="..." class="w-full h-full object-contain" />`
   ========================================================================= */
function getProductSVG(productId) {
  switch (productId) {
    case 'magnelek-b6':
      return `
        <svg viewBox="0 0 320 400" class="w-full h-full drop-shadow-xl" aria-label="Opakowanie MagneLek B6">
          <rect x="46" y="42" width="228" height="316" rx="16" fill="#ffffff" stroke="#94a3b8" stroke-width="3"/>
          <rect x="46" y="42" width="228" height="58" rx="14" fill="#be123c"/>
          <rect x="46" y="80" width="228" height="20" fill="#be123c"/>
          <text x="68" y="76" font-size="11" font-weight="900" fill="#ffffff" letter-spacing="1.2">PRODUKT LECZNICZY (OTC)</text>
          <rect x="216" y="56" width="42" height="24" rx="6" fill="#ffffff"/>
          <text x="237" y="72" text-anchor="middle" font-size="9" font-weight="900" fill="#be123c">GMP</text>
          <text x="160" y="138" text-anchor="middle" font-size="25" font-weight="900" fill="#0f172a">MagneLek B6</text>
          <text x="160" y="160" text-anchor="middle" font-size="13" font-weight="800" fill="#be123c">48 mg jonów Mg²⁺ + 5 mg wit. B6</text>
          <rect x="66" y="178" width="188" height="56" rx="12" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
          <text x="160" y="198" text-anchor="middle" font-size="9.5" font-weight="800" fill="#1e293b">Substancja czynna:</text>
          <text x="160" y="213" text-anchor="middle" font-size="9" fill="#334155">Magnezu mleczan dwuwodny</text>
          <text x="160" y="226" text-anchor="middle" font-size="8.5" fill="#475569">(sól organiczna · 50 tabletek powlekanych)</text>
          <rect x="66" y="248" width="188" height="44" rx="10" fill="#f0f9ff" stroke="#bae6fd" stroke-width="1.5"/>
          <text x="160" y="266" text-anchor="middle" font-size="8.5" font-weight="800" fill="#0369a1">🌡️ Przechowywać w temp. poniżej 25°C</text>
          <text x="160" y="280" text-anchor="middle" font-size="8" fill="#075985">Przed użyciem zapoznaj się z ulotką</text>
          <text x="160" y="320" text-anchor="middle" font-size="8.5" font-weight="700" fill="#334155">Pozwolenie URPL nr: 12345 (Nadzór GIF)</text>
          <text x="160" y="340" text-anchor="middle" font-size="7.5" fill="#64748b">Lek wydawany bez przepisu lekarza – OTC</text>
        </svg>
      `;

    case 'krem-purebio':
      return `
        <svg viewBox="0 0 320 400" class="w-full h-full drop-shadow-xl" aria-label="Opakowanie Kremu PureBio">
          <rect x="65" y="45" width="190" height="44" rx="12" fill="#b48a60" stroke="#8c6742" stroke-width="2"/>
          <line x1="75" y1="60" x2="245" y2="60" stroke="#9e764e" stroke-width="2" opacity="0.6"/>
          <line x1="75" y1="73" x2="245" y2="73" stroke="#9e764e" stroke-width="2" opacity="0.5"/>
          <rect x="48" y="89" width="224" height="255" rx="28" fill="#f4efe6" stroke="#d6cbb8" stroke-width="3"/>
          <rect x="60" y="108" width="200" height="218" rx="16" fill="#e8f2e6" stroke="#a7c9a0" stroke-width="1.5"/>
          <path d="M88 180 C70 135, 110 118, 128 150 C110 165, 102 175, 88 180 Z" fill="#4caf50" opacity="0.85"/>
          <path d="M88 180 C105 140, 120 132, 124 148" fill="none" stroke="#1b5e20" stroke-width="1.8"/>
          <circle cx="228" cy="144" r="28" fill="#fbbf24" stroke="#b45309" stroke-width="2.5" stroke-dasharray="5 3"/>
          <circle cx="228" cy="144" r="21" fill="#fef3c7"/>
          <text x="228" y="139" text-anchor="middle" font-size="8" font-weight="800" fill="#92400e">EKO</text>
          <text x="228" y="148" text-anchor="middle" font-size="6.5" font-weight="800" fill="#92400e">GWARANCJA</text>
          <text x="228" y="157" text-anchor="middle" font-size="7.5" font-weight="900" fill="#b45309">2026</text>
          <text x="160" y="176" text-anchor="middle" font-size="22" font-weight="900" fill="#14532d">PureBio</text>
          <rect x="74" y="188" width="172" height="36" rx="8" fill="#15803d"/>
          <text x="160" y="205" text-anchor="middle" font-size="12.5" font-weight="900" fill="#ffffff">100% BEZ CHEMII</text>
          <text x="160" y="218" text-anchor="middle" font-size="8.5" font-weight="700" fill="#dcfce7">• BEZ PARABENÓW • NATURALNY •</text>
          <text x="160" y="248" text-anchor="middle" font-size="10" font-weight="600" fill="#3f6212">Krem nawilżający z aloesem</text>
          <line x1="80" y1="262" x2="240" y2="262" stroke="#bbf7d0" stroke-width="1.5"/>
          <text x="160" y="280" text-anchor="middle" font-size="7" font-weight="700" fill="#475569">SKŁADNIKI (INCI):</text>
          <text x="160" y="292" text-anchor="middle" font-size="6.5" fill="#64748b">Aqua, Butyrospermum Parkii Butter,</text>
          <text x="160" y="302" text-anchor="middle" font-size="6.5" fill="#64748b">Phenoxyethanol, Parfum, Limonene, Linalool</text>
          <text x="160" y="317" text-anchor="middle" font-size="7.5" font-weight="700" fill="#64748b">50 ml</text>
        </svg>
      `;

    case 'suplement-neurocalm':
      return `
        <svg viewBox="0 0 320 400" class="w-full h-full drop-shadow-xl" aria-label="Opakowanie NeuroCalm Forte">
          <rect x="52" y="34" width="216" height="332" rx="18" fill="#ffffff" stroke="#cbd5e1" stroke-width="3"/>
          <path d="M52 52 Q52 34 70 34 L250 34 Q268 34 268 52 L268 88 L52 88 Z" fill="#0f172a"/>
          <rect x="218" y="47" width="26" height="26" rx="6" fill="#ef4444"/>
          <rect x="228" y="52" width="6" height="16" fill="#ffffff"/>
          <rect x="223" y="57" width="16" height="6" fill="#ffffff"/>
          <text x="72" y="67" font-size="11" font-weight="800" fill="#38bdf8" letter-spacing="1">PHARMA-STYLE</text>
          <text x="160" y="122" text-anchor="middle" font-size="23" font-weight="900" fill="#0f172a">NeuroCalm</text>
          <text x="160" y="142" text-anchor="middle" font-size="14" font-weight="800" fill="#dc2626" letter-spacing="2">FORTE MAX</text>
          <rect x="74" y="154" width="172" height="24" rx="12" fill="#eff6ff" stroke="#93c5fd" stroke-width="1.5"/>
          <text x="160" y="170" text-anchor="middle" font-size="9.5" font-weight="800" fill="#1d4ed8">★ POLECANE PRZEZ EKSPERTÓW ★</text>
          <rect x="68" y="192" width="184" height="58" rx="12" fill="#fef2f2" stroke="#fca5a5" stroke-width="1.5"/>
          <text x="160" y="213" text-anchor="middle" font-size="10.5" font-weight="800" fill="#991b1b">SKUTECZNA ULGA W NERWICY</text>
          <text x="160" y="229" text-anchor="middle" font-size="10.5" font-weight="800" fill="#991b1b">I BEZSENNOŚCI!</text>
          <text x="160" y="242" text-anchor="middle" font-size="7.5" fill="#b91c1c">Ekstrakt z melisy + tlenek magnezu</text>
          <g transform="rotate(-7 224 282)">
            <rect x="172" y="262" width="84" height="44" rx="10" fill="#ec4899" stroke="#ffffff" stroke-width="2"/>
            <text x="214" y="280" text-anchor="middle" font-size="8" font-weight="800" fill="#ffffff">HIT TIKTOKA!</text>
            <text x="214" y="295" text-anchor="middle" font-size="11" font-weight="900" fill="#fef08a">KOD: -20%</text>
          </g>
          <rect x="74" y="274" width="38" height="16" rx="8" fill="#3b82f6"/>
          <rect x="93" y="274" width="19" height="16" rx="8" fill="#e2e8f0"/>
          <text x="74" y="308" font-size="9" font-weight="700" fill="#475569">60 kapsułek</text>
          <text x="255" y="354" text-anchor="end" font-size="7.5" font-weight="600" fill="#94a3b8">Suplement diety</text>
        </svg>
      `;

    case 'baton-fitzero':
      return `
        <svg viewBox="0 0 320 400" class="w-full h-full drop-shadow-xl" aria-label="Opakowanie Batona FitZero">
          <rect x="38" y="38" width="244" height="214" rx="18" fill="#0f766e" stroke="#115e59" stroke-width="3"/>
          <polygon points="38,160 282,110 282,165 38,215" fill="#14b8a6" opacity="0.35"/>
          <circle cx="84" cy="94" r="24" fill="#ccfbf1" opacity="0.25"/>
          <text x="84" y="102" text-anchor="middle" font-size="26">🏃‍♀️</text>
          <text x="184" y="88" text-anchor="middle" font-size="26" font-weight="900" fill="#ffffff" font-style="italic">FitZero*</text>
          <text x="184" y="107" text-anchor="middle" font-size="10" font-weight="700" fill="#99f6e4" letter-spacing="1.5">ENERGY &amp; SPORT BAR</text>
          <rect x="56" y="122" width="208" height="36" rx="10" fill="#facc15"/>
          <text x="160" y="145" text-anchor="middle" font-size="13.5" font-weight="900" fill="#0f172a">0% DODANEGO CUKRU</text>
          <rect x="66" y="170" width="188" height="44" rx="12" fill="#042f2e" stroke="#2dd4bf" stroke-width="1.5"/>
          <text x="160" y="191" text-anchor="middle" font-size="15" font-weight="900" fill="#ffffff">TYLKO 140 kcal!*</text>
          <text x="160" y="205" text-anchor="middle" font-size="7.5" fill="#99f6e4">*w 1 porcji (30 g) · masa całego batona: 60 g</text>
          <rect x="46" y="264" width="228" height="104" rx="14" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
          <text x="62" y="284" font-size="9" font-weight="800" fill="#0f172a">TYŁ OPAKOWANIA (TABELA I SKŁAD):</text>
          <text x="62" y="302" font-size="8.5" fill="#334155"><tspan font-weight="700">Skład:</tspan> pasta daktylowa (45%), syrop z agawy,</text>
          <text x="62" y="314" font-size="8.5" fill="#334155">olej palmowy, płatki owsiane, kakao.</text>
          <line x1="62" y1="325" x2="258" y2="325" stroke="#e2e8f0" stroke-width="1.5"/>
          <text x="62" y="341" font-size="9" font-weight="700" fill="#475569">Wartość w 100 g: 467 kcal</text>
          <text x="62" y="356" font-size="9.5" font-weight="900" fill="#dc2626">w tym CUKRY: 42 g / 100 g!</text>
        </svg>
      `;

    case 'woda-alkaline':
      return `
        <svg viewBox="0 0 320 400" class="w-full h-full drop-shadow-xl" aria-label="Butelka Alkaline Detox pH 9.5">
          <rect x="134" y="28" width="52" height="26" rx="6" fill="#0284c7"/>
          <path d="M138 54 L182 54 L208 112 L112 112 Z" fill="#e0f2fe" stroke="#7dd3fc" stroke-width="2.5"/>
          <rect x="92" y="110" width="136" height="252" rx="26" fill="#ecfeff" stroke="#38bdf8" stroke-width="3"/>
          <rect x="206" y="72" width="76" height="30" rx="10" fill="#0f172a"/>
          <text x="244" y="91" text-anchor="middle" font-size="12" font-weight="900" fill="#38bdf8">14,99 zł</text>
          <rect x="100" y="142" width="120" height="190" rx="14" fill="#ffffff" stroke="#bae6fd" stroke-width="1.5"/>
          <text x="160" y="168" text-anchor="middle" font-size="14" font-weight="900" fill="#0369a1" letter-spacing="1">ALKALINE</text>
          <text x="160" y="184" text-anchor="middle" font-size="11" font-weight="700" fill="#0d9488" letter-spacing="2">DETOX</text>
          <circle cx="160" cy="218" r="24" fill="#0284c7"/>
          <text x="160" y="215" text-anchor="middle" font-size="9" font-weight="700" fill="#bae6fd">WYSOKIE</text>
          <text x="160" y="229" text-anchor="middle" font-size="14" font-weight="900" fill="#ffffff">pH 9.5</text>
          <text x="160" y="261" text-anchor="middle" font-size="8.5" font-weight="800" fill="#0f172a">• ODKWASZA ORGANIZM •</text>
          <text x="160" y="274" text-anchor="middle" font-size="8.5" font-weight="800" fill="#0f172a">• USUWA TOKSYNY •</text>
          <rect x="108" y="286" width="104" height="34" rx="8" fill="#dcfce7" stroke="#4ade80" stroke-width="1.2"/>
          <text x="160" y="301" text-anchor="middle" font-size="7.5" font-weight="800" fill="#166534">100% PRZYJAZNA</text>
          <text x="160" y="312" text-anchor="middle" font-size="7.5" font-weight="800" fill="#166534">PLANECIE 🌍</text>
          <circle cx="234" cy="316" r="28" fill="#16a34a" stroke="#ffffff" stroke-width="2.5"/>
          <text x="234" y="311" text-anchor="middle" font-size="7" font-weight="900" fill="#ffffff">EKO-PLANET</text>
          <text x="234" y="322" text-anchor="middle" font-size="7" font-weight="800" fill="#bbf7d0">APPROVED</text>
        </svg>
      `;

    case 'mus-owocowy':
      return `
        <svg viewBox="0 0 320 400" class="w-full h-full drop-shadow-xl" aria-label="Mus Owocowy Jabłko-Porzeczka">
          <rect x="138" y="34" width="44" height="24" rx="6" fill="#dc2626"/>
          <rect x="148" y="58" width="24" height="12" fill="#e2e8f0"/>
          <path d="M90 70 L230 70 C248 70 258 84 258 104 L250 338 C248 354 236 364 218 364 L102 364 C84 364 72 354 70 338 L62 104 C62 84 72 70 90 70 Z" fill="#fefce8" stroke="#cbd5e1" stroke-width="3"/>
          <text x="160" y="114" text-anchor="middle" font-size="11" font-weight="700" fill="#64748b" letter-spacing="1.5">MUS OWOCOWY 100 g</text>
          <text x="160" y="142" text-anchor="middle" font-size="22" font-weight="900" fill="#1e293b">Jabłko &amp;</text>
          <text x="160" y="166" text-anchor="middle" font-size="22" font-weight="900" fill="#6b21a8">Porzeczka</text>
          <text x="160" y="198" text-anchor="middle" font-size="24">🍎 🫐</text>
          <rect x="82" y="212" width="156" height="84" rx="12" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
          <text x="160" y="229" text-anchor="middle" font-size="8.5" font-weight="800" fill="#0f172a">SKŁADNIKI:</text>
          <text x="160" y="244" text-anchor="middle" font-size="8" fill="#334155">Przecier jabłkowy (75%),</text>
          <text x="160" y="256" text-anchor="middle" font-size="8" fill="#334155">przecier z czarnej porzeczki (24%),</text>
          <text x="160" y="270" text-anchor="middle" font-size="8" font-weight="700" fill="#0f172a">substancja żelująca: E440,</text>
          <text x="160" y="282" text-anchor="middle" font-size="8" font-weight="700" fill="#0f172a">regulator: E330, przeciwutleniacz: E300</text>
          <rect x="176" y="308" width="56" height="36" rx="4" fill="#65a30d"/>
          <path d="M188 332 C194 316, 212 314, 222 322 C214 334, 198 336, 188 332 Z" fill="none" stroke="#ffffff" stroke-width="2" stroke-dasharray="3 2.5"/>
          <text x="204" y="354" text-anchor="middle" font-size="7.5" font-weight="800" fill="#365314">PL-EKO-01</text>
          <text x="90" y="328" font-size="8" font-weight="600" fill="#64748b">Bez obietnic</text>
          <text x="90" y="340" font-size="8" font-weight="600" fill="#64748b">marketingowych</text>
        </svg>
      `;

    default:
      return '';
  }
}

const STORAGE_KEY = 'etykieta_bez_sciemy_state_v2';

let appState = {
  activeTab: 'xray',
  currentProductIndex: 0,
  xrayCategoryFilter: 'all',
  activeLayerKey: 'chemia',
  inspected: {}, // Mapa: productId -> { userVote: 'kupuje'|'sciema', visitedLayers: [] }
  bestQuizPct: null,
  bestQuizRank: null,
  forumFeedbacks: [],
  scannerMode: 'drugs',
  activeDrugScanId: 'magnelek-b6',
  activeCertScanId: 'cert-teraz-polska',
  shoppingList: [] // Tablica obiektów { id, name, price, store, checked }
};

let activeCameraStream = null;

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      appState = { ...appState, ...parsed };
    }
  } catch (err) {
    console.warn('localStorage niedostępny – aplikacja działa w pamięci sesji:', err);
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
  } catch (err) {
    console.warn('Nie udało się zapisać stanu w localStorage:', err);
  }
}

/* =========================================================================
   5. NARZĘDZIA UI: POWIADOMIENIA TOAST I NAWIGACJA ZAKŁADEK
   ========================================================================= */
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  const colors = type === 'error'
    ? 'bg-rose-900 text-white border-rose-700'
    : 'bg-slate-900 text-white border-emerald-500';

  toast.className = `pointer-events-auto px-4 py-3 rounded-2xl border-l-4 shadow-lg text-sm font-semibold flex items-center gap-2.5 animate-fade-in ${colors}`;
  toast.innerHTML = `<span>${type === 'error' ? '⚠️' : '✅'}</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.25s ease';
    setTimeout(() => toast.remove(), 260);
  }, 3200);
}

function switchTab(tabId) {
  if (appState.activeTab === 'scanner' && tabId !== 'scanner') {
    stopCamera();
  }
  appState.activeTab = tabId;
  document.querySelectorAll('.tab-view').forEach(section => section.classList.add('hidden'));

  const target = document.getElementById(`view-${tabId}`);
  if (target) target.classList.remove('hidden');

  document.querySelectorAll('.nav-tab').forEach(btn => {
    const isActive = btn.dataset.tab === tabId;
    btn.className = isActive
      ? 'nav-tab flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/80'
      : 'nav-tab flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap text-slate-600 hover:text-slate-900 hover:bg-white/60';
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateNavBadges() {
  const inspectedCount = Object.keys(appState.inspected).length;
  document.getElementById('nav-xray-badge').textContent = `${inspectedCount}/${PRODUCTS.length}`;
  document.getElementById('xray-progress-text').textContent = `${inspectedCount} z ${PRODUCTS.length}`;
  document.getElementById('xray-progress-bar').style.width = `${(inspectedCount / PRODUCTS.length) * 100}%`;

  const cartBadge = document.getElementById('nav-cart-badge');
  if (cartBadge) {
    const cartCount = appState.shoppingList ? appState.shoppingList.length : 0;
    cartBadge.textContent = String(cartCount);
    cartBadge.classList.toggle('hidden', cartCount === 0);
  }

  const quizBadge = document.getElementById('nav-quiz-badge');
  if (appState.bestQuizPct !== null) {
    quizBadge.textContent = `${appState.bestQuizPct}%`;
    quizBadge.classList.remove('hidden');
    document.getElementById('quiz-best-score-display').textContent = `${appState.bestQuizPct}%`;
    document.getElementById('quiz-best-rank-display').textContent = appState.bestQuizRank || '';
  } else {
    quizBadge.classList.add('hidden');
    document.getElementById('quiz-best-score-display').textContent = '—';
    document.getElementById('quiz-best-rank-display').textContent = 'Jeszcze nie rozegrano';
  }
}

/* =========================================================================
   6. SILNIK MODUŁU 1: RENTGEN ETYKIETY
   ========================================================================= */
function renderProductSelector() {
  const strip = document.getElementById('product-selector-strip');
  strip.innerHTML = '';

  PRODUCTS.forEach((prod, idx) => {
    if (appState.xrayCategoryFilter !== 'all' && prod.mainCategory !== appState.xrayCategoryFilter) {
      return;
    }

    const isCurrent = idx === appState.currentProductIndex;
    const isDone = Boolean(appState.inspected[prod.id]);

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `flex items-center justify-between gap-2 px-3.5 py-3 rounded-2xl border text-left transition-all ${
      isCurrent
        ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20'
        : isDone
          ? 'bg-emerald-50/70 text-emerald-950 border-emerald-200 hover:bg-emerald-100/70'
          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
    }`;

    btn.innerHTML = `
      <div class="min-w-0">
        <div class="text-[11px] font-bold uppercase tracking-wider ${isCurrent ? 'text-emerald-100' : 'text-slate-400'}">
          ${prod.mainCategory.toUpperCase()}
        </div>
        <div class="text-sm font-extrabold truncate">${prod.shortName}</div>
      </div>
      <span class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
        isDone
          ? (isCurrent ? 'bg-white text-emerald-700' : 'bg-emerald-600 text-white')
          : (isCurrent ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500')
      }">
        ${isDone ? '✓' : idx + 1}
      </span>
    `;

    btn.addEventListener('click', () => {
      appState.currentProductIndex = idx;
      appState.activeLayerKey = 'chemia';
      renderXrayView();
    });

    strip.appendChild(btn);
  });

  // Aktualizacja stylu przycisków filtra kategorii
  document.querySelectorAll('.xray-cat-pill').forEach(pill => {
    const active = pill.dataset.xrayCat === appState.xrayCategoryFilter;
    pill.classList.toggle('ring-2', active);
    pill.classList.toggle('ring-slate-900', active);
    pill.classList.toggle('font-extrabold', active);
  });
}

function triggerScanAnimation() {
  const container = document.getElementById('xray-scanline-container');
  container.innerHTML = '<div class="xray-scanline"></div>';
  setTimeout(() => {
    container.innerHTML = '';
  }, 1200);
}

function renderHotspots(product, isUnlocked) {
  const layer = document.getElementById('hotspots-layer');
  layer.innerHTML = '';

  if (!isUnlocked) {
    layer.classList.add('pointer-events-none');
    return;
  }

  layer.classList.remove('pointer-events-none');

  Object.entries(product.layers).forEach(([key, data]) => {
    const meta = LAYER_META[key];
    const isActive = appState.activeLayerKey === key;

    const pin = document.createElement('button');
    pin.type = 'button';
    pin.style.left = `${data.x}%`;
    pin.style.top = `${data.y}%`;
    pin.title = `Rentgen: ${meta.label} – ${data.title}`;
    pin.className = `hotspot-pin pointer-events-auto w-10 h-10 rounded-full flex items-center justify-center text-lg text-white border-2 shadow-lg cursor-pointer ${meta.pinBg} ${meta.pinBorder} ${isActive ? 'active-pin ring-4 ring-white' : ''}`;
    pin.innerHTML = meta.icon;

    pin.addEventListener('click', () => selectLayer(key));
    layer.appendChild(pin);
  });
}

function selectLayer(layerKey) {
  const product = PRODUCTS[appState.currentProductIndex];
  const record = appState.inspected[product.id];
  if (!record) return;

  appState.activeLayerKey = layerKey;
  if (!record.visitedLayers.includes(layerKey)) {
    record.visitedLayers.push(layerKey);
    saveState();
  }

  renderLayerInspector(product, record);
  renderHotspots(product, true);
}

function renderLayerInspector(product, record) {
  const tabsContainer = document.getElementById('layer-tabs');
  tabsContainer.innerHTML = '';

  Object.keys(LAYER_META).forEach(key => {
    const meta = LAYER_META[key];
    const isActive = appState.activeLayerKey === key;
    const isVisited = record.visitedLayers.includes(key);

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs sm:text-sm font-bold transition-all ${
      isActive ? meta.activeTab : meta.inactiveTab
    }`;
    btn.innerHTML = `
      <span>${meta.icon}</span>
      <span>${meta.label}</span>
      ${isVisited && !isActive ? '<span class="text-[10px] opacity-70">✓</span>' : ''}
    `;

    btn.addEventListener('click', () => selectLayer(key));
    tabsContainer.appendChild(btn);
  });

  const activeKey = appState.activeLayerKey;
  const meta = LAYER_META[activeKey];
  const data = product.layers[activeKey];

  const detailBox = document.getElementById('layer-detail-box');
  detailBox.className = `rounded-2xl p-5 border-2 transition-all ${meta.boxClass}`;

  const tag = document.getElementById('layer-tag');
  tag.className = `inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full ${meta.tagClass}`;
  tag.innerHTML = `${meta.icon} Warstwa: ${meta.label}`;

  document.getElementById('layer-title').textContent = data.title;
  document.getElementById('layer-text').textContent = data.text;
  document.getElementById('layer-source').textContent = data.source;
  document.getElementById('layers-visited-counter').textContent = `Odkryto: ${record.visitedLayers.length}/4 warstw`;
}

function handleVote(vote) {
  const product = PRODUCTS[appState.currentProductIndex];
  appState.inspected[product.id] = {
    userVote: vote,
    visitedLayers: ['chemia']
  };
  appState.activeLayerKey = 'chemia';
  saveState();
  triggerScanAnimation();
  renderXrayView();
}

function renderXrayView() {
  const product = PRODUCTS[appState.currentProductIndex];
  const record = appState.inspected[product.id];
  const isUnlocked = Boolean(record);

  renderProductSelector();
  updateNavBadges();

  document.getElementById('product-category-badge').textContent = product.category;
  document.getElementById('product-title').textContent = product.name;
  document.getElementById('product-svg-wrapper').innerHTML = getProductSVG(product.id);

  const statusPill = document.getElementById('xray-status-pill');
  const stageHint = document.getElementById('stage-hint-text');

  if (isUnlocked) {
    statusPill.textContent = '🔬 Rentgen aktywny';
    statusPill.className = 'text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0';
    stageHint.textContent = 'Kliknij dowolną pulsującą pinezkę na etykiecie, aby zobaczyć analizę tego elementu.';
  } else {
    statusPill.textContent = '⏳ Czeka na decyzję';
    statusPill.className = 'text-xs font-bold px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 shrink-0';
    stageHint.textContent = 'Przyjrzyj się uważnie napisom, znaczkom i drobnemu drukowi, a potem wybierz werdykt po prawej.';
  }

  renderHotspots(product, isUnlocked);

  const decisionPrompt = document.getElementById('decision-prompt');
  const decisionResult = document.getElementById('decision-result');
  const lockedState = document.getElementById('xray-locked-state');
  const activeState = document.getElementById('xray-active-state');

  document.getElementById('product-teaser').textContent = product.teaser;

  if (!isUnlocked) {
    decisionPrompt.classList.remove('hidden');
    decisionResult.classList.add('hidden');
    lockedState.classList.remove('hidden');
    activeState.classList.add('hidden');
  } else {
    decisionPrompt.classList.add('hidden');
    decisionResult.classList.remove('hidden');
    lockedState.classList.add('hidden');
    activeState.classList.remove('hidden');

    const isCorrect = record.userVote === product.verdict;
    const iconBox = document.getElementById('verdict-icon-box');
    const badge = document.getElementById('verdict-badge');

    if (isCorrect) {
      iconBox.className = 'w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 bg-emerald-100 text-emerald-700';
      iconBox.textContent = '✅';
      badge.className = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase tracking-wide mb-1 bg-emerald-100 text-emerald-800';
      badge.textContent = product.verdict === 'sciema' ? 'Trafna obserwacja · Elementy do weryfikacji' : 'Trafna ocena · Przejrzyste oznaczenia';
    } else {
      iconBox.className = 'w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 bg-amber-100 text-amber-800';
      iconBox.textContent = '💡';
      badge.className = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase tracking-wide mb-1 bg-amber-100 text-amber-900';
      badge.textContent = product.verdict === 'sciema' ? 'Warto wiedzieć · Zauważone haczyki marketingowe' : 'Warto wiedzieć · Oznaczenia są rzetelne';
    }

    document.getElementById('verdict-headline').textContent =
      record.userVote === 'sciema' ? product.verdictHeadlineSciema : product.verdictHeadlineKupuje;
    document.getElementById('verdict-summary').textContent = product.verdictSummary;

    // Renderowanie neutralnej listy Plusów i Kwestii do uwagi
    const prosList = document.getElementById('verdict-pros-list');
    const consList = document.getElementById('verdict-cons-list');
    prosList.innerHTML = (product.pros || []).map(item => `<li>${item}</li>`).join('');
    consList.innerHTML = (product.cons || []).map(item => `<li>${item}</li>`).join('');

    renderLayerInspector(product, record);

    const prevBtn = document.getElementById('btn-prev-product');
    const nextBtn = document.getElementById('btn-next-product');
    const quizBtn = document.getElementById('btn-goto-quiz-from-xray');

    prevBtn.disabled = appState.currentProductIndex === 0;
    prevBtn.classList.toggle('opacity-40', appState.currentProductIndex === 0);
    prevBtn.classList.toggle('cursor-not-allowed', appState.currentProductIndex === 0);

    const isLast = appState.currentProductIndex === PRODUCTS.length - 1;
    nextBtn.classList.toggle('hidden', isLast);
    quizBtn.classList.toggle('hidden', !isLast);
  }
}

/* =========================================================================
   7B. SILNIK MODUŁU SKANER / APARAT (Leki + Certyfikaty)
   ========================================================================= */
async function startCamera() {
  const videoEl = document.getElementById('camera-video');
  const placeholder = document.getElementById('scanner-placeholder');
  const uploadedImg = document.getElementById('scanner-uploaded-img');
  const toggleBtn = document.getElementById('btn-toggle-camera');
  const statusTag = document.getElementById('scanner-status-tag');

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    showToast('Przeglądarka nie udostępnia aparatu – skorzystaj z próbek lub wgraj zdjęcie.', 'error');
    return;
  }

  try {
    activeCameraStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' },
      audio: false
    });
    videoEl.srcObject = activeCameraStream;
    videoEl.classList.remove('hidden');
    placeholder.classList.add('hidden');
    uploadedImg.classList.add('hidden');
    toggleBtn.textContent = '⏹ Wyłącz aparat';
    toggleBtn.className = 'px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors';
    statusTag.textContent = 'Aparat aktywny – nakieruj etykietę lub wybierz próbkę poniżej';
    showToast('Aparat uruchomiony! Możesz też przetestować próbki 1-klikiem.');
  } catch (err) {
    console.warn('Brak dostępu do kamery:', err);
    showToast('Brak zgody na aparat lub brak kamery. Działa tryb symulacji i wgrywania zdjęć.', 'error');
  }
}

function stopCamera() {
  if (activeCameraStream) {
    activeCameraStream.getTracks().forEach(track => track.stop());
    activeCameraStream = null;
  }
  const videoEl = document.getElementById('camera-video');
  const placeholder = document.getElementById('scanner-placeholder');
  const toggleBtn = document.getElementById('btn-toggle-camera');
  const statusTag = document.getElementById('scanner-status-tag');
  if (videoEl) {
    videoEl.srcObject = null;
    videoEl.classList.add('hidden');
  }
  if (placeholder && document.getElementById('scanner-uploaded-img').classList.contains('hidden')) {
    placeholder.classList.remove('hidden');
  }
  if (toggleBtn) {
    toggleBtn.textContent = '📷 Włącz aparat';
    toggleBtn.className = 'px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors';
  }
  if (statusTag) {
    statusTag.textContent = 'Gotowy do rozpoznawania kodów i znaków';
  }
}

function renderScannerView() {
  // Przełączniki trybu
  document.querySelectorAll('.scanner-mode-btn').forEach(btn => {
    const active = btn.dataset.scannerMode === appState.scannerMode;
    btn.className = active
      ? 'scanner-mode-btn px-4 py-2 rounded-xl text-sm font-bold bg-white text-slate-900 shadow-sm'
      : 'scanner-mode-btn px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-900';
  });

  const samplesGrid = document.getElementById('scanner-samples-grid');
  const samplesLabel = document.getElementById('scanner-samples-label');
  samplesGrid.innerHTML = '';

  if (appState.scannerMode === 'drugs') {
    samplesLabel.textContent = 'Zeskanuj przykładowy lek / suplement:';
    SCANNER_DRUGS.forEach(drug => {
      const isSelected = drug.id === appState.activeDrugScanId;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `p-3 rounded-2xl border text-left transition-all ${
        isSelected
          ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-200'
          : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
      }`;
      btn.innerHTML = `
        <div class="flex items-center justify-between gap-1 mb-1">
          <span class="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
            drug.statusType === 'lek' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
          }">${drug.statusType === 'lek' ? '💊 LEK OTC' : '🧴 SUPLEMENT'}</span>
          <span class="text-[10px] font-mono text-slate-400">${drug.barcode.slice(-5)}</span>
        </div>
        <div class="text-xs font-extrabold text-slate-900 leading-snug">${drug.name}</div>
      `;
      btn.addEventListener('click', () => {
        appState.activeDrugScanId = drug.id;
        document.getElementById('scanner-status-tag').textContent = `Rozpoznano kod: ${drug.barcode}`;
        renderScannerView();
      });
      samplesGrid.appendChild(btn);
    });
    renderDrugScanResult();
  } else {
    samplesLabel.textContent = 'Zeskanuj znak / logo certyfikatu:';
    SCANNER_CERTS.forEach(cert => {
      const isSelected = cert.id === appState.activeCertScanId;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
        isSelected
          ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-200'
          : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
      }`;
      btn.innerHTML = `
        <div class="shrink-0 scale-75 -m-3">${cert.svg}</div>
        <div class="min-w-0">
          <div class="text-xs font-extrabold text-slate-900 leading-snug">${cert.name}</div>
          <div class="text-[10px] font-semibold text-slate-500 mt-0.5 truncate">${cert.verdictLabel}</div>
        </div>
      `;
      btn.addEventListener('click', () => {
        appState.activeCertScanId = cert.id;
        document.getElementById('scanner-status-tag').textContent = `Rozpoznano znak: ${cert.name}`;
        renderScannerView();
      });
      samplesGrid.appendChild(btn);
    });
    renderCertScanResult();
  }
}

function renderDrugScanResult() {
  const drug = SCANNER_DRUGS.find(d => d.id === appState.activeDrugScanId) || SCANNER_DRUGS[0];
  const container = document.getElementById('scanner-result-container');
  const isDrug = drug.statusType === 'lek';

  container.innerHTML = `
    <div class="animate-fade-in">
      <div class="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <span class="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full ${
            isDrug ? 'bg-rose-100 text-rose-800 border border-rose-200' : 'bg-amber-100 text-amber-900 border border-amber-200'
          }">
            ${isDrug ? '💊 Produkt leczniczy (URPL / GIF)' : '🧴 Suplement diety (Żywność – GIS)'}
          </span>
          <h2 class="text-2xl font-extrabold text-slate-900 mt-2">${drug.name}</h2>
          <p class="text-xs text-slate-500 mt-1"><strong>Substancja / Skład:</strong> ${drug.activeSubstance}</p>
        </div>
        <span class="text-xs font-mono font-bold bg-slate-100 text-slate-600 px-3 py-1.5 rounded-xl border border-slate-200">EAN: ${drug.barcode}</span>
      </div>

      <!-- 3 kluczowe kafle ulotkowe: Temperatura, Dawkowanie, Przeciwwskazania -->
      <div class="grid grid-cols-1 gap-3.5 my-5">
        <div class="p-4 rounded-2xl bg-sky-50/70 border border-sky-200">
          <div class="text-xs font-extrabold uppercase tracking-wider text-sky-900 mb-1">🌡️ Temperatura i warunki przechowywania</div>
          <p class="text-sm text-slate-700 leading-relaxed">${drug.storageTemp}</p>
        </div>

        <div class="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200">
          <div class="text-xs font-extrabold uppercase tracking-wider text-indigo-900 mb-1">⏱️ Dawkowanie / Zalecana porcja</div>
          <p class="text-sm text-slate-700 leading-relaxed">${drug.dosage}</p>
        </div>

        <div class="p-4 rounded-2xl bg-rose-50/70 border border-rose-200">
          <div class="text-xs font-extrabold uppercase tracking-wider text-rose-900 mb-1">⚠️ Główne przeciwwskazania i środki ostrożności</div>
          <p class="text-sm text-slate-700 leading-relaxed">${drug.contraindications}</p>
        </div>
      </div>

      <!-- Neutralna ocena: Plusy / Na co zwrócić uwagę -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-5">
        <div class="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200">
          <div class="text-xs font-extrabold uppercase text-emerald-800 mb-1.5">✓ Plusy</div>
          <ul class="text-xs text-slate-700 space-y-1.5 list-disc list-inside leading-relaxed">
            ${drug.pros.map(p => `<li>${p}</li>`).join('')}
          </ul>
        </div>
        <div class="p-4 rounded-2xl bg-amber-50/60 border border-amber-200">
          <div class="text-xs font-extrabold uppercase text-amber-900 mb-1.5">⚖️ Na co zwrócić uwagę</div>
          <ul class="text-xs text-slate-700 space-y-1.5 list-disc list-inside leading-relaxed">
            ${drug.cons.map(c => `<li>${c}</li>`).join('')}
          </ul>
        </div>
      </div>

      <div class="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200 text-xs text-slate-500">
        <span>ℹ️ Informacja edukacyjna – zawsze sprawdź oficjalną ulotkę dołączoną do opakowania.</span>
        <a href="${drug.sourceUrl}" target="_blank" rel="noopener noreferrer" class="font-bold text-emerald-700 hover:underline">
          📖 ${drug.sourceLabel} ↗
        </a>
      </div>
    </div>
  `;
}

function renderCertScanResult() {
  const cert = SCANNER_CERTS.find(c => c.id === appState.activeCertScanId) || SCANNER_CERTS[0];
  const container = document.getElementById('scanner-result-container');

  const badgeStyle = cert.badgeType === 'official'
    ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
    : cert.badgeType === 'verified'
      ? 'bg-sky-100 text-sky-900 border-sky-300'
      : 'bg-amber-100 text-amber-900 border-amber-300';

  container.innerHTML = `
    <div class="animate-fade-in">
      <div class="flex flex-col sm:flex-row sm:items-center gap-5 pb-5 border-b border-slate-200">
        <div class="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
          ${cert.svg}
        </div>
        <div>
          <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold border ${badgeStyle}">
            ${cert.verdictLabel}
          </span>
          <h2 class="text-2xl font-extrabold text-slate-900 mt-2">${cert.name}</h2>
          <p class="text-xs text-slate-600 mt-1"><strong>Podmiot przyznający / nadzorujący:</strong> ${cert.issuer}</p>
        </div>
      </div>

      <div class="my-5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
        <div class="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1">Co oznacza ten znak na opakowaniu?</div>
        <p class="text-sm text-slate-800 leading-relaxed">${cert.meaning}</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-5">
        <div class="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200">
          <div class="text-xs font-extrabold uppercase text-emerald-800 mb-1.5">✓ Co realnie potwierdza (Plusy)</div>
          <ul class="text-xs text-slate-700 space-y-1.5 list-disc list-inside leading-relaxed">
            ${cert.pros.map(p => `<li>${p}</li>`).join('')}
          </ul>
        </div>
        <div class="p-4 rounded-2xl bg-amber-50/60 border border-amber-200">
          <div class="text-xs font-extrabold uppercase text-amber-900 mb-1.5">⚖️ Czego NIE gwarantuje (Na co zwrócić uwagę)</div>
          <ul class="text-xs text-slate-700 space-y-1.5 list-disc list-inside leading-relaxed">
            ${cert.cons.map(c => `<li>${c}</li>`).join('')}
          </ul>
        </div>
      </div>

      <div class="flex flex-wrap items-center justify-between gap-2 pt-4 border-t border-slate-200 text-xs">
        <span class="text-slate-500">Weryfikacja w oparciu o standardy UE i oficjalne wykazy.</span>
        <a href="${cert.sourceUrl}" target="_blank" rel="noopener noreferrer" class="font-bold text-emerald-700 hover:underline">
          📖 Źródło: ${cert.sourceLabel} ↗
        </a>
      </div>
    </div>
  `;
}

/* =========================================================================
   7C. SILNIK MODUŁU PLANER ZAKUPÓW (Ankieta, Sklepy, Lista Zakupów)
   ========================================================================= */
function renderPlannerResults() {
  const cat = document.getElementById('planner-category-select').value;
  const maxPrice = Number(document.getElementById('planner-max-price').value);
  document.getElementById('planner-price-label').textContent = `Do ${maxPrice} zł`;

  const selectedStores = Array.from(document.querySelectorAll('.planner-store-cb:checked')).map(cb => cb.value);
  const selectedPrefs = Array.from(document.querySelectorAll('.planner-pref-cb:checked')).map(cb => cb.value);

  const filtered = PLANNER_PRODUCTS.filter(p => {
    if (cat !== 'all' && p.category !== cat) return false;
    if (p.price > maxPrice) return false;
    if (selectedStores.length > 0 && !selectedStores.some(st => p.stores.includes(st))) return false;
    if (selectedPrefs.length > 0 && !selectedPrefs.every(pref => p.prefs.includes(pref))) return false;
    return true;
  });

  document.getElementById('planner-results-count').textContent = `Znaleziono produktów: ${filtered.length}`;
  const grid = document.getElementById('planner-results-grid');
  grid.innerHTML = '';

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="bg-white rounded-3xl border border-slate-200 p-8 text-center">
        <div class="text-3xl mb-2">🔍</div>
        <h3 class="text-base font-extrabold text-slate-900">Brak produktów dla tak wąskich filtrów</h3>
        <p class="text-sm text-slate-600 mt-1">Zwiększ maksymalny budżet albo odznacz część priorytetów w ankiecie po lewej stronie.</p>
      </div>
    `;
    return;
  }

  filtered.forEach(prod => {
    const inCart = appState.shoppingList.some(item => item.id === prod.id);
    const card = document.createElement('article');
    card.className = 'bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-sm hover:border-emerald-300 transition-all animate-fade-in';
    card.innerHTML = `
      <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
        <div>
          <div class="flex flex-wrap items-center gap-2 mb-1.5">
            <span class="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800">${prod.categoryLabel}</span>
            ${prod.stores.map(s => `<span class="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">🏪 ${s}</span>`).join('')}
          </div>
          <h3 class="text-lg font-extrabold text-slate-900">${prod.name}</h3>
        </div>
        <div class="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
          <div class="text-xl font-black text-slate-900">~${prod.price.toFixed(2).replace('.', ',')} zł</div>
          <button type="button" data-cart-toggle="${prod.id}" class="px-3.5 py-2 rounded-xl text-xs font-bold transition-colors ${
            inCart
              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200'
              : 'bg-slate-900 text-white hover:bg-emerald-600'
          }">
            ${inCart ? '✓ Na liście (Usuń)' : '+ Dodaj do listy'}
          </button>
        </div>
      </div>

      <!-- Pełny skład -->
      <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 mb-3.5 leading-relaxed">
        <span class="font-extrabold text-slate-900 uppercase tracking-wide">Pełny skład: </span>${prod.ingredients}
      </div>

      <!-- Zbalansowana ocena: Plusy / Na co zwrócić uwagę -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3.5">
        <div class="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80">
          <div class="text-xs font-extrabold uppercase text-emerald-800 mb-1">✓ Co jest dobre (Plusy)</div>
          <ul class="text-xs text-slate-700 space-y-1 list-disc list-inside leading-relaxed">
            ${prod.pros.map(item => `<li>${item}</li>`).join('')}
          </ul>
        </div>
        <div class="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80">
          <div class="text-xs font-extrabold uppercase text-amber-900 mb-1">⚖️ Na co zwrócić uwagę</div>
          <ul class="text-xs text-slate-700 space-y-1 list-disc list-inside leading-relaxed">
            ${prod.cons.map(item => `<li>${item}</li>`).join('')}
          </ul>
        </div>
      </div>

      <!-- Relacja ceny i źródło -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 border-t border-slate-100 text-xs">
        <div class="text-slate-700"><strong class="text-slate-900">💰 Za co płacisz:</strong> ${prod.priceVerdict}</div>
        <a href="${prod.sourceUrl}" target="_blank" rel="noopener noreferrer" class="font-bold text-emerald-700 hover:underline shrink-0">
          📖 ${prod.sourceLabel} ↗
        </a>
      </div>
    `;

    card.querySelector('[data-cart-toggle]').addEventListener('click', () => toggleShoppingItem(prod));
    grid.appendChild(card);
  });
}

function toggleShoppingItem(prod) {
  const idx = appState.shoppingList.findIndex(item => item.id === prod.id);
  if (idx >= 0) {
    appState.shoppingList.splice(idx, 1);
    showToast(`Usunięto z listy: ${prod.name}`);
  } else {
    appState.shoppingList.push({
      id: prod.id,
      name: prod.name,
      price: prod.price,
      stores: prod.stores.join(', '),
      checked: false
    });
    showToast(`Dodano do listy zakupów!`);
  }
  saveState();
  updateNavBadges();
  renderShoppingCart();
  renderPlannerResults();
}

function renderShoppingCart() {
  const listEl = document.getElementById('planner-cart-list');
  const summaryEl = document.getElementById('planner-cart-summary');
  const clearBtn = document.getElementById('planner-clear-cart-btn');

  const items = appState.shoppingList || [];
  const total = items.reduce((sum, item) => sum + item.price, 0);
  summaryEl.textContent = `${items.length} prod. · ~${total.toFixed(2).replace('.', ',')} zł`;
  clearBtn.classList.toggle('hidden', items.length === 0);

  if (items.length === 0) {
    listEl.innerHTML = 'Dodaj wybrane produkty z prawej strony, aby zaplanować świadome zakupy.';
    return;
  }

  listEl.innerHTML = '';
  items.forEach(item => {
    const row = document.createElement('div');
    row.className = 'flex items-start justify-between gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200';
    row.innerHTML = `
      <label class="flex items-start gap-2 cursor-pointer flex-1">
        <input type="checkbox" ${item.checked ? 'checked' : ''} class="mt-0.5 accent-emerald-600" />
        <div class="${item.checked ? 'line-through opacity-50' : ''}">
          <div class="font-bold text-slate-800">${item.name}</div>
          <div class="text-[11px] text-slate-500">${item.stores} · ~${item.price.toFixed(2).replace('.', ',')} zł</div>
        </div>
      </label>
      <button type="button" class="text-slate-400 hover:text-rose-600 font-bold px-1" title="Usuń">✕</button>
    `;

    row.querySelector('input').addEventListener('change', (e) => {
      item.checked = e.target.checked;
      saveState();
      renderShoppingCart();
    });
    row.querySelector('button').addEventListener('click', () => {
      appState.shoppingList = appState.shoppingList.filter(x => x.id !== item.id);
      saveState();
      updateNavBadges();
      renderShoppingCart();
      renderPlannerResults();
    });
    listEl.appendChild(row);
  });
}

/* =========================================================================
   8. GENERATOR ŚCIĄGAWKI PNG (Canvas) + KOPIOWANIE + ANKIETA FORUM
   ========================================================================= */
function drawRoundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function downloadCheatSheetPNG() {
  try {
    const canvas = document.createElement('canvas');
    const W = 1080;
    const H = 1350;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, W, H);

    const grad = ctx.createLinearGradient(0, 0, W, 280);
    grad.addColorStop(0, '#047857');
    grad.addColorStop(1, '#0f172a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, 270);

    ctx.fillStyle = '#6ee7b7';
    ctx.font = 'bold 26px Inter, sans-serif';
    ctx.fillText('ETYKIETA BEZ ŚCIEMY · HACKATHON POPLAB', 64, 78);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 54px Inter, sans-serif';
    ctx.fillText('TEST 3 PYTAŃ PRZY PÓŁCE', 64, 152);

    ctx.fillStyle = '#d1fae5';
    ctx.font = '500 28px Inter, sans-serif';
    ctx.fillText('30 sekund zamiast doktoratu – nie przepłacaj za ściemę.', 64, 210);

    function drawStepCard(y, num, color, bgColor, title, lines) {
      ctx.fillStyle = bgColor;
      drawRoundedRect(ctx, 64, y, W - 128, 285, 28);
      ctx.fill();

      ctx.fillStyle = color;
      drawRoundedRect(ctx, 96, y + 32, 64, 64, 18);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 36px Inter, sans-serif';
      ctx.fillText(num, 117, y + 77);

      ctx.fillStyle = '#0f172a';
      ctx.font = '800 32px Inter, sans-serif';
      ctx.fillText(title, 184, y + 76);

      ctx.fillStyle = '#334155';
      ctx.font = '500 25px Inter, sans-serif';
      lines.forEach((line, i) => {
        ctx.fillText('•  ' + line, 96, y + 144 + i * 44);
      });
    }

    drawStepCard(315, '1', '#0284c7', '#e0f2fe', 'CO JEST NA 1. MIEJSCU? (Skład i tabela)', [
      'Odwróć opakowanie – front to reklama, tył to fakty.',
      'Pierwsze 3 składniki stanowią większość produktu.',
      'Cukry i kalorie porównuj ZAWSZE na 100 g, nie „na porcję”.'
    ]);

    drawStepCard(630, '2', '#4f46e5', '#e0e7ff', 'LEK CZY ŻYWNOŚĆ? (Prawo i chemia)', [
      'Suplement diety = żywność (nie ma badań skuteczności).',
      '„Bez dodatku cukru” ≠ 0 g cukru; „bez chemii” nie istnieje.',
      'Symbole E to przebadane dodatki (E300 = witamina C!).'
    ]);

    drawStepCard(945, '3', '#d97706', '#fef3c7', 'KTO TO SPRAWDZIŁ? (Jakość i grafika)', [
      'Zignoruj zielony kolor, listki i hasła „eko / naturalne”.',
      'Prawdziwy certyfikat ma kod kontroli (np. PL-EKO-01, ISO).',
      'Złota pieczątka bez nazwy jednostki to tylko dekoracja.'
    ]);

    ctx.fillStyle = '#0f172a';
    ctx.font = '800 26px Inter, sans-serif';
    ctx.fillText('„Zielony listek to nie dowód – sprawdź skład, prawo i certyfikat w 30 s.”', 64, 1295);

    canvas.toBlob(blob => {
      if (!blob) {
        showToast('Nie udało się wygenerować pliku PNG.', 'error');
        return;
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sciagawka-etykieta-bez-sciemy.png';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      showToast('Pobrano Ściągawkę PNG (1080×1350 px)!');
    }, 'image/png');
  } catch (err) {
    console.error(err);
    showToast('Błąd podczas generowania obrazu PNG.', 'error');
  }
}

function copyCheatSheetText() {
  const text = [
    'TEST 3 PYTAŃ PRZY PÓŁCE (Etykieta bez ściemy)',
    '1. CO JEST NA 1. MIEJSCU? Odwróć opakowanie. Pierwsze 3 składniki to baza produktu. Cukry i kalorie porównuj ZAWSZE na 100 g, nie na porcję.',
    '2. LEK, JEDZENIE CZY PUSTA OBIETNICA? Suplement diety = żywność, nie lek. „Bez dodatku cukru” ≠ „bez cukru”. Symbole E to przebadane dodatki (E300 = witamina C).',
    '3. KTO TO SPRAWDZIŁ? Zignoruj zielony kolor i listki. Prawdziwy certyfikat ma oficjalny kod kontroli (np. Euroliść + PL-EKO-XX, EU Ecolabel, ISO).',
    'Hasło: Zielony listek to nie dowód – sprawdź skład, prawo i certyfikat w 30 sekund.'
  ].join('\n\n');

  try {
    const tempArea = document.createElement('textarea');
    tempArea.value = text;
    tempArea.style.position = 'fixed';
    tempArea.style.left = '-9999px';
    document.body.appendChild(tempArea);
    tempArea.select();
    document.execCommand('copy');
    tempArea.remove();
    showToast('Skopiowano treść Ściągawki do schowka!');
  } catch (err) {
    showToast('Nie udało się skopiować tekstu.', 'error');
  }
}

/* Obsługa ankiety testowej (Kanwa 7 – Forum) */
let selectedStars = 5;

function updateStarButtons(rating) {
  selectedStars = rating;
  document.querySelectorAll('.star-btn').forEach(btn => {
    const val = Number(btn.dataset.star);
    btn.className = val <= rating
      ? 'star-btn w-9 h-9 rounded-xl bg-amber-100 text-amber-500 border border-amber-300 text-lg font-bold transition-colors'
      : 'star-btn w-9 h-9 rounded-xl bg-slate-100 text-slate-400 hover:bg-amber-50 text-lg font-bold transition-colors';
  });
}

function renderSavedFeedbacks() {
  const box = document.getElementById('saved-feedback-list');
  const list = document.getElementById('feedback-items');
  const count = document.getElementById('feedback-count');

  if (!appState.forumFeedbacks || appState.forumFeedbacks.length === 0) {
    box.classList.add('hidden');
    return;
  }

  box.classList.remove('hidden');
  count.textContent = appState.forumFeedbacks.length;
  list.innerHTML = '';

  appState.forumFeedbacks.slice().reverse().forEach(fb => {
    const li = document.createElement('li');
    li.className = 'p-2 rounded-lg bg-slate-50 border border-slate-200';
    li.textContent = `${'★'.repeat(fb.stars)} – ${fb.note || '(bez komentarza)'}`;
    list.appendChild(li);
  });
}

/* =========================================================================
   9. INICJALIZACJA APLIKACJI I ZDARZENIA
   ========================================================================= */
document.addEventListener('DOMContentLoaded', () => {
  loadState();

  // Nawigacja zakładek
  document.querySelectorAll('.nav-tab').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });
  document.getElementById('brand-home-btn').addEventListener('click', () => switchTab('xray'));
  document.querySelectorAll('[data-goto-tab]').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.gotoTab));
  });

  // Sklepowy pasek kategorii (przyciski główne i rozwijane podkategorie)
  document.querySelectorAll('.quick-cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.dataset.quickCat;
      appState.xrayCategoryFilter = cat;
      const firstMatch = PRODUCTS.findIndex(p => p.mainCategory === cat);
      if (firstMatch >= 0) appState.currentProductIndex = firstMatch;
      renderXrayView();
      switchTab('xray');
    });
  });

  document.querySelectorAll('[data-cat-action]').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.catAction;
      if (action === 'xray') {
        const idx = PRODUCTS.findIndex(p => p.id === btn.dataset.targetId);
        if (idx >= 0) {
          appState.xrayCategoryFilter = 'all';
          appState.currentProductIndex = idx;
          appState.activeLayerKey = 'chemia';
          renderXrayView();
          switchTab('xray');
        }
      } else if (action === 'scanner-drug') {
        appState.scannerMode = 'drugs';
        appState.activeDrugScanId = btn.dataset.targetId;
        renderScannerView();
        switchTab('scanner');
      } else if (action === 'scanner-cert') {
        appState.scannerMode = 'certs';
        appState.activeCertScanId = btn.dataset.targetId;
        renderScannerView();
        switchTab('scanner');
      } else if (action === 'planner') {
        document.getElementById('planner-category-select').value = btn.dataset.targetCat || 'all';
        renderPlannerResults();
        switchTab('planner');
      }
    });
  });

  // Filtry kategorii w Rentgenie
  document.querySelectorAll('.xray-cat-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      appState.xrayCategoryFilter = pill.dataset.xrayCat;
      if (appState.xrayCategoryFilter !== 'all') {
        const matchIdx = PRODUCTS.findIndex(p => p.mainCategory === appState.xrayCategoryFilter);
        if (matchIdx >= 0) appState.currentProductIndex = matchIdx;
      }
      renderXrayView();
    });
  });

  // Zdarzenia Skanera / Aparatu
  document.querySelectorAll('.scanner-mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      appState.scannerMode = btn.dataset.scannerMode;
      renderScannerView();
    });
  });

  document.getElementById('btn-toggle-camera').addEventListener('click', () => {
    if (activeCameraStream) stopCamera();
    else startCamera();
  });

  document.getElementById('scanner-file-input').addEventListener('change', (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    stopCamera();
    const imgEl = document.getElementById('scanner-uploaded-img');
    const placeholder = document.getElementById('scanner-placeholder');
    const reader = new FileReader();
    reader.onload = () => {
      imgEl.src = reader.result;
      imgEl.classList.remove('hidden');
      placeholder.classList.add('hidden');
      document.getElementById('scanner-status-tag').textContent = `Wgrano zdjęcie: ${file.name} (wybierz dopasowanie poniżej)`;
      showToast('Zdjęcie załadowane w wizjerze skanera!');
    };
    reader.readAsDataURL(file);
  });

  // Zdarzenia Planera Zakupów
  document.getElementById('planner-category-select').addEventListener('change', renderPlannerResults);
  document.getElementById('planner-max-price').addEventListener('input', renderPlannerResults);
  document.querySelectorAll('.planner-store-cb, .planner-pref-cb').forEach(cb => {
    cb.addEventListener('change', renderPlannerResults);
  });
  document.getElementById('planner-reset-filters-btn').addEventListener('click', () => {
    document.getElementById('planner-category-select').value = 'all';
    document.getElementById('planner-max-price').value = '80';
    document.querySelectorAll('.planner-store-cb, .planner-pref-cb').forEach(cb => { cb.checked = false; });
    renderPlannerResults();
  });
  document.getElementById('planner-clear-cart-btn').addEventListener('click', () => {
    appState.shoppingList = [];
    saveState();
    updateNavBadges();
    renderShoppingCart();
    renderPlannerResults();
    showToast('Lista zakupów została wyczyszczona.');
  });

  // Zdarzenia Rentgena
  document.getElementById('btn-vote-kupuje').addEventListener('click', () => handleVote('kupuje'));
  document.getElementById('btn-vote-sciema').addEventListener('click', () => handleVote('sciema'));
  document.getElementById('btn-prev-product').addEventListener('click', () => {
    if (appState.currentProductIndex > 0) {
      appState.currentProductIndex -= 1;
      appState.activeLayerKey = 'chemia';
      renderXrayView();
    }
  });
  document.getElementById('btn-next-product').addEventListener('click', () => {
    if (appState.currentProductIndex < PRODUCTS.length - 1) {
      appState.currentProductIndex += 1;
      appState.activeLayerKey = 'chemia';
      renderXrayView();
    }
  });
  document.getElementById('btn-goto-quiz-from-xray').addEventListener('click', () => switchTab('quiz'));

  // Zdarzenia Quizu
  document.querySelectorAll('.quiz-start-card').forEach(card => {
    card.addEventListener('click', () => startQuiz(card.dataset.quizCat));
  });
  document.getElementById('quiz-next-btn').addEventListener('click', () => {
    if (quizSession.currentIndex < quizSession.questions.length - 1) {
      quizSession.currentIndex += 1;
      renderQuizQuestion();
    } else {
      showQuizSummary();
    }
  });
  document.getElementById('quiz-abort-btn').addEventListener('click', () => {
    document.getElementById('quiz-active').classList.add('hidden');
    document.getElementById('quiz-intro').classList.remove('hidden');
  });
  document.getElementById('quiz-retry-btn').addEventListener('click', () => startQuiz(quizSession.category));
  document.getElementById('quiz-back-cats-btn').addEventListener('click', () => {
    document.getElementById('quiz-summary').classList.add('hidden');
    document.getElementById('quiz-intro').classList.remove('hidden');
  });

  // Zdarzenia Ściągawki
  document.getElementById('btn-download-png').addEventListener('click', downloadCheatSheetPNG);
  document.getElementById('btn-copy-cheatsheet').addEventListener('click', copyCheatSheetText);
  document.getElementById('btn-print-cheatsheet').addEventListener('click', () => window.print());

  // Zdarzenia Ankiety Forum
  updateStarButtons(5);
  document.querySelectorAll('.star-btn').forEach(btn => {
    btn.addEventListener('click', () => updateStarButtons(Number(btn.dataset.star)));
  });
  document.getElementById('forum-feedback-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const noteInput = document.getElementById('feedback-note');
    appState.forumFeedbacks.push({
      stars: selectedStars,
      note: noteInput.value.trim(),
      date: new Date().toISOString()
    });
    saveState();
    noteInput.value = '';
    renderSavedFeedbacks();
    showToast('Dziękujemy! Opinia testera została zapisana.');
  });

  // Modal resetu postępu (z obsługą klawisza Escape)
  const resetModal = document.getElementById('reset-modal');
  const closeResetModal = () => {
    resetModal.classList.add('hidden');
    resetModal.classList.remove('flex');
  };

  document.getElementById('open-reset-modal-btn').addEventListener('click', () => {
    resetModal.classList.remove('hidden');
    resetModal.classList.add('flex');
  });
  document.getElementById('cancel-reset-btn').addEventListener('click', closeResetModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !resetModal.classList.contains('hidden')) {
      closeResetModal();
    }
  });
  document.getElementById('confirm-reset-btn').addEventListener('click', () => {
    appState.inspected = {};
    appState.bestQuizPct = null;
    appState.bestQuizRank = null;
    appState.currentProductIndex = 0;
    appState.xrayCategoryFilter = 'all';
    appState.activeLayerKey = 'chemia';
    appState.shoppingList = [];
    saveState();
    closeResetModal();
    renderXrayView();
    renderShoppingCart();
    renderPlannerResults();
    showToast('Postęp oraz lista zakupów zostały zresetowane.');
  });

  // Pierwsze renderowanie widoków
  renderXrayView();
  renderScannerView();
  renderShoppingCart();
  renderPlannerResults();
  renderSavedFeedbacks();
  switchTab('xray');
});