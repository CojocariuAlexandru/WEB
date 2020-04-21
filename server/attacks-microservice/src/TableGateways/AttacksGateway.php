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
            FROM attacks WHERE ";
        
        $this->prepareStatement($statement, $transformed);

        // echo $statement;

        try {
            $statement = $this->db->query($statement);
            $result = $statement->fetchAll(\PDO::FETCH_ASSOC);
            return $result;
        } catch (\PDOException $e) {
            exit($e->getMessage());
        }
    }
    private function prepareStatement(&$statement, $transformed){

        $statement = $statement . "date >= STR_TO_DATE('" . $transformed["startDate"] .  "' , '%Y-%m-%d')";
        if ($transformed["finalDate"]=="sysdate")
        $statement = $statement . " AND date <= sysdate() ";
        else
            $statement = $statement . " AND date <= STR_TO_DATE('" . $transformed["finalDate"] . "', '%Y-%m-%d') ";

        // $this->statementArray($statement, $transformed["weaponType"], "weaponType");
        // $this->statementArray($statement, $transformed["attackType"], "attackType");
        // $this->statementArray($statement, $transformed["targType"], "targType");

        $this->setCondition($statement, $transformed["terrCount"], "terrCount", "<=");
        $this->setCondition($statement, $transformed["killsCount"], "killsCount", "<=");
        $this->setCondition($statement, $transformed["woundedCount"],"woundedCount", "<=");

        $this->setCondition($statement, $transformed["success"], "success", "=");
        if (array_key_exists("region", $transformed))
            $this->setConditionStr($statement, $transformed["region"], "region", "=");
        if (array_key_exists("country", $transformed))
            $this->setConditionStr($statement, $transformed["country"], "country", "=");

        $statement = $statement . "LIMIT 100;";

    }



    private function setCondition(&$statement, $value, $str, $op){
        $statement = $statement . "AND $str $op $value ";
    }
    private function setConditionStr(&$statement, $value, $str, $op){
        $statement = $statement . "AND $str $op '$value' ";
    }

    private function statementArray(&$statement, $array, $name){
        $str = " AND $name IN (";

        foreach($array as $elem){
            $str = $str . "'" . $elem .  "',";
        }

        $str = $str . "'" . $array[0]."') ";
        $statement = $statement . $str;
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
