# Villa Bomada — Guest Manager

A mobile app for managing guests and reservations across a 7-apartment
accommodation property. Built to replace the paper notebook and spreadsheet
the property was managed with.

## Features

- **Property timeline** — all 7 apartments on a horizontal calendar, with
  reservations shown as colour-coded bars (green for Booking.com guests,
  blue for direct bookings, yellow for friends and family)
- **Availability search** — check which apartments are free for a given date range
- **Daily plan** — check-outs, check-ins and cleaning tasks for the day, with
  checkboxes to mark them done
- **Guest schedule** — per-night breakdown of each stay, including automatically
  suggested linen and towel changes that can be edited or moved to another day
- **Apartment history** — past, current and upcoming guests for each apartment,
  with the free gaps between them

## Status

Work in progress. The UI is being built first, with data persistence and
multi-device sync to follow.

## Built with

- React Native
- Expo / Expo Router
- TypeScript

## Running locally

Install dependencies:

npm install

Start the development server:

npx expo start

Then open the project in Expo Go, an Android emulator, or an iOS simulator.

## Note

This project is written by hand, without AI code generation. The goal is to
learn the stack properly rather than ship something I don't understand.