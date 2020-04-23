<?php

namespace Src\Controller;

use Src\TableGateways\AttacksGateway;

class AttacksController
{
    private $requestMethod;

    private $attacksGateway;

    public function __construct($db, $requestMethod)
    {
        $this->requestMethod = $requestMethod;

        $this->attacksGateway = new AttacksGateway($db);
    }

    public function processRequest($uri)
    {
        switch ($this->requestMethod) {
            case 'GET':
                if (isset($_GET["preview"]) && $_GET["preview"] == "true") {
                    $response = $this->getAttacksPreview();
                } else if (sizeof($uri) > 3) {
                    $response = $this->getById($uri[3]);
                } else {
                    $response = $this->getFirst(1000);
                }
                break;
            case 'OPTIONS':
                break;
            case 'POST':
                $rawData = file_get_contents("php://input");
                $decoded = json_decode($rawData, true);
                 $response = $this->getGoodAttacks($decoded);
        }
        if (isset($response['status_code_header'])) {
            header($response['status_code_header']);
        }
        if (isset($response['body'])) {
            if ($response['body']) {
                echo $response['body'];
            }
        }
    }

    private function getGoodAttacks($decoded){
        $transformed = [];

        $this->getStartDate($decoded, $transformed);
        $this->getEndDate($decoded, $transformed);
        $this->setArrays($decoded, $transformed, "weaponType");
        $this->setArrays($decoded, $transformed, "attackType");
        $this->setArrays($decoded, $transformed, "targType");
        $this->setArrays($decoded, $transformed, "propExtent");

        $this->setValue($decoded, $transformed, "terrCount");
        $this->setValue($decoded, $transformed, "killsCount");
        $this->setValue($decoded, $transformed, "woundedCount");
        $this->setValueBool($decoded, $transformed, "success");
        $this->setValueBool($decoded, $transformed, "suicide");
        $this->setIfExists($decoded, $transformed, "region");
        $this->setIfExists($decoded, $transformed, "country");
        $this->setIfExists($decoded, $transformed, "city");
        $this->setIfExists($decoded, $transformed, "groupName");
        $this->setIfExists($decoded, $transformed, "targetNat");
        $this->setIfExists($decoded, $transformed, "targetName");
        $this->setIfExists($decoded, $transformed, "targSubtype");
        $this->setIfExists($decoded, $transformed, "weaponSubtype");


        $result = $this->attacksGateway->getStatistics($transformed);
        $response['status_code_header'] = 'HTTP/1.1 200 OK';
        $response['body']=json_encode($result);
        return $response;
    }
    private function setIfExists($decoded, &$transformed, $name){
        if ($decoded[$name]!="")
            $transformed[$name]=$decoded[$name];
    }
    private function setValueBool($decoded, &$transformed, $name){
        if ($decoded[$name]=="true")
            $transformed[$name]="1";
        else 
            $transformed[$name]="0";
    }
    
    private function setValue($decoded, &$transformed, $name){
        $transformed[$name]=$decoded[$name];
    }

    private function getStartDate($decoded, &$transformed){
        if ($decoded["dateStart"]==""){
            $transformed["startDate"]="1970-01-01";
        }else{
            $transformed["startDate"]=$decoded["dateStart"];
        }
    }

    private function getEndDate($decoded, &$transformed){
        if ($decoded["dateFinal"]==""){
            $transformed["finalDate"]="sysdate";
        }else{
            $transformed["finalDate"]=$decoded["dateFinal"];
        }
    }

    private function setArrays($decoded, &$transformed, $name){

        $i=0;
        $exploded = explode(",", $decoded[$name]);
        foreach ($exploded as $value){
            $transformed[$name][$i]=$value;
            $i++;
        }
    }



    private function getFirst($first)
    {
        $result = $this->attacksGateway->getFirst($first);
        $response['status_code_header'] = 'HTTP/1.1 200 OK';
        $response['body'] = json_encode($result);
        return $response;
    }

    private function getById($id)
    {
        if (is_numeric($id) && intval($id) >= 0 && intval($id) <= 180000) {
            $result = $this->attacksGateway->getById($id);
            $response['status_code_header'] = 'HTTP/1.1 200 OK';
            $response['body'] = json_encode($result);
        } else {
            $response['status_code_header'] = 'HTTP/1.1 404 Not Found';
            $response['body'] = json_encode("eroare");
        }
        return $response;
    }

    private function getAttacksPreview()
    {
        $result = $this->attacksGateway->getPreview();
        $response['status_code_header'] = 'HTTP/1.1 200 OK';
        $response['body'] = json_encode($result);
        return $response;
    }
}
