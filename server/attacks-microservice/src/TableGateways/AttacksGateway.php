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
    
    public function getById($id)
    {
        $statement = "
            SELECT * 
            FROM attacks
            WHERE id=" . $id . ";";
        try {
            $statement = $this->db->query($statement);
            $result = $statement->fetchAll(\PDO::FETCH_ASSOC);
            return $result;
        } catch (\PDOException $e) {
            exit($e->getMessage());
        }
    }
    public function getStatistics($decoded)
    {
        $statement = "
            SELECT *
            FROM attacks WHERE
            startDate < TO_DATE(". $decoded["startDate"]."\",\"YYYY-MM-DD\")";

        $this->prepareStatement($statement);

        
        try {
            $statement = $this->db->query($statement);
            $result = $statement->fetchAll(\PDO::FETCH_ASSOC);
            return $result;
        } catch (\PDOException $e) {
            exit($e->getMessage());
        }
    }
    private function prepareStatement(&$statement, $decoded){


        if ($decoded["country"]!=""){
            $statement = $statement . "AND country=".$decoded["country"];
        }

        if ($decoded["region"]!=""){
            $statement = $statement . "AND region=".$decoded["region"];
        }

        $statement = $statement . "attack_type IN(".$decoded["attack_type"].")";
        $statement = $statement . "weaponUsed IN(".$decoded["weapon_used"].")";
        $statement = $statement . "targets IN(".$decoded["tagets"].")";

        
        




    }


    public function getPreview()
    {
        $statement = "
            SELECT id, latitude, longitude, country, attack_type, kills_count, wounded_count 
            FROM attacks
            ORDER BY kills_count DESC
            LIMIT 12;";
        try {
            $statement = $this->db->query($statement);
            $result = $statement->fetchAll(\PDO::FETCH_ASSOC);
            return $result;
        } catch (\PDOException $e) {
            exit($e->getMessage());
        }
    }
}
