# TOTP Dynamic Code Generator

This project provides a simple Cloudflare Worker that serves a web based TOTP generator.

## Features

- Generate OTP codes from a Base32 secret
- Countdown progress circle
- Copy OTP to clipboard
- Paste secret from clipboard with one click
- English and Chinese interface
- Persist the secret, algorithm and digit settings in `localStorage`
- Accept the secret from the `?secret=` query parameter
