<?php

require 'Slim/Slim.php';

$app = new Slim();

$app->get('/roofs', 'getRoofs');
$app->get('/roofs/:id', 'getWine');
$app->get('/roofs/search/:query', 'findByAddress');
$app->post('/roofs', 'addRoof');
$app->put('/roofs/:id', 'updateRoof');
$app->delete('/roofs/:id/:email/:passcode', 'deleteRoof');
$app->post('/upload/:id', 'uploadPictures');

$app->run();

function getRoofs() {
    $sql = "SELECT * FROM roof ORDER BY date_added";
    try {
        $db = getConnection();
        $stmt = $db->query($sql);
        $roofs = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        echo json_encode($roofs);
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}'; 
    }
}

function getRoof($id) {
    $sql = "SELECT * FROM roof WHERE id=:id";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("id", $id);
        $stmt->execute();
        $roof = $stmt->fetchObject();
        $db = null;
        echo json_encode($roof);
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}'; 
    }
}

function addRoof() {
    $request = Slim::getInstance()->request();
    $roof = json_decode($request->getBody());
    $sql = "INSERT INTO roof (type, address, city, country, rate, latitude, longitude, contact_person, contact_number, details, email, passcode) VALUES (:type, :address, :city, :country, :rate, :latitude, :longitude, :contact_person, :contact_number, :details, :email, :passcode)";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("type", $roof->type);
        $stmt->bindParam("address", $roof->address);
        $stmt->bindParam("city", $roof->city);
        $stmt->bindParam("country", $roof->country);
        $stmt->bindParam("rate", $roof->rate);
        $stmt->bindParam("latitude", $roof->latitude);
        $stmt->bindParam("longitude", $roof->longitude);
        $stmt->bindParam("contact_person", $roof->contact_person);
        $stmt->bindParam("contact_number", $roof->contact_number);
        $stmt->bindParam("details", $roof->details);
        $stmt->bindParam("email", $roof->email);
        $stmt->bindParam("passcode", $roof->passcode);
        $stmt->execute();
        $roof->id = $db->lastInsertId();
        $db = null;
        echo json_encode($roof);
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function updateRoof($id) {
    $request = Slim::getInstance()->request();
    $body = $request->getBody();
    $roof = json_decode($body);
    $sql = "UPDATE roof SET type=:type, address=:address, city=:city, country=:country, rate=:rate, latitude=:latitude, longitude=:longitude, contact_person=:contact_person, contact_number=:contact_number, details=:details WHERE id=:id and email=:email and passcode=:passcode";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("type", $roof->type);
        $stmt->bindParam("address", $roof->address);
        $stmt->bindParam("city", $roof->city);
        $stmt->bindParam("country", $roof->country);
        $stmt->bindParam("rate", $roof->rate);
        $stmt->bindParam("latitude", $roof->latitude);
        $stmt->bindParam("longitude", $roof->longitude);
        $stmt->bindParam("contact_person", $roof->contact_person);
        $stmt->bindParam("contact_number", $roof->contact_number);
        $stmt->bindParam("details", $roof->details);
        $stmt->bindParam("id", $id);
        $stmt->bindParam("email", $roof->email);
        $stmt->bindParam("passcode", $roof->passcode);
        $stmt->execute();
        $db = null;
        echo json_encode($roof);
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function deleteRoof($id, $email, $passcode) {
    $sql = "DELETE FROM roof WHERE id=:id and email=:email and passcode=:passcode";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("id", $id);
        $stmt->bindParam("email", $email);
        $stmt->bindParam("passcode", $passcode);
        $stmt->execute();
        $db = null;
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function findByName($query) {

}

function uploadPictures($id) {
	$ret = "error";
	if (isset($id) && isset($_FILES["pictures"])) {
		$path = "../pics/$id";
		if (mkdir($path)) {
			$path .= "/";
			$paths = [];
			
			foreach($_FILES["pictures"]["error"] as $key => $error) {
				$tmp_name = $_FILES["pictures"]["tmp_name"][$key];
				$name = $_FILES["pictures"]["name"][$key];
				move_uploaded_file($tmp_name, $path . $name);
				$paths[$key] = "pics/$id" . $name;
			}
			
			// update pictures field in roof table
			$sql = "UPDATE roof SET pictures=:pictures WHERE id=:id";
			$pictureLinks = json_encode($paths);
			try {
				$db = getConnection();
				$stmt = $db->prepare($sql);
				$stmt->bindParam("pictures", $pictureLinks);
				$stmt->bindParam("id", $id);
				$stmt->execute();
				$db = null;
				$ret = "success";
			} catch(PDOException $e) {
				echo '{"error":{"text":'. $e->getMessage() .'}}';
			}
		}
	}
	echo $ret;
}

function getConnection() {
    $dbhost = "localhost";
    $dbuser = "root";
    $dbpass = "";
    $dbname = "roofster";
    $dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    return $dbh;
}
