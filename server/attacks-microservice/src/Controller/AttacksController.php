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
                if (sizeof($uri) > 3){
                    $response = $this->getById($uri[3]);
                } else {
                    $response = $this->getFirst(1000);
                }
                break;
            case 'OPTIONS':
                break;
            case 'POST':
                echo ('It\'s working!');
        }
        if (isset($response['status_code_header'])){
            header($response['status_code_header']);
        }
        if (isset($response['body'])){
            if ($response['body']) {
                echo $response['body'];
            }
        }
    }

    private function getFirst($first)
    {
        $result = $this->attacksGateway->getFirst($first);
        $response['status_code_header'] = 'HTTP/1.1 200 OK';
        $response['body'] = json_encode($result);
        return $response;
    }
    
    private function getById($id){
        if (is_numeric($id) && intval($id)>=0 && intval($id)<=180000){
            $result = $this->attacksGateway->getById($id);
            $response['status_code_header'] = 'HTTP/1.1 200 OK';
            $response['body'] = json_encode($result);
        }else{

            $response['status_code_header'] = 'HTTP/1.1 404 Not Found';
            $response['body'] = json_encode("eroare");
        }
        return $response;

        // $result = [ "country" => "test", "latitude" => 200, "longitude" => 100];
        // if (strcmp($id, "gresit") == 0){
        //     $response['status_code_header'] = 'HTTP/1.1 404 Not Found';
        // } else {
        //     $response['status_code_header'] = 'HTTP/1.1 200 OK';
        // }
        // $response['body'] = json_encode($result);
        // return $response;
    }

}
