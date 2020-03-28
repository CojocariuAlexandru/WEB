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

    public function processRequest()
    {
        switch ($this->requestMethod) {
            case 'GET':
                $response = $this->getFirst(100);
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
}
