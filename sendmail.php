<?php
// echo json_encode($_POST);
$recipient = 'nandanmarkrao@gmail.com';
$subject = 'Signup from Discover Bloom Website';
$message = "You have received an inquiry from discoverbloom.com.<br/>";
$message .= "Name: " . $_POST['name'] . "<br/>";
$message .= "Email: " . $_POST['email'] . "<br/>";
$message .= "Phone: " . $_POST['phone'] . "<br/>";
$message .= "organization: " . $_POST['organization'] . "<br/>";
$message .= "Comments: " . $_POST['comments'];
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