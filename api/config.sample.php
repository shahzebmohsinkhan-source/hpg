<?php
// Copy to config.php and edit. Keep config.php out of version control.
return [
  'to'        => 'tim@hospitalityperformancegroup.com',
  'from'      => 'noreply@hospitalityperformancegroup.com', // must be a mailbox on your domain
  'from_name' => 'HPG Website',
  // Optional SMTP via PHPMailer (put PHPMailer's src/ files in api/phpmailer/, no Composer needed)
  'smtp' => ['enabled' => false, 'host' => '', 'port' => 587, 'user' => '', 'pass' => '', 'secure' => 'tls'],
];
