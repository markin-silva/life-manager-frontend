# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### 1.7.1

### Changed

- Pagination active page uses neutral styling to avoid competing with CTAs.
- Transaction empty state refined with a structured, subtle container.
- Category selection enforces explicit choice with uncategorized option.
- Category dropdown actions remain accessible with internal scroll and fixed footer actions.
- Transaction modal resets state on open and refines Category/Date/Time layout.
- Amount input uses inline currency selector with locale formatting.
- Transaction amounts display using backend currency and locale formatting.
- Validation messages localized to the active locale.
- Toast feedback added for transaction creation/deletion success/error.

### 1.7.0

### Added

- Pagination hook with URL sync (page, per_page) and metadata handling.
- Transaction list skeleton loader and shared list skeleton component.
- Icon-only button component for contextual actions.
- Loading label helper and locale-aware date/time formatter utilities.
- Currency selector in the transaction creation modal.

### Changed

- Transactions list layout with dedicated columns, delete icon action, and footer pagination.
- Button variants refactored to semantic intent (primary, secondary, outline, ghost, destructive).

### 1.6.0

### Added

- Category entity support with API-backed list/create/update/delete flows.
- Category selection UI with icon/color badges and create/manage modals.
- Category i18n mapping for system keys and custom label fallback.
- Lucide icons for transactions and categories.

### 1.5.0

### Added

- Centralized API response handling and expense success feedback.

### 1.4.0

### Added

- Frontend i18n support (EN and PT-BR) with locale selector and Intl formatting.

### 1.3.0

### Added

- Global Header navigation for authenticated pages (Dashboard, Transactions).

### 1.2.0

### Added

- Transactions module (page, types, service, and routing).

### 1.1.0

### Added

- Login page

### 1.0.0

### Added

- Primary color palette and fonts in Tailwind config.
- Signup page.
- Enable class-based dark mode in Tailwind config.