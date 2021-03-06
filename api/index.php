<?php

require 'Slim/Slim.php';

$app = new Slim();

$app->get('/roofs', 'getRoofs');
$app->get('/roofs/:id', 'getRoof');
$app->get('/roofs/search/:query', 'findByAddress');
$app->get('/roofs/search/:lat/:lng/:radius', 'findByLatLng');
$app->post('/roofs', 'addRoof');
$app->post('/upload/:id', 'uploadPictures');
$app->put('/roofs/:id', 'updateRoof');
$app->delete('/roofs/:id/:email/:passcode', 'deleteRoof');

$app->run();

function getRoofs() {
	$request = Slim::getInstance()->request();
    $bounds = $request->get();
	$sql = "";
	if (isset($bounds)) {
		$sql = "SELECT id, type, address, rate, latitude, longitude, date_added FROM roof where latitude BETWEEN :from_lat AND :to_lat AND longitude BETWEEN :from_lng AND :to_lng ORDER BY date_added";
	}
	else {
		$sql = "SELECT id, type, address, rate, latitude, longitude, date_added FROM roof ORDER BY date_added";
	}
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);
		if (isset($bounds)) {
			$stmt->bindParam("from_lat", $bounds['from']['lat']);
			$stmt->bindParam("from_lng", $bounds['from']['lng']);
			$stmt->bindParam("to_lat", $bounds['to']['lat']);
			$stmt->bindParam("to_lng", $bounds['to']['lng']);
		}
		$stmt->execute();
        $roofs = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        echo json_encode($roofs);
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}'; 
    }
}

function getRoof($id) {
    $sql = "SELECT id, type, address, rate, latitude, longitude, contact_person, contact_number, details, pictures, date_added FROM roof WHERE id=:id";
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

function findByLatLng($lat, $lng, $radius) {
	$sql = "SELECT id, type, address, rate, latitude, longitude, date_added FROM roof where latitude BETWEEN :lat_min AND :lat_max AND longitude BETWEEN :lng_min AND :lng_max ORDER BY date_added";
	$lat_min = $lat - $radius;
	$lat_max = $lat + $radius;
	$lng_min = $lng - $radius;
	$lng_max = $lng + $radius;
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$stmt->bindParam("lat_min", $lat_min);
		$stmt->bindParam("lat_max", $lat_max);
		$stmt->bindParam("lng_min", $lng_min);
		$stmt->bindParam("lng_max", $lng_max);
		$stmt->execute();
		$roofs = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo json_encode($roofs);
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
	$ret = "error";
    $request = Slim::getInstance()->request();
    $body = $request->getBody();
    $roof = json_decode($body);
	$sqlCheck = "SELECT COUNT(*) FROM roof WHERE id=:id and email=:email and passcode=:passcode";
    $sql = "UPDATE roof SET type=:type, address=:address, city=:city, country=:country, rate=:rate, latitude=:latitude, longitude=:longitude, contact_person=:contact_person, contact_number=:contact_number, details=:details WHERE id=:id and email=:email and passcode=:passcode";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sqlCheck);
		$stmt->bindParam("id", $id);
		$stmt->bindParam("email", $roof->email);
        $stmt->bindParam("passcode", $roof->passcode);
		$stmt->execute();
		if ($stmt->fetchColumn() > 0)
		{
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
			$ret = json_encode($roof);
		}
        $db = null;
        echo $ret;
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
		$count = $stmt->rowCount();
		$db = null;
		if ($count > 0)
			deletePictures("../pics/$id");
		echo $count;
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}
}

function findByAddress($query) {
	echo $query;
}

function deletePictures($path) {
	if (is_dir($path)) {
		foreach (new DirectoryIterator($path) as $file) {
			if ($file->isFile())
				unlink($file->getPathname());
		}
	}
}

function uploadPictures($id) {
	$ret = "error";
	if (isset($id)) {
		$path = "../pics/$id";

        $success = true;
        if (is_dir($path)) {
			deletePictures($path);
        }
        else {
            $success = mkdir($path, 0777, true);
        }

		if ($success) {
			$path .= "/";
			$paths = [];
			
			if (isset($_FILES["pictures"])) {
				foreach($_FILES["pictures"]["error"] as $key => $error) {
					$tmp_name = $_FILES["pictures"]["tmp_name"][$key];
					$name = $_FILES["pictures"]["name"][$key];
					move_uploaded_file($tmp_name, $path . $name);
					$paths[$key] = "pics/$id/" . $name;
				}
			}
			
			// update pictures field in roof table
			$sql = "UPDATE roof SET pictures=:pictures WHERE id=:id";
			$pictureLinks = json_encode($paths, JSON_UNESCAPED_SLASHES);
			try {
				$db = getConnection();
				$stmt = $db->prepare($sql);
				$stmt->bindParam("pictures", $pictureLinks);
				$stmt->bindParam("id", $id);
				$stmt->execute();
				$db = null;
				$ret = $pictureLinks;
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
