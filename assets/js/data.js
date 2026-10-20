/*
 * All portfolio content lives here. Edit this file to update the site;
 * every section (and the SQL playground) is rendered from it.
 */
window.PORTFOLIO = {
  name: "Vishnu Madhav Machineni",
  firstName: "Vishnu",
  title: "Data Engineer",
  location: "Trier, Germany",
  email: "vishnumachineni03@gmail.com",
  links: {
    github: "https://github.com/VISHNUMAC03",
    linkedin: "" // add your LinkedIn URL here and the button appears automatically
  },
  availability: "Actively looking for full-time Data Engineer roles",
  roles: [
    "Data Engineer",
    "ETL / ELT pipeline builder",
    "Big Data engineer",
    "Cloud data wrangler",
    "SQL optimiser"
  ],
  summary:
    "I build reliable data pipelines that turn raw, messy data into clean, analytics-ready tables. " +
    "With a B.Tech in Computer Science (Big Data), industry experience automating data workflows, APIs and SQL, " +
    "and an ongoing M.Sc. in Data Science at Universität Trier, I care about pipelines that are tested, observable and easy to trust.",

  stats: [
    { value: 10, suffix: "K+", label: "records automated per day" },
    { value: 5, suffix: "K+", label: "users served by my dashboards" },
    { value: 17, suffix: "", label: "months of industry experience" },
    { value: 5, suffix: "", label: "end-to-end data projects" }
  ],

  pipeline: [
    {
      id: "ingest", label: "Ingest", icon: "⇣",
      text: "Pull data from files, databases and REST APIs into a raw zone, untouched and versioned by run, so every load can be replayed.",
      tools: ["Python", "REST APIs", "Azure Data Factory", "AWS Glue"],
      example: "Sales platform: CSV exports plus a live exchange-rate API, landed per run in data/raw/<source>/<run_id>/."
    },
    {
      id: "store", label: "Store", icon: "▤",
      text: "Organise a data lake into raw, clean and curated zones on object storage, using columnar formats where it pays off.",
      tools: ["Amazon S3", "ADLS Gen2", "Parquet"],
      example: "Uber analytics: region-level trip data stored in S3 and catalogued for querying."
    },
    {
      id: "transform", label: "Transform", icon: "⚙",
      text: "Clean, cast, deduplicate and enrich data with pandas, Spark or SQL. Bad rows are quarantined with a reason, never silently dropped.",
      tools: ["pandas", "PySpark", "SQL", "AWS Glue"],
      example: "Sales platform: validation rules for types, duplicates, impossible dates and referential integrity, with rejected rows logged."
    },
    {
      id: "model", label: "Model", icon: "◇",
      text: "Model data into star schemas and reporting tables that analysts can query without reading pipeline code.",
      tools: ["Dimensional modelling", "DuckDB", "dbt", "Snowflake"],
      example: "Sales platform: fct_sales with customer, product and date dimensions across staging, marts and reporting layers."
    },
    {
      id: "validate", label: "Validate", icon: "✓",
      text: "Automated data-quality checks run after every build. If a check fails, the run fails, before anyone sees a wrong number.",
      tools: ["SQL tests", "pytest", "Great Expectations"],
      example: "Sales platform: nine SQL tests for uniqueness, nulls, amounts, integrity, future dates and reconciliation."
    },
    {
      id: "serve", label: "Serve & Orchestrate", icon: "▶",
      text: "Schedule, log and containerise the pipeline, then serve dashboards and queryable tables to the business.",
      tools: ["Docker", "GitHub Actions", "Airflow", "Streamlit", "QuickSight"],
      example: "Sales platform: one-command Docker Compose run, CI on every push, and a Streamlit dashboard."
    }
  ],

  skillCategories: {
    lang: "Languages",
    proc: "Big Data & Processing",
    cloud: "Cloud",
    wh: "Warehousing & Modelling",
    orch: "Orchestration & Streaming",
    ops: "DevOps & Infrastructure",
    dq: "Data Quality & Governance",
    db: "Databases",
    bi: "BI & Visualisation",
    int: "APIs & Integration"
  },
  skillLevels: {
    production: { label: "Used at work", hint: "Used in a professional role" },
    projects: { label: "Used in projects", hint: "Used hands-on in my projects or degree" },
    learning: { label: "Currently learning", hint: "Actively learning and building with it now" }
  },
  skills: [
    { name: "SQL", cat: "lang", level: "production", note: "Optimised queries and database routines to speed up reporting" },
    { name: "Python", cat: "lang", level: "projects", note: "pandas pipelines, orchestration, testing and APIs" },
    { name: "C / C++", cat: "lang", level: "production", note: "Automated workflows processing 10K+ records a day" },
    { name: "JavaScript / React", cat: "lang", level: "production", note: "Responsive dashboards for 5K+ users" },
    { name: "Scala", cat: "lang", level: "learning", note: "For Spark-native development" },

    { name: "Apache Spark / PySpark", cat: "proc", level: "projects", note: "Distributed processing from my Big Data specialisation" },
    { name: "pandas", cat: "proc", level: "projects", note: "Cleaning and validation layer of my sales platform" },
    { name: "Batch & disk-based processing", cat: "proc", level: "projects", note: "Processing data larger than memory" },
    { name: "Hadoop / HDFS", cat: "proc", level: "projects", note: "B.Tech Big Data coursework" },
    { name: "Market-basket analysis", cat: "proc", level: "projects", note: "Apriori, ECLAT and FP-Growth at scale" },

    { name: "Amazon S3", cat: "cloud", level: "projects", note: "Raw zone and data lake storage" },
    { name: "AWS Glue", cat: "cloud", level: "projects", note: "Crawlers and ETL for the Uber analytics project" },
    { name: "Amazon Athena", cat: "cloud", level: "projects", note: "Serverless SQL over S3" },
    { name: "Amazon QuickSight", cat: "cloud", level: "projects", note: "Dashboards for YouTube analytics" },
    { name: "Azure DevOps", cat: "cloud", level: "production", note: "CI, automated testing and deployments at BD" },
    { name: "Azure Data Factory", cat: "cloud", level: "learning", note: "Building a parameterised, config-driven ingestion pipeline" },
    { name: "Azure Data Lake Gen2", cat: "cloud", level: "learning", note: "Landing zone for the AdventureWorks pipeline" },
    { name: "Databricks", cat: "cloud", level: "learning", note: "Spark notebooks and lakehouse workflows" },
    { name: "AWS Lambda", cat: "cloud", level: "learning", note: "Event-driven ingestion" },
    { name: "Amazon Redshift", cat: "cloud", level: "learning", note: "Cloud data warehousing" },
    { name: "Google BigQuery", cat: "cloud", level: "learning", note: "Serverless warehouse" },

    { name: "Dimensional modelling", cat: "wh", level: "projects", note: "Star schema with facts and dimensions" },
    { name: "DuckDB", cat: "wh", level: "projects", note: "Warehouse with raw, staging, marts and reporting schemas" },
    { name: "Data lake zones", cat: "wh", level: "projects", note: "Raw, clean and rejected zones per pipeline run" },
    { name: "dbt", cat: "wh", level: "learning", note: "Moving SQL models into dbt with tests" },
    { name: "Snowflake", cat: "wh", level: "learning", note: "Cloud data warehouse" },
    { name: "Delta Lake / Lakehouse", cat: "wh", level: "learning", note: "ACID tables on the data lake" },
    { name: "Parquet & columnar formats", cat: "wh", level: "learning", note: "Efficient storage for analytics" },

    { name: "Pipeline orchestration in Python", cat: "orch", level: "projects", note: "One entry point with logging and exit codes" },
    { name: "Config-driven pipelines", cat: "orch", level: "projects", note: "JSON-parameterised Lookup and ForEach ingestion" },
    { name: "Apache Airflow", cat: "orch", level: "learning", note: "DAG scheduling and retries" },
    { name: "Apache Kafka", cat: "orch", level: "learning", note: "Event streaming" },
    { name: "Spark Structured Streaming", cat: "orch", level: "learning", note: "Near-real-time processing" },

    { name: "Git & GitHub", cat: "ops", level: "production", note: "Version control and team collaboration" },
    { name: "CI/CD", cat: "ops", level: "production", note: "Azure DevOps pipelines and GitHub Actions" },
    { name: "Docker & Compose", cat: "ops", level: "projects", note: "One-command, reproducible pipeline runs" },
    { name: "Linux & Bash", cat: "ops", level: "learning", note: "Shell scripting and servers" },
    { name: "Terraform", cat: "ops", level: "learning", note: "Infrastructure as code" },

    { name: "Data validation rules", cat: "dq", level: "projects", note: "Schema, types, duplicates and business rules" },
    { name: "SQL data tests", cat: "dq", level: "projects", note: "Tests that return failing rows and fail the run" },
    { name: "pytest", cat: "dq", level: "projects", note: "Unit and end-to-end pipeline tests" },
    { name: "Great Expectations", cat: "dq", level: "learning", note: "Declarative data-quality suites" },
    { name: "Data lineage & cataloguing", cat: "dq", level: "learning", note: "Knowing where every number comes from" },

    { name: "Relational databases", cat: "db", level: "production", note: "Database management and query tuning" },
    { name: "PostgreSQL", cat: "db", level: "learning", note: "Open-source RDBMS" },
    { name: "MongoDB / NoSQL", cat: "db", level: "learning", note: "Document stores" },

    { name: "Data visualisation", cat: "bi", level: "projects", note: "Turning tables into decisions" },
    { name: "Streamlit", cat: "bi", level: "projects", note: "Interactive revenue and data-quality dashboard" },
    { name: "Plotly", cat: "bi", level: "projects", note: "Interactive charts" },
    { name: "Power BI", cat: "bi", level: "learning", note: "Business dashboards" },

    { name: "REST APIs", cat: "int", level: "production", note: "Built and maintained APIs connecting internal systems" },
    { name: "API ingestion", cat: "int", level: "projects", note: "Live exchange rates with an offline fallback" },
    { name: "SAP EWM", cat: "int", level: "learning", note: "Beginner understanding of Extended Warehouse Management" }
  ],

  experience: [
    {
      company: "GroupUP Solutions", role: "Software Developer", location: "Hyderabad, India",
      start: "Jun 2024", end: "Jun 2025",
      bullets: [
        "Automated data-processing workflows in C, handling 10K+ records a day and cutting manual data entry and reconciliation.",
        "Built and maintained responsive websites and dashboards in ReactJS, used by 5K+ people across the organisation.",
        "Developed and maintained RESTful APIs that keep data flowing automatically between internal systems.",
        "Optimised SQL queries and database routines to speed up reporting and data retrieval.",
        "Owned ongoing maintenance: bug fixes, updates and performance monitoring."
      ],
      tags: ["C", "SQL", "REST APIs", "ReactJS", "Automation"]
    },
    {
      company: "Becton, Dickinson and Company", role: "Software Developer", location: "Chandigarh, India",
      start: "Jun 2023", end: "Nov 2023",
      bullets: [
        "Used Azure DevOps across the software lifecycle: continuous integration, automated testing and streamlined deployments.",
        "Used Git for version control, keeping collaboration smooth and project history clear.",
        "Completed extensive training in core software-development technologies.",
        "Reviewed progress regularly with a mentor to deepen understanding of the stack."
      ],
      tags: ["Azure DevOps", "CI/CD", "Git", "Testing"]
    }
  ],

  education: [
    {
      degree: "Master of Science in Data Science", school: "Universität Trier", location: "Trier, Germany",
      start: "Apr 2026", end: "Present", detail: "EQF level 7"
    },
    {
      degree: "B.Tech in Computer Science Engineering (Big Data)", school: "University of Petroleum and Energy Studies",
      location: "Dehradun, India", start: "Aug 2020", end: "Apr 2024", detail: "EQF level 6 · Big Data specialisation"
    }
  ],

  projectFilters: { all: "All", de: "Data Engineering", aws: "AWS", azure: "Azure", analytics: "Analytics" },
  projects: [
    {
      id: "sales-platform", featured: true,
      title: "Automated Sales Analytics Data Platform",
      year: "2026", status: "Complete", cats: ["de", "analytics"],
      summary: "An end-to-end platform that ingests sales files and a live currency API, validates every row, models a star schema in SQL and serves a dashboard, all in one Docker command.",
      problem: "Real sales exports arrive with duplicates, impossible dates, bad currencies and missing IDs. Reports built on them silently go wrong.",
      built: [
        "Ingestion of CSVs plus the Frankfurter exchange-rate API into a raw zone versioned per run, with optional S3 upload.",
        "A pandas validation layer covering schema, types, duplicates, missing values, business rules and referential integrity. Every rejected row is stored with its reason.",
        "A DuckDB warehouse with raw, staging, marts, reporting and meta schemas, and a fct_sales star schema with three dimensions.",
        "Nine SQL data-quality tests, including reconciliation of reporting totals to the fact table. Any failure fails the run.",
        "A Streamlit dashboard, Docker Compose packaging, and GitHub Actions CI with pytest on every push."
      ],
      outcome: "Bad data is caught before it reaches a chart, and anyone can reproduce the whole platform with one command.",
      flow: ["CSV + API", "Raw zone", "Validate", "DuckDB star schema", "SQL tests", "Dashboard"],
      stack: ["Python", "pandas", "SQL", "DuckDB", "Streamlit", "Docker", "GitHub Actions", "pytest", "REST API", "S3"],
      links: [{ label: "Code on GitHub", url: "https://github.com/VISHNUMAC03/sales-analytics-platform" }]
    },
    {
      id: "adventureworks", featured: true,
      title: "AdventureWorks Dynamic Ingestion Pipeline",
      year: "2026", status: "In progress", cats: ["de", "azure"],
      summary: "A config-driven ingestion pipeline that lands ten AdventureWorks tables from GitHub into a data lake using one parameterised copy activity.",
      problem: "Hard-coding one copy activity per file does not scale. Adding a table should mean adding a line of config, not a new pipeline.",
      built: [
        "Published the source dataset: 10 related CSV tables with 56K sales order lines (2015–2017), 18K customers, products, returns and territories, documented with an ER diagram.",
        "A JSON control file with one entry per table: relative source URL, sink folder and sink file name.",
        "A Lookup activity reads the control file and a ForEach loop feeds each entry into parameterised HTTP and data-lake datasets."
      ],
      outcome: "New tables are onboarded by adding one JSON entry. Next steps are Spark transformations and a serving layer.",
      flow: ["GitHub raw", "Lookup config", "ForEach", "Parameterised copy", "Data lake"],
      stack: ["Azure Data Factory", "ADLS Gen2", "JSON", "HTTP", "GitHub"],
      links: [{ label: "Dataset on GitHub", url: "https://github.com/VISHNUMAC03/AWDataset" }]
    },
    {
      id: "uber", featured: false,
      title: "Uber Data Analytics on AWS",
      year: "2023", status: "Complete", cats: ["de", "aws", "analytics"],
      summary: "Region-level analysis of taxi trip data on AWS to optimise fleet management and support the move to electric vehicles.",
      problem: "Fleet decisions were made without a region-by-region view of demand, routes and vehicle use.",
      built: [
        "Stored trip data in Amazon S3 and catalogued and transformed it with AWS Glue.",
        "Queried the data with Amazon Athena for region-specific analysis.",
        "Designed route-optimisation strategies and analysis supporting the transition to EVs."
      ],
      outcome: "Leaner fleet operations and data-backed input for route efficiency and profitability.",
      flow: ["Trip data", "S3", "Glue", "Athena", "Insights"],
      stack: ["Amazon S3", "AWS Glue", "Amazon Athena", "SQL", "Python"],
      links: []
    },
    {
      id: "youtube", featured: false,
      title: "YouTube Data Analysis",
      year: "2023", status: "Complete", cats: ["de", "aws", "analytics"],
      summary: "An end-to-end framework for ingesting, processing and visualising YouTube data on AWS.",
      problem: "Raw YouTube statistics are scattered across regions and formats, so content strategy is guesswork.",
      built: [
        "An end-to-end cloud pipeline for data ingestion, processing and visualisation.",
        "Efficient querying with Amazon Athena.",
        "Dashboards in Amazon QuickSight for audience and engagement insights."
      ],
      outcome: "Actionable insights for content strategy, and hands-on experience integrating multiple AWS services.",
      flow: ["YouTube data", "S3", "Processing", "Athena", "QuickSight"],
      stack: ["AWS", "Amazon Athena", "Amazon QuickSight", "S3", "SQL"],
      links: []
    },
    {
      id: "basket", featured: false,
      title: "ECLAT vs FP-Growth vs Apriori",
      year: "2022", status: "Complete", cats: ["analytics"],
      summary: "A comparative study of frequent-itemset mining algorithms for stockpile management, using market-basket analysis.",
      problem: "Small and medium businesses rarely use the market-basket analytics that large retailers rely on.",
      built: [
        "Analysed how widely frequent-itemset mining is used across major global enterprises.",
        "Compared ECLAT, Apriori and FP-Growth on execution time and scalability.",
        "Ran training, validation and testing with tuned data loading and optimisation techniques."
      ],
      outcome: "A practical case for bringing these models to SMEs, not just retailers like Amazon and Walmart.",
      flow: ["Transactions", "Itemset mining", "Benchmark", "Recommendations"],
      stack: ["Python", "Apriori", "ECLAT", "FP-Growth", "Data analysis"],
      links: []
    }
  ],

  awards: [
    { title: "1st prize, Spandan Group Dance Competition", place: "UPES", date: "Feb 2023" },
    { title: "3rd prize, Uurja Inter-school Dance Competition", place: "UPES", date: "Oct 2023" },
    { title: "2nd prize, Spandan Group Dance Competition", place: "UPES", date: "Feb 2024" }
  ],
  leadership: {
    title: "Core Member & Recruitment Head, Lazarus Dance Crew",
    dates: "Oct 2022 – Apr 2024",
    text: "Led recruitment for the university dance crew and performed in competitive group events. The same teamwork, rehearsal discipline and stage nerves carry straight into on-call data work."
  },
  languages: [
    { name: "Telugu", level: "Native", pct: 100 },
    { name: "English", level: "C1 writing · B2", pct: 85 },
    { name: "Hindi", level: "B1–B2", pct: 60 },
    { name: "German", level: "A1 · learning", pct: 20 }
  ],
  lookingFor: [
    "Data Engineer",
    "Big Data Engineer",
    "Analytics Engineer",
    "ETL / Data Pipeline Developer"
  ]
};
