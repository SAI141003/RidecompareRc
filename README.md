# RideCompare RC – AI-Powered Ride Comparison Platform
https://ridecomparerc.netlify.app/
**RideCompare RC** is a comprehensive ride comparison and booking platform that allows users to compare rides across multiple providers (Uber, Lyft, etc.), predict ride prices, optimize routes, and make smart transportation decisions. The app integrates AI-driven features, interactive maps, and real-time data to provide an enhanced user experience.

---

## 🚀 Features

### **Core Features**
- Compare ride options across multiple providers (Uber, Lyft, and more)  
- Real-time pickup and drop-off location selection with map integration  
- Display travel time and distance for each ride  
- View exact addresses, not just street names  
- Hotel booking comparison integrated into the app  

### **AI-Driven Features**
- **Price Prediction:** AI predicts ride fares based on historical and real-time data  
- **Smart Ride Recommendation:** Suggests the best ride option for time, price, and convenience  
- **Surge Pricing Alerts:** Detects surge pricing and provides alternative suggestions  
- **Fraud Detection:** AI identifies suspicious or fraudulent ride options  
- **Dynamic Ride Optimization:** Optimizes routes for multiple stops, traffic, and ride preferences  

### **User-Friendly Interface**
- Simple, Uber-like interface for ease of use  
- Open-source AI chatbot for customer support with real responses  
- Option to customize avatars and chat with the AI assistant  
- Clear, responsive maps and interactive elements  

---

## 🛠 Tech Stack
- **Frontend:** React, Capacitor (for mobile support), Open-Source Maps  
- **Backend:** Python (FastAPI / Flask), integrated with ride APIs  
- **AI & ML:** Python, Scikit-learn, Pandas, NLP for chatbot, predictive modeling for fares  
- **Maps & Geolocation:** OpenStreetMap, Leaflet, Google Maps APIs (free tier)  
- **Database:** MySQL / MS SQL for ride data, user data, and bookings  
- **Other Tools:** Rasa AI for chatbot, DeepSeek AI for recommendations  

---

## 📂 Folder Structure
RideCompare_RC/
│
├── backend/               # Backend API & ML models
├── frontend/              # React + Capacitor app
├── ai_models/             # ML models for price prediction, fraud detection, recommendations
├── maps/                  # Map integration scripts
├── chatbot/               # Rasa AI chatbot configuration
├── database/              # Database scripts and schema
├── requirements.txt       # Python dependencies
├── package.json           # Frontend dependencies
└── README.md
