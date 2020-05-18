<?php

namespace Src\Service;

use PHPUnit\Framework\TestCase;

require $_SERVER['DOCUMENT_ROOT'] . 'attacks-microservice/src/Service/AttacksService.php';


class attacksTests extends TestCase{

    public function testTheTesting(){
        $a = 14;
        $this->assertTrue(true);
        $this->assertFalse(false);
        $this->assertEquals($a, 14);
    }

    public function testDeleteRoute(){
        $this->assertTrue(true);
        
    }
}