var camera, scene, renderer;
var plane;
var mouse, raycaster, isShiftDown = false;

var rollOverMesh, rollOverMaterial;
var cubeGeo, cubeMaterial = [], materialIndex = 0;

var objects = [];
var objectsMaterial = [];
var contents = '';
var form;
var speedFlag = false;
var anglePutFlag = false;
var colorChangeFlag = false;
var cameraAngle = 0.0;
var cameraZoom = 700.0;
var json;

var colorNumTextArray = [
  'color1',
  'color2',
  'color3',
  'color4',
  'color5',
  'color6',
  'color7',
  'color8',
  'color9',
  'color10',
  'color11',
  'color12',
  'color13',
  'color14',
  'color15',
  'color16',
];

function allClear() {
  for (const v of objects) {
    scene.remove(v);
  }
  objects.length = 0;
  objects = [];
  objectsMaterial.length = 0;
  objectsMaterial = [];
  rollOverMesh.position.set(25, 25, 25);
  rollOverMesh.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);

  objects.push(plane);

}

function colorToText(mm) {
  let colorText = '#';
  let m1 = Math.floor(mm.r * 255 % 16);
  let m2 = Math.floor(mm.r * 255 / 16);
  if      (m1 == 10) { m1 = 'a'; }
  else if (m1 == 11) { m1 = 'b'; }
  else if (m1 == 12) { m1 = 'c'; }
  else if (m1 == 13) { m1 = 'd'; }
  else if (m1 == 14) { m1 = 'e'; }
  else if (m1 == 15) { m1 = 'f'; }
  if      (m2 == 10) { m2 = 'a'; }
  else if (m2 == 11) { m2 = 'b'; }
  else if (m2 == 12) { m2 = 'c'; }
  else if (m2 == 13) { m2 = 'd'; }
  else if (m2 == 14) { m2 = 'e'; }
  else if (m2 >= 15) { m2 = 'f'; }
  colorText += m2 + '' + m1;
  m1 = Math.floor(mm.g * 255 % 16);
  m2 = Math.floor(mm.g * 255 / 16);
  if      (m1 == 10) { m1 = 'a'; }
  else if (m1 == 11) { m1 = 'b'; }
  else if (m1 == 12) { m1 = 'c'; }
  else if (m1 == 13) { m1 = 'd'; }
  else if (m1 == 14) { m1 = 'e'; }
  else if (m1 == 15) { m1 = 'f'; }
  if      (m2 == 10) { m2 = 'a'; }
  else if (m2 == 11) { m2 = 'b'; }
  else if (m2 == 12) { m2 = 'c'; }
  else if (m2 == 13) { m2 = 'd'; }
  else if (m2 == 14) { m2 = 'e'; }
  else if (m2 >= 15) { m2 = 'f'; }
  colorText += m2 + '' + m1;
  m1 = Math.floor(mm.b * 255 % 16);
  m2 = Math.floor(mm.b * 255 / 16);
  if      (m1 == 10) { m1 = 'a'; }
  else if (m1 == 11) { m1 = 'b'; }
  else if (m1 == 12) { m1 = 'c'; }
  else if (m1 == 13) { m1 = 'd'; }
  else if (m1 == 14) { m1 = 'e'; }
  else if (m1 == 15) { m1 = 'f'; }
  if      (m2 == 10) { m2 = 'a'; }
  else if (m2 == 11) { m2 = 'b'; }
  else if (m2 == 12) { m2 = 'c'; }
  else if (m2 == 13) { m2 = 'd'; }
  else if (m2 == 14) { m2 = 'e'; }
  else if (m2 >= 15) { m2 = 'f'; }
  colorText += m2 + '' + m1;
  return colorText;
}

function render() {
  renderer.setClearColor(document.getElementById('background').value, 1.0);
  renderer.render(scene, camera);
}

function downLoadJson() {
  for (const voxel of objects) {
    let i = 0;
    for (const cm of cubeMaterial) {
      if (voxel.material == cm) {
        break;
      }
      ++i;
    }
    if (i < 16) {
      contents += '{'
                    + '"x":' + ((voxel.position.x + 25) / 50) + ','
                    + '"y":' + ((voxel.position.y - 25) / 50) + ','
                    + '"z":' + ((voxel.position.z + 25) / 50) + ','
                    + '"m":' + i + '},';
    }
  }

  let material = '"material":[';
  for (let l = 0; l < 16; ++l) {
    //          for (const m of cubeMaterial) {
    cubeMaterial[l].color.set(document.getElementById(colorNumTextArray[l]).value);
    material += '{'
                      + '"r":' + cubeMaterial[l].color.r + ','
                      + '"g":' + cubeMaterial[l].color.g + ','
                      + '"b":' + cubeMaterial[l].color.b + ','
                      + '"a":' + cubeMaterial[l].opacity + '},';
  }
  const mat = material.substr(0, material.length - 1) + ']}';


  // var resultJson = JSON.stringify($scope.jsonObj);
  const downLoadLink = document.createElement('a');
  downLoadLink.download = 'voxel.txt';
  downLoadLink.href = URL.createObjectURL(new Blob(['{"voxel":[' + contents.substr(0, contents.length - 1) + '],' + mat], {type: 'text.plain'}));
  downLoadLink.dataset.downloadurl = ['text/plain', downLoadLink.download, downLoadLink.href].join(':');
  downLoadLink.click();
}


function boxAll(num) {
  for (let x = -num / 2; x < num / 2; ++x) {
    for (let y = 0; y < num; ++y) {
      for (let z = -num / 2; z < num / 2; ++z) {
        var voxel = new THREE.Mesh(cubeGeo, cubeMaterial[materialIndex]);
        voxel.position.set(x * 50, y * 50, z * 50);//copy( intersect.point ).add( intersect.face.normal );
        voxel.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);
        scene.add(voxel);

        objects.push(voxel);
        objectsMaterial.push(cubeMaterial[materialIndex]);
      }
    }
  }
}


function anglePut() {
  anglePutFlag = !anglePutFlag;
  if (anglePutFlag) {
    document.getElementById('anglePut').innerHTML = '設置';
  } else {
    document.getElementById('anglePut').innerHTML = '削除';
  }
}

function colorChange() {
  colorChangeFlag = !colorChangeFlag;
  if (colorChangeFlag) {
    document.getElementById('colorChange').innerHTML = '色入替ON';
  } else {
    document.getElementById('colorChange').innerHTML = '色入替OFF';
  }

}

    