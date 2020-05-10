<?php

namespace Src\Service;

interface iAttacksService
{
    public function getFirst($first);

    public function getByPlaceInPage($pageId, $onPage);

    public function deleteById($id);

    public function getById($id);

    public function insert($decoded);

    public function update($decoded, $id);

    public function getFiltered($decoded, $id);

    public function getMapPageAttacks($body);

    public function getPreview();
}
