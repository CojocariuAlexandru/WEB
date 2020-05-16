<?php
use PHPUnit\Framework\TestCase;


require '../src/Service/AttacksService.php';

class TeviTests extends TestCase
{

    public function testDeleteRoute()
    {
        $obj = new AttacksService;
        $this->assertSame($obj->deleteById("9999999")['body'], "eroare");
        $this->assertSame($obj->deleteById("ana")['body'], "eroare");
        $this->assertTrue($obj->deleteById("1")['body'] != "eroare");

    }
}
?>