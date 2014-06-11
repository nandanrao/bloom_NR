<?php
// echo json_encode($_GET);
$recipient = 'nandanmarkrao@gmail.com';
$subject = 'Signup from Discover Bloom Website';
$message = "You have received an inquiry from discoverbloom.com.<br/>";
$message .= "Name: " . $_GET['name'] . "<br/>";
$message .= "Email: " . $_GET['email'] . "<br/>";
$message .= "Phone: " . $_GET['phone'] . "<br/>";
$message .= "organization: " . $_GET['organization'] . "<br/>";
$message .= "Comments: " . $_GET['comments'];
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";

// // More headers
$headers .= 'From: <no-reply@discoverbloom.com>' . "\r\n";

if(mail($recipient , $subject, $message, $headers))
{
	echo 'success';
}
else
{
	echo 'failure';
}

?>