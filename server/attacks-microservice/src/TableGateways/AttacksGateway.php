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
    public function getStatistics($transformed)
    {
        $statement = "
            SELECT *
            FROM attacks WHERE";

        $this->prepareStatement($statement, $transformed);

        echo $statement;

        try {
            $statement = $this->db->query($statement);
            $result = $statement->fetchAll(\PDO::FETCH_ASSOC);
            return $result;
        } catch (\PDOException $e) {
            exit($e->getMessage());
        }
    }
    private function prepareStatement(&$statement, $transformed){

        $statement = $statement . "date >= TO_DATE(" . $transformed["startDate"] .  ", 'YYYY-MM-DD' )";
        $statement = $statement . "AND date <= TO_DATE(" . $transformed["finaltDate"] . ", 'YYYY-MM-DD' ) ";

        $this->statementArray($statement, $transformed["weaponsUsed"]);
        $this->statementArray($statement, $transformed["attacksUsed"]);
        $this->statementArray($statement, $transformed["targets"]);

        $this->setCondition($statement, $transformed["terroristNumber"], "terroristNumber", "<=");
        $this->setCondition($statement, $transformed["deathsNumber"], "deathsNumber", "<=");
        $this->setCondition($statement, $transformed["woundNumber"], "woundNumber", "<=");

        $this->setCondition($statement, $transformed["success"], "success", "=");
        $this->setCondition($statement, $transformed["region"], "region", "=");
        $this->setCondition($statement, $transformed["country"], "country", "=");
        $this->setCondition($statement, $transformed["knownAttacker"], "knownAttacker", "=");

    }



    private function setCondition(&$statement, $value, $str, $op){
        $statement = $statement . "AND $str $op $value";
    }

    private function statementArray(&$statement, $array){
        $str = "AND $array IN (";

        foreach($array as $elem){
            $str = $str + $elem + ",";
        }

        $str = $str +$array[0]+")";
    }


    public function getPreview()
    {
        $statement = "
            SELECT id, latitude, longitude, country, attackType, killsCount, woundedCount 
            FROM attacks
            ORDER BY killsCount DESC
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
