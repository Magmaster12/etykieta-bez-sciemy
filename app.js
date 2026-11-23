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
    id: 'krem-purebio',
    shortName: 'Krem PureBio',
    name: 'Krem „PureBio – 100% Bez Chemii”',
    category: 'Kosmetyki',
    verdict: 'sciema',
    teaser: 'Widzisz ten słoiczek w drogerii. Beżowe eko-opakowanie, złota pieczątka gwarancji i głośna obietnica braku chemii. Wybierasz go dla wrażliwej cery?',
    verdictHeadlineSciema: 'Świetny instynkt! To klasyczna pułapka chemofobii.',
    verdictHeadlineKupuje: 'Ostrożnie – ten zielony listek właśnie Cię uśpił!',
    verdictSummary: 'Krem bez chemii nie istnieje fizycznie, złota pieczątka to grafika marketingowa, a unijne prawo zakazuje takich haseł. Prześwietl wszystkie 4 warstwy poniżej.',
    layers: {
      chemia: {
        x: 50, y: 78,
        title: 'Mit „100% bez chemii” i alergeny naturalne',
        text: 'Wszystko, co istnieje – łącznie z wodą (Aqua), masłem shea i ekstraktem roślinnym – składa się ze związków chemicznych. Ponadto naturalne olejki eteryczne (np. Limonene z listy INCI) uczulają statystycznie częściej niż wiele przebadanych składników syntetycznych.',
        source: 'Baza CosIng Komisji Europejskiej; toksykologia kosmetyczna'
      },
      prawo: {
        x: 42, y: 46,
        title: 'Niedozwolone oświadczenie kosmetyczne',
        text: 'Unijne kryteria oświadczeń kosmetycznych zakazują twierdzeń nieprawdziwych (nie da się wyprodukować kremu „bez chemii”) oraz dyskredytowania legalnych, bezpiecznych składników dopuszczonych do obrotu (np. straszenia parabenami).',
        source: 'Rozporządzenie Komisji (UE) nr 655/2013; Dokument techniczny KE'
      },
      jakosc: {
        x: 76, y: 34,
        title: 'Pieczątka bez zewnętrznego audytu',
        text: 'Złota pieczątka „Eko Gwarancja 2026” nie jest akredytowanym certyfikatem (jak COSMOS czy ECOCERT), lecz wymyślonym przez dział marketingu znakiem graficznym bez żadnej niezależnej kontroli.',
        source: 'Standardy certyfikacji COSMOS / ISO 14024'
      },
      grafika: {
        x: 24, y: 34,
        title: 'Efekt „green-cueing” na opakowaniu',
        text: 'Połączenie zieleni, papierowej beżowej tekstury i dużego liścia aloesu podświadomie budzi skojarzenie z czystością i bezpieczeństwem, skutecznie odwracając wzrok od drobnego składu INCI na dole.',
        source: 'Psychologia opakowań i neuromarketing'
      }
    }
  },
  {
    id: 'suplement-neurocalm',
    shortName: 'NeuroCalm Forte',
    name: 'Suplement „NeuroCalm Forte – Stop Stresowi”',
    category: 'Suplementy diety',
    verdict: 'sciema',
    teaser: 'Przed sesją egzaminacyjną widzisz to pudełko na relacji ulubionego influencera z kodem -20%. Wygląda jak lek z apteki i obiecuje ulgę w nerwicy. Bierzesz?',
    verdictHeadlineSciema: 'Brawo! Rozpoznałeś suplement udający lek.',
    verdictHeadlineKupuje: 'Wpadłeś w pułapkę „aptecznego” designu!',
    verdictSummary: 'To prawnie żywność (suplement diety), nie lek – nie musi mieć badań skuteczności, a obiecywanie leczenia nerwicy jest nielegalne. Zobacz szczegóły pod Rentgenem.',
    layers: {
      chemia: {
        x: 50, y: 58,
        title: 'Brak standaryzacji i słaba forma magnezu',
        text: 'Kapsułka zawiera głównie ekstrakt z melisy i śladowe ilości magnezu w słabo przyswajalnej formie (tlenek magnezu). Brakuje informacji o standaryzacji ekstraktu, więc nie wiadomo, ile substancji aktywnej realnie przyjmujesz.',
        source: 'Opinie naukowe EFSA (Europejski Urząd ds. Bezpieczeństwa Żywności)'
      },
      prawo: {
        x: 72, y: 84,
        title: 'Suplement to żywność – nie wolno mu „leczyć”',
        text: 'Suplement diety to prawnie środek spożywczy, który przed wejściem na rynek nie przechodzi badań klinicznych skuteczności (wystarczy zgłoszenie do GIS). Przypisywanie mu leczenia nerwicy i bezsenności łamie prawo.',
        source: 'Ustawa o bezpieczeństwie żywności i żywienia; Rozporządzenie (WE) nr 1924/2006'
      },
      jakosc: {
        x: 34, y: 38,
        title: 'Puste hasło „Polecane przez ekspertów”',
        text: 'Napis „Polecane przez ekspertów” bez podania, kim są badani eksperci i jak przeprowadzono badanie, nie ma wartości dowodowej. Leki podlegają ścisłemu nadzorowi GIF i normom GMP; suplementy – normom żywnościowym.',
        source: 'Rejestr Produktów Leczniczych vs. Rejestr GIS'
      },
      grafika: {
        x: 76, y: 24,
        title: 'Kamuflaż farmaceutyczny i mikrodruk',
        text: 'Białe pudełko, czerwony krzyżyk i medyczna typografia celowo upodabniają produkt do leku z apteki. Kluczowy napis „Suplement diety” ukryto mikroskopijną czcionką o słabym kontraście, a obok dodano naklejkę influencera.',
        source: 'Analiza projektowania opakowań farmaceutycznych; Rekomendacje UOKiK'
      }
    }
  },
  {
    id: 'baton-fitzero',
    shortName: 'Baton FitZero*',
    name: 'Baton „FitZero* – Bez Dodatku Cukru”',
    category: 'Zdrowe odżywianie',
    verdict: 'sciema',
    teaser: 'Po treningu łapiesz szybki baton „fit”. Wielkie 0% dodanego cukru i zaledwie 140 kcal!* Wygląda na idealną przekąskę dietetyczną. Wrzucasz do koszyka?',
    verdictHeadlineSciema: 'Celny strzał! Wyłapałeś pułapkę porcji i daktyli.',
    verdictHeadlineKupuje: 'Dałeś się nabrać na gwiazdkę i efekt „health halo”!',
    verdictSummary: 'Cały baton ma 280 kcal (140 kcal to połowa batona!), a aż 42 g w 100 g to cukry proste z pasty daktylowej i syropu. Kliknij warstwy, by zobaczyć jak działa ten trik.',
    layers: {
      chemia: {
        x: 52, y: 74,
        title: '„Bez dodatku cukru” ≠ brak cukrów prostych',
        text: 'Pasta daktylowa (45%) i syrop z agawy dostarczają ogromnej ilości fruktozy i glukozy – ponad 25 g cukru w jednym batonie (ok. 5 łyżeczek!), które w organizmie podnoszą glikemię podobnie jak zwykły cukier.',
        source: 'NCEŻ – Narodowe Centrum Edukacji Żywieniowej'
      },
      prawo: {
        x: 74, y: 50,
        title: 'Trik z zaniżoną „porcją” vs. tabela na 100 g',
        text: 'Prawo pozwala użyć hasła „bez dodatku cukrów”, jeśli nie dosypano sacharozy, ale wymaga dopisku o cukrach naturalnych. Podawanie kalorii dla „porcji 30 g” (pół batona!) jest legalnym, lecz mylącym chwytem – zawsze sprawdzaj kolumnę 100 g.',
        source: 'Rozporządzenie (WE) nr 1924/2006; Rozporządzenie (UE) nr 1169/2011'
      },
      jakosc: {
        x: 28, y: 74,
        title: 'Kolejność składników zdradza prawdę',
        text: 'Pierwsze trzy pozycje na liście składników stanowią większość masy produktu (kolejność malejąca). Baton reklamowany jako „fit i proteinowy” składa się głównie z cukru z daktyli oraz oleju palmowego.',
        source: 'Rozporządzenie (UE) nr 1169/2011 – zasady znakowania składu'
      },
      grafika: {
        x: 28, y: 34,
        title: 'Efekt aureoli zdrowotnej (Health Halo)',
        text: 'Ogromne „0%”, dynamiczna sylwetka biegaczki i jaskrawe „140 kcal*” tworzą wrażenie ultrazdrowej przekąski. Gwiazdka odsyłająca do wagi pół porcji jest celowo mikroskopijna.',
        source: 'Ekonomia behawioralna i framing wizualny'
      }
    }
  },
  {
    id: 'woda-alkaline',
    shortName: 'Woda pH 9.5',
    name: 'Woda „Alkaline Detox pH 9.5” (14,99 zł)',
    category: 'Pseudonauka i greenwashing',
    verdict: 'sciema',
    teaser: 'Designerska butelka za 14,99 zł obiecująca „odkwaszenie organizmu”, „usunięcie toksyn” i „100% przyjazność dla planety”. Płacisz za ten upgrade zwykłej wody?',
    verdictHeadlineSciema: 'Brawo! Zaoszczędziłeś 13 złotych na zwykłej wodzie.',
    verdictHeadlineKupuje: 'Uwaga – właśnie zapłaciłeś za czysty „science-washing”!',
    verdictSummary: 'Żołądek neutralizuje pH 9,5 w kilka sekund, a ogólne hasło „przyjazna planecie” bez dowodu łamie nowe unijne prawo przeciw greenwashingowi. Sprawdź 4 warstwy.',
    layers: {
      chemia: {
        x: 50, y: 44,
        title: 'Fizjologiczny mit „odkwaszania” i detoksu',
        text: 'Zdrowy organizm precyzyjnie utrzymuje pH krwi (7,35–7,45) dzięki płucom i nerkom. Woda o pH 9,5 natychmiast neutralizuje się w kwaśnym soku żołądkowym (pH ok. 1,5–2) – nie może „odkwasić ciała”, a toksyny usuwają wątroba i nerki.',
        source: 'Podstawy fizjologii człowieka; opinie EFSA'
      },
      prawo: {
        x: 50, y: 68,
        title: 'Unijny zakaz ogólnego greenwashingu',
        text: 'Nowa unijna dyrektywa anty-greenwashingowa zakazuje ogólnych, nieudowodnionych haseł typu „100% przyjazna planecie” oraz zakazuje stosowania własnych znaków ekologicznych bez niezależnej certyfikacji.',
        source: 'Dyrektywa (UE) 2024/825 ws. transformacji ekologicznej'
      },
      jakosc: {
        x: 74, y: 78,
        title: 'Własna eko-naklejka ≠ EU Ecolabel',
        text: 'Znaczek „Eko-Planet Approved” został zaprojektowany przez samego producenta i nie stoi za nim żaden audyt. Prawdziwe etykietowanie (np. EU Ecolabel) wymaga spełnienia publicznie weryfikowalnych norm.',
        source: 'System oznakowania EU Ecolabel / ISO 14024'
      },
      grafika: {
        x: 34, y: 30,
        title: 'Science-washing i iluzja premium',
        text: 'Minimalistyczny design w stylu „wellness” i laboratoryjnie brzmiąca liczba „pH 9.5” mają zbudować wrażenie naukowej technologii, usprawiedliwiając kilkukrotnie wyższą cenę butelki wody.',
        source: 'Analiza strategii science-washing w komunikacji marek'
      }
    }
  },
  {
    id: 'mus-owocowy',
    shortName: 'Mus E300/E440',
    name: 'Mus owocowy „Jabłko-Porzeczka” (z E300, E330, E440)',
    category: 'Test na chemofobię (Pułapka odwrócona!)',
    verdict: 'kupuje',
    teaser: 'Skromna saszetka bez haseł „fit/superfood”. Na froncie widać aż trzy symbole „E” (E440, E330, E300), a w rogu zielony znak Euroliścia z kodem PL-EKO-01. Wrzucasz do koszyka?',
    verdictHeadlineKupuje: 'Mistrzostwo! Nie dałeś się wystraszyć symbolom „E”!',
    verdictHeadlineSciema: 'Złapany na chemofobię! To jedyny w pełni rzetelny produkt w teście.',
    verdictSummary: 'To celowa „odwrócona pułapka”! Pod strasznymi symbolami kryją się witamina C, kwas cytrynowy i pektyny z jabłek, a znak w rogu to oficjalny certyfikat UE. Prześwietl szczegóły!',
    layers: {
      chemia: {
        x: 50, y: 56,
        title: '„Straszne” symbole E to zwykła witamina C i pektyny',
        text: 'Symbole „E” nie oznaczają trucizny, lecz dokładnie przebadane substancje. E300 to kwas askorbinowy (witamina C chroniąca owoce przed brązowieniem), E330 to kwas cytrynowy, a E440 to pektyny naturalnie występujące w jabłkach.',
        source: 'EFSA – unijny wykaz dodatków do żywności'
      },
      prawo: {
        x: 30, y: 40,
        title: 'Uczciwe i transparentne znakowanie',
        text: 'Producent rzetelnie podał skład w kolejności malejącej (99% przecierów owocowych), wskazał dokładną funkcję technologiczną każdego dodatku i zrezygnował z wprowadzających w błąd obietnic zdrowotnych.',
        source: 'Rozporządzenie (UE) nr 1169/2011; Rozporządzenie (WE) nr 1333/2008'
      },
      jakosc: {
        x: 72, y: 78,
        title: 'Prawdziwy, kontrolowany certyfikat UE',
        text: 'Zielony znak Euroliścia (z białych gwiazdek) wraz z kodem jednostki certyfikującej (PL-EKO-01) to jedyny oficjalny, prawnie chroniony certyfikat żywności ekologicznej w UE, podlegający regularnym kontrolom.',
        source: 'Rozporządzenie (UE) 2018/848 w sprawie produkcji ekologicznej'
      },
      grafika: {
        x: 50, y: 24,
        title: 'Brak manipulacji – uczciwa prostota',
        text: 'Brak krzykliwych haseł „100% bez chemii” i brak ukrytych gwiazdek. Ten przykład udowadnia, że skromna etykieta z symbolami E bywa o wiele bardziej rzetelna niż „zielone” opakowanie z pięknymi hasłami.',
        source: 'Zasady transparentnego projektowania informacji'
      }
    }
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

/* =========================================================================
   4. STAN APLIKACJI I BEZPIECZNY ZAPIS W localStorage
   ========================================================================= */
const STORAGE_KEY = 'etykieta_bez_sciemy_state_v1';

let appState = {
  activeTab: 'xray',
  currentProductIndex: 0,
  activeLayerKey: 'chemia',
  inspected: {}, // Mapa: productId -> { userVote: 'kupuje'|'sciema', visitedLayers: [] }
  bestQuizPct: null,
  bestQuizRank: null,
  forumFeedbacks: []
};

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
  appState.activeTab = tabId;
  document.querySelectorAll('.tab-view').forEach(section => section.classList.add('hidden'));

  const target = document.getElementById(`view-${tabId}`);
  if (target) target.classList.remove('hidden');

  document.querySelectorAll('.nav-tab').forEach(btn => {
    const isActive = btn.dataset.tab === tabId;
    btn.className = isActive
      ? 'nav-tab flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/80'
      : 'nav-tab flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap text-slate-600 hover:text-slate-900 hover:bg-white/60';
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateNavBadges() {
  const inspectedCount = Object.keys(appState.inspected).length;
  document.getElementById('nav-xray-badge').textContent = `${inspectedCount}/${PRODUCTS.length}`;
  document.getElementById('xray-progress-text').textContent = `${inspectedCount} z ${PRODUCTS.length}`;
  document.getElementById('xray-progress-bar').style.width = `${(inspectedCount / PRODUCTS.length) * 100}%`;

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
          Produkt ${idx + 1}
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
      badge.textContent = product.verdict === 'sciema' ? 'Trafna ocena · To była ŚCIEMA' : 'Trafna ocena · Produkt RZETELNY';
    } else {
      iconBox.className = 'w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 bg-rose-100 text-rose-700';
      iconBox.textContent = '💡';
      badge.className = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase tracking-wide mb-1 bg-rose-100 text-rose-800';
      badge.textContent = product.verdict === 'sciema' ? 'Pułapka zadziałała · To była ŚCIEMA' : 'Chemofobia zadziałała · Ten produkt jest OK!';
    }

    document.getElementById('verdict-headline').textContent =
      record.userVote === 'sciema' ? product.verdictHeadlineSciema : product.verdictHeadlineKupuje;
    document.getElementById('verdict-summary').textContent = product.verdictSummary;

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
   7. SILNIK MODUŁU 2: QUIZ „SPRAWDŹ SIĘ!”
   ========================================================================= */
let quizSession = {
  category: 'all',
  questions: [],
  currentIndex: 0,
  score: 0,
  answered: false,
  catStats: {}
};

function startQuiz(category) {
  const pool = category === 'all'
    ? [...QUESTIONS]
    : QUESTIONS.filter(q => q.category === category);

  quizSession = {
    category,
    questions: pool,
    currentIndex: 0,
    score: 0,
    answered: false,
    catStats: {}
  };

  document.getElementById('quiz-intro').classList.add('hidden');
  document.getElementById('quiz-summary').classList.add('hidden');
  document.getElementById('quiz-active').classList.remove('hidden');

  renderQuizQuestion();
}

function renderQuizQuestion() {
  const q = quizSession.questions[quizSession.currentIndex];
  const total = quizSession.questions.length;
  quizSession.answered = false;

  document.getElementById('quiz-cat-pill').textContent = CATEGORY_LABELS[q.category];
  document.getElementById('quiz-type-pill').textContent = q.type;
  document.getElementById('quiz-counter').textContent = `Pytanie ${quizSession.currentIndex + 1} z ${total}`;
  document.getElementById('quiz-live-score').textContent = `Punkty: ${quizSession.score}`;
  document.getElementById('quiz-progress-bar').style.width = `${((quizSession.currentIndex + 1) / total) * 100}%`;
  document.getElementById('quiz-question-text').textContent = q.question;

  const feedbackBox = document.getElementById('quiz-feedback-box');
  const nextBtn = document.getElementById('quiz-next-btn');
  feedbackBox.classList.add('hidden');
  nextBtn.classList.add('hidden');
  nextBtn.textContent = quizSession.currentIndex === total - 1 ? 'Zobacz swój wynik →' : 'Następne pytanie →';

  const optionsContainer = document.getElementById('quiz-options-container');
  optionsContainer.innerHTML = '';

  const letters = ['A', 'B', 'C', 'D'];
  q.options.forEach((optText, idx) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'quiz-opt-btn w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-slate-200 bg-white hover:border-indigo-400 hover:bg-indigo-50/40 text-left transition-all';
    btn.innerHTML = `
      <span class="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 font-extrabold text-sm flex items-center justify-center shrink-0">${letters[idx]}</span>
      <span class="text-sm sm:text-base font-semibold text-slate-800">${optText}</span>
    `;
    btn.addEventListener('click', () => handleQuizAnswer(idx));
    optionsContainer.appendChild(btn);
  });
}

function handleQuizAnswer(selectedIndex) {
  if (quizSession.answered) return;
  quizSession.answered = true;

  const q = quizSession.questions[quizSession.currentIndex];
  const isCorrect = selectedIndex === q.correctIndex;

  if (!quizSession.catStats[q.category]) {
    quizSession.catStats[q.category] = { ok: 0, total: 0 };
  }
  quizSession.catStats[q.category].total += 1;
  if (isCorrect) {
    quizSession.score += 1;
    quizSession.catStats[q.category].ok += 1;
  }

  document.getElementById('quiz-live-score').textContent = `Punkty: ${quizSession.score}`;

  const buttons = document.querySelectorAll('.quiz-opt-btn');
  buttons.forEach((btn, idx) => {
    btn.disabled = true;
    btn.classList.remove('hover:border-indigo-400', 'hover:bg-indigo-50/40');
    if (idx === q.correctIndex) {
      btn.className = 'quiz-opt-btn w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-emerald-500 bg-emerald-50 text-left transition-all';
      btn.querySelector('span:first-child').className = 'w-9 h-9 rounded-xl bg-emerald-600 text-white font-extrabold text-sm flex items-center justify-center shrink-0';
    } else if (idx === selectedIndex && !isCorrect) {
      btn.className = 'quiz-opt-btn w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-rose-500 bg-rose-50 text-left transition-all';
      btn.querySelector('span:first-child').className = 'w-9 h-9 rounded-xl bg-rose-600 text-white font-extrabold text-sm flex items-center justify-center shrink-0';
    } else {
      btn.className = 'quiz-opt-btn w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-slate-100 bg-slate-50/70 opacity-60 text-left';
    }
  });

  const feedbackBox = document.getElementById('quiz-feedback-box');
  feedbackBox.classList.remove('hidden');

  if (isCorrect) {
    feedbackBox.className = 'mt-6 rounded-2xl p-5 border-2 bg-emerald-50/70 border-emerald-300 animate-fade-in';
    document.getElementById('quiz-feedback-icon').textContent = '✅';
    document.getElementById('quiz-feedback-title').textContent = 'Dobrze! Nie dałeś się nabrać.';
    document.getElementById('quiz-feedback-title').className = 'text-base font-extrabold text-emerald-900';
  } else {
    feedbackBox.className = 'mt-6 rounded-2xl p-5 border-2 bg-rose-50/70 border-rose-300 animate-fade-in';
    document.getElementById('quiz-feedback-icon').textContent = '❌';
    document.getElementById('quiz-feedback-title').textContent = 'To popularny mit! Zobacz, jak jest naprawdę:';
    document.getElementById('quiz-feedback-title').className = 'text-base font-extrabold text-rose-900';
  }

  document.getElementById('quiz-feedback-text').textContent = q.explanation;
  document.getElementById('quiz-feedback-source').textContent = q.source;
  document.getElementById('quiz-next-btn').classList.remove('hidden');
}

function showQuizSummary() {
  document.getElementById('quiz-active').classList.add('hidden');
  document.getElementById('quiz-summary').classList.remove('hidden');

  const total = quizSession.questions.length;
  const pct = Math.round((quizSession.score / total) * 100);

  let rank = '';
  let emoji = '';
  let msg = '';
  let badgeCls = '';

  if (pct >= 76) {
    rank = 'Łowca Mitów (Poziom Ekspert)';
    emoji = '🏆';
    badgeCls = 'bg-emerald-100 text-emerald-900 border border-emerald-300';
    msg = 'Marketingowcy mają z Tobą naprawdę ciężko! Potrafisz czytać składy, znasz różnicę między suplementem a lekiem i nie ulegasz chemofobii.';
  } else if (pct >= 45) {
    rank = 'Czujny Konsument';
    emoji = '🔎';
    badgeCls = 'bg-amber-100 text-amber-900 border border-amber-300';
    msg = 'Masz solidne podstawy, ale kilka sprytnych haczyków nadal potrafi uśpić Twoją czujność. Pobierz Ściągawkę 30 s, aby domknąć luki!';
  } else {
    rank = 'Ofiara Zielonego Listka';
    emoji = '🌿';
    badgeCls = 'bg-rose-100 text-rose-900 border border-rose-300';
    msg = 'Spokojnie – właśnie dlatego powstała ta aplikacja! Przejdź jeszcze raz Rentgen Etykiety i zapisz w telefonie Test 3 Pytań przy półce.';
  }

  if (appState.bestQuizPct === null || pct >= appState.bestQuizPct) {
    appState.bestQuizPct = pct;
    appState.bestQuizRank = rank;
    saveState();
    updateNavBadges();
  }

  document.getElementById('summary-emoji').textContent = emoji;
  document.getElementById('summary-score-big').textContent = `${quizSession.score} / ${total} (${pct}%)`;

  const badge = document.getElementById('summary-rank-badge');
  badge.textContent = rank;
  badge.className = `inline-flex items-center px-4 py-1.5 rounded-full text-sm font-extrabold mt-3 ${badgeCls}`;
  document.getElementById('summary-message').textContent = msg;

  const breakdown = document.getElementById('summary-breakdown');
  breakdown.innerHTML = '';
  Object.entries(quizSession.catStats).forEach(([catKey, stat]) => {
    const card = document.createElement('div');
    card.className = 'p-4 rounded-2xl bg-slate-50 border border-slate-200';
    card.innerHTML = `
      <div class="text-xs font-bold text-slate-500">${CATEGORY_LABELS[catKey]}</div>
      <div class="text-xl font-black text-slate-900 mt-1">${stat.ok} / ${stat.total}</div>
    `;
    breakdown.appendChild(card);
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
    appState.activeLayerKey = 'chemia';
    saveState();
    closeResetModal();
    renderXrayView();
    showToast('Postęp został zresetowany.');
  });

  // Pierwsze renderowanie widoków
  renderXrayView();
  renderSavedFeedbacks();
  switchTab('xray');
});