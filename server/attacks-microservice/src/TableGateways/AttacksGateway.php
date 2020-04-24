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
            SELECT id, date, extended, region, country, city, 
            attackType, success, suicide, targType, terrCount, weaponType, 
            killsCount, woundedCount, propExtent
            FROM attacks WHERE ";
        
        $prepareArray = $this->prepareStatement($statement, $transformed);
        // print_r($prepareArray);

        try {
            $statement = $this->db->prepare($statement);
            $statement->execute($prepareArray);
             $result = $statement->fetchAll();
            return $result;
        } catch (\PDOException $e) {
            exit($e->getMessage());
        }
    }
 
    private function prepareStatement(&$statement, $transformed){
        $prepareArray1 = [];

        $statement = $statement . "date >= STR_TO_DATE('" . $transformed["startDate"] .  "' , '%Y-%m-%d')";
        if ($transformed["finalDate"]=="sysdate")
        $statement = $statement . " AND date <= sysdate() ";
        else
            $statement = $statement . " AND date <= STR_TO_DATE('" . $transformed["finalDate"] . "', '%Y-%m-%d') ";

        if (array_key_exists("weaponType", $transformed))
            $this->statementArray($statement, $transformed["weaponType"], "weaponType", $prepareArray1);
        if (array_key_exists("attackType", $transformed))
            $this->statementArray($statement, $transformed["attackType"], "attackType", $prepareArray1);
        if (array_key_exists("targType", $transformed))
            $this->statementArray($statement, $transformed["targType"], "targType", $prepareArray1);
        if (array_key_exists("propExtent", $transformed))
            $this->statementArray($statement, $transformed["propExtent"], "propExtent", $prepareArray1);

        if (array_key_exists("terrCount", $transformed)){
             $this->setCondition($statement, $transformed["terrCount"], "terrCount", "<=");
             $prepareArray1["terrCount"] = $transformed["terrCount"];
        }
        if (array_key_exists("killsCount", $transformed)){
            $this->setCondition($statement, $transformed["killsCount"], "killsCount", "<=");
            $prepareArray1["killsCount"] = $transformed["killsCount"];
        }
        if (array_key_exists("woundedCount", $transformed)){
            $this->setCondition($statement, $transformed["woundedCount"],"woundedCount", "<=");
            $prepareArray1["woundedCount"] = $transformed["woundedCount"];
        }
        if (array_key_exists("success", $transformed)){
           $this->setCondition($statement, $transformed["success"], "success", "=");
           $prepareArray1["success"] = $transformed["success"];
        }
        if (array_key_exists("suicide", $transformed)){
            $this->setCondition($statement, $transformed["suicide"], "suicide", "=");
            $prepareArray1["suicide"] = $transformed["suicide"];
        }
        if (array_key_exists("extended", $transformed)){
            $this->setCondition($statement, $transformed["extended"], "extended", "=");
            $prepareArray1["extended"] = $transformed["extended"];
        }
        if (array_key_exists("region", $transformed)){
            $this->setConditionStr($statement, $transformed["region"], "region", "=");
            $prepareArray1["region"] = $transformed["region"];
        }
        if (array_key_exists("country", $transformed)){
            $this->setConditionStr($statement, $transformed["country"], "country", "=");
            $prepareArray1["country"] = $transformed["country"];
        }
        if (array_key_exists("city", $transformed)){
            $this->setConditionStr($statement, $transformed["city"], "city", "=");
            $prepareArray1["city"] = $transformed["city"];
        }
        if (array_key_exists("targetName", $transformed)){
            $this->setConditionStr($statement, $transformed["targetName"], "targetName", "=");
            $prepareArray1["targetName"] = $transformed["targetName"];
        }
        if (array_key_exists("targetNat", $transformed)){
            $this->setConditionStr($statement, $transformed["targetNat"], "targetNat", "=");
            $prepareArray1["targetNat"] = $transformed["targetNat"];
        }
        if (array_key_exists("groupName", $transformed)){
            $this->setConditionStr($statement, $transformed["groupName"], "groupName", "=");
            $prepareArray1["groupName"] = $transformed["groupName"];
        }

        if (array_key_exists("targSubtype", $transformed)){
            $this->setConditionStr($statement, $transformed["targSubtype"], "targSubtype", "=");
            $prepareArray1["targSubtype"] = $transformed["targSubtype"];
        }
        if (array_key_exists("weaponSubtype", $transformed)){
            $this->setConditionStr($statement, $transformed["weaponSubtype"], "weaponSubtype", "=");
            $prepareArray1["weaponSubtype"] = $transformed["weaponSubtype"];
        }

        // $statement = $statement . "LIMIT 10000;";

        // echo $statement;
        // print_r($prepareArray1);

        return $prepareArray1;

    }



    private function setCondition(&$statement, $value, $str, $op){
        // $statement = $statement . "AND $str $op $value ";
        $statement = $statement . "AND $str $op :$str ";
    }
    private function setConditionStr(&$statement, $value, $str, $op){
       // $statement = $statement . "AND $str $op '$value' ";
       $statement = $statement . "AND $str $op :$str ";
    }

    private function statementArray(&$statement, $array, $name, &$prepareArray){
        $str = " AND $name IN ( :$name ) ";
        $value = "";



        foreach($array as $elem){
            $value = $value . "'" . $elem .  "',";
        }

        $prepareArray[$name]= substr($value, 0, -1);
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
