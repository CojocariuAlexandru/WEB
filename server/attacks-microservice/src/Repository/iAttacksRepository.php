<?php

namespace Src\Repository;

interface iAttacksRepository
{
    public function getFirst($first);

    public function getByPlaceInPage($pageId, $onPage);

    public function deleteById($id);

    public function getById($id);

    public function insert($decoded);

    public function update($decoded, $id);

    public function getStatistics($transformed);

    public function getInfoForMapPage($filters);

    public function getPreview();
}
