import natural from 'natural';

const jobTitles = [
  // General Software & Web Development
  "Software Engineer", "Software Developer", "Full Stack Developer", "Frontend Developer", "Backend Developer",
  "Web Developer", "Application Developer", "Mobile App Developer", "Embedded Systems Developer", "Game Developer",

  // Frontend Development
  "React Developer", "Angular Developer", "Vue.js Developer", "JavaScript Developer", "HTML/CSS Developer",
  "UI Developer", "Frontend Engineer", "Bootstrap Developer", "Web UI Designer", "Frontend Architect",

  // Backend Development
  "Node.js Developer", "Python Backend Developer", "Java Backend Developer", "C# Backend Developer", "Ruby on Rails Developer",
  "PHP Developer", "Go Backend Developer", "Rust Developer", "Django Developer", "Spring Boot Developer",

  // Full Stack Development
  "MERN Stack Developer", "MEAN Stack Developer", "LAMP Stack Developer", "JAMstack Developer", "GraphQL Developer",
  "Web Application Developer", "Full Stack JavaScript Developer", "Serverless Developer", "Progressive Web App Developer", "WordPress Developer",

  // Cloud & DevOps
  "Cloud Engineer", "DevOps Engineer", "AWS Solutions Architect", "Azure Cloud Engineer", "Google Cloud Engineer",
  "Cloud Security Engineer", "Kubernetes Engineer", "Site Reliability Engineer (SRE)", "CI/CD Engineer", "Infrastructure Engineer",

  // Cybersecurity
  "Cybersecurity Analyst", "Ethical Hacker", "Security Engineer", "Penetration Tester", "Incident Response Analyst",
  "Forensic Analyst", "Cloud Security Analyst", "Threat Intelligence Analyst", "Security Operations Center (SOC) Analyst", "IT Security Auditor",

  // Artificial Intelligence & Machine Learning
  "Machine Learning Engineer", "AI Engineer", "Deep Learning Engineer", "Natural Language Processing (NLP) Engineer", "Computer Vision Engineer",
  "AI Research Scientist", "Data Scientist", "Big Data Engineer", "Predictive Analytics Engineer", "AI Chatbot Developer",

  // Data Science & Analytics
  "Data Engineer", "Data Scientist", "Data Analyst", "Business Intelligence Developer", "SQL Developer",
  "ETL Developer", "Data Warehouse Engineer", "Big Data Architect", "Hadoop Developer", "Power BI Developer",

  // Blockchain & Web3
  "Blockchain Developer", "Solidity Developer", "Smart Contract Developer", "Crypto Analyst", "DeFi Engineer",
  "NFT Developer", "Web3 Developer", "Ethereum Developer", "Hyperledger Developer", "Distributed Ledger Engineer",

  // Game Development & AR/VR
  "Game Developer", "Unity Developer", "Unreal Engine Developer", "Game Designer", "VR Developer",
  "AR Developer", "Metaverse Developer", "3D Game Artist", "Game AI Developer", "Mobile Game Developer",

  // Software Testing & QA
  "QA Engineer", "Test Automation Engineer", "Software Test Engineer", "SDET (Software Development Engineer in Test)", "Manual QA Tester",
  "Performance Test Engineer", "Security Test Engineer", "Mobile App QA Engineer", "Load Tester", "Penetration Testing Specialist",

  // IT & System Administration
  "IT Support Specialist", "System Administrator", "Network Administrator", "Help Desk Technician", "Database Administrator (DBA)",
  "Cloud Administrator", "Windows System Administrator", "Linux Administrator", "IT Consultant", "IT Project Manager",

  // Product & Business Management
  "Product Manager", "Technical Program Manager", "Business Analyst", "Scrum Master", "Agile Coach",
  "IT Business Consultant", "Digital Transformation Consultant", "Growth Hacker", "Customer Success Engineer", "Technical Account Manager",

  // Marketing & Content
  "SEO Specialist", "Digital Marketing Manager", "Content Writer", "Technical Writer", "Social Media Manager",
  "E-commerce Manager", "Copywriter", "Marketing Analyst", "Conversion Rate Optimization (CRO) Specialist", "UX Writer",

  // Emerging Tech & Research
  "Quantum Computing Researcher", "IoT Developer", "AI Ethics Researcher", "Bioinformatics Scientist", "Industrial Automation Engineer",
  "Telecommunications Engineer", "GIS Analyst", "Computer Scientist", "Cryptography Engineer", "Digital Twin Developer"
];
const companies = [
  // Big Tech Companies
  "Google", "Microsoft", "Amazon", "Meta (Facebook)", "Apple", "Netflix", "Tesla", "IBM", "Intel", "Oracle",

  // Cloud Computing & Enterprise Tech
  "Salesforce", "SAP", "Adobe", "VMware", "Cisco", "ServiceNow", "Snowflake", "Red Hat", "Atlassian", "Zoom",

  // AI & Machine Learning
  "OpenAI", "DeepMind", "NVIDIA", "Anthropic", "Cohere", "Hugging Face", "Stability AI", "DataRobot", "Graphcore", "Cerebras Systems",

  // Cybersecurity
  "CrowdStrike", "Palo Alto Networks", "Fortinet", "CyberArk", "McAfee", "Symantec", "Trend Micro", "Check Point Software", "Zscaler", "Okta",

  // FinTech & Payments
  "PayPal", "Stripe", "Square (Block)", "Robinhood", "Plaid", "Adyen", "Revolut", "Wise", "Coinbase", "Chime",

  // Social Media & Entertainment
  "TikTok (ByteDance)", "Snapchat", "Pinterest", "Spotify", "Reddit", "Discord", "Twitch", "Quora", "YouTube", "Hulu",

  // E-commerce & Retail Tech
  "Shopify", "eBay", "Alibaba", "Etsy", "Walmart", "Target", "Best Buy", "Wayfair", "Zalando", "Mercado Libre",

  // Telecom & Networking
  "Verizon", "AT&T", "T-Mobile", "Qualcomm", "Ericsson", "Nokia", "Huawei", "Broadcom", "Juniper Networks", "Arista Networks",

  // Semiconductor & Chip Companies
  "AMD", "TSMC", "ARM", "Micron Technology", "Western Digital", "Texas Instruments", "GlobalFoundries", "SK Hynix", "Seagate", "Intel Foundry Services",

  // Automotive & Mobility Tech
  "Uber", "Lyft", "Waymo", "Rivian", "Lucid Motors", "NIO", "BYD", "Toyota Connected", "Cruise", "Aptiv",

  // HealthTech & Biotech
  "Moderna", "Pfizer", "Johnson & Johnson", "Roche", "Illumina", "GE Healthcare", "Medtronic", "Siemens Healthineers", "Teladoc Health", "23andMe",

  // Game Development & Esports
  "Activision Blizzard", "Electronic Arts (EA)", "Ubisoft", "Epic Games", "Riot Games", "Valve", "Nintendo", "Sony Interactive Entertainment", "Rockstar Games", "Bethesda",

  // Blockchain & Web3
  "Ripple", "Chainlink Labs", "Binance", "Kraken", "BitPay", "Polygon", "Solana Labs", "Ledger", "Gemini", "ConsenSys",

  // Consulting & IT Services
  "Accenture", "Capgemini", "Infosys", "Wipro", "TCS (Tata Consultancy Services)", "Cognizant", "Deloitte", "PwC", "EY (Ernst & Young)", "KPMG",

  // Robotics & Automation
  "Boston Dynamics", "iRobot", "ABB Robotics", "Fanuc", "KUKA Robotics", "Universal Robots", "Tesla Robotics", "Omron Robotics", "Agility Robotics", "Fetch Robotics",

  // Space & Aerospace Tech
  "SpaceX", "Blue Origin", "Boeing", "Lockheed Martin", "Northrop Grumman", "Sierra Nevada Corporation", "Rocket Lab", "Astra", "Virgin Galactic", "Relativity Space"
];
const locations = [
  // Major Metro Cities
  "Mumbai", "Delhi", "Bengaluru", "Hyderabad", "Chennai", "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Lucknow",

  // Maharashtra Districts
  "Nagpur", "Nashik", "Thane", "Aurangabad", "Solapur", "Kolhapur", "Satara", "Pune", "Amravati", "Latur",

  // Uttar Pradesh Districts
  "Kanpur", "Varanasi", "Agra", "Meerut", "Ghaziabad", "Allahabad (Prayagraj)", "Noida", "Bareilly", "Gorakhpur", "Aligarh",

  // Tamil Nadu Districts
  "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli", "Erode", "Thoothukudi", "Vellore", "Dindigul", "Thanjavur",

  // Karnataka Districts
  "Mysuru", "Mangalore", "Hubballi", "Belagavi", "Shivamogga", "Davangere", "Ballari", "Udupi", "Bidar", "Gulbarga",

  // West Bengal Districts
  "Howrah", "Durgapur", "Asansol", "Siliguri", "Nadia", "Medinipur", "Malda", "Murshidabad", "Bankura", "Jalpaiguri",

  // Gujarat Districts
  "Surat", "Rajkot", "Vadodara", "Bhavnagar", "Jamnagar", "Gandhinagar", "Anand", "Mehsana", "Vapi", "Navsari",

  // Rajasthan Districts
  "Jodhpur", "Udaipur", "Kota", "Ajmer", "Bikaner", "Alwar", "Bhilwara", "Chittorgarh", "Sikar", "Pali",

  // Madhya Pradesh Districts
  "Indore", "Bhopal", "Jabalpur", "Gwalior", "Ujjain", "Satna", "Sagar", "Dewas", "Rewa", "Chhindwara",

  // Bihar Districts
  "Patna", "Gaya", "Muzaffarpur", "Bhagalpur", "Purnia", "Darbhanga", "Begusarai", "Saharsa", "Samastipur", "Siwan",

  // Kerala Districts
  "Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam", "Alappuzha", "Palakkad", "Malappuram", "Kannur", "Kottayam",

  // Andhra Pradesh Districts
  "Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Rajahmundry", "Kadapa", "Tirupati", "Anantapur", "Chittoor",

  // Telangana Districts
  "Hyderabad", "Warangal", "Karimnagar", "Nizamabad", "Khammam", "Rangareddy", "Mahbubnagar", "Siddipet", "Medak", "Adilabad",

  // Odisha Districts
  "Bhubaneswar", "Cuttack", "Rourkela", "Sambalpur", "Puri", "Balasore", "Berhampur", "Jharsuguda", "Kendujhar", "Koraput",

  // Punjab Districts
  "Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Mohali", "Hoshiarpur", "Pathankot", "Firozpur", "Sangrur",

  // Haryana Districts
  "Gurgaon", "Faridabad", "Panipat", "Ambala", "Rohtak", "Hisar", "Karnal", "Yamunanagar", "Bhiwani", "Sirsa",

  // Northeast India Districts
  "Guwahati", "Shillong", "Agartala", "Imphal", "Aizawl", "Kohima", "Gangtok", "Dimapur", "Itanagar", "Silchar"
];

export const searchSuggestions = (query, type) => {
  if (!query) return [];
  const tokenizer = new natural.WordTokenizer();
  const words = tokenizer.tokenize(query.toLowerCase());

  let dataSource = type === 'job' ? jobTitles : type === 'company' ? companies : locations;

  return dataSource
  .filter(item => words.some(word => item.toLowerCase().includes(word)))
  .sort((a, b) => {
    const aStartsWith = a.toLowerCase().startsWith(query.toLowerCase());
    const bStartsWith = b.toLowerCase().startsWith(query.toLowerCase());

    if (aStartsWith && !bStartsWith) return -1;
    if (!aStartsWith && bStartsWith) return 1;
    return a.localeCompare(b); 
  });
};
