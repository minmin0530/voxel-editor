<?php

$result = glob("./data/*");
$array = array_reverse($result);

$doc = new DomDocument;
$doc->Load('./index.html');

$sampleSelectBox = $doc->getElementById("selectBoxName");

for ( $i = 0; $i < count( $array ); $i++ ) {
  $option = $doc->createElement("option");
  $option->setAttribute("value", $array[$i]);
  $option->innerHTML = $array[$i];
  $sampleSelectBox->appendChild($option);
}

echo $doc->saveHTML();

?>
