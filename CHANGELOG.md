# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added

-   Basic frontend structure with login, account, record and notes tabs
-   Database connection setup
-   Server file structure
-   REST API routes for users, records, and notes
-   Service layer for records and notes management
-   Client API integration in frontend (app/lib/api.ts)
-   Dynamic note loading from backend
-   Audio recording save functionality with API integration
-   File upload support with multer
-   Audio transcription service with Whisper.cpp integration
-   AI-powered summarization service using Ollama (llama3.2:3b)
-   Asynchronous audio processing pipeline with p-queue
-   Queue worker system for background audio processing
-   Record status tracking (pending, processing, completed, error)
-   Transcription field in records model

### Changed

-   Updated database schema with CASCADE relations
-   Migrated API client from app/services to app/lib
-   Simplified account page (removed statistics section)
-   Frontend now fully integrated with backend API

### Fixed

-   Database default values for duration and file_size
-   Demo data references in database script
