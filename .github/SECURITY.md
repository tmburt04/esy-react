# Security Policy

## Reporting a Vulnerability

Please report security vulnerabilities by emailing [timmichaelburton@gmail.com](mailto:timmichaelburton@gmail.com).

DO NOT create public issues for security vulnerabilities.

You can expect:
1. Confirmation within 24 hours
2. Regular updates on the progress
3. Credit in the fix announcement (if desired)

## API Keys & Sensitive Data

This project uses API keys and sensitive credentials in the following way:

- All API keys are stored in `.env` files that are never committed to Git via `.gitignore` (always verify this before committing)
- The `.env` files are temporary and only exist on your local machine
- We use `.env.example` to show what keys are needed (with fake values)
- Each developer creates their own `.env` file with their personal API keys

**BE AWARE, if the active repo has already commited a .env file to Git, API Keys used MAY get COMPROMISED**

⚠️ Important things to know:
- Never commit `.env` files to Git. esy-react-cli has procedures in place to prevent this, but you should always be cautious.
- Never share your API keys in issues or pull requests
- Never hardcode API keys in your code
- Get fresh API keys if you accidentally expose them

If you accidentally commit an API key:
1. Consider it compromised
2. Rotate/regenerate the key immediately
3. Update your `.env` file with the new key
4. Contact your organizations security team (if applicable).