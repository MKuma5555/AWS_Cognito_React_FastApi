# Cognito React with Python

This project demonstrates how to integrate AWS Cognito for user authentication with a React frontend and a Python backend.

## Table of Contents

- [Cognito Setup](#cognito-setup)
  - [Creating a User Pool](#creating-a-user-pool)
  - [User Pool Management and Registration](#user-pool-management-and-registration)
- [Backend Setup (Python)](#backend-setup-python)
  - [Creating a Virtual Environment](#creating-a-virtual-environment)
  - [Installing Dependencies](#installing-dependencies)
- [Frontend Setup (React with Vite)](#frontend-setup-react-with-vite)
  - [Creating a React Project with Vite](#creating-a-react-project-with-vite)
  - [Installing Dependencies](#installing-dependencies-1)
  - [Integrating Tailwind CSS](#integrating-tailwind-css)
- [Connecting Cognito User Pool Data](#connecting-cognito-user-pool-data)
- [Troubleshooting](#troubleshooting)

## Cognito Setup <a name="cognito-setup"></a>

### Creating a User Pool <a name="creating-a-user-pool"></a>

1.  Navigate to the Cognito console in the AWS Management Console.
2.  Click the "Create user pool" button.
3.  Click the "Create user pool" button again to complete the process.

### User Pool Management and Registration <a name="user-pool-management-and-registration"></a>

1.  Return to the User Pool page.
2.  You can change the pool's name. Register users via the "Users" option in the left navigation menu.
3.  Create users as needed.

## Backend Setup (Python) 
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```
## Install Dependencies
```bash
pip install fastapi uvicorn sqlalchemy
pip install bcrypt
pip install common
pip install PyJWT
pip install dotenv
pip install cryptography  
pip install boto3 fastapi pyjwt python-dotenv
```
1. Create a main.py file for your backend logic and a .env file to store environment variables.

### Creating a Virtual Environment 
Frontend Setup (React with Vite) 
Creating a React Project with Vite 
Bash
```bash
npm create vite@latest <my-cognito> -- --template react-ts  # Or 'react' for JavaScript
cd <my-cognito>
npm install
npm run dev # Starts the development server (usually at http://localhost:xxxx/)
Installing Dependencies <a name="installing-dependencies-1"></a>
```

## Install npm 
```bash
- npm install amazon-cognito-identity-js
- npm install react react-dom`
- npm install react-router-dom
- npm install axios
```
Integrating Tailwind CSS 
```bash
npm install tailwindcss @tailwindcss/vite
```
vite.config.tsフォルダの中に以下追加：
```bash
import tailwindcss from '@tailwindcss/vite’
    tailwindcss()
```
## Cognito User Pool data connect ：繋ぎたいプールのデータ情報をリアクトに送る
vite.config.tsの中に下記の部分を追加する”amzon-cognito-identity-js.” golobal undefine を防ぐ
Add the Tailwind directives to your ./src/index.css file:   

CSS
@tailwind base;
@tailwind components;
@tailwind utilities;
Add the following to your vite.config.ts file:

TypeScript

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    global: {}, // Prevents "global undefined" errors with amazon-cognito-identity-js
  },
})


## Start Python command 
```bash
.venv/bin/uvicorn main:app --reload --port <変更可能:8080＞
```
This ensures that the correct uvicorn instance within your virtual environment (where PyJWT is installed) is used.

