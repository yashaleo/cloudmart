# 🛍️ CloudMart – AI-Powered E-Commerce Platform

CloudMart is a full-stack, cloud-native e-commerce platform enhanced with generative AI for intelligent shopping assistance. Built as part of an intensive cloud computing and AI bootcamp, this app showcases modern UI/UX, serverless architecture, and Bedrock-powered natural language processing.

---

## 🚀 Features

- 🔍 **Product Discovery**: Browse and search a catalog of items.
- 🛒 **Shopping Cart**: Add, update, and remove items with real-time quantity management.
- 🤖 **AI Assistant**: Claude 3 Sonnet via Amazon Bedrock responds to product inquiries and shopping help.
- 📦 **Order Placement**: Place orders with a confirmation modal and persistent storage.
- 🧾 **My Orders**: Track past orders and expand to view item details.
- 💬 **Customer Support**: Chat-like interface with thread management powered by Bedrock.
- 📱 **Responsive UI**: Built with React and Material-UI for a polished, mobile-friendly experience.

---

## 🧱 Tech Stack

### 🖥️ Frontend

- React + Vite
- Material-UI (MUI)
- Axios

### 🧠 AI/Backend

- Node.js + Express
- AWS Bedrock (Claude 3 Sonnet)
- Amazon Lambda (AI integration)
- Amazon DynamoDB (product catalog & orders)

### ☁️ Cloud Infrastructure

- AWS EKS (Kubernetes)
- AWS CodePipeline (CI/CD)
- Terraform (IAM & Lambda provisioning)

## 📁 Project Structure

cloudmart/
├── backend/ # Node.js API (Express) + Bedrock Lambda endpoint
│ ├── src/ # Server logic and route handlers
│ └── cloudmart-backend.yaml # Kubernetes deployment file
│
├── frontend/ # React app (Vite + Material UI)
│ ├── components/ # Reusable UI components (Header, Footer, AIAssistant, etc.)
│ ├── config/ # axiosConfig, routes, etc.
│ ├── utils/ # cartUtils, userUtils, etc.
│ └── vite.config.js # Vite configuration
│
├── terraform/ # Infrastructure as Code (IAM, Lambda, Bedrock)
│ └── main.tf # Terraform config files for provisioning
│
└── README.md # Project overview and documentation

## Deploy Backend to EKS

cd backend/
kubectl apply -f cloudmart-backend.yaml
kubectl rollout status deployment cloudmart-backend-app

## Run Frontend in Dev Mode

cd frontend/
npm install
npm run dev

## 🧪 Linting & Formatting

npm run lint
npm run format

## 🤖 AI Assistant Details

- Model: anthropic.claude-3-sonnet-20240229-v1:0
- Platform: Amazon Bedrock + AWS Lambda
- Capabilities:
- Natural conversation
- Product recommendations
- Summarization of cart items
- Customer support threads

## ✅ Tested User Flows

- Add to Cart, Update, Remove
- Place Order + Confirmation Modal
- AI Assistant Integration with Claude 3 Sonnet
- View and Expand Order History
- Persistent Cart via localStorage
- Responsive Design with MUI Grid + Cards

## 🧠 Lessons Learned

- AWS Bedrock agents require manual version preparation to reflect updated instructions.
- Use prepare-agent CLI when UI doesn’t show a “Create Version” button.
- Upgrading from AWS SDK v2 to v3 inside Lambda improves performance + compatibility.
- MUI Grid system and flexbox are powerful for responsive e-commerce UIs.
