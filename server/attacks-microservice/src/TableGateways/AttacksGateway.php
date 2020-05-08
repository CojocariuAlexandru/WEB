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

    public function deleteById($id){
        $statement = "
            DELETE 
            FROM attacks
            WHERE id= :id ";
        $prepareArray["id"]= $id;
        try {
            $statement = $this->db->prepare($statement);
            $status = $statement->execute($prepareArray);
                return $status;
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

    public function insertAttack($decoded){
        $statement = "INSERT INTO attacks ( ";
        $prepareArray = $this->prepareInsert($statement, $decoded);
        try {
            $statement = $this->db->prepare($statement);
            $status = $statement->execute($prepareArray);
            if ($status === false) {
                return "err";
            } else {

                $statement = "SELECT MAX(id) id FROM attacks; ";
                $statement = $this->db->query($statement);
                $result = $statement->fetchAll(\PDO::FETCH_ASSOC);
                return $result;
            }
        } catch (\PDOException $e) {
            exit($e->getMessage());
        }

    }

    private function prepareInsert(&$statement, $transformed){

        $statement = $statement . " date, ";

        $values = "(  STR_TO_DATE( :date , '%Y-%m-%d'), " ;

        $prepareArray1["date"] = $transformed["date"];
        unset($transformed['date']);
        unset($transformed['id']);

        foreach((array)$transformed as $key => $value){
             $prepareArray1[$key] = $value;
             $statement = $statement . "$key, ";
             $values = $values . ":$key, ";
        }
        $statement = substr($statement, 0, -2) . ") VALUES " . substr($values, 0, -2) . ")";
        return $prepareArray1;
    }

    public function updateAttack($decoded, $id){
        $statement = "UPDATE attacks SET ";
        $prepareArray = $this->prepareUpdate($statement, $decoded);
        $prepareArray["id"]=$id;
        $statement = $statement . " WHERE id = :id ";
        try {
            $smt = $this->db->prepare($statement);
            $status = $smt->execute($prepareArray);
            if ($status === false) {
                return "err";
            } else {
                return "Done";
            }
        } catch (\PDOException $e) {
            exit($e->getMessage());
        }

    }

    private function prepareUpdate(&$statement, $transformed){

        $statement = $statement . " date = STR_TO_DATE( :date , '%Y-%m-%d'), ";
        $prepareArray1["date"] = $transformed["date"];
        unset($transformed['date']);
        foreach((array)$transformed as $key => $value){

             $prepareArray1[$key] = $value;
             $statement = $statement . "$key=:$key, ";
        }
        $statement =  substr($statement, 0, -1);
           $statement = substr($statement, 0, -1);


        return $prepareArray1;
    }

    public function getStatistics($transformed)
    {
        $statement = "
            SELECT id, date, extended, region, country, city, 
            attackType, success, suicide, targType, terrCount, weaponType, 
            killsCount, woundedCount, propExtent
            FROM attacks WHERE ";

        $prepareArray = $this->prepareStatement($statement, $transformed);
        //  print_r($prepareArray);
        //  print_r($statement);

        try {
            $statement = $this->db->prepare($statement);
            $statement->execute($prepareArray);
            // print_r($statement);
            $result = $statement->fetchAll();
            return $result;
        } catch (\PDOException $e) {
            exit($e->getMessage());
        }
    }

    private function prepareStatement(&$statement, $transformed)
    {
        $prepareArray1 = [];

        $statement = $statement . "date >= STR_TO_DATE('" . $transformed["startDate"] .  "' , '%Y-%m-%d')";
        if ($transformed["finalDate"] == "sysdate")
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

        if (array_key_exists("terrCount", $transformed)) {
            $this->setCondition($statement, $transformed["terrCount"], "terrCount", "<=");
            $prepareArray1["terrCount"] = $transformed["terrCount"];
        }
        if (array_key_exists("killsCount", $transformed)) {
            $this->setCondition($statement, $transformed["killsCount"], "killsCount", "<=");
            $prepareArray1["killsCount"] = $transformed["killsCount"];
        }
        if (array_key_exists("woundedCount", $transformed)) {
            $this->setCondition($statement, $transformed["woundedCount"], "woundedCount", "<=");
            $prepareArray1["woundedCount"] = $transformed["woundedCount"];
        }
        if (array_key_exists("success", $transformed)) {
            $this->setCondition($statement, $transformed["success"], "success", "=");
            $prepareArray1["success"] = $transformed["success"];
        }
        if (array_key_exists("suicide", $transformed)) {
            $this->setCondition($statement, $transformed["suicide"], "suicide", "=");
            $prepareArray1["suicide"] = $transformed["suicide"];
        }
        if (array_key_exists("extended", $transformed)) {
            $this->setCondition($statement, $transformed["extended"], "extended", "=");
            $prepareArray1["extended"] = $transformed["extended"];
        }
        if (array_key_exists("region", $transformed)) {
            $this->setConditionStr($statement, $transformed["region"], "region", "=");
            $prepareArray1["region"] = $transformed["region"];
        }
        if (array_key_exists("country", $transformed)) {
            $this->setConditionStr($statement, $transformed["country"], "country", "=");
            $prepareArray1["country"] = $transformed["country"];
        }
        if (array_key_exists("city", $transformed)) {
            $this->setConditionStr($statement, $transformed["city"], "city", "=");
            $prepareArray1["city"] = $transformed["city"];
        }
        if (array_key_exists("targetName", $transformed)) {
            $this->setConditionStr($statement, $transformed["targetName"], "targetName", "=");
            $prepareArray1["targetName"] = $transformed["targetName"];
        }
        if (array_key_exists("targetNat", $transformed)) {
            $this->setConditionStr($statement, $transformed["targetNat"], "targetNat", "=");
            $prepareArray1["targetNat"] = $transformed["targetNat"];
        }
        if (array_key_exists("groupName", $transformed)) {
            $this->setConditionStr($statement, $transformed["groupName"], "groupName", "=");
            $prepareArray1["groupName"] = $transformed["groupName"];
        }

        if (array_key_exists("targSubtype", $transformed)) {
            $this->setConditionStr($statement, $transformed["targSubtype"], "targSubtype", "=");
            $prepareArray1["targSubtype"] = $transformed["targSubtype"];
        }
        if (array_key_exists("weaponSubtype", $transformed)) {
            $this->setConditionStr($statement, $transformed["weaponSubtype"], "weaponSubtype", "=");
            $prepareArray1["weaponSubtype"] = $transformed["weaponSubtype"];
        }

        //  $statement = $statement . "LIMIT 1000;";

        return $prepareArray1;
    }



    private function setCondition(&$statement, $value, $str, $op){
        $statement = $statement . "AND $str $op :$str ";
    }
    private function setConditionStr(&$statement, $value, $str, $op){
        $statement = $statement . "AND UPPER(TRIM( $str )) $op  UPPER(TRIM(:$str)) ";
    }

    private function statementArray(&$statement, $array, $name, &$prepareArray)
    {
        $index = 0;
        $str = " AND $name IN ( ";
        $value = "";

        foreach ($array as $elem) {
            $par = $name . $index;
            $str = $str . ":$par,";
            $prepareArray[$par]=$elem;
            $index ++;
        } 
        $statement = $statement . substr($str, 0, -1) . ") ";
    }

    public function getAttacksInfoForMapPage($filters)
    {
        $statement = "SELECT latitude, longitude FROM attacks WHERE ";

        $prepareArray = $this->prepareStatementForMapPage($statement, $filters);

        try {
            $statement = $this->db->prepare($statement);
            $statement->execute($prepareArray);
            $result = $statement->fetchAll();
            return $result;
        } catch (\PDOException $e) {
            exit($e->getMessage());
        }
    }

    private function prepareStatementForMapPage(&$statement, $filters)
    {
        $preparedArray = [];

        $statement = $statement . "date >= STR_TO_DATE('" . $filters["startDate"] .  "' , '%Y-%m-%d')";
        if ($filters["finalDate"] == "sysdate")
            $statement = $statement . " AND date <= sysdate() ";
        else
            $statement = $statement . " AND date <= STR_TO_DATE('" . $filters["finalDate"] . "', '%Y-%m-%d') ";

        if (array_key_exists("region", $filters)) {
            $this->setConditionStr($statement, $filters["region"], "region", "=");
            $preparedArray["region"] = $filters["region"];
        }
        if (array_key_exists("country", $filters)) {
            $this->setConditionStr($statement, $filters["country"], "country", "=");
            $preparedArray["country"] = $filters["country"];
        }
        if (array_key_exists("city", $filters)) {
            $this->setConditionStr($statement, $filters["city"], "city", "=");
            $preparedArray["city"] = $filters["city"];
        }

        $statement = $statement . "LIMIT 10000;";

        return $preparedArray;
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
