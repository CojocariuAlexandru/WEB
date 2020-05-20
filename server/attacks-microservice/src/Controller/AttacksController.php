<?php
// https://dzone.com/articles/develop-a-rest-api-in-php
// In dezvoltarea acestui serviciului s-a pornit dupa exemplul de aici

namespace Src\Controller;

class AttacksController
{
    private $iAttacksService;

    public function __construct($iAttacksService)
    {
        $this->iAttacksService = $iAttacksService;
    }

    public function processRequest($uri, $requestMethod)
    {
        $response = $this->solveRequest($uri, $requestMethod);

        if (isset($response['status_code_header'])) {
            header($response['status_code_header']);
        }
        if (isset($response['body'])) {
            if ($response['body']) {
                echo $response['body'];
            }
        }
    }

    private function solveRequest($uri, $requestMethod)
    {
        $response = null;

        switch ($requestMethod) {
            case 'GET':
                $response = $this->solveGETRequests($uri);
                break;
            case 'POST':
                $response = $this->solvePOSTRequests($uri);
                break;
            case 'PUT':
                $response = $this->solvePUTRequests($uri);
                break;
            case 'DELETE':
                $response = $this->solveDELETERequests($uri);
                break;
        }

        return $response;
    }

    private function solveGETRequests($uri)
    {
        $response = null;

        //Attacks dashboard case: (pageId, onPage) => returns the attack which is the onPage-th in the page with ID 'pageId'
        if (sizeof($uri) > 3 && strcmp($uri[3], "attacks-dashboard") == 0) {
            $response = $this->iAttacksService->getByPlaceInPage($_GET["pageId"], $_GET["onPage"]);
        } else if (isset($_GET["preview"]) && $_GET["preview"] == "true") {
            $response = $this->iAttacksService->getPreview();
        } else if (sizeof($uri) > 3) {
            $response = $this->iAttacksService->getById($uri[3]);
        } else {
            $response = $this->iAttacksService->getFirst(1000);
        }

        return $response;
    }

    private function solvePOSTRequests($uri)
    {
        $response = null;

        $rawData = file_get_contents("php://input");
        $decoded = json_decode($rawData, true);

        if (sizeof($uri) > 3 && strcmp($uri[3], "map") == 0) {
            $response = $this->iAttacksService->getMapPageAttacks($decoded);
        } else if (sizeof($uri) > 3) {
            $response = $this->iAttacksService->getFiltered($decoded, $uri[3]);
        } else {
            if (!$this->isAuthorized()) {
                $response['status_code_header'] = 'HTTP/1.1 401 Not Authorized';
                return $response;
            }
            $response = $this->iAttacksService->insert($decoded);
        }

        return $response;
    }

    private function solvePUTRequests($uri)
    {
        $response = [];

        $rawData = file_get_contents("php://input");
        $decoded = json_decode($rawData, true);
        if (sizeof($uri) > 3) {
            if (!$this->isAuthorized()) {
                $response['status_code_header'] = 'HTTP/1.1 401 Not Authorized';
                return $response;
            }
            $response = $this->iAttacksService->update($decoded, $uri[3]);
        } else {
            $response['status_code_header'] = 'HTTP/1.1 404 Not Found';
        }

        return $response;
    }

    private function solveDELETERequests($uri)
    {
        if (!$this->isAuthorized()) {
            $response['status_code_header'] = 'HTTP/1.1 401 Not Authorized';
            return $response;
        }
        $response = $this->iAttacksService->deleteById($uri[3]);
        return $response;
    }

    private function isAuthorized()
    {
        $jwt = $this->getJwtFromHeader();
        if ($jwt === '') {
            return false;
        }
        $SECRET_KEY = getenv('SECRET');

        try {
            $decoded = \Firebase\JWT\JWT::decode($jwt, $SECRET_KEY, array('HS256'));
            $decoded = (array) $decoded;

            if ($decoded["admin"] == 0) {
                return false;
            }
        } catch (\Firebase\JWT\ExpiredException $e) {
            return false;
        }

        return true;
    }

    private function getJwtFromHeader()
    {
        if (!isset($_SERVER['HTTP_AUTHORIZATION'])) {
            return '';
        }

        $header = $_SERVER['HTTP_AUTHORIZATION'];
        if (substr($header, 0, 7) !== 'Bearer ') {
            return '';
        }

        $jwt = explode(' ', $header);
        if (sizeof($jwt) < 2) {
            return '';
        }

        return $jwt[1];
    }
}
