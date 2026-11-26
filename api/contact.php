<?php
header('Content-Type: application/json; charset=utf-8');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo json_encode(['ok'=>false,'error'=>'Method not allowed']); exit; }
if (!empty($_POST['website'])) { echo json_encode(['ok'=>true]); exit; } // honeypot

$cfgFile = __DIR__.'/config.php';
$cfg = is_file($cfgFile) ? require $cfgFile : require __DIR__.'/config.sample.php';

function clean($v,$max=2000){ $v=trim((string)$v); $v=str_replace(["\r","\0"],'',$v); return mb_substr($v,0,$max); }
$name=clean($_POST['name']??'',120); $email=clean($_POST['email']??'',160);
$company=clean($_POST['company']??'',160); $role=clean($_POST['role']??'',60);
$interest=clean($_POST['interest']??'',120); $message=clean($_POST['message']??'',3000);
if ($name==='' || !filter_var($email,FILTER_VALIDATE_EMAIL)) { http_response_code(422); echo json_encode(['ok'=>false,'error'=>'Please enter your name and a valid email.']); exit; }

// Simple rate limit: 5 per hour per IP (flat JSON)
$dir = __DIR__.'/../data'; if (!is_dir($dir)) mkdir($dir,0750,true);
$rlFile=$dir.'/ratelimit.json'; $rl=is_file($rlFile)?(json_decode(file_get_contents($rlFile),true)?:[]):[];
$ip=hash('sha256',$_SERVER['REMOTE_ADDR']??''); $now=time();
$rl[$ip]=array_values(array_filter($rl[$ip]??[],fn($t)=>$t>$now-3600));
if (count($rl[$ip])>=5) { http_response_code(429); echo json_encode(['ok'=>false,'error'=>'Too many requests. Please try again later.']); exit; }
$rl[$ip][]=$now; file_put_contents($rlFile,json_encode($rl),LOCK_EX);

// Store inquiry in flat JSON file
$file=$dir.'/inquiries.json'; $all=is_file($file)?(json_decode(file_get_contents($file),true)?:[]):[];
$all[]=['id'=>bin2hex(random_bytes(6)),'date'=>date('c'),'name'=>$name,'email'=>$email,'company'=>$company,'role'=>$role,'interest'=>$interest,'message'=>$message];
file_put_contents($file,json_encode($all,JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE),LOCK_EX);

// Email notification
$subject='New HPG inquiry from '.preg_replace('/[\r\n]+/',' ',$name);
$body="Name: $name\nEmail: $email\nCompany: $company\nRole: $role\nInterest: $interest\n\nMessage:\n$message\n";
$sent=false;
$pm=__DIR__.'/phpmailer/src/PHPMailer.php';
if (!empty($cfg['smtp']['enabled']) && is_file($pm)) {
  require $pm; require __DIR__.'/phpmailer/src/SMTP.php'; require __DIR__.'/phpmailer/src/Exception.php';
  try { $m=new PHPMailer\PHPMailer\PHPMailer(true); $m->isSMTP(); $m->Host=$cfg['smtp']['host']; $m->Port=$cfg['smtp']['port'];
    $m->SMTPAuth=true; $m->Username=$cfg['smtp']['user']; $m->Password=$cfg['smtp']['pass']; $m->SMTPSecure=$cfg['smtp']['secure'];
    $m->setFrom($cfg['from'],$cfg['from_name']); $m->addAddress($cfg['to']); $m->addReplyTo($email,$name);
    $m->Subject=$subject; $m->Body=$body; $m->send(); $sent=true; } catch (Throwable $e) {}
}
if (!$sent) { $h="From: {$cfg['from_name']} <{$cfg['from']}>\r\nReply-To: $email\r\nContent-Type: text/plain; charset=utf-8"; @mail($cfg['to'],$subject,$body,$h); }
echo json_encode(['ok'=>true]);
