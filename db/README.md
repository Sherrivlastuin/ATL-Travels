# Database Configuration

This directory contains database schema and migration files for the ATL-Travels application.

## Structure

- **schema.sql** - Complete database schema definition
- **migrations/** - Numbered migration files for incremental schema updates

## Migrations

Migrations are numbered sequentially and should be applied in order:

1. **001_initial_schema.sql** - Creates core tables: travelers, destinations, trips, bookings, reviews
2. **002_add_user_preferences.sql** - Adds user preferences table for personalization

## Running Migrations

### Using psql (PostgreSQL)

```bash
# Connect to your database
psql -U username -d database_name

# Run migrations in order
\i db/migrations/001_initial_schema.sql
\i db/migrations/002_add_user_preferences.sql
```

### Using TypeORM / Other ORMs

Refer to your ORM's migration documentation for running these SQL files.

## Database Schema Overview

### Core Tables

- **travelers** - User accounts for travelers
- **destinations** - Travel destinations
- **trips** - Trip packages to destinations
- **bookings** - Traveler bookings for trips
- **reviews** - Destination reviews and ratings
- **user_preferences** - User travel preferences

## Environment Setup

Create a `.env` file with database credentials:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/atl_travels
```

## Rollback

To rollback to a previous state, reverse the migrations in reverse order:

```bash
psql -U username -d database_name < db/migrations/002_add_user_preferences.sql
# (Run the appropriate DROP statements)
```
