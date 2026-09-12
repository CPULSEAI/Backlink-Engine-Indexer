// ELI10 (Explain Like I'm 10) In-App User Manual Data
// Rules:
// 1. Short sentences, no unexplained jargon.
// 2. Acronyms explained in plain English on first use.
// 3. Every feature gets: What it is (1 sentence), What it does (1 sentence), 2-4 numbered click-by-click steps.
// 4. Real-life analogies for anything abstract.
// 5. Honest notes for simulated or fallback features.

export interface Eli10FeatureItem {
  id: string;
  name: string;
  category: string;
  location: string;
  analogy: string;
  whatItIs: string;
  whatItDoes: string;
  steps: string[];
  statusNote?: string;
  keywords: string[];
}

export interface Eli10TroubleshootingItem {
  ifYouSee: string;
  itMeans: string;
  heresWhatToClick: string;
  keywords: string[];
}

export interface Eli10GlossaryItem {
  term: string;
  plainEnglish: string;
  analogy: string;
}

export const ELI10_GLOSSARY: Eli10GlossaryItem[] = [
  {
    term: 'URL (Uniform Resource Locator)',
    plainEnglish: 'The exact web address you type into your browser to visit a webpage, like https://careerpulseai.net.',
    analogy: 'Like the street address and house number written on an envelope so the mail carrier knows where to deliver your letter.'
  },
  {
    term: 'SEO (Search Engine Optimization)',
    plainEnglish: 'The practice of making your website easy for search engines like Google to find, understand, and show to people.',
    analogy: 'Like putting a bright, clear sign above your shop door so shoppers walking down the street can easily find you.'
  },
  {
    term: 'GEO (Generative Engine Optimization)',
    plainEnglish: 'Making your website easy for AI chatbots (like ChatGPT, Perplexity, and Google Gemini) to read, summarize, and quote.',
    analogy: 'Like writing your recipe clearly in a cookbook so a helpful robot chef can easily read your recipe out loud to someone who asks for it.'
  },
  {
    term: 'API (Application Programming Interface)',
    plainEnglish: 'A bridge that lets two computer programs talk to each other and pass information back and forth automatically.',
    analogy: 'Like a friendly restaurant waiter who takes your order from your table to the kitchen and brings back your meal.'
  },
  {
    term: 'Backlink',
    plainEnglish: 'A clickable link on someone else’s website that points visitors directly to your website.',
    analogy: 'Like a trusted friend telling everyone in town, "Hey, you should definitely check out my friend’s amazing bookstore!"'
  },
  {
    term: 'Indexing',
    plainEnglish: 'When Google or another search engine adds your webpage into its giant catalog so people can find it when they search.',
    analogy: 'Like a librarian writing down your new book in the library’s big card catalog so readers can borrow it.'
  },
  {
    term: 'IndexNow Protocol',
    plainEnglish: 'A fast alert system that tells search engines like Bing and Yandex the moment you publish or change a webpage.',
    analogy: 'Like sending a group text message to search engines saying, "Hey, I just wrote a new page, come take a look!"'
  },
  {
    term: 'HTTP Status Code (200, 404, 429, 500)',
    plainEnglish: 'A 3-digit number a web server sends back to say if a request worked or had a problem.',
    analogy: 'Like a thumbs up (200 = OK), a shrug (404 = Page Not Found), a stop sign (429 = Slow down, too fast), or a broken machine warning (500 = Server error).'
  },
  {
    term: 'JSON-LD / Schema Markup',
    plainEnglish: 'A snippet of computer code you put on your website that labels your information (like your business name, questions, and answers).',
    analogy: 'Like putting sticky name tags on all the toys in a toy box so anyone cleaning up knows exactly what each toy is.'
  },
  {
    term: 'Cron / Scheduler',
    plainEnglish: 'A timer program that runs tasks automatically at set times without you having to be at your computer.',
    analogy: 'Like setting an automatic alarm clock that feeds the goldfish every morning at 8:00 AM.'
  },
  {
    term: 'Proxy',
    plainEnglish: 'A computer in the middle that delivers your web requests so websites do not block your own computer for asking too many questions.',
    analogy: 'Like asking your friend to raise their hand in class to ask the teacher a question on your behalf.'
  },
  {
    term: 'WebSocket',
    plainEnglish: 'A continuous, live phone call between your web browser and the server so updates appear on your screen instantly.',
    analogy: 'Like keeping a walkie-talkie turned on so you hear your friend speaking the exact millisecond they talk.'
  },
  {
    term: 'CRO (Conversion Rate Optimization)',
    plainEnglish: 'Designing your website so more visitors click your buttons, sign up, or buy what you offer.',
    analogy: 'Like rearranging the items in a bakery so customers immediately see the warm cookies and decide to buy one.'
  },
  {
    term: 'SQLite WAL (Write-Ahead Logging)',
    plainEnglish: 'A super fast and reliable digital notebook stored on the server that saves all your campaign records safely.',
    analogy: 'Like writing down every score in a durable spiral notebook with indelible ink so no memories are ever lost.'
  },
  {
    term: 'Google Cloud Storage (GCS)',
    plainEnglish: 'A secure cloud vault on Google’s servers where backup copies of your database are stored safely.',
    analogy: 'Like taking a photo of your favorite Lego creation and putting it in a fireproof safety deposit box.'
  },
  {
    term: 'Stripe',
    plainEnglish: 'A secure online payment service that handles credit cards and subscription billing.',
    analogy: 'Like a cash register with a card reader at a checkout counter.'
  },
  {
    term: 'Revenue Asset',
    plainEnglish: 'A webpage directly tied to earning revenue, such as a product checkout page, storefront, or interactive calculator.',
    analogy: 'Like placing the best-selling toy right in the front display window of your toy shop so people buy it immediately.'
  },
  {
    term: 'Content Drift',
    plainEnglish: 'When information on a webpage becomes outdated over time, like stale copyright dates, expired prices, or outdated answers.',
    analogy: 'Like milk in the refrigerator that has passed its expiration date and needs to be replaced with a fresh carton.'
  },
  {
    term: 'Answer-First Architecture',
    plainEnglish: 'Writing a direct 30-to-50 word answer right beneath a heading so AI chatbots like Perplexity and ChatGPT can quote you word-for-word.',
    analogy: 'Like answering a question on a test with the exact, clear answer right on the first line before adding extra details.'
  }
];

export const ELI10_FEATURES: Eli10FeatureItem[] = [
  // 1. Site Authorization & Security
  {
    id: 'auth-gatekeeper',
    name: 'Site Authorization Gatekeeper Screen',
    category: 'Security & Access',
    location: 'Initial App Screen (when locked)',
    analogy: 'Like a security door with a keypad outside a clubhouse.',
    whatItIs: 'This is the lock screen that protects the indexing engine so only authorized people can use it.',
    whatItDoes: 'It checks your email and password or special access key before opening the application.',
    steps: [
      '1. Type your email (or use admin@careerpulseai.net) and password (admin123) into the boxes.',
      '2. Or click the "Access Key" tab and enter your master key (SEO-ACCESS-2026).',
      '3. Click the dark "Sign In to Indexer Pro" button to unlock the dashboard.'
    ],
    statusNote: 'Fully working local session gatekeeper with encrypted tokens saved in your browser storage.',
    keywords: ['login', 'password', 'sign in', 'lock', 'gatekeeper', 'auth', 'access key']
  },
  {
    id: 'auth-account-center',
    name: 'Enterprise Auth & RBAC Center',
    category: 'Security & Access',
    location: 'Sidebar -> System & Security -> Account & Security (or Header tab "Auth & RBAC")',
    analogy: 'Like a club membership desk showing your photo ID card and permission badge.',
    whatItIs: 'This is the account profile and permissions screen for your team.',
    whatItDoes: 'It displays who is logged in, shows what features your role is allowed to touch, and lets you copy or revoke API keys.',
    steps: [
      '1. Click "Auth & RBAC" in the header or sidebar to open the account page.',
      '2. Review your active role (such as Admin, Agency, or Viewer) and session expiration clock.',
      '3. Click "Generate New API Key" if you want to connect external software to this engine.',
      '4. Click "Lock Site Authorization" when you want to sign out.'
    ],
    statusNote: 'Fully functional session viewer with local role simulation and API token manager.',
    keywords: ['account', 'profile', 'rbac', 'permissions', 'api key', 'sign out', 'logout']
  },

  // 2. Top Header Controls
  {
    id: 'header-quick-switcher',
    name: 'Header Quick View Switcher Tabs',
    category: 'Navigation',
    location: 'Top bar of the screen',
    analogy: 'Like the channel buttons on a TV remote control.',
    whatItIs: 'This is a row of shortcut buttons in the top header.',
    whatItDoes: 'It lets you switch between the Bento Dashboard, Wizards Hub, Submission Engine, Reports, Live Ops, Diagnostics, and Account views in one click.',
    steps: [
      '1. Look at the top center of the screen in your browser.',
      '2. Click any tab name, such as "Dashboard", "Wizards Hub", or "Live Ops".',
      '3. The main screen instantly changes to that workspace.'
    ],
    statusNote: 'Fully functional instant screen switcher.',
    keywords: ['header', 'tabs', 'view switcher', 'navigation', 'bento', 'wizards hub']
  },
  {
    id: 'header-ws-indicator',
    name: 'WebSocket Live Connection Indicator',
    category: 'System Telemetry',
    location: 'Top bar -> Right side',
    analogy: 'Like a little green light on a walkie-talkie showing the radio channel is open.',
    whatItIs: 'This is a small badge that shows whether your browser is connected to the server’s live feed.',
    whatItDoes: 'It tells you if real-time indexing logs and progress bars will stream to your screen automatically.',
    steps: [
      '1. Look at the top right of the header.',
      '2. If you see "WS_200_OK" with a green pulsing dot, your live feed is healthy.',
      '3. If you see "WS_SYNC...", the system is reconnecting in the background.'
    ],
    statusNote: 'Real-time WebSocket handshake with automatic reconnect timer.',
    keywords: ['websocket', 'ws', 'connection', 'status', 'online', 'telemetry']
  },
  {
    id: 'header-cron-indicator',
    name: 'Server-Side Cron Status Button',
    category: 'Automation',
    location: 'Top bar -> Right side',
    analogy: 'Like a pocket watch on your desk telling you when the next scheduled alarm will ring.',
    whatItIs: 'This is a button showing if the automated background timer is running.',
    whatItDoes: 'It checks the server to see how many scheduled jobs are waiting to run and opens the scheduler when clicked.',
    steps: [
      '1. Click the "CRON_ACTIVE" button in the top header.',
      '2. The Smart Batch Scheduler modal will open so you can see your scheduled drip queues.'
    ],
    statusNote: 'Connects to /api/cron/status to monitor server timers.',
    keywords: ['cron', 'scheduler', 'timer', 'alarm', 'clock', 'background']
  },
  {
    id: 'header-workspace-save-resume',
    name: 'Quick Save & Resume Workspace Buttons',
    category: 'Data Management',
    location: 'Top bar -> Right side buttons: "SAVE" and "RESUME"',
    analogy: 'Like saving your video game progress to a memory card and loading it back up later.',
    whatItIs: 'These are two buttons for backing up your current campaign data to your computer as a file.',
    whatItDoes: 'Clicking SAVE downloads your history, logs, and settings as a JSON file, and clicking RESUME lets you upload that file back.',
    steps: [
      '1. Click "SAVE" to download a backup file named indexing-workspace-state.json to your computer.',
      '2. On another computer or day, click "RESUME" and choose that file to restore your work.'
    ],
    statusNote: 'Fully working browser JSON export and import utility.',
    keywords: ['save', 'resume', 'backup', 'export', 'import', 'workspace', 'json']
  },
  {
    id: 'header-menu-dropdown',
    name: 'Master Navigation & Tools Menu Dropdown',
    category: 'Navigation',
    location: 'Top bar -> Right side "[ MENU ]" button',
    analogy: 'Like a Swiss Army knife where you pull out any tool you need.',
    whatItIs: 'This is a drop-down menu that holds links to every tool in the application.',
    whatItDoes: 'It lets you launch any wizard, open your history drawer, view directories, check settings, or sign out from anywhere in the app.',
    steps: [
      '1. Click the "[ MENU ]" button in the top right of the header.',
      '2. Choose any tool from the 3 organized sections: AI Intelligence, Workspace & History, or Configuration.',
      '3. Click the tool you want or press the ESC key to close the menu.'
    ],
    statusNote: 'Fully functional dropdown with keyboard escape listener and click-outside dismissal.',
    keywords: ['menu', 'dropdown', 'tools hub', 'shortcuts', 'navigation']
  },

  // 3. Sidebar Navigation Controls
  {
    id: 'sidebar-collapse-toggle',
    name: 'Sidebar Expand / Collapse Toggle',
    category: 'Navigation',
    location: 'Left sidebar header',
    analogy: 'Like folding a road map so it takes up less space on your desk.',
    whatItIs: 'This is a small arrow button at the top of the left navigation bar.',
    whatItDoes: 'It shrinks the sidebar into slim icon mode to give you more room for charts, or expands it back to show full labels.',
    steps: [
      '1. Click the arrow button (< or >) next to the logo in the sidebar.',
      '2. On mobile phones, swipe left anywhere on the sidebar to slide it closed.'
    ],
    statusNote: 'Supports desktop width toggling and mobile touch swipe gestures.',
    keywords: ['sidebar', 'collapse', 'expand', 'mobile', 'swipe']
  },
  {
    id: 'sidebar-categories',
    name: 'Sidebar Accordion Categories',
    category: 'Navigation',
    location: 'Left sidebar navigation list',
    analogy: 'Like folder tabs in a filing cabinet.',
    whatItIs: 'These are the collapsible section headers inside the left sidebar.',
    whatItDoes: 'They group related features into 6 tidy drawers: Views, Wizards, Engines, Audits, Network, and System.',
    steps: [
      '1. Click on any category title (like "CORE ENGINES" or "AUDITS & INTEL").',
      '2. The drawer unfolds to reveal all the buttons inside that category.',
      '3. Click the button of the screen or wizard you want to open.'
    ],
    statusNote: 'Fully functional accordion menu with independent open/close memory.',
    keywords: ['sidebar', 'categories', 'accordion', 'views', 'engines', 'audits']
  },

  // 4. Bento Dashboard Modules
  {
    id: 'bento-executive-summary',
    name: 'Executive Platform & Indexing Health Digest',
    category: 'Dashboard & Intelligence',
    location: 'Bento Dashboard -> Top Card',
    analogy: 'Like a morning report card from a teacher showing your grades and what homework to do next.',
    whatItIs: 'This is a high-level summary card that translates all technical data into plain English.',
    whatItDoes: 'It shows your overall score (0-100), explains what happened today, lists discoveries, warns of any risks, and gives 3 simple action steps.',
    steps: [
      '1. Read the big score badge and the "What Happened" paragraph.',
      '2. Look at the sparkline graphs to see your Google Indexing rate and HTTP verification success.',
      '3. Click any of the 3 numbered next-step buttons at the bottom to jump straight into action.'
    ],
    statusNote: 'Real-time calculation derived from your live database logs and API health diagnostics.',
    keywords: ['digest', 'summary', 'health', 'scorecard', 'executive', 'bento', 'telemetry']
  },
  {
    id: 'bento-conversion-banner',
    name: 'ConversionWizard CRO Banner',
    category: 'Wizards & Growth',
    location: 'Bento Dashboard -> Below Executive Summary',
    analogy: 'Like a fast-lane kiosk at an airport check-in counter.',
    whatItIs: 'This is a quick-access orange banner for auditing website conversion rates.',
    whatItDoes: 'It lets you type in any website address and immediately launch an AI review of that page’s sales pitch and buttons.',
    steps: [
      '1. Type a website address (like https://yourwebsite.com) into the input box.',
      '2. Click the black "Audit Conversion Rate" button.',
      '3. The ConversionWizard modal will pop up with suggestions to improve your sign-ups.'
    ],
    statusNote: 'Uses heuristic heuristics and Google Gemini AI if configured.',
    keywords: ['cro', 'conversion', 'banner', 'audit', 'quick launch']
  },
  {
    id: 'bento-url-input-form',
    name: 'URL Input Form & Directory Selector',
    category: 'Core Indexing',
    location: 'Bento Dashboard -> Main Submission Card (Module A)',
    analogy: 'Like filling out an order form at a printing press before starting the printing run.',
    whatItIs: 'This is the control panel where you enter website links and choose where to send them.',
    whatItDoes: 'It takes your URLs, lets you pick which directory networks to notify, lets you toggle Google Indexing and IndexNow, and starts the submission.',
    steps: [
      '1. Choose "Single URL" to enter one address, "Bulk URLs" to paste a list, or "File Upload" to upload a CSV file.',
      '2. Check the boxes for features you want (like "Google Indexing API", "Generate Backlinks", and "Check Live 200").',
      '3. Check or uncheck directory networks in the list.',
      '4. Click the big orange "START INDEXING CAMPAIGN" button to begin!'
    ],
    statusNote: 'Full submission pipeline that submits to SQLite queue and triggers automated dispatch workers.',
    keywords: ['submission', 'url input', 'bulk', 'csv upload', 'directories', 'start campaign', 'features']
  },
  {
    id: 'bento-progress-bar',
    name: 'Live Job Progress Bar',
    category: 'Core Indexing',
    location: 'Bento Dashboard -> Directly beneath URL Input Form',
    analogy: 'Like the loading bar on a video game when installing a new level.',
    whatItIs: 'This is an animated meter that shows how much of your submission job is finished.',
    whatItDoes: 'It shows the percentage completed, how many links were verified live (HTTP 200), how many were pushed to Google, and provides a red Cancel button.',
    steps: [
      '1. Start any submission job.',
      '2. Watch the progress bar fill from 0% to 100% in real time.',
      '3. If you need to stop early, click the red "Cancel Job" button.'
    ],
    statusNote: 'Updates in real-time via WebSocket broadcast events.',
    keywords: ['progress', 'progress bar', 'tasks', 'percentage', 'cancel job']
  },
  {
    id: 'bento-keyword-radar',
    name: '3-Way Competitor Keyword Gap Radar',
    category: 'Audits & Intel',
    location: 'Bento Dashboard -> Middle section',
    analogy: 'Like a spiderweb chart showing who is taller, faster, and stronger in a friendly game.',
    whatItIs: 'This is a visual radar chart that compares your website against two competitor websites.',
    whatItDoes: 'It reveals which search topics your competitors are winning and highlights keyword gaps where you should write new content.',
    steps: [
      '1. Type your domain name and two competitor domains into the three input fields.',
      '2. Click "Recalculate Radar Data" to update the spiderweb chart.',
      '3. Click "Grade Content" to inspect a specific page, or click "Launch Outreach Strategy" to plan backlinks.'
    ],
    statusNote: 'Evaluates content intent clusters using algorithmic topic matching and domain authority metrics.',
    keywords: ['keyword', 'radar', 'gap', 'competitors', 'spiderweb', 'chart']
  },
  {
    id: 'bento-batch-scheduler',
    name: 'Smart Batch Scheduler Card',
    category: 'Automation',
    location: 'Bento Dashboard -> Middle section',
    analogy: 'Like an automatic garden sprinkler that turns on at 6 AM every Tuesday and Thursday.',
    whatItIs: 'This is a drip-feed scheduling tool that paces your submissions over time.',
    whatItDoes: 'Instead of submitting 500 links all at once, it breaks them into small batches (like 10 links every 2 hours) so search engines see natural growth.',
    steps: [
      '1. Drag the slider to set your batch size (for example, 10 URLs per batch).',
      '2. Choose your delay interval (like every 60 minutes).',
      '3. Click "Save & Activate Drip Schedule".',
      '4. View your active timers in the table below, where you can pause or delete them anytime.'
    ],
    statusNote: 'Stored in persistent database and executed by background timers.',
    keywords: ['scheduler', 'drip', 'queue', 'cron', 'batch', 'intervals']
  },
  {
    id: 'bento-funnel-timeline',
    name: 'Visual SEO Lifecycle Funnel Timeline',
    category: 'Core Indexing',
    location: 'Bento Dashboard -> Middle section',
    analogy: 'Like a factory conveyor belt showing an item moving from assembly to packaging to shipping.',
    whatItIs: 'This is a 5-step visual pipeline tracker.',
    whatItDoes: 'It lights up each step of a URL’s journey: 1. In Queue -> 2. Dispatched -> 3. HTTP Handshake -> 4. Live Verification -> 5. Search Engine Indexed.',
    steps: [
      '1. Run a submission job.',
      '2. Look at the 5 numbered circles on the timeline to see which phase your campaign is currently in.'
    ],
    statusNote: 'Reflects real-time batch lifecycle status.',
    keywords: ['funnel', 'timeline', 'lifecycle', 'stages', 'pipeline']
  },
  {
    id: 'bento-daily-digest',
    name: 'Daily Performance Digest (24-Hour Success Trend)',
    category: 'Analytics',
    location: 'Bento Dashboard -> Lower section',
    analogy: 'Like a fitness tracker showing how many steps you walked each hour today.',
    whatItIs: 'This is a bar chart showing your hourly submission volume and success rates over the past 24 hours.',
    whatItDoes: 'It helps you spot if any specific hour had higher network errors or slower response times.',
    steps: [
      '1. Hover your mouse over any bar to see how many URLs were submitted during that hour.',
      '2. Click "Refresh Logs" to query the latest numbers from the database.'
    ],
    statusNote: 'Aggregated directly from SQLite history logs.',
    keywords: ['digest', '24-hour', 'chart', 'trend', 'hourly', 'performance']
  },
  {
    id: 'bento-analytics-card',
    name: '30-Day Submissions Success/Failure Ratio & AI Citation Monitor',
    category: 'Analytics',
    location: 'Bento Dashboard -> Lower section',
    analogy: 'Like a monthly bank statement showing your deposits and withdrawals over 30 days.',
    whatItIs: 'This is a monthly trend chart with tabs for different performance metrics.',
    whatItDoes: 'It graphs total submission volume, success vs. failure percentages, average response latency in milliseconds, and estimated AI citation scores.',
    steps: [
      '1. Click on any metric tab (like "Success Rate %" or "AI Citation Score").',
      '2. The line chart updates to show that specific measurement across the past 30 days.',
      '3. Click "Open Content Grader" to test your on-page text for AI citation quality.'
    ],
    statusNote: 'Generates historical curves from stored batch records.',
    keywords: ['analytics', '30-day', 'charts', 'success rate', 'citation score']
  },
  {
    id: 'bento-peer-network-card',
    name: 'Peer Network Status Card',
    category: 'Network & Health',
    location: 'Bento Dashboard -> Lower section',
    analogy: 'Like checking the signal bars on your cell phone to make sure you have good coverage.',
    whatItIs: 'This is a telemetry card displaying the health of the partner backlink network.',
    whatItDoes: 'It displays active directory partner nodes, consensus handshake speed, and synchronization state.',
    steps: [
      '1. Check that the status shows "NETWORK SYNCHRONIZED".',
      '2. Observe the active peer node count to ensure directory endpoints are responsive.'
    ],
    statusNote: 'Monitors endpoint availability across the built-in directory collection.',
    keywords: ['peer network', 'telemetry', 'nodes', 'health', 'sync']
  },
  {
    id: 'bento-results-table',
    name: 'Real-time Results Stream & Verification Table',
    category: 'Core Indexing',
    location: 'Bento Dashboard -> Bottom card (and on Submissions View)',
    analogy: 'Like an airport flight arrivals board showing every plane, its flight number, and whether it landed on time.',
    whatItIs: 'This is the detailed log table showing every single URL submitted in your current job.',
    whatItDoes: 'It shows the target URL, directory name, HTTP status code (like 200 OK), Google Indexing status, latency, and live link verification.',
    steps: [
      '1. Use the search box above the table to search for any URL or directory.',
      '2. Click on the status dropdown to filter by "Success", "Failed", or "Pending".',
      '3. Click the black "EXPORT CSV" button to download this entire table into an Excel-compatible spreadsheet.'
    ],
    statusNote: 'Real-time log table with pagination and instant CSV export.',
    keywords: ['results table', 'logs', 'csv export', 'stream', 'http status', 'verification']
  },

  // 5. Dedicated Views
  {
    id: 'view-submissions-engine',
    name: 'Dedicated Multi-Site Submission Engine View',
    category: 'Core Indexing',
    location: 'Sidebar -> CORE ENGINES -> SUBMISSION ENGINE (or Header "Engine")',
    analogy: 'Like a dedicated cockpit with all your flight instruments spread out across large screens.',
    whatItIs: 'This is a full-page workspace dedicated entirely to setting up and running large URL campaigns.',
    whatItDoes: 'It combines the submission form, directory checkboxes, concurrency speed slider, live progress bar, and results table in one focused screen.',
    steps: [
      '1. Click "SUBMISSION ENGINE" in the sidebar or "Engine" in the header.',
      '2. Enter your URLs and configure your engine toggles.',
      '3. Slide the Concurrency slider to set how many URLs to process at once (default is 4).',
      '4. Click "START INDEXING CAMPAIGN" and watch the live stream table fill up.'
    ],
    statusNote: 'Full-featured dedicated submission interface.',
    keywords: ['submission engine', 'concurrency', 'batch', 'multi-site', 'workbench']
  },
  {
    id: 'view-traffic-engine',
    name: 'Traffic & SERP CTR Generation Engine View',
    category: 'Wizards & Growth',
    location: 'Sidebar -> CORE ENGINES -> TRAFFIC & SERP CTR',
    analogy: 'Like a flight simulator that tests how an airplane handles different wind conditions without leaving the ground.',
    whatItIs: 'This is a simulation dashboard for testing organic search click patterns and referral traffic.',
    whatItDoes: 'It lets you set up test campaigns with target URLs, search keywords, simulated visitor counts, click-through rates (CTR), and bounce rate controls.',
    steps: [
      '1. Enter your target website address and the keywords people might search for.',
      '2. Drag the slider to choose how many simulated visitors to test per day.',
      '3. Select your target country (like United States or Global).',
      '4. Click "Start Traffic Campaign" to initiate the simulation test.'
    ],
    statusNote: 'PLEASE NOTE: This engine runs simulated browser sessions for testing analytics reception and bounce-rate tracking. It does not generate real human buyers.',
    keywords: ['traffic engine', 'serp ctr', 'simulation', 'visitors', 'bounce rate', 'keywords']
  },
  {
    id: 'view-bulk-seo-validator',
    name: 'Bulk SEO URL Validator View',
    category: 'Audits & Intel',
    location: 'Sidebar -> CORE ENGINES -> BULK SEO VALIDATOR',
    analogy: 'Like a school teacher with a red pen checking 50 essays at once for spelling, title, and structure mistakes.',
    whatItIs: 'This is a bulk testing tool that inspects up to 50 or more web addresses at the exact same time.',
    whatItDoes: 'It crawls each URL and tells you if the page loads (200 OK), if it has a title tag, if the meta description is missing, and if canonical tags match.',
    steps: [
      '1. Paste your list of URLs (one per line) into the big text box.',
      '2. Click the green "Run 50+ Parallel SEO Scan" button.',
      '3. Review the scorecard showing total scanned, passed, warnings, and errors.',
      '4. Click "Send Passed URLs to Indexing Queue" to immediately submit the clean URLs!'
    ],
    statusNote: 'Performs multi-threaded parallel page fetches through the server crawler.',
    keywords: ['bulk seo', 'validator', 'scanner', 'canonical', 'meta tags', 'titles', '50+']
  },
  {
    id: 'view-backlink-counter',
    name: 'Bulk Backlink & Referring Domain Counter View',
    category: 'Audits & Intel',
    location: 'Sidebar -> CORE ENGINES -> BACKLINK COUNTER',
    analogy: 'Like counting how many people in town recommend each restaurant on your list.',
    whatItIs: 'This is a domain intelligence tool that checks how many total backlinks and unique websites point to multiple domains.',
    whatItDoes: 'It takes a list of domains, looks up their backlink counts and referring domain counts, and grades their toxicity risk score.',
    steps: [
      '1. Paste up to 20 domains into the text box (for example: google.com, github.com).',
      '2. Click "Count Backlinks & Domains".',
      '3. Review the table showing Total Backlinks, Referring Domains, and Follow vs NoFollow ratio.',
      '4. Click "Audit Domain" on any row to open the full SEO Domain Profiler for that site.'
    ],
    statusNote: 'Queries live DataForSEO API if credentials are provided in settings; otherwise uses offline heuristic estimation.',
    keywords: ['backlink counter', 'referring domains', 'dofollow', 'toxicity', 'dataforseo']
  },
  {
    id: 'view-reports-export-center',
    name: 'Executive Plain-English Reports & Exports View',
    category: 'Reports & Exports',
    location: 'Sidebar -> WIZARDS & GROWTH -> EXECUTIVE REPORTS (or Header "Reports")',
    analogy: 'Like the principal’s office printing official report cards to give to parents.',
    whatItIs: 'This is the reporting library where all your past campaign results are organized.',
    whatItDoes: 'It shows plain-English summaries of every historical job, provides CSV spreadsheet downloads, and lets you open the PDF generator.',
    steps: [
      '1. Click "Executive Reports" in the sidebar or "Reports" in the header.',
      '2. Scroll through your past campaign batches.',
      '3. Click "Export CSV" on any batch to save its data to your computer.',
      '4. Click "Launch Whitelabel PDF Generator" to create a branded PDF document.'
    ],
    statusNote: 'Reads saved campaign history from persistent SQLite storage.',
    keywords: ['reports', 'executive', 'csv', 'export center', 'history']
  },
  {
    id: 'view-live-operations',
    name: 'Live Operations & Sitemap Observer Stream View',
    category: 'System Telemetry',
    location: 'Sidebar -> NETWORK & HEALTH -> LIVE OPERATIONS (or Header "Live Ops")',
    analogy: 'Like mission control at NASA watching rocket telemetry streaming onto big screens in real time.',
    whatItIs: 'This is a live terminal and event console showing behind-the-scenes server activity as it happens.',
    whatItDoes: 'It streams color-coded log entries for every HTTP ping, search engine notification, and sitemap update.',
    steps: [
      '1. Click "Live Operations" in the navigation.',
      '2. Watch the terminal window update as jobs process in the background.',
      '3. If the Sitemap Observer detects a new page on your website, an alert card appears with a "Push to Queue" button.'
    ],
    statusNote: 'Connects directly to server-sent WebSocket events with local terminal pause/clear buttons.',
    keywords: ['live operations', 'live ops', 'terminal', 'stream', 'console', 'sitemap observer']
  },
  {
    id: 'view-diagnostics-center',
    name: 'Diagnostics & Guided Error Center View',
    category: 'System Telemetry',
    location: 'Sidebar -> NETWORK & HEALTH -> DIAGNOSTICS & ERRORS (or Header "Health")',
    analogy: 'Like a mechanic lifting the hood of a car to check the battery, oil, and spark plugs.',
    whatItIs: 'This is a system health checkup room that tests all 6 core engines of the platform.',
    whatItDoes: 'It checks your Google Indexing API key, Gemini AI key, SQLite database, GCS Cloud Storage, Proxy pool, and WebSocket gateway, and explains how to fix any red lights.',
    steps: [
      '1. Click "Health" in the header or "Diagnostics & Errors" in the sidebar.',
      '2. Click the "Run All Diagnostics" button to re-test all connections.',
      '3. If any service shows yellow or red, read the "Guided Error Fix" card below it for the exact steps to fix it.'
    ],
    statusNote: 'Runs live ping handshakes to internal server APIs (/api/health, /api/storage/status, /api/cron/status).',
    keywords: ['diagnostics', 'health', 'error center', 'troubleshooting', 'gcs', 'gemini', 'sqlite']
  },

  // 6. Wizards Hub Tabs
  {
    id: 'wizards-hub-dashboard',
    name: 'Wizards & Growth Command Hub View',
    category: 'Wizards & Growth',
    location: 'Sidebar -> DASHBOARD VIEWS -> WIZARDS HUB (or Header "Wizards Hub")',
    analogy: 'Like an arcade filled with 6 different game rooms, each with specialized tools.',
    whatItIs: 'This is a central launchpad containing 6 specialized strategy tabs.',
    whatItDoes: 'It organizes the Quick Launch wizard cards, LLM Citation Simulator, Whitelabel PDF Generator, Bulk SEO Validator, Funnel Flowchart, and AI Link Strategist.',
    steps: [
      '1. Click "Wizards Hub" in the header or sidebar.',
      '2. Click across the sub-tabs: "Wizards", "Citation Simulator", "Whitelabel PDF", "Bulk SEO", "Funnel Map", and "Link Strategist".',
      '3. Use the tools inside that tab to analyze and optimize your web presence.'
    ],
    statusNote: 'Central hub integrating multiple modal tools and interactive analyzers.',
    keywords: ['wizards hub', 'growth', 'command center', 'tabs']
  },
  {
    id: 'wizard-llm-citation-sim',
    name: 'LLM AI Citation Simulator',
    category: 'Wizards & Growth',
    location: 'Wizards Hub -> Tab 2: "Citation Simulator"',
    analogy: 'Like asking an AI robot what books it would recommend to a friend and checking if your book is on the list.',
    whatItIs: 'This is an AI simulation tool that tests if chatbots like ChatGPT, Perplexity, and Gemini would quote your website.',
    whatItDoes: 'It calculates an overall citation probability score (0-100%), breaks down your content readability and schema health, and displays a simulated AI answer citing your brand.',
    steps: [
      '1. Enter your website address and a question a customer might ask an AI chatbot.',
      '2. Click the black "Run LLM Citation Test" button.',
      '3. Review the citation radar chart and read the simulated AI chatbot answer.',
      '4. If your score is under 70%, click "1-Click Generate Missing Schema" to fix it!'
    ],
    statusNote: 'Uses local heuristic citation scoring algorithms and simulates typical LLM response formatting.',
    keywords: ['llm', 'citation', 'simulator', 'ai search', 'perplexity', 'chatgpt', 'gemini']
  },
  {
    id: 'wizard-whitelabel-pdf',
    name: 'Whitelabel Client PDF Generator',
    category: 'Reports & Exports',
    location: 'Wizards Hub -> Tab 3: "Whitelabel PDF" (and Executive Reports)',
    analogy: 'Like designing your own personalized stationery with your company logo printed at the top.',
    whatItIs: 'This is a report customizer that builds professional, print-ready PDF audits for clients.',
    whatItDoes: 'It lets you put your agency name, client name, custom logo, and brand colors on the report, and select which chapters to include.',
    steps: [
      '1. Type your Agency Name and Client Name into the boxes.',
      '2. Choose your primary brand color (like navy blue, purple, or orange).',
      '3. Check the boxes for the chapters you want (Executive Summary, Backlinks, Technical SEO, AI Readiness).',
      '4. Click the purple "Generate & Download Client PDF" button.'
    ],
    statusNote: 'Uses the built-in browser jsPDF engine to render formatted PDF documents directly to your computer.',
    keywords: ['whitelabel', 'pdf', 'client report', 'branding', 'logo', 'generator']
  },
  {
    id: 'wizard-link-strategist',
    name: 'AI Backlink & Outreach Strategist',
    category: 'Wizards & Growth',
    location: 'Wizards Hub -> Tab 6: "Link Strategist"',
    analogy: 'Like hiring a smart public relations manager who writes friendly letters to newspapers asking them to write about your store.',
    whatItIs: 'This is an outreach planning tool that generates link building ideas.',
    whatItDoes: 'It analyzes your niche and competitors, recommends anchor text ratios, and writes personalized email pitches to send to webmasters.',
    steps: [
      '1. Enter your website domain and your industry (e.g., Tech, Real Estate, Health).',
      '2. Click "Generate Link Strategy".',
      '3. Copy the suggested anchor text breakdown and use the pre-written outreach emails to pitch partner sites.'
    ],
    statusNote: 'Generates SEO strategy blueprints using proven link distribution rules and AI copy templates.',
    keywords: ['link strategist', 'outreach', 'email pitch', 'anchor text', 'backlinks']
  },
  {
    id: 'wizard-funnel-map',
    name: 'Interactive SEO/GEO Pipeline Flowchart',
    category: 'Wizards & Growth',
    location: 'Wizards Hub -> Tab 5: "Funnel Map"',
    analogy: 'Like a subway map showing every stop a train makes from the station to the airport.',
    whatItIs: 'This is an interactive diagram showing how URLs travel through the entire system.',
    whatItDoes: 'It visualizes the full pipeline: Raw URLs -> Bulk Validation -> Directory Syndication -> Google Indexing API & IndexNow -> Live Verification -> LLM AI Citation.',
    steps: [
      '1. Click on any node in the flowchart to read what happens at that stage.',
      '2. Use the shortcut buttons to jump directly into that module.'
    ],
    statusNote: 'Interactive educational visualizer explaining platform architecture.',
    keywords: ['funnel map', 'flowchart', 'architecture', 'diagram', 'pipeline']
  },

  // 7. Modals & Guided Wizards
  {
    id: 'modal-settings',
    name: 'System Settings & Infrastructure Modal',
    category: 'Configuration',
    location: 'Sidebar -> System Settings (or Header gear icon)',
    analogy: 'Like the control room in the basement of a building where you set the water temperature and electricity breakers.',
    whatItIs: 'This is the main settings window for configuring server credentials, speed, and proxies.',
    whatItDoes: 'It holds your Google Service Account JSON key, Google Cloud Storage backup button, Gemini API key status, proxy list, and webhook alert settings.',
    steps: [
      '1. Click the gear icon in the top header or "System Settings" in the sidebar.',
      '2. Paste your Google Service Account JSON key into the box and click "Validate JSON".',
      '3. Under Cloud Infrastructure, click "Trigger Manual Database Snapshot to GCS" to take a backup.',
      '4. Add proxy servers if you are doing heavy scraping, and click "Save System Settings".'
    ],
    statusNote: 'Saves configuration to persistent backend SQLite settings store and verifies GCS/Gemini health.',
    keywords: ['settings', 'service account', 'json', 'gcs', 'backup', 'gemini', 'proxies', 'concurrency']
  },
  {
    id: 'modal-directories',
    name: '55+ Built-in Directory Networks Modal',
    category: 'Core Indexing',
    location: 'Sidebar -> Network & Health -> Directory Network (or Header Menu)',
    analogy: 'Like a giant telephone book or community bulletin board where local businesses post their cards.',
    whatItIs: 'This is a catalog of all 55+ verified web directories and syndication platforms included in the software.',
    whatItDoes: 'It shows each directory’s Domain Authority score (DA 40 to 95), category, submission endpoint, and active status.',
    steps: [
      '1. Click "DIRECTORY NETWORK" in the sidebar.',
      '2. Type in the search box to find specific directories (like "Tech" or "High-DA").',
      '3. Click any category pill to filter the list.'
    ],
    statusNote: 'Displays built-in directory collection with live category filtering.',
    keywords: ['directories', '55+', 'directory network', 'domain authority', 'da', 'syndication']
  },
  {
    id: 'modal-technical-crawler',
    name: 'Technical SEO Website Crawler Modal',
    category: 'Audits & Intel',
    location: 'Sidebar -> Audits & Intel -> Technical Crawler (or Header "AUDIT")',
    analogy: 'Like a building inspector walking through a house with a clipboard, checking for leaky pipes and cracked windows.',
    whatItIs: 'This is an on-page website crawler that checks for technical errors on a website.',
    whatItDoes: 'It visits a webpage and reports missing title tags, missing meta descriptions, broken links (404), slow load times, and missing image alt tags.',
    steps: [
      '1. Click "AUDIT" in the top header or "TECHNICAL CRAWLER" in the sidebar.',
      '2. Type in the website address you want to inspect.',
      '3. Click the black "Run Technical Audit Crawler" button.',
      '4. Read the checklist of found issues, and click "Export Technical Audit PDF" to save the report.'
    ],
    statusNote: 'Crawls pages safely via the backend Express proxy to avoid browser security blocks.',
    keywords: ['technical crawler', 'audit', 'broken links', 'meta descriptions', 'alt tags', 'crawler']
  },
  {
    id: 'modal-domain-profiler',
    name: 'SEO Domain Profiler Modal',
    category: 'Audits & Intel',
    location: 'Sidebar -> Audits & Intel -> Domain Profiler (or Header "PROFILER")',
    analogy: 'Like looking up a house on a real estate website to see its property value, square footage, and neighborhood history.',
    whatItIs: 'This is a domain research tool that gathers key facts about any website address.',
    whatItDoes: 'It reports the domain’s Authority Score, estimated indexed pages, backlink estimates, SERP footprints, and SSL certificate security.',
    steps: [
      '1. Click "PROFILER" in the top header.',
      '2. Type in any domain name (e.g. careerpulseai.net).',
      '3. Click "Profile Domain" to view its authority grade and historical backlink charts.'
    ],
    statusNote: 'Combines DNS lookups, SSL validation, and search engine footprint estimates.',
    keywords: ['domain profiler', 'profiler', 'authority', 'indexed pages', 'ssl', 'footprint']
  },
  {
    id: 'modal-sitemap-audit',
    name: 'XML Sitemap Crawler & Health Auditor Modal',
    category: 'Audits & Intel',
    location: 'Sidebar -> Audits & Intel -> Sitemap Audit',
    analogy: 'Like reading a museum map and walking down every hallway to check that every door is unlocked.',
    whatItIs: 'This is a tool that reads your website’s sitemap.xml file to verify every link.',
    whatItDoes: 'It finds every URL in your sitemap, tests if each page loads with a healthy 200 OK, flags broken 404 pages or redirects, and sends bad links to the queue.',
    steps: [
      '1. Click "SITEMAP AUDIT" in the sidebar.',
      '2. Enter your domain (e.g. careerpulseai.net) or your direct sitemap link.',
      '3. Click "Crawl & Audit Sitemap".',
      '4. Click "Send Flagged URLs to Indexing Queue" to re-index pages that had issues.'
    ],
    statusNote: 'Fetches and parses standard XML sitemaps and sitemap index files.',
    keywords: ['sitemap', 'xml sitemap', 'crawler', 'broken links', '404', 'redirects']
  },
  {
    id: 'modal-onboarding-wizard',
    name: '3-Step Onboarding Setup Wizard Modal',
    category: 'Wizards & Growth',
    location: 'Sidebar -> Wizards & Growth -> Onboarding Wizard (or Header Menu)',
    analogy: 'Like a friendly tour guide showing you around a new school on your very first day.',
    whatItIs: 'This is a simple 3-step walkthrough designed for brand-new users.',
    whatItDoes: 'It explains how to connect your accounts, enter your first website addresses, and run a safe demo submission to see how everything works.',
    steps: [
      '1. Click "ONBOARDING WIZARD" in the sidebar.',
      '2. Step 1: Read how Google Indexing API works and click "Next Step".',
      '3. Step 2: Enter your primary website domain and click "Next Step".',
      '4. Step 3: Click "Run Demo Submission" to watch a live test run through 3 sample directories.'
    ],
    statusNote: 'Safe guided tutorial with a non-destructive sample submission trigger.',
    keywords: ['onboarding', 'tutorial', 'quickstart', 'demo submission', 'walkthrough']
  },
  {
    id: 'modal-conversion-wizard',
    name: 'ConversionWizard CRO Audit Modal',
    category: 'Wizards & Growth',
    location: 'Sidebar -> Wizards & Growth -> Conversion Wizard (or Header "[ WIZARD ]")',
    analogy: 'Like an experienced store manager telling you how to make your sales sign bigger and clearer.',
    whatItIs: 'This is an on-page conversion rate optimizer that audits marketing headlines and buttons.',
    whatItDoes: 'It scores your page’s headline clarity, calls to action, and form friction, and writes customized AI prompt recipes to rewrite your sales copy.',
    steps: [
      '1. Click "[ WIZARD ]" in the top header or "CONVERSION WIZARD" in the sidebar.',
      '2. Type in your landing page URL and click "Audit Conversion Rate".',
      '3. Read your headline and CTA scores.',
      '4. Click "Copy AI Prompt" to paste the recommendations into ChatGPT, Gemini, or Claude.'
    ],
    statusNote: 'Combines heuristic copywriting formulas with Gemini AI if an API key is present.',
    keywords: ['conversion wizard', 'cro', 'copywriting', 'headlines', 'cta', 'prompts']
  },
  {
    id: 'modal-clarity-overload',
    name: 'Clarity Overload CRO Audit Modal (5-Second Test)',
    category: 'Wizards & Growth',
    location: 'Sidebar -> Wizards & Growth -> Clarity Overload',
    analogy: 'Like holding up a flashcard to a friend for 5 seconds to see if they can read the word before you put it away.',
    whatItIs: 'This is a visual simplicity tester that measures how confusing or cluttered a webpage feels.',
    whatItDoes: 'It simulates a "5-Second Test" to measure cognitive load (mental effort) and tells you if visitors can understand what you sell in 5 seconds.',
    steps: [
      '1. Click "CLARITY OVERLOAD" in the sidebar.',
      '2. Enter your webpage URL and click "Run 5-Second Clarity Test".',
      '3. Review the Cognitive Load Meter (Low, Medium, or Overload).',
      '4. Follow the 3 simplification steps to declutter your hero section.'
    ],
    statusNote: 'Evaluates text density, visual clutter, and call-to-action prominence.',
    keywords: ['clarity overload', '5-second test', 'cognitive load', 'clutter', 'cro', 'simplicity']
  },
  {
    id: 'modal-autonomous-auditor',
    name: '14-Phase Autonomous Website Auditor Modal',
    category: 'Wizards & Growth',
    location: 'Sidebar -> Wizards & Growth -> 14-Phase Auditor',
    analogy: 'Like a 14-point vehicle inspection at a car garage before going on a long road trip.',
    whatItIs: 'This is a multi-stage audit scanner that runs 14 distinct tests across a website.',
    whatItDoes: 'It tests security, mobile layout, speed, canonical tags, headings, content depth, image tags, internal links, schema, social tags, and AI search readiness.',
    steps: [
      '1. Click "14-PHASE AUDITOR" in the sidebar.',
      '2. Enter your website address and click "Start 14-Phase Audit".',
      '3. Watch all 14 phases check off one by one.',
      '4. Review the prioritized action items and click "Export 14-Phase Audit Report" to save a copy.'
    ],
    statusNote: 'Runs client and server-assisted phased checks with simulated benchmark heuristics.',
    keywords: ['14-phase', 'auditor', 'inspection', 'security', 'mobile', 'speed', 'comprehensive']
  },
  {
    id: 'modal-google-api-wizard',
    name: 'Google Indexing API 3-Step Setup Wizard Modal',
    category: 'Wizards & Growth',
    location: 'Sidebar -> Wizards & Growth -> Google API Wizard',
    analogy: 'Like getting a special VIP badge from Google so you can deliver letters directly to their mail room.',
    whatItIs: 'This is a guided setup assistant for connecting Google’s official Indexing API.',
    whatItDoes: 'It walks you through creating a free Google Cloud service account, adding it as an Owner in Google Search Console, and testing the connection.',
    steps: [
      '1. Click "GOOGLE API WIZARD" in the sidebar.',
      '2. Follow Step 1 to create your Service Account on Google Cloud Console.',
      '3. Follow Step 2 to add the generated email as an Owner inside Google Search Console.',
      '4. Step 3: Paste or upload your downloaded JSON key and click "Test API Handshake".'
    ],
    statusNote: 'Directly validates Google Service Account private keys and tests OAuth2 token generation.',
    keywords: ['google indexing api', 'service account', 'search console', 'json key', 'oauth', 'handshake']
  },
  {
    id: 'modal-url-indexing-wizard',
    name: '5-Step Enterprise URL Submission & Indexing Wizard Modal',
    category: 'Core Indexing',
    location: 'Bento Dashboard -> "Launch 5-Step Wizard" button (or Wizards Hub card)',
    analogy: 'Like an easy wizard on your computer that guides you through installing a new program step by step.',
    whatItIs: 'This is a structured, 5-screen walkthrough for launching submission campaigns without seeing too many controls at once.',
    whatItDoes: 'It guides you through 1. URLs -> 2. Engines -> 3. Speed -> 4. Review -> 5. Launch.',
    steps: [
      '1. Click "Launch 5-Step Indexing Wizard" on the Bento dashboard.',
      '2. Step 1: Type or paste your URLs and click Next.',
      '3. Step 2: Toggle on Google Indexing, IndexNow, and Directory Networks and click Next.',
      '4. Step 3: Choose your speed (threads) and click Next.',
      '5. Step 4 & 5: Review the summary and click "Launch Campaign Now!"'
    ],
    statusNote: 'Alternative guided interface for the main submission engine.',
    keywords: ['5-step wizard', 'url indexing wizard', 'guided campaign', 'wizard']
  },
  {
    id: 'modal-visual-schema-generator',
    name: 'Visual Schema Generator Modal',
    category: 'Wizards & Growth',
    location: 'Sidebar -> Wizards & Growth -> Schema Generator',
    analogy: 'Like filling out an official form to get a library card so the computer knows who you are.',
    whatItIs: 'This is a visual form for creating JSON-LD structured data code without writing code by hand.',
    whatItDoes: 'It lets you choose a type (like FAQ, Article, Organization, or Local Business), fill in plain text boxes, and copies perfect schema code for your website.',
    steps: [
      '1. Click "SCHEMA GENERATOR" in the sidebar.',
      '2. Choose your schema type from the dropdown (for example, "FAQ Page").',
      '3. Type in your questions and answers.',
      '4. Click "Copy Schema JSON-LD" to copy the code, and paste it into your website’s HTML header.'
    ],
    statusNote: 'Generates valid, Google-compliant schema.org JSON-LD formatted code.',
    keywords: ['schema generator', 'json-ld', 'faq schema', 'structured data', 'rich results']
  },
  {
    id: 'modal-geo-blueprint',
    name: 'Enterprise GEO Growth Blueprint Modal',
    category: 'Wizards & Growth',
    location: 'Sidebar -> Wizards & Growth -> GEO Blueprint',
    analogy: 'Like an architect’s blueprint showing builders exactly where to put the walls and doors.',
    whatItIs: 'This is an educational guide explaining how to optimize websites for generative AI search engines.',
    whatItDoes: 'It provides copy-and-paste schema templates and entity guidelines so AI models like ChatGPT and Perplexity can easily cite your brand.',
    steps: [
      '1. Click "GEO BLUEPRINT" in the sidebar.',
      '2. Browse the tabs to learn about AI Citation Triggers and Entity Authority.',
      '3. Copy pre-built JSON-LD templates for your company, author bio, or product.'
    ],
    statusNote: 'Educational documentation modal with instant copy-to-clipboard code snippets.',
    keywords: ['geo blueprint', 'generative engine optimization', 'ai search', 'blueprint', 'citations']
  },
  {
    id: 'modal-content-grader',
    name: 'AI Content & Readiness Grader Modal',
    category: 'Wizards & Growth',
    location: 'Sidebar -> Wizards & Growth -> Content Grader',
    analogy: 'Like a friendly English teacher grading your essay and giving you tips to make it even better.',
    whatItIs: 'This is a writing evaluation tool that scores text for readability and search relevance.',
    whatItDoes: 'It reads your article or webpage, checks your target keywords, calculates readability grade level, and gives you a checklist to make it rank higher.',
    steps: [
      '1. Click "CONTENT GRADER" in the sidebar.',
      '2. Either type in a live website address or paste raw article text into the box.',
      '3. Enter your main target keyword.',
      '4. Click "Grade Content" to view your 0-100 score and recommendations.'
    ],
    statusNote: 'Performs semantic entity density analysis and Flesch-Kincaid readability scoring.',
    keywords: ['content grader', 'readability', 'keywords', 'flesch kincaid', 'grader', 'ai readiness']
  },
  {
    id: 'drawer-history-logs',
    name: 'Job Submission History Drawer',
    category: 'Reports & Exports',
    location: 'Sidebar -> Network & Health -> History Logs (or Header Menu -> Logs Drawer)',
    analogy: 'Like a bank deposit book that lists every receipt in order of date and time.',
    whatItIs: 'This is a drawer that slides out from the right side of the screen showing all past campaigns.',
    whatItDoes: 'It displays every previous batch, its date, how many URLs succeeded or failed, and lets you reload that batch into the results table.',
    steps: [
      '1. Click "HISTORY LOGS" in the sidebar.',
      '2. Look through your past jobs.',
      '3. Click "View Batch" to load those specific URLs into your main table.',
      '4. Click "Export CSV" to download that past job.'
    ],
    statusNote: 'Queries persistent SQLite database history records.',
    keywords: ['history drawer', 'history logs', 'past jobs', 'batches', 'drawer']
  },
  {
    id: 'widget-ai-assistant',
    name: 'Floating AI Copilot Assistant Widget',
    category: 'Wizards & Growth',
    location: 'Bottom right corner of the screen (Floating Sparkles button)',
    analogy: 'Like having a friendly expert sitting right next to you while you work, ready to answer questions.',
    whatItIs: 'This is an interactive chat assistant located in the corner of your browser.',
    whatItDoes: 'It lets you ask questions about SEO, explains error codes in plain English, and helps you decide what to click next.',
    steps: [
      '1. Click the floating orange button with the sparkle icon in the bottom right corner.',
      '2. Click any suggested question chip (like "Explain my score" or "What is GEO?").',
      '3. Or type your own question into the message box and press Enter.'
    ],
    statusNote: 'Answers common platform questions using built-in knowledge and Gemini AI when available.',
    keywords: ['ai copilot', 'assistant', 'chat widget', 'sparkles', 'help bot']
  },
  {
    id: 'modal-confirmation',
    name: 'Global Destructive Action Confirmation Modal',
    category: 'Security & Access',
    location: 'Pops up when clicking Stop, Cancel, or Delete actions',
    analogy: 'Like a double-check popup that asks, "Are you sure you want to throw this away?" before emptying the trash.',
    whatItIs: 'This is a safety dialog box that prevents accidental clicks from ruining your work.',
    whatItDoes: 'It explains what will happen if you proceed (like stopping a live batch or clearing logs) and requires an explicit confirmation click.',
    steps: [
      '1. When you click a sensitive button (like Cancel Job or Stop Autonomous Mode), this window appears.',
      '2. Read the impact warning.',
      '3. Click the red confirmation button to proceed, or click "Cancel" to keep working safely.'
    ],
    statusNote: 'Global modal safeguarding against accidental job termination or data purge.',
    keywords: ['confirmation modal', 'cancel job', 'safety', 'stop', 'delete']
  },

  // 17. GEO Engine, Revenue Prioritizer & Failure Recovery Guides
  {
    id: 'geo-engine-self-healing',
    name: 'GEO Engine & Autonomous Self-Healing Pipeline',
    category: 'Core Indexing',
    location: 'URL Submission & Indexing Screen -> Top Banner & Diagnostic Panel',
    analogy: 'Like an automatic pit crew that watches your race car: if a tire goes flat, it changes the tire, tunes the engine, and sends the car right back onto the track.',
    whatItIs: 'An automated diagnostic and repair engine that guarantees your web pages get indexed by search engines and cited by AI chatbots.',
    whatItDoes: 'When an address fails or gets slow, it follows a strict 5-step repair rule: Retry -> Regenerate Schema -> Rebuild FAQ -> Re-submit -> Verify.',
    steps: [
      '1. Click "URL Submission & Indexing Engine" in the sidebar or top tab bar.',
      '2. Look at the top of the screen for the "SYSTEM DIRECTIVE — GEO ENGINE" banner.',
      '3. Check the 5 health criteria: IndexNow Success, Google Indexing API, Schema Correctness, Zero Fake Metrics, and 85%+ Revenue Compliance.',
      '4. Click the purple "Execute 5-Step Self-Healing" button to launch an automatic repair cycle.',
      '5. Click the "Regenerated Schema.org & FAQ" tab to inspect the rebuilt Answer-First Q&A blocks and structured data.'
    ],
    statusNote: 'Fully active self-healing engine tied to /api/geo/self-heal and WebSocket live telemetry.',
    keywords: ['geo engine', 'self-healing', 'retry', 'regenerate schema', 'faq rebuild', 'ai citation', 'lanette']
  },
  {
    id: 'revenue-asset-prioritizer',
    name: 'Revenue Asset Prioritizer (Storefronts & High-Intent Engine)',
    category: 'Core Indexing',
    location: 'URL Submission Form & Broadcast Dispatch Queue',
    analogy: 'Like a hospital triage nurse who rushes patients with urgent needs straight to the doctor first, while keeping general checkups in the normal line.',
    whatItIs: 'A smart priority sorter that treats every web address as a financial revenue asset.',
    whatItDoes: 'It automatically detects storefronts, pricing tables, checkout pages, and interactive calculators, putting them at the very front of the indexing line so you earn money faster.',
    steps: [
      '1. Paste your list of website links into the "Bulk URL Input" box.',
      '2. The engine instantly classifies your links: Tier 1 (Storefronts & Checkouts), Tier 2 (Calculators & Tools), Tier 3 (High-Intent Guides), or Tier 4 (Editorial Articles).',
      '3. Click "START MULTI-ENGINE BROADCAST". High-value checkout and calculator pages are dispatched to Google and Bing ahead of regular articles.',
      '4. Review the Results Table to confirm that revenue assets received immediate HTTP 200/202 confirmations.'
    ],
    statusNote: 'Active prioritization algorithm sorting dispatch queues with 80/20 concurrency.',
    keywords: ['revenue asset', 'storefront', 'calculator', 'high intent', 'prioritization', 'tier 1', 'dispatch']
  },
  {
    id: '14-phase-content-drift',
    name: '14-Phase Auditor: Content Drift Repair & AI Schema Injection',
    category: 'Wizards & Growth',
    location: 'Sidebar -> Wizards & Growth -> 14-Phase Auditor -> Schema & Drift Tab',
    analogy: 'Like a master editor who spots outdated facts in an encyclopedia and pastes shiny new explanation cards right over them.',
    whatItIs: 'An advanced scanner inside the 14-Phase Auditor that discovers stale dates, decaying answers, and missing AI tags.',
    whatItDoes: 'It fixes content drift and injects complete Schema.org JSON-LD and 30-50 word Answer-First snippets so ChatGPT and Google AI Overviews cite your pages.',
    steps: [
      '1. Click "14-Phase Auditor" in the sidebar and enter your website address.',
      '2. Click "Start 14-Phase Audit" and wait 3 seconds while all 14 multi-vector phases scan your site.',
      '3. In the diagnostic tabs, click "Schema & Structured Data".',
      '4. Look at the "AUTONOMOUS DRIFT REPAIR" box to view repaired timestamps and AI Q&A citation anchors.',
      '5. Click "Inject & Queue for Indexing" to immediately send the repaired asset into the live broadcast queue.'
    ],
    statusNote: 'Directly injects Answer-First schema graphs and synchronizes with the indexing queue.',
    keywords: ['14-phase auditor', 'content drift', 'schema injection', 'ai citation', 'answer first', 'perplexity']
  },
  {
    id: 'frm-lanette-recovery',
    name: 'Failure Recovery Mode (FRM) Lanette 1-Click Guide',
    category: 'Core Indexing',
    location: 'Global Emergency Banner (Top of screen when active)',
    analogy: 'Like a big red emergency brake on a factory assembly line that protects you from shipping broken products until a supervisor clicks 3 green buttons.',
    whatItIs: 'An automated safety system that freezes publishing if click rates or revenue compliance scores drop below safety thresholds.',
    whatItDoes: 'It protects your domain reputation and provides Lanette with step-by-step 1-click recovery actions to unfreeze the system safely.',
    steps: [
      '1. If you see the warning banner saying "FAILURE RECOVERY MODE (FRM) ACTIVE", publishing is safely paused.',
      '2. Click Step 1 "Regenerate Failing Assets" to rebuild any broken products or schemas.',
      '3. Click Step 2 "Revalidate Market Demand" to test customer interest with fresh trend data (target >= 95).',
      '4. Click Step 3 "Recalculate Compliance" to verify your revenue compliance score is back above 85%.',
      '5. Click "Resolve & Un-Freeze System" to return to normal operation.'
    ],
    statusNote: 'Enforces the FRM Kindergarten-level 1-click operator guidance rules.',
    keywords: ['failure recovery mode', 'frm', 'lanette', 'freeze', 'unfreeze', 'compliance', 'demand score']
  }
];

export const ELI10_TROUBLESHOOTING: Eli10TroubleshootingItem[] = [
  {
    ifYouSee: 'Google Indexing API Permission Denied (403)',
    itMeans: 'Google Search Console doesn’t know who your robot service account is yet.',
    heresWhatToClick: 'Click "Google API Wizard" in the sidebar. Copy your service account email address, open Google Search Console, go to Settings -> Users and Permissions, and add that email as an "Owner". Then test the connection again in Step 3.',
    keywords: ['google indexing api', '403', 'permission denied', 'service account', 'search console']
  },
  {
    ifYouSee: 'WebSocket Disconnected / WS_SYNC... Status',
    itMeans: 'Your web browser lost its live phone call with the server, probably because your laptop went to sleep or your internet flickered.',
    heresWhatToClick: 'Simply refresh your browser page (F5 or Command+R). All your past data is saved safely in the server database, so you won’t lose anything!',
    keywords: ['websocket', 'ws_sync', 'disconnected', 'reconnect', 'refresh']
  },
  {
    ifYouSee: 'HTTP 429 Too Many Requests (Rate Limit)',
    itMeans: 'You are knocking on a website’s door too fast, and their security guard told you to take a quick break.',
    heresWhatToClick: 'Open the "Smart Batch Scheduler" in the sidebar. Lower your batch size to 5 or 10 URLs and increase your delay to 60 seconds. Our Intelligent Retry Policy will automatically retry failed requests after a short pause.',
    keywords: ['429', 'rate limit', 'too many requests', 'slow down', 'cooldown']
  },
  {
    ifYouSee: 'HTTP 404 Page Not Found in Sitemap Crawler',
    itMeans: 'Your sitemap lists a web address that doesn’t exist on your website anymore.',
    heresWhatToClick: 'In the Sitemap Audit modal, look at the red 404 rows. Click "Send Flagged URLs to Indexing Queue" or update your website’s sitemap file so Google stops looking for deleted pages.',
    keywords: ['404', 'not found', 'sitemap', 'broken link']
  },
  {
    ifYouSee: 'IndexNow 403 Forbidden Error',
    itMeans: 'Search engines like Bing looked for your secret key file on your website and could not find it.',
    heresWhatToClick: 'Open "System Settings" in the sidebar. Verify your IndexNow API key, and make sure the small text file named [your-key].txt is uploaded to the root folder of your website.',
    keywords: ['indexnow', '403', 'forbidden', 'key file', 'bing']
  },
  {
    ifYouSee: 'Bulk SEO Validator Canonical Mismatch',
    itMeans: 'The webpage has a secret tag saying its "real home" is somewhere else (for example, http instead of https, or with www instead of without it).',
    heresWhatToClick: 'Open the Bulk SEO Validator results table. Click on the row with the warning to see which address it prefers, and update your submission list to use the exact preferred address.',
    keywords: ['canonical', 'mismatch', 'bulk seo', 'duplicate']
  },
  {
    ifYouSee: 'Visual Schema Generator JSON-LD Syntax Error',
    itMeans: 'There is an extra quotation mark or a typo in one of your form fields.',
    heresWhatToClick: 'Open the Visual Schema Generator modal. Make sure all your answers have matching quotes and valid website addresses, then click "Copy Schema JSON-LD" again.',
    keywords: ['schema', 'json-ld', 'syntax error', 'validation']
  },
  {
    ifYouSee: 'LLM Citation Simulator Low Probability (<50%)',
    itMeans: 'Your webpage doesn’t have clear question-and-answer blocks or facts that an AI chatbot can easily quote.',
    heresWhatToClick: 'In the Citation Simulator, click the button that says "1-Click Generate Missing Schema". Copy the generated FAQ schema and paste it into your website to give the AI clear answers to read.',
    keywords: ['citation probability', 'llm', 'simulator', 'faq schema', 'low score']
  },
  {
    ifYouSee: 'Whitelabel PDF Print Preview Blank Logo',
    itMeans: 'The image link you provided for your company logo cannot be reached or is blocked by security.',
    heresWhatToClick: 'In the Whitelabel PDF Generator, make sure you upload an image directly from your computer or use an image link that starts with https://.',
    keywords: ['whitelabel', 'logo', 'pdf', 'blank', 'image']
  },
  {
    ifYouSee: 'Backlink Verification Timeout (Wait > 6000ms)',
    itMeans: 'The directory website took longer than 6 seconds to answer back.',
    heresWhatToClick: 'Open "System Settings" in the sidebar. Increase the Request Timeout from 6000ms to 10000ms and check that High-Anonymity Proxies are turned on.',
    keywords: ['timeout', 'latency', 'slow', 'verification']
  },
  {
    ifYouSee: 'Gemini AI API Credit Limit (429)',
    itMeans: 'Your free Google Gemini AI key ran out of questions for the minute.',
    heresWhatToClick: 'Don’t panic! The system automatically switches to our offline heuristic engine so your audits keep running. If you have a paid Gemini key, paste it into Settings.',
    keywords: ['gemini', 'api key', '429', 'ai quota', 'fallback']
  },
  {
    ifYouSee: 'Export CSV Button Does Nothing or Outputs Empty File',
    itMeans: 'You have a search filter typed in that hid all the rows in the table.',
    heresWhatToClick: 'Clear the search box above the Results Table and make sure the status dropdown is set to "All Statuses". Then click "EXPORT CSV" again.',
    keywords: ['export csv', 'empty', 'no rows', 'download']
  },
  {
    ifYouSee: 'Content Drift Warning or Stale Schema in 14-Phase Auditor',
    itMeans: 'Your page contains old dates (e.g. 2023 copyright) or lacks modern Answer-First JSON-LD markup.',
    heresWhatToClick: 'In the 14-Phase Auditor, switch to the "Schema & Structured Data" tab, review the repaired timestamp list in the "AUTONOMOUS DRIFT REPAIR" box, and click "Inject & Queue for Indexing" to instantly update Google and Bing.',
    keywords: ['content drift', 'stale schema', '14-phase auditor', 'timestamp', 'drift repair']
  },
  {
    ifYouSee: 'Revenue Asset Not Prioritized at Head of Queue',
    itMeans: 'The URL was typed as a plain blog path instead of matching standard storefront, checkout, or calculator naming conventions.',
    heresWhatToClick: 'Check your URL structure. The engine automatically looks for words like /tools/, /calculator, /store, /products/, or /cart. If it is a pricing page, name it /pricing to ensure Tier-1 dispatch treatment.',
    keywords: ['revenue asset', 'queue priority', 'storefront', 'calculator', 'high intent']
  },
  {
    ifYouSee: 'GEO Citation Probability Below 90%',
    itMeans: 'Your content does not answer users’ search questions right in the first sentence with clear numbers and definitions.',
    heresWhatToClick: 'Open the "GEO Engine & Autonomous Self-Healing" panel at the top of the Indexing screen and click "Execute 5-Step Self-Healing". This regenerates your Answer-First FAQ block and resubmits the page automatically.',
    keywords: ['geo citation', 'citation probability', 'perplexity', 'chatgpt', 'self-healing']
  },
  {
    ifYouSee: 'Publishing Frozen Under Failure Recovery Mode (FRM)',
    itMeans: 'Revenue compliance dropped below 85% or CTR fell below 3.5%, so the safety lock turned on to protect your domain reputation.',
    heresWhatToClick: 'Look at the FRM banner at the top of the screen. Follow Lanette’s 3 simple steps: 1. Click "Regenerate Failing Assets", 2. Click "Revalidate Demand", 3. Click "Recalculate Compliance", then click "Resolve & Unfreeze".',
    keywords: ['frm', 'failure recovery mode', 'frozen', 'compliance', 'lanette', 'unfreeze']
  }
];
