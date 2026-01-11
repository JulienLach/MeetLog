# MeetLog

Capture, transcribe, and summarize developer standup meetings in real-time with AI on your mobile device.

## Table of Contents

-   [Overview](#overview)
-   [Features](#features)
-   [Requirements](#requirements)
-   [Running Locally](#running-locally)
-   [Environment Variables](#environment-variables)
-   [Implementation Status](#implementation-status)

## Overview

MeetLog is a full-stack application for recording meeting audio, transcribing it automatically with Whisper.cpp, and generating structured summaries with Ollama LLM. Perfect for sprint meetings, stand-ups, and team discussions.

Two-model pipeline :

-   Whisper.cpp : Transcribes audio to text (offline, no API calls)
-   Ollama : Generates summaries from transcriptions (local downloaded small LLM)

## Features

-   Audio Recording : Record meetings directly from the mobile app
-   Automatic Transcription : Convert audio to text using Whisper.cpp
-   AI Summaries : Generate meeting summaries with key points, actions, and mentions using Ollama
-   Meeting Notes : View and manage all meeting notes with metadata (duration, date)
-   REST API : Backend API for audio processing and note management

## Requirements

-   Node.js v20+
-   npm v10+
-   Expo Go (mobile testing)
-   PostgreSQL 14+
-   Whisper.cpp (audio transcription)
-   Ollama (AI summarization)

## Running Locally

### 1. Setup Database

```bash
sudo -u postgres psql < database_script.sql
```

### 2. Install Dependencies

```bash
npm install
cd server && npm install
```

### 3. Install Whisper.cpp

```bash
cd server
git clone https://github.com/ggerganov/whisper.cpp.git
cd whisper.cpp
make
cd ../..
```

Then download a model:

```bash
cd server/whisper-cpp/models
bash download-ggml-model.sh base
cd ../../..
```

### 4. Compile Whisper.cpp (if needed after updates)

```bash
cd server/whisper-cpp
make
cd ../..
```

### 5. Start Services

**Terminal 1 - Start Ollama:**

```bash
ollama serve
```

**Terminal 2 - Start Backend Server:**

```bash
cd server
npm run dev
```

**Terminal 3 - Start Expo (Frontend):**

```bash
npx expo start
```

Then:

-   Press `w` to open web view
-   Scan QR code with Camera app to open Expo Go (iOS)

## Environment Variables

Create a `.env` file in the root directory and replace `<YOUR_LOCAL_IP>` and `<PROJECT_ROOT>` accordingly:

```env
NODE_ENV=development
PORT_BACKEND=3001

DB_USER=postgres
DB_HOST=localhost
DB_NAME=meetlog
DB_PASSWORD=postgres
DB_PORT=5432

ORIGIN_URL=http://<YOUR_LOCAL_IP>:8081
SERVER_URL=http://<YOUR_LOCAL_IP>:3001
EXPO_PUBLIC_API_URL=http://<YOUR_LOCAL_IP>:3001/api

WHISPER_EXECUTABLE_PATH=<PROJECT_ROOT>/server/whisper-cpp/build/bin/whisper-cli
WHISPER_MODEL_PATH=<PROJECT_ROOT>/server/whisper-cpp/models/ggml-base.bin

OLLAMA_API_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2:3b
```
