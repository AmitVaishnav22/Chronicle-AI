# Chronicle‑AI

**A full‑stack, end‑to‑end platform for sharing and reading technically rich articles with real‑world software development experience.**

Chronicle‑AI empowers developers to publish and consume high‑quality technical content seamlessly—combining a polished frontend, robust backend, and intuitive user flow.

---

## 🚀 Key Features

### 1. **Rich Full‑Stack Architecture**
- **Frontend**: React.js + Redux Toolkit + Tailwind CSS for responsive, component‑driven UI.
- **Backend**: Appwrite handles authentication, real‑time database updates, and cloud‑functions.
- **Deployment**: Hosted on Vercel with CI/CD hooks to Appwrite and GitHub for smooth development.

### 2. **User‑First Content Creation and Consumption**
- **Markdown‑style editor**: Write posts with images, code blocks, and formatted text.
- **Article feeds**: Browse a global feed of technical writings or curated personal feeds.
- **Real‑time interactions**: Like, bookmark, and comment—powered by Appwrite’s real‑time capabilities.

### 3. **Secure & Collaborative**
- **Authentication**: Sign in via email/password or third‑party (GitHub, Google).
- **Data privacy**: Role-based access control ensures users retain ownership of their content.
- **Collaborations**: Invite co-authors, manage drafts, and schedule future publications.

### 4. **Developer-Centric Experience**
- **Tech-savvy design**: Tailored for engineers—shows code snippets with syntax highlighting, supports tech tags, and lets you search by language or topic.
- **Author tools**: Dashboards with post metrics, engagement stats, and analytics.
- **Tagging & Search**: Discover content via tags (e.g., React, DevOps, AI) and full‑text search.

---

## 🌟 What Makes Chronicle‑AI Unique

| Feature | Chronicle‑AI | Other Platforms |
|:---|:---|:---|
| **Developer‑Focused** | Built by devs, for devs—showcases code, architecture diagrams, and real tools. | Often generic blog layouts with basic formatting. |
| **Real‑Time Feeds** | Instantly reflects new posts, comments, and likes via Appwrite live updates. | Usually static; need refresh or longer polling intervals. |
| **Integrated Analytics** | Authors see engagement (views, likes, comments) per post in dashboard. | Often requires 3rd-party analytics or manual plugins. |
| **Full‑Stack Built‑In** | Demo site includes production-ready frontend, backend, CI/CD, and hosting. | Many require stitching together separate services. |

---

## 🧩 Tech Stack

- **Frontend**: React.js, Redux Toolkit, Tailwind CSS  
- **Backend**: Appwrite (Auth, Database, Functions, Storage)  
- **Hosting**: Vercel for frontend, Appwrite Cloud or self‑hosted for backend  
- **CI/CD**: GitHub Actions — deploy on commit  
- **Languages**: JavaScript / TypeScript  
- **State Management**: Redux Toolkit  
- **Styling**: Tailwind CSS

---

## 🏗️ Getting Started

### Prerequisites
- **Node.js** (v16+), **npm/yarn**
- **Appwrite** instance (self‑hosted or cloud)
- **Vercel** (or any React‑friendly hosting)

### Setup
1. **Clone the repo**  
   ```bash
   git clone https://github.com/AmitVaishnav22/Chronicle-AI.git
   cd Chronicle-AI
