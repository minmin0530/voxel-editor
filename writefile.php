<?php

$data = $_POST['data'];

$arrTime = explode('.',microtime(true));

$fh = fopen('./data/'.date('Ymd_His_', $arrTime[0]).$arrTime[1].'.txt', "w");
fwrite($fh, $data);
fclose($fh);

echo date('Ymd_His_', $arrTime[0]).$arrTime[1];