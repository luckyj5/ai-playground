export type NavKey =
  | 'overview'
  | 'data-access'
  | 'query-editor'
  | 'poly-notebook'
  | 'data-notebook'
  | 'unified-workflow'
  | 'before-after'
  | 'architecture';

export const NAV_ORDER: NavKey[] = [
  'overview',
  'data-access',
  'query-editor',
  'poly-notebook',
  'data-notebook',
  'unified-workflow',
  'before-after',
  'architecture',
];

export const NAV_META: Record<
  NavKey,
  { title: string; subtitle: string; shortcut: string; icon: string }
> = {
  overview: {
    title: 'Overview',
    subtitle: '3x productivity story',
    shortcut: '1',
    icon: '◎',
  },
  'data-access': {
    title: 'Data Access & Governance',
    subtitle: 'GDC pain → SMUS fix',
    shortcut: '2',
    icon: '▣',
  },
  'query-editor': {
    title: 'AI Query Editor',
    subtitle: 'Natural language → SQL',
    shortcut: '3',
    icon: '⌕',
  },
  'poly-notebook': {
    title: 'Poly-Compute Notebook',
    subtitle: 'Multi-kernel execution',
    shortcut: '4',
    icon: '⎔',
  },
  'data-notebook': {
    title: 'Data Notebook',
    subtitle: 'Explore · SQL · Python',
    shortcut: '5',
    icon: '≡',
  },
  'unified-workflow': {
    title: 'Unified Studio',
    subtitle: 'End-to-end workflow',
    shortcut: '6',
    icon: '❖',
  },
  'before-after': {
    title: 'Before vs After',
    subtitle: 'Productivity comparison',
    shortcut: '7',
    icon: '⇄',
  },
  architecture: {
    title: 'Architecture',
    subtitle: 'How SMUS fits together',
    shortcut: '8',
    icon: '◈',
  },
};

/* ------------------------- Mock datasets for notebooks ------------------------ */

export const mockCustomers = [
  { customer_id: 'C-10293', name: 'Acme Corp', region: 'NA', revenue: 1_820_430, signup: '2021-04-12' },
  { customer_id: 'C-10422', name: 'Globex', region: 'EU', revenue: 1_540_120, signup: '2020-09-03' },
  { customer_id: 'C-10711', name: 'Umbrella', region: 'NA', revenue: 1_210_900, signup: '2022-01-18' },
  { customer_id: 'C-10812', name: 'Initech', region: 'NA', revenue: 1_102_000, signup: '2019-11-22' },
  { customer_id: 'C-10915', name: 'Hooli', region: 'APAC', revenue: 998_220, signup: '2022-08-02' },
  { customer_id: 'C-11003', name: 'Soylent', region: 'EU', revenue: 915_500, signup: '2021-06-30' },
  { customer_id: 'C-11201', name: 'Stark Ind.', region: 'NA', revenue: 880_175, signup: '2018-03-14' },
  { customer_id: 'C-11305', name: 'Wayne Ent.', region: 'NA', revenue: 812_900, signup: '2020-12-07' },
  { customer_id: 'C-11487', name: 'Wonka', region: 'EU', revenue: 770_120, signup: '2022-02-11' },
  { customer_id: 'C-11599', name: 'Tyrell', region: 'APAC', revenue: 712_340, signup: '2021-10-05' },
];

export const mockSales = [
  { order_id: 'O-9001', customer_id: 'C-10293', amount: 42_300, date: '2025-01-14', product: 'Analytics' },
  { order_id: 'O-9002', customer_id: 'C-10422', amount: 38_150, date: '2025-01-16', product: 'ML Platform' },
  { order_id: 'O-9003', customer_id: 'C-10293', amount: 51_900, date: '2025-02-03', product: 'Analytics' },
  { order_id: 'O-9004', customer_id: 'C-10711', amount: 22_400, date: '2025-02-11', product: 'Data Lake' },
  { order_id: 'O-9005', customer_id: 'C-10812', amount: 18_700, date: '2025-02-15', product: 'Warehouse' },
  { order_id: 'O-9006', customer_id: 'C-10915', amount: 61_200, date: '2025-03-02', product: 'ML Platform' },
  { order_id: 'O-9007', customer_id: 'C-11003', amount: 33_100, date: '2025-03-18', product: 'Analytics' },
  { order_id: 'O-9008', customer_id: 'C-11201', amount: 28_900, date: '2025-03-29', product: 'Data Lake' },
];

/* ---------------------------- NL → SQL examples ------------------------------ */

export type QueryExample = {
  id: string;
  prompt: string;
  sql: string;
  explanation: string[];
  rows: Array<Record<string, string | number>>;
};

export const QUERY_EXAMPLES: QueryExample[] = [
  {
    id: 'top10',
    prompt: 'Show top 10 customers by revenue last quarter',
    sql: `SELECT c.customer_id,
       c.name,
       SUM(s.amount) AS revenue
FROM   gdc.sales  s
JOIN   gdc.customers c  ON c.customer_id = s.customer_id
WHERE  s.date BETWEEN DATE_TRUNC('quarter', CURRENT_DATE) - INTERVAL '3 months'
                 AND  DATE_TRUNC('quarter', CURRENT_DATE)
GROUP BY c.customer_id, c.name
ORDER BY revenue DESC
LIMIT 10;`,
    explanation: [
      "Resolves `gdc.sales` and `gdc.customers` through the SageMaker Unified Studio Governed Data Catalog — no IAM/Glue setup required.",
      "Filters to the previous calendar quarter using DATE_TRUNC, so the result updates automatically each quarter.",
      "Aggregates revenue per customer, then orders DESC and limits to top 10.",
    ],
    rows: [
      { customer_id: 'C-10293', name: 'Acme Corp', revenue: 1_820_430 },
      { customer_id: 'C-10422', name: 'Globex', revenue: 1_540_120 },
      { customer_id: 'C-10711', name: 'Umbrella', revenue: 1_210_900 },
      { customer_id: 'C-10812', name: 'Initech', revenue: 1_102_000 },
      { customer_id: 'C-10915', name: 'Hooli', revenue: 998_220 },
      { customer_id: 'C-11003', name: 'Soylent', revenue: 915_500 },
      { customer_id: 'C-11201', name: 'Stark Ind.', revenue: 880_175 },
      { customer_id: 'C-11305', name: 'Wayne Ent.', revenue: 812_900 },
      { customer_id: 'C-11487', name: 'Wonka', revenue: 770_120 },
      { customer_id: 'C-11599', name: 'Tyrell', revenue: 712_340 },
    ],
  },
  {
    id: 'churn',
    prompt: 'Which regions had the highest churn in 2024 vs 2023?',
    sql: `WITH churn AS (
  SELECT region,
         EXTRACT(year FROM churn_date) AS yr,
         COUNT(*)                      AS churned
  FROM   gdc.customer_events
  WHERE  event = 'cancel'
  GROUP BY 1, 2
)
SELECT region,
       MAX(CASE WHEN yr = 2024 THEN churned END) AS churn_2024,
       MAX(CASE WHEN yr = 2023 THEN churned END) AS churn_2023,
       ROUND(
         100.0 *
         (MAX(CASE WHEN yr = 2024 THEN churned END) -
          MAX(CASE WHEN yr = 2023 THEN churned END)) /
          NULLIF(MAX(CASE WHEN yr = 2023 THEN churned END), 0), 1
       ) AS yoy_pct
FROM   churn
GROUP  BY region
ORDER  BY yoy_pct DESC;`,
    explanation: [
      "Builds a year-bucketed CTE over `gdc.customer_events` using Unified Studio's governed view — lineage flows to the BI dashboard automatically.",
      "Pivots 2023 vs 2024 churn per region and computes YoY % change with NULL-safe division.",
      "Sorts regions by the largest YoY increase for quick exec readouts.",
    ],
    rows: [
      { region: 'APAC', churn_2024: 412, churn_2023: 280, yoy_pct: 47.1 },
      { region: 'EU', churn_2024: 305, churn_2023: 260, yoy_pct: 17.3 },
      { region: 'NA', churn_2024: 640, churn_2023: 612, yoy_pct: 4.6 },
      { region: 'LATAM', churn_2024: 92, churn_2023: 110, yoy_pct: -16.4 },
    ],
  },
  {
    id: 'ltv',
    prompt: 'Average order value by product line, last 12 months',
    sql: `SELECT product,
       COUNT(*)                  AS orders,
       ROUND(AVG(amount), 2)     AS avg_order_value,
       ROUND(SUM(amount) / 1e6, 2) AS revenue_m
FROM   gdc.sales
WHERE  date >= CURRENT_DATE - INTERVAL '12 months'
GROUP  BY product
ORDER  BY revenue_m DESC;`,
    explanation: [
      "Scans the governed `gdc.sales` table — row-level security masks restricted customers automatically.",
      "Computes count, AVG order value, and revenue in $M per product line.",
      "Ordered by revenue to highlight top contributors.",
    ],
    rows: [
      { product: 'ML Platform', orders: 18_420, avg_order_value: 4_912.4, revenue_m: 90.5 },
      { product: 'Analytics', orders: 24_110, avg_order_value: 2_844.1, revenue_m: 68.6 },
      { product: 'Data Lake', orders: 11_030, avg_order_value: 3_201.2, revenue_m: 35.3 },
      { product: 'Warehouse', orders: 9_450, avg_order_value: 2_110.7, revenue_m: 19.9 },
    ],
  },
];

/* ------------------------ Before/After comparison data ----------------------- */

export const BEFORE_AFTER_ROWS: Array<{
  dimension: string;
  before: string;
  after: string;
  lift: string;
}> = [
  {
    dimension: 'Data access',
    before: 'Ticket → IAM role → Glue setup (2–5 days)',
    after: 'Self-serve via Governed Data Catalog (minutes)',
    lift: '~40x faster',
  },
  {
    dimension: 'Query authoring',
    before: 'Swivel between Athena, Redshift, EMR consoles',
    after: 'One AI-assisted query editor, NL → SQL',
    lift: '3x faster',
  },
  {
    dimension: 'Notebook compute',
    before: 'Separate SageMaker, EMR, Glue notebooks',
    after: 'One notebook, per-cell kernels (Python/Spark/SQL/R)',
    lift: '2.5x less context switching',
  },
  {
    dimension: 'Governance',
    before: 'Manual IAM + Lake Formation per team',
    after: 'Central domain with row/column-level policies',
    lift: 'Audited by default',
  },
  {
    dimension: 'ML handoff',
    before: 'Export CSV → upload to S3 → re-discover schema',
    after: 'Share notebook + governed dataset in a project',
    lift: 'Zero re-work',
  },
  {
    dimension: 'Onboarding',
    before: '2 weeks (accounts, roles, tools, VPN)',
    after: 'Join a SMUS project — ready in an hour',
    lift: '80% faster',
  },
];

/* ------------------------- Workflow builder nodes ---------------------------- */

export type WorkflowStep = {
  id: string;
  title: string;
  tool: string;
  minutesBefore: number;
  minutesAfter: number;
  desc: string;
};

export const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    id: 'discover',
    title: 'Discover data',
    tool: 'Governed Data Catalog',
    minutesBefore: 240,
    minutesAfter: 10,
    desc: 'Search the GDC, request access, and subscribe — no IAM tickets.',
  },
  {
    id: 'query',
    title: 'Explore with SQL',
    tool: 'AI Query Editor',
    minutesBefore: 90,
    minutesAfter: 15,
    desc: 'Ask in natural language, refine SQL, save as a governed view.',
  },
  {
    id: 'notebook',
    title: 'Prep & feature engineer',
    tool: 'Poly-compute Notebook',
    minutesBefore: 180,
    minutesAfter: 45,
    desc: 'Mix SQL, Python, and Spark cells against the same dataset.',
  },
  {
    id: 'train',
    title: 'Train model',
    tool: 'SageMaker Training',
    minutesBefore: 240,
    minutesAfter: 60,
    desc: 'Kick off training on the managed environment from the notebook.',
  },
  {
    id: 'deploy',
    title: 'Share & deploy',
    tool: 'Project + Endpoint',
    minutesBefore: 120,
    minutesAfter: 20,
    desc: 'Publish to a SMUS project so teammates inherit access + lineage.',
  },
];
