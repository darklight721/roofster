<?php

require 'Slim/Slim.php';

$app = new Slim();

$app->get('/roofs', function() use ($app) {
    $bounds = $app->request()->get();
	$sql = "";
	if (isset($bounds)) {
		$sql = "SELECT id, type, address, rate, latitude, longitude, date_added 
				FROM roof 
				WHERE latitude BETWEEN :from_lat AND :to_lat AND longitude BETWEEN :from_lng AND :to_lng 
				ORDER BY date_added DESC";
	}
	else {
		$sql = "SELECT id, type, address, rate, latitude, longitude, date_added 
				FROM roof 
				ORDER BY date_added DESC";
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
});

$app->get('/roofs/:id', function($id) use ($app) {
    $sql = "SELECT id, type, address, rate, latitude, longitude, contact_person, 
    			   contact_number, details, pictures, date_added 
    		FROM roof 
    		WHERE id=:id";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("id", $id);
        $stmt->execute();
        $roof = $stmt->fetchObject();
        $db = null;
        if ($roof) {
        	echo json_encode($roof);
        }
        else {
        	$app->response()->status(404);
        	echo 'not found';
        }
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}'; 
    }
});

$app->post('/roofs', function() use ($app) {
    $roof = json_decode($app->request()->getBody());
    $sql = "INSERT INTO roof (type, address, city, country, rate, latitude, longitude, 
    					contact_person, contact_number, details, email, passcode) 
    		VALUES (:type, :address, :city, :country, :rate, :latitude, :longitude, 
    				:contact_person, :contact_number, :details, :email, :passcode)";
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
});

$app->post('/upload/:id', function($id) use ($app) {
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
				echo $pictureLinks;
			} catch(PDOException $e) {
				echo '{"error":{"text":'. $e->getMessage() .'}}';
			}
		}
		else
		{
			$app->response()->status(500);
			echo 'error';
		}
	}
});

$app->put('/roofs/:id', function($id) use ($app) {
    $roof = json_decode($app->request()->getBody());
	$sqlCheck = "SELECT COUNT(id) 
				 FROM roof 
				 WHERE id=:id and email=:email and passcode=:passcode";
    $sql = "UPDATE roof 
    		SET type=:type, address=:address, city=:city, country=:country, rate=:rate, latitude=:latitude, longitude=:longitude, 
    			contact_person=:contact_person, contact_number=:contact_number, details=:details 
    		WHERE id=:id and email=:email and passcode=:passcode";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sqlCheck);
		$stmt->bindParam("id", $id);
		$stmt->bindParam("email", $roof->email);
        $stmt->bindParam("passcode", $roof->passcode);
		$stmt->execute();
		if ($stmt->fetchColumn() > 0) {
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
		}
		else {
			$db = null;
			$app->response()->status(405);
			echo 'mismatched';
		}
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
});

$app->delete('/roofs/:id/:email/:passcode', function($id, $email, $passcode) use ($app) {
	$sql = "DELETE FROM roof 
			WHERE id=:id and email=:email and passcode=:passcode";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$stmt->bindParam("id", $id);
		$stmt->bindParam("email", $email);
		$stmt->bindParam("passcode", $passcode);
		$stmt->execute();
		$count = $stmt->rowCount();
		$db = null;
		if ($count > 0) {
			deletePictures("../pics/$id");
		}
		else {
			$app->response()->status(405);
			echo 'mismatched';
		}
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}
});

$app->run();

function deletePictures($path) {
	if (is_dir($path)) {
		foreach (new DirectoryIterator($path) as $file) {
			if ($file->isFile())
				unlink($file->getPathname());
		}
	}
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
