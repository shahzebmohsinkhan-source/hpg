# Hospitality Performance Group - website

- index.html - the page (semantic HTML, no framework)
- css/style.css - all styling; colors are tokens in :root (re-theme there)
- js/main.js - sticky header, mobile menu, audience filter, scroll reveals, contact form
- assets/img/ - favicon; add logo and photos here
- api/contact.php - contact handler (validation, honeypot, rate limit, flat JSON storage, email)
- api/config.sample.php - copy to api/config.php and set recipient and optional SMTP
- data/ - inquiries.json is written here (web access blocked by .htaccess)

## Deploy
1. Upload to PHP hosting (PHP 8+, Apache).
2. Copy api/config.sample.php to api/config.php and set the recipient.
3. Make data/ writable by PHP (chmod 750 or 770).
4. For SMTP, put PHPMailer's src/ files in api/phpmailer/ and set smtp.enabled to true.

## Replace before launch
- Selected Engagements placeholders in index.html (#experience)
- Logo in header/footer, and any photography
- Privacy policy and legal details as required
