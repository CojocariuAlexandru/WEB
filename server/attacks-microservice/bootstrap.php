<?php
// https://dzone.com/articles/develop-a-rest-api-in-php
// In dezvoltarea acestui serviciului s-a pornit dupa exemplul de aici
require 'vendor/autoload.php';

use Dotenv\Dotenv;

use Src\System\DatabaseConnector;
use Src\Repository\AttacksRepository;
use Src\Service\AttacksService;
use Src\Controller\AttacksController;

$dotenv = new DotEnv(__DIR__);
$dotenv->load();

$dbConnection = (new DatabaseConnector())->getConnection();

$iAttacksRepository = new AttacksRepository($dbConnection);
$iAttacksService = new AttacksService($iAttacksRepository);
$attacksController = new AttacksController($iAttacksService);
