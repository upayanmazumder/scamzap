# scamzap

[![Build Docker Image](https://github.com/upayanmazumder/scamzap/actions/workflows/docker-image.yml/badge.svg)](https://github.com/upayanmazumder/scamzap/actions/workflows/docker-image.yml)

Protect yourselves from scams!

---

## 🌐 Live URLs

* **Main App:** [scamzap.upayan.dev](https://scamzap.upayan.dev)
* **API:** [api.scamzap.upayan.dev](https://api.scamzap.upayan.dev)

---

## 📦 Docker Image

* **Docker Image:** [ghcr.io/upayanmazumder/scamzap](https://github.com/users/upayanmazumder/packages/container/package/scamzap)

---

## 🎨 UI/UX Design

View the design prototype on Figma: [Figma - Scamzap](https://www.figma.com/design/tQrLAmu1uaEFrbGlglFBKh/internal-hack?node-id=0-1&t=T2LsGBc2X8ZqfUrk-1)

---

## 🚀 Features

* Report suspicious phone numbers
* Verify numbers with crowdsourced scam ratings
* View scam trends and statistics
* Real-time scam alerts and community contributions
* REST API to integrate scam protection into other apps

---

## 🏗️ How It Works

Scamzap is a full-stack web application comprising:

* A **frontend app** (React + Tailwind) served at [scamzap.upayan.dev](https://scamzap.upayan.dev)
* A **backend API** (Node.js + Express + MongoDB) served at [api.scamzap.upayan.dev](https://api.scamzap.upayan.dev)
* Data is stored in MongoDB Atlas and served via REST endpoints
* The frontend and API are containerized using Docker and orchestrated with Docker Compose
* Real-time data updates and number checks via API endpoints

---

## 🛠️ Setup and Usage

### 1. Clone the Repository

```bash
git clone https://github.com/upayanmazumder/scamzap.git
cd scamzap
```

### 2. Install Dependencies

Install dependencies in the root, `api`, and `app` directories:

```bash
npm install
cd api && npm install
cd ../app && npm install
cd ..
```

### 3. Create `.env` Files

Copy and modify the `example.env` file in each relevant directory.

### 4. Start the Application

Run both the frontend and backend concurrently:

```bash
npm run dev
```

### 5. Docker Setup (Optional)

You can also use Docker Compose:

```bash
docker-compose up --build
```

---

## 📘 Technical Details

This project was built as part of the **GDSC Internal Hackathon 2025**.
For a deep dive into the architecture and development process, read the [Technical Documentation on DeepWiki](https://deepwiki.com/upayanmazumder/scamzap).

---

## 🏆 Team – Indecisive Folks

* **[Upayan Mazumder](https://upayan.dev)** – Fullstack Developer
  [LinkedIn](https://www.linkedin.com/in/upayanmazumder/)

* **[Swayam](https://github.com/swayam5342)** – Backend Developer
  [LinkedIn](https://www.linkedin.com/in/swayam-prakash-2909222b4)

* **[Devansh Arora](https://devansharora.in)** – Backend Developer
  [LinkedIn](https://www.linkedin.com/in/devansh-arora-7b2395215/)

* **[Monica Srinivas](https://github.com/monica-2707)** – UI/UX Designer
  [LinkedIn](https://www.linkedin.com/in/monicasrinivas/)

* **[Shourya Saraf](https://github.com/Shouryasaraf)** – Management
  [LinkedIn](https://www.linkedin.com/in/shourya-saraf-186b8332a/)

* **[Nitin Pandey](https://github.com/NitinTheGreat)** – Mentor [LinkedIn](https://www.linkedin.com/in/nitinkrpandey/)