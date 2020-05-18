<?php

namespace Src\Service;

class AttacksService implements iAttacksService
{
    private $iAttacksRepository = null;

    public function __construct($iAttacksRepository)
    {
        $this->iAttacksRepository = $iAttacksRepository;
    }
    

    public function getFirst($first)
    {
        $result = $this->iAttacksRepository->getFirst($first);
        $response['status_code_header'] = 'HTTP/1.1 200 OK';
        $response['body'] = json_encode($result);
        return $response;
    }

    public function getByPlaceInPage($pageId, $onPage)
    {
        $result = $this->iAttacksRepository->getByPlaceInPage($pageId, $onPage);
        $response['status_code_header'] = 'HTTP/1.1 200 OK';
        $response['body'] = json_encode($result);
        return $response;
    }

    public function deleteById($id)
    {
        if (is_numeric($id) && intval($id) >= 0/* && intval($id) <= 180000*/) {
            $result = $this->iAttacksRepository->deleteById($id);
            $response['status_code_header'] = 'HTTP/1.1 200 OK';
            $response['body'] = json_encode($result);
        } else {
            $response['status_code_header'] = 'HTTP/1.1 404 Not Found';
            $response['body'] = json_encode("eroare");
        }
        return $response;
    }

    public function getById($id)
    {
        if (is_numeric($id) && intval($id) >= 0/* && intval($id) <= 180000*/) {

            $result = $this->iAttacksRepository->getById($id);
            if ($result != []) {
                $response['status_code_header'] = 'HTTP/1.1 200 OK';
            } else {
                $response['status_code_header'] = 'HTTP/1.1 404 Not Found';
            }

            $response['body'] = json_encode($result);
        } else {
            $response['status_code_header'] = 'HTTP/1.1 404 Not Found';
            $response['body'] = json_encode("eroare");
        }

        return $response;
    }

    public function insert($decoded)
    {
        $this->prepareUpdate($decoded, $transformed);
        $result = $this->iAttacksRepository->insert($transformed);

        $response['status_code_header'] = 'HTTP/1.1 201 Created';
        $response['body'] = json_encode($result);
        return $response;
    }

    public function update($decoded, $id)
    {
        $this->prepareUpdate($decoded, $transformed);
        $result = $this->iAttacksRepository->update($transformed, $id);

        if ($result == "err") {
            $response['status_code_header'] = 'HTTP/1.1 500 Internal Server Error';
        } else {
            $response['status_code_header'] = 'HTTP/1.1 200 OK';
        }
        $response['body'] = json_encode($result);

        return $response;
    }

    public function getFiltered($decoded, $id)
    {
        if ($id != "filters") {
            $response['status_code_header'] = 'HTTP/1.1 404 Not Found';
            $response['body'] = json_encode("eroare");
            return $response;
        }
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
        $this->setValueBool($decoded, $transformed, "extended");
        $this->setIfExists($decoded, $transformed, "region");
        $this->setIfExists($decoded, $transformed, "country");
        $this->setIfExists($decoded, $transformed, "city");
        $this->setIfExists($decoded, $transformed, "groupName");
        $this->setIfExists($decoded, $transformed, "targetNat");
        $this->setIfExists($decoded, $transformed, "targetName");
        $this->setIfExists($decoded, $transformed, "targSubtype");
        $this->setIfExists($decoded, $transformed, "weaponSubtype");

        $result = $this->iAttacksRepository->getStatistics($transformed);
        $response['status_code_header'] = 'HTTP/1.1 200 OK';
        $response['body'] = json_encode($result);
        return $response;
    }

    public function getMapPageAttacks($body)
    {
        $filters = [];

        $this->getStartDate($body, $filters);
        $this->getEndDate($body, $filters);
        $this->setIfExists($body, $filters, "region");
        $this->setIfExists($body, $filters, "country");
        $this->setIfExists($body, $filters, "city");

        $result = $this->iAttacksRepository->getInfoForMapPage($filters);
        $response['status_code_header'] = 'HTTP/1.1 200 OK';
        $response['body'] = json_encode($result);
        return $response;
    }

    public function getPreview()
    {
        $result = $this->iAttacksRepository->getPreview();
        $response['status_code_header'] = 'HTTP/1.1 200 OK';
        $response['body'] = json_encode($result);
        return $response;
    }

    // HELPER FUNCTIONS

    private function prepareUpdate($decoded, &$transformed)
    {
        foreach ((array) $decoded as $key => $value) {
            if ($value != "") {
                $transformed[$key] = $value;
            }
        }

        $this->setValueBool($decoded, $transformed, "suicide");
        $this->setValueBool($decoded, $transformed, "extended");
        $this->setValueBool($decoded, $transformed, "success");
    }

    private function setIfExists($decoded, &$transformed, $name)
    {
        if ($decoded[$name] != "") {
            $transformed[$name] = $decoded[$name];
        }
    }

    private function setValueBool($decoded, &$transformed, $name)
    {
        if ($decoded[$name] == "true") {
            $transformed[$name] = "1";
        } else {
            $transformed[$name] = "0";
        }
    }

    private function setValue($decoded, &$transformed, $name)
    {
        $transformed[$name] = $decoded[$name];
    }

    private function getStartDate($decoded, &$transformed)
    {
        if ($decoded["dateStart"] == "") {
            $transformed["startDate"] = "1970-01-01";
        } else {
            $transformed["startDate"] = $decoded["dateStart"];
        }
    }

    private function getEndDate($decoded, &$transformed)
    {
        if ($decoded["dateFinal"] == "") {
            $transformed["finalDate"] = "sysdate";
        } else {
            $transformed["finalDate"] = $decoded["dateFinal"];
        }
    }

    private function setArrays($decoded, &$transformed, $name)
    {
        if ($decoded[$name] != "") {
            $i = 0;
            $exploded = explode(",", $decoded[$name]);

            foreach ($exploded as $value) {
                $transformed[$name][$i] = $value;
                $i++;
            }
        }
    }
}
