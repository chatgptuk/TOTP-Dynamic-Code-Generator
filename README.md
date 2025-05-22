# TOTP Dynamic Code Generator

This project provides a simple Cloudflare Worker that serves a web based TOTP generator.

## Features

- Generate OTP codes from a Base32 secret
- Countdown progress circle
- Copy OTP to clipboard

- English and Chinese interface
- Persist the secret in `localStorage`
- Accept the secret from the `?secret=` query parameter
- Paste the secret from the clipboard via a button

- Paste secret from clipboard with one click
- English and Chinese interface
- Persist secret, algorithm and digit settings in `localStorage`
- Accept secret from the `?secret=` query parameter


## Usage

Deploy the `worker.js` script to Cloudflare Workers or run it locally using `wrangler dev`.

