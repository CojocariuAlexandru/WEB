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
    
         echo $statement;
         print_r($transformed);
        $prepareArray = $this->prepareArray($transformed);
        print_r($prepareArray);

        try {
            $statement = $this->db->prepare($statement);
            $statement->execute($prepareArray);
             $res = $statement->get_result();
             $result = $res->fetch_all(PDO::FETCH_ASSOC);
            return $statement;
        } catch (\PDOException $e) {
            exit($e->getMessage());
        }
    }
    private function prepareArray($transformed){
        $prepareArray1 = [];
        if (array_key_exists("region", $transformed))
            $prepareArray1["region"] = $transformed["region"];
        if (array_key_exists("country", $transformed))
            $prepareArray1["country"] = $transformed["country"];
        if (array_key_exists("city", $transformed))
            $prepareArray1["city"] = $transformed["city"];
        if (array_key_exists("targetName", $transformed))
            $prepareArray1["targetName"] = $transformed["targetName"];
        if (array_key_exists("targetNat", $transformed))
            $prepareArray1["targetNat"] = $transformed["targetNat"];
        if (array_key_exists("groupName", $transformed))
            $prepareArray1["groupName"] = $transformed["groupName"];
        if (array_key_exists("targSubtype", $transformed))
            $prepareArray1["targSubtype"] = $transformed["targSubtype"];
        if (array_key_exists("weaponSubtype", $transformed))
            $prepareArray1["weaponSubtype"] = $transformed["weaponSubtype"];
        return $prepareArray1;
    }
    private function prepareStatement(&$statement, $transformed){

        $statement = $statement . "date >= STR_TO_DATE('" . $transformed["startDate"] .  "' , '%Y-%m-%d')";
        if ($transformed["finalDate"]=="sysdate")
        $statement = $statement . " AND date <= sysdate() ";
        else
            $statement = $statement . " AND date <= STR_TO_DATE('" . $transformed["finalDate"] . "', '%Y-%m-%d') ";

        $this->statementArray($statement, $transformed["weaponType"], "weaponType");
        $this->statementArray($statement, $transformed["attackType"], "attackType");
        $this->statementArray($statement, $transformed["targType"], "targType");
        $this->statementArray($statement, $transformed["propExtent"], "propExtent");

        $this->setCondition($statement, $transformed["terrCount"], "terrCount", "<=");
        $this->setCondition($statement, $transformed["killsCount"], "killsCount", "<=");
        $this->setCondition($statement, $transformed["woundedCount"],"woundedCount", "<=");

        $this->setCondition($statement, $transformed["success"], "success", "=");
        $this->setCondition($statement, $transformed["suicide"], "suicide", "=");

        
        if (array_key_exists("region", $transformed))
            $this->setConditionStr($statement, $transformed["region"], "region", "=");
        if (array_key_exists("country", $transformed))
            $this->setConditionStr($statement, $transformed["country"], "country", "=");
        if (array_key_exists("city", $transformed))
            $this->setConditionStr($statement, $transformed["city"], "city", "=");
        if (array_key_exists("targetName", $transformed))
            $this->setConditionStr($statement, $transformed["targetName"], "targetName", "=");
        if (array_key_exists("targetNat", $transformed))
            $this->setConditionStr($statement, $transformed["targetNat"], "targetNat", "=");
        if (array_key_exists("groupName", $transformed))
            $this->setConditionStr($statement, $transformed["groupName"], "groupName", "=");

        if (array_key_exists("targSubtype", $transformed))
            $this->setConditionStr($statement, $transformed["targSubtype"], "targSubtype", "=");
        if (array_key_exists("weaponSubtype", $transformed))
            $this->setConditionStr($statement, $transformed["weaponSubtype"], "weaponSubtype", "=");

        $statement = $statement . "LIMIT 100;";

    }



    private function setCondition(&$statement, $value, $str, $op){
        $statement = $statement . "AND $str $op $value ";
    }
    private function setConditionStr(&$statement, $value, $str, $op){
       // $statement = $statement . "AND $str $op '$value' ";
       $statement = $statement . "AND $str $op :$str ";
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
