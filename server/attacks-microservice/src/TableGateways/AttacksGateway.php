<?php

namespace Src\TableGateways;

class AttacksGateway
{

    private $db = null;

    public function __construct($db)
    {
        $this->db = $db;
    }

    public function getFirst($first)
    {
        $statement = "
            SELECT country, latitude, longitude, region, id
            FROM attacks
            LIMIT " . $first . ";";
        try {
            $statement = $this->db->query($statement);
            $result = $statement->fetchAll(\PDO::FETCH_ASSOC);
            return $result;
        } catch (\PDOException $e) {
            exit($e->getMessage());
        }
    }
    public function getById($id){
        
        $statement = "
            SELECT * 
            FROM attacks
            WHERE id=". $id .";";
        try {
            $statement = $this->db->query($statement);
            $result = $statement->fetchAll(\PDO::FETCH_ASSOC);
            return $result;
        } catch (\PDOException $e) {
            exit($e->getMessage());
        }
    }


}
