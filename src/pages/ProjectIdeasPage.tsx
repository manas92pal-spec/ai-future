import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, Code2, Layers, BarChart3, Loader2, Github, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const fields = ["AI / Machine Learning", "Web Development", "Cybersecurity", "Data Science", "Mobile Development", "Blockchain / Web3", "Game Development", "DevOps / Cloud", "IoT & Embedded"];
const levels = ["Beginner", "Intermediate", "Advanced"];

const mkProject = (title: string, desc: string, stack: string[], difficulty: string, outcomes: string[], structure: string) => ({ title, desc, stack, difficulty, outcomes, structure });

const projectBank: Record<string, Record<string, any[]>> = {
  "AI / Machine Learning": {
    Beginner: [
      mkProject("Spam Email Classifier", "Build an ML model that classifies emails as spam or not spam using Naive Bayes.", ["Python", "Scikit-learn", "Pandas"], "Easy", ["Text classification", "Feature extraction", "Model evaluation"], "spam-classifier/\n├── data/\n├── model.py\n├── train.py\n└── README.md"),
      mkProject("Handwritten Digit Recognizer", "Neural network recognizing handwritten digits from MNIST.", ["Python", "TensorFlow", "NumPy"], "Easy", ["Neural network basics", "Image classification", "Model training"], "digit-recognizer/\n├── model.py\n├── train.py\n├── predict.py\n└── README.md"),
      mkProject("Movie Recommendation Engine", "Content-based movie recommender using cosine similarity.", ["Python", "Pandas", "Scikit-learn"], "Easy", ["Recommendation algorithms", "Similarity metrics", "Data preprocessing"], "movie-recommender/\n├── recommender.py\n├── data/\n└── README.md"),
    ],
    Intermediate: [
      mkProject("Sentiment Analysis Dashboard", "Real-time social media sentiment analysis with visualization.", ["Python", "NLTK", "Streamlit", "Plotly"], "Medium", ["NLP fundamentals", "Real-time processing", "Dashboard building"], "sentiment-dashboard/\n├── app.py\n├── analyzer.py\n└── README.md"),
      mkProject("Object Detection System", "Detect and classify objects in images using YOLO.", ["Python", "OpenCV", "PyTorch"], "Medium", ["Computer vision", "Transfer learning", "Real-time detection"], "object-detection/\n├── detect.py\n├── models/\n└── README.md"),
      mkProject("AI Music Generator", "Generate music compositions using recurrent neural networks.", ["Python", "TensorFlow", "MIDI"], "Medium", ["Sequence modeling", "Audio processing", "Creative AI"], "music-gen/\n├── model.py\n├── generate.py\n└── README.md"),
    ],
    Advanced: [
      mkProject("AI-Powered Code Reviewer", "AI tool that reviews code, suggests improvements, and detects bugs.", ["Python", "OpenAI API", "FastAPI", "React"], "Hard", ["LLM integration", "Code analysis", "Full-stack dev"], "code-reviewer/\n├── backend/\n├── frontend/\n└── README.md"),
      mkProject("Autonomous Trading Bot", "ML-powered trading bot with backtesting and risk management.", ["Python", "PyTorch", "Pandas", "Alpaca API"], "Hard", ["Time series ML", "Financial modeling", "Risk management"], "trading-bot/\n├── strategy/\n├── backtest/\n└── README.md"),
      mkProject("Multi-Agent AI System", "Build cooperating AI agents that solve complex tasks together.", ["Python", "LangChain", "OpenAI", "FastAPI"], "Hard", ["Agent architecture", "Tool use", "Orchestration"], "multi-agent/\n├── agents/\n├── tools/\n└── README.md"),
    ],
  },
  "Web Development": {
    Beginner: [
      mkProject("Personal Portfolio", "Responsive portfolio with project showcase and contact form.", ["HTML", "CSS", "JavaScript"], "Easy", ["Responsive design", "DOM manipulation", "Forms"], "portfolio/\n├── index.html\n├── styles.css\n└── README.md"),
      mkProject("Weather Dashboard", "Fetch and display weather data with search functionality.", ["HTML", "CSS", "JavaScript", "API"], "Easy", ["API calls", "Async JS", "UI design"], "weather-app/\n├── index.html\n├── app.js\n└── README.md"),
      mkProject("Quiz Application", "Interactive quiz app with scoring, timer, and categories.", ["HTML", "CSS", "JavaScript"], "Easy", ["State management", "Timers", "Local storage"], "quiz-app/\n├── index.html\n├── quiz.js\n└── README.md"),
    ],
    Intermediate: [
      mkProject("Real-Time Chat App", "Chat with rooms, auth, and real-time messaging.", ["React", "Node.js", "Socket.io", "MongoDB"], "Medium", ["WebSocket", "Authentication", "Database design"], "chat-app/\n├── client/\n├── server/\n└── README.md"),
      mkProject("Blog Platform with CMS", "Full-featured blog with markdown editor and admin panel.", ["Next.js", "PostgreSQL", "Prisma", "MDX"], "Medium", ["SSR/SSG", "CMS architecture", "Rich text editing"], "blog-cms/\n├── app/\n├── prisma/\n└── README.md"),
      mkProject("Task Management Tool", "Kanban-style task manager with drag-and-drop and teams.", ["React", "Node.js", "PostgreSQL", "DnD"], "Medium", ["Drag-and-drop", "Real-time updates", "Team features"], "task-manager/\n├── client/\n├── server/\n└── README.md"),
    ],
    Advanced: [
      mkProject("E-Commerce Platform", "Full e-commerce with payments, inventory, and admin dashboard.", ["Next.js", "Stripe", "PostgreSQL", "Prisma"], "Hard", ["Payment integration", "Admin systems", "Scalable arch"], "ecommerce/\n├── app/\n├── prisma/\n└── README.md"),
      mkProject("Real-Time Collaboration Editor", "Google Docs-like collaborative document editor.", ["React", "WebSocket", "CRDT", "Node.js"], "Hard", ["CRDTs", "Operational transforms", "Real-time sync"], "collab-editor/\n├── client/\n├── server/\n└── README.md"),
      mkProject("Video Streaming Platform", "YouTube-like platform with uploads, transcoding, and comments.", ["Next.js", "FFmpeg", "AWS S3", "PostgreSQL"], "Hard", ["Video processing", "CDN", "Streaming protocols"], "video-platform/\n├── app/\n├── services/\n└── README.md"),
    ],
  },
  "Cybersecurity": {
    Beginner: [
      mkProject("Password Strength Checker", "Tool that evaluates passwords and suggests improvements.", ["Python", "Regex"], "Easy", ["Security fundamentals", "Pattern matching"], "password-checker/\n├── checker.py\n└── README.md"),
      mkProject("Caesar Cipher Tool", "Encrypt/decrypt messages with various cipher algorithms.", ["Python", "Tkinter"], "Easy", ["Cryptography basics", "Encoding", "GUI"], "cipher-tool/\n├── cipher.py\n├── gui.py\n└── README.md"),
      mkProject("Port Scanner", "Simple network port scanner to discover open services.", ["Python", "Socket"], "Easy", ["Networking", "TCP/IP", "Service discovery"], "port-scanner/\n├── scanner.py\n└── README.md"),
    ],
    Intermediate: [
      mkProject("Vulnerability Scanner", "Scans networks for common vulnerabilities and open ports.", ["Python", "Nmap", "Flask"], "Medium", ["Vuln detection", "Network scanning", "Reporting"], "vuln-scanner/\n├── scanner.py\n├── web/\n└── README.md"),
      mkProject("Phishing Detection System", "ML-based system to detect phishing emails and URLs.", ["Python", "Scikit-learn", "Flask"], "Medium", ["ML for security", "Feature engineering", "URL analysis"], "phishing-detect/\n├── model.py\n├── app.py\n└── README.md"),
      mkProject("Keylogger Detector", "Tool to detect and alert on keylogger activity.", ["Python", "psutil", "WMI"], "Medium", ["Process monitoring", "Threat detection", "System hooks"], "keylog-detector/\n├── detector.py\n└── README.md"),
    ],
    Advanced: [
      mkProject("SIEM Dashboard", "Platform to track, analyze, and respond to security incidents.", ["React", "Node.js", "ElasticSearch", "Docker"], "Hard", ["Log analysis", "Incident management", "Containerization"], "siem/\n├── frontend/\n├── backend/\n└── README.md"),
      mkProject("Honeypot System", "Deployable honeypot that captures and analyzes attack patterns.", ["Python", "Docker", "MongoDB", "ELK Stack"], "Hard", ["Deception tech", "Attack analysis", "Forensics"], "honeypot/\n├── services/\n├── analysis/\n└── README.md"),
      mkProject("Zero-Trust Security Framework", "Implement a zero-trust architecture with identity verification.", ["Go", "OAuth2", "mTLS", "Kubernetes"], "Hard", ["Zero trust", "Identity mgmt", "mTLS"], "zero-trust/\n├── auth/\n├── proxy/\n└── README.md"),
    ],
  },
  "Data Science": {
    Beginner: [
      mkProject("COVID-19 Data Dashboard", "Visualize pandemic trends with interactive charts.", ["Python", "Pandas", "Plotly", "Streamlit"], "Easy", ["Data cleaning", "Visualization", "Dashboards"], "covid-dashboard/\n├── app.py\n└── README.md"),
      mkProject("Sales Data Explorer", "Analyze and visualize retail sales data patterns.", ["Python", "Pandas", "Matplotlib"], "Easy", ["EDA", "Data wrangling", "Charts"], "sales-explorer/\n├── analysis.py\n└── README.md"),
      mkProject("Survey Analysis Tool", "Process and visualize survey responses with insights.", ["Python", "Pandas", "Seaborn"], "Easy", ["Survey analysis", "Statistical summaries", "Reports"], "survey-tool/\n├── analyze.py\n└── README.md"),
    ],
    Intermediate: [
      mkProject("Customer Churn Predictor", "Predict which customers will leave and why.", ["Python", "Scikit-learn", "XGBoost", "Streamlit"], "Medium", ["Predictive modeling", "Feature importance", "Business insights"], "churn-predictor/\n├── model.py\n├── app.py\n└── README.md"),
      mkProject("Recommendation System", "Collaborative filtering recommendation engine.", ["Python", "Surprise", "FastAPI"], "Medium", ["Collaborative filtering", "Matrix factorization", "API design"], "recommender/\n├── model.py\n├── api.py\n└── README.md"),
      mkProject("Time Series Forecasting", "Forecast stock prices or weather using ARIMA/Prophet.", ["Python", "Prophet", "Statsmodels"], "Medium", ["Time series", "Forecasting", "Seasonality analysis"], "forecast/\n├── model.py\n├── visualize.py\n└── README.md"),
    ],
    Advanced: [
      mkProject("Real-Time Analytics Pipeline", "Streaming analytics processing millions of events.", ["Kafka", "Spark", "PostgreSQL", "Grafana"], "Hard", ["Stream processing", "Big data", "Infrastructure"], "analytics-pipeline/\n├── producer/\n├── consumer/\n└── README.md"),
      mkProject("Causal Inference Engine", "Platform for running causal analysis on observational data.", ["Python", "DoWhy", "EconML", "Streamlit"], "Hard", ["Causal inference", "A/B testing", "Statistical methods"], "causal-engine/\n├── engine.py\n├── app.py\n└── README.md"),
      mkProject("Automated ML Pipeline", "End-to-end AutoML system with model selection and tuning.", ["Python", "Optuna", "MLflow", "FastAPI"], "Hard", ["AutoML", "Hyperparameter tuning", "Model registry"], "automl/\n├── pipeline.py\n├── api.py\n└── README.md"),
    ],
  },
  "Mobile Development": {
    Beginner: [
      mkProject("Todo App", "Simple task manager with local storage and categories.", ["React Native", "AsyncStorage"], "Easy", ["Mobile UI", "State management", "Local storage"], "todo-app/\n├── App.js\n├── components/\n└── README.md"),
      mkProject("Weather App", "Display current weather and forecasts by location.", ["Flutter", "Dart", "Weather API"], "Easy", ["API integration", "Location services", "Material Design"], "weather-flutter/\n├── lib/\n└── README.md"),
      mkProject("Calculator App", "Scientific calculator with history and themes.", ["React Native", "JavaScript"], "Easy", ["UI components", "Math operations", "Theming"], "calculator/\n├── App.js\n└── README.md"),
    ],
    Intermediate: [
      mkProject("Fitness Tracker", "Track workouts, calories, and progress with charts.", ["React Native", "Firebase", "Charts"], "Medium", ["Health data", "Charts", "Firebase"], "fitness-tracker/\n├── src/\n├── firebase/\n└── README.md"),
      mkProject("Food Delivery App", "Restaurant browsing, cart, and order tracking.", ["Flutter", "Firebase", "Google Maps"], "Medium", ["Maps integration", "Real-time updates", "Payments"], "food-delivery/\n├── lib/\n└── README.md"),
      mkProject("Expense Tracker", "Track expenses with categories, budgets, and analytics.", ["React Native", "SQLite", "Charts"], "Medium", ["Local database", "Financial UI", "Analytics"], "expense-tracker/\n├── src/\n└── README.md"),
    ],
    Advanced: [
      mkProject("Social Media App", "Instagram-like app with posts, stories, and messaging.", ["React Native", "Firebase", "Cloud Functions"], "Hard", ["Social features", "Media upload", "Real-time chat"], "social-app/\n├── src/\n├── functions/\n└── README.md"),
      mkProject("AR Shopping Experience", "Try products in AR before buying.", ["Flutter", "ARCore/ARKit", "Firebase"], "Hard", ["Augmented reality", "3D rendering", "E-commerce"], "ar-shopping/\n├── lib/\n└── README.md"),
      mkProject("Cross-Platform Music Streamer", "Spotify-like music player with playlists and offline mode.", ["React Native", "FFmpeg", "Node.js"], "Hard", ["Audio streaming", "Offline storage", "Background playback"], "music-streamer/\n├── src/\n├── server/\n└── README.md"),
    ],
  },
  "Blockchain / Web3": {
    Beginner: [
      mkProject("Crypto Price Tracker", "Track cryptocurrency prices with real-time updates.", ["React", "CoinGecko API"], "Easy", ["API integration", "Real-time data", "Charts"], "crypto-tracker/\n├── src/\n└── README.md"),
      mkProject("Simple Smart Contract", "Deploy a basic smart contract on a testnet.", ["Solidity", "Hardhat", "Ethers.js"], "Easy", ["Smart contracts", "Blockchain basics", "Deployment"], "smart-contract/\n├── contracts/\n├── scripts/\n└── README.md"),
    ],
    Intermediate: [
      mkProject("NFT Marketplace", "Mint, buy, and sell NFTs with a beautiful gallery.", ["React", "Solidity", "IPFS", "Ethers.js"], "Medium", ["NFT standards", "IPFS storage", "Web3 UI"], "nft-marketplace/\n├── contracts/\n├── frontend/\n└── README.md"),
      mkProject("DAO Voting System", "Decentralized voting with proposal creation and governance.", ["Solidity", "React", "Hardhat"], "Medium", ["Governance", "Token voting", "Proposal systems"], "dao-voting/\n├── contracts/\n├── frontend/\n└── README.md"),
    ],
    Advanced: [
      mkProject("DeFi Lending Protocol", "Decentralized lending and borrowing platform.", ["Solidity", "React", "Chainlink", "Hardhat"], "Hard", ["DeFi mechanics", "Oracle integration", "Liquidation"], "defi-lending/\n├── contracts/\n├── frontend/\n└── README.md"),
      mkProject("Cross-Chain Bridge", "Bridge tokens between different blockchain networks.", ["Solidity", "Go", "React"], "Hard", ["Cross-chain", "Bridge security", "Multi-chain"], "cross-chain-bridge/\n├── contracts/\n├── relayer/\n└── README.md"),
    ],
  },
  "Game Development": {
    Beginner: [
      mkProject("2D Platformer", "Classic side-scrolling platformer with levels.", ["Unity", "C#"], "Easy", ["Game mechanics", "2D physics", "Level design"], "platformer/\n├── Assets/\n├── Scripts/\n└── README.md"),
      mkProject("Puzzle Game", "Match-3 or sliding puzzle with scoring.", ["Unity", "C#"], "Easy", ["Puzzle logic", "Scoring systems", "Animations"], "puzzle-game/\n├── Assets/\n└── README.md"),
    ],
    Intermediate: [
      mkProject("3D Survival Game", "Gather resources, craft items, and survive.", ["Unreal Engine", "C++/Blueprints"], "Medium", ["3D gameplay", "Inventory systems", "AI enemies"], "survival-game/\n├── Source/\n└── README.md"),
      mkProject("Multiplayer Card Game", "Online card game with matchmaking.", ["Unity", "C#", "Photon"], "Medium", ["Networking", "Card mechanics", "Matchmaking"], "card-game/\n├── Assets/\n└── README.md"),
    ],
    Advanced: [
      mkProject("VR Escape Room", "Immersive VR puzzle experience.", ["Unity", "XR Toolkit", "C#"], "Hard", ["VR interaction", "Spatial puzzles", "Immersion"], "vr-escape/\n├── Assets/\n└── README.md"),
      mkProject("Procedural World Generator", "Infinite procedurally generated terrain and biomes.", ["Unity", "C#", "Compute Shaders"], "Hard", ["Procedural gen", "Shaders", "Optimization"], "proc-world/\n├── Assets/\n└── README.md"),
    ],
  },
  "DevOps / Cloud": {
    Beginner: [
      mkProject("Dockerized Web App", "Containerize a web application with Docker Compose.", ["Docker", "Nginx", "Node.js"], "Easy", ["Containers", "Docker Compose", "Networking"], "docker-app/\n├── Dockerfile\n├── docker-compose.yml\n└── README.md"),
      mkProject("CI/CD Pipeline", "Set up automated testing and deployment.", ["GitHub Actions", "Docker", "Node.js"], "Easy", ["CI/CD", "Automation", "Testing"], "ci-cd-pipeline/\n├── .github/workflows/\n└── README.md"),
    ],
    Intermediate: [
      mkProject("Kubernetes Deployment", "Deploy a microservices app on Kubernetes.", ["Kubernetes", "Helm", "Docker"], "Medium", ["K8s concepts", "Service mesh", "Scaling"], "k8s-deploy/\n├── manifests/\n├── helm/\n└── README.md"),
      mkProject("Infrastructure as Code", "Provision cloud infrastructure with Terraform.", ["Terraform", "AWS", "GitHub Actions"], "Medium", ["IaC", "State management", "Modules"], "terraform-infra/\n├── modules/\n├── environments/\n└── README.md"),
    ],
    Advanced: [
      mkProject("Self-Healing Infrastructure", "Auto-detecting and recovering from failures.", ["Kubernetes", "Prometheus", "Python"], "Hard", ["Chaos engineering", "Auto-remediation", "Observability"], "self-healing/\n├── controllers/\n├── monitors/\n└── README.md"),
      mkProject("Multi-Cloud Platform", "Deploy across AWS, GCP, and Azure with single config.", ["Terraform", "Pulumi", "Go"], "Hard", ["Multi-cloud", "Abstraction layers", "Cost optimization"], "multi-cloud/\n├── providers/\n├── modules/\n└── README.md"),
    ],
  },
  "IoT & Embedded": {
    Beginner: [
      mkProject("Smart Weather Station", "IoT weather monitor with web dashboard.", ["Arduino", "Python", "Flask"], "Easy", ["Sensor data", "Serial comm", "Web display"], "weather-station/\n├── firmware/\n├── dashboard/\n└── README.md"),
      mkProject("LED Controller", "Control RGB LEDs from a mobile app.", ["Arduino", "BLE", "React Native"], "Easy", ["BLE protocol", "Hardware control", "Mobile apps"], "led-controller/\n├── firmware/\n├── app/\n└── README.md"),
    ],
    Intermediate: [
      mkProject("Smart Home Hub", "Central IoT hub controlling multiple devices.", ["Raspberry Pi", "MQTT", "Node.js", "React"], "Medium", ["MQTT protocol", "Device management", "Dashboards"], "smart-home/\n├── hub/\n├── frontend/\n└── README.md"),
      mkProject("Plant Monitoring System", "Monitor soil, light, and water with alerts.", ["ESP32", "Python", "InfluxDB", "Grafana"], "Medium", ["Time series DB", "Alerting", "Sensor networks"], "plant-monitor/\n├── firmware/\n├── backend/\n└── README.md"),
    ],
    Advanced: [
      mkProject("Autonomous Robot", "Self-navigating robot with obstacle avoidance.", ["ROS", "Python", "LiDAR", "OpenCV"], "Hard", ["Robotics", "SLAM", "Path planning"], "autonomous-robot/\n├── ros_ws/\n├── vision/\n└── README.md"),
      mkProject("Industrial IoT Platform", "Scalable platform for monitoring industrial sensors.", ["Kafka", "InfluxDB", "React", "Docker"], "Hard", ["Stream processing", "High availability", "Industrial protocols"], "iiot-platform/\n├── services/\n├── frontend/\n└── README.md"),
    ],
  },
};

export default function ProjectIdeasPage() {
  const [field, setField] = useState<string | null>(null);
  const [level, setLevel] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<any[] | null>(null);

  const generate = async () => {
    if (!field || !level) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setProjects(projectBank[field]?.[level] || []);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              AI <span className="gradient-text">Project Idea Generator</span>
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Get tailored project ideas with tech stacks, structure, and learning outcomes.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
              <h3 className="font-display text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
                <Layers className="h-5 w-5 text-primary" /> Choose Field ({fields.length})
              </h3>
              <div className="space-y-2">
                {fields.map((f) => (
                  <button key={f} onClick={() => { setField(f); setProjects(null); }}
                    className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      field === f ? "bg-primary text-primary-foreground" : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}>{f}</button>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
              <h3 className="font-display text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-accent" /> Skill Level
              </h3>
              <div className="space-y-2">
                {levels.map((l) => (
                  <button key={l} onClick={() => { setLevel(l); setProjects(null); }}
                    className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      level === l ? "bg-accent text-accent-foreground" : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}>{l}</button>
                ))}
              </div>
            </motion.div>
          </div>

          {field && level && (
            <div className="text-center mb-8">
              <Button variant="hero" size="lg" onClick={generate} disabled={loading}>
                {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Generating...</> : <><Lightbulb className="h-4 w-4" /> Generate Project Ideas</>}
              </Button>
            </div>
          )}

          <AnimatePresence>
            {projects && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                {projects.map((p, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-display text-xl font-bold text-foreground">{p.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 ${
                        p.difficulty === "Easy" ? "bg-primary/15 text-primary" : p.difficulty === "Medium" ? "bg-accent/15 text-accent" : "bg-destructive/15 text-destructive"
                      }`}>{p.difficulty}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{p.desc}</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs font-semibold text-primary mb-1.5 uppercase tracking-wider flex items-center gap-1"><Code2 className="h-3 w-3" /> Tech Stack</p>
                        <div className="flex flex-wrap gap-1">
                          {p.stack.map((s: string) => <span key={s} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">{s}</span>)}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-accent mb-1.5 uppercase tracking-wider flex items-center gap-1"><GraduationCap className="h-3 w-3" /> Outcomes</p>
                        <ul className="text-xs text-muted-foreground space-y-0.5">
                          {p.outcomes.map((o: string) => <li key={o}>• {o}</li>)}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider flex items-center gap-1"><Github className="h-3 w-3" /> Structure</p>
                        <pre className="text-xs text-muted-foreground bg-secondary/50 rounded-lg p-2 overflow-x-auto">{p.structure}</pre>
                      </div>
                    </div>
                  </motion.div>
                ))}
                <div className="text-center">
                  <Button variant="hero-outline" onClick={() => { setProjects(null); setField(null); setLevel(null); }}>Generate More Ideas</Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <Footer />
    </div>
  );
}
