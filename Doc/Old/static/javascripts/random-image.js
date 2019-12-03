var theImages = new Array()
theImages[0] = '../static/images/index-1.png'
theImages[1] = '../static/images/index-2.png'
theImages[2] = '../static/images/index-3.png'
theImages[3] = '../static/images/index-4.png'
theImages[4] = '../static/images/index-5.png'
var j = 0
var p = theImages.length;
var preBuffer = new Array()

for (i = 0; i < p; i++) {
 preBuffer[i] = new Image()
 preBuffer[i].src = theImages[i]
}
var whichImage = Math.round(Math.random() * (p - 1));

function showImage() {
 if (whichImage == 0) {
  document.write('<img src="' + theImages[whichImage] + '" class="img-fluid" border=0 width="55%" height="70px">');
 } else if (whichImage == 1) {
  document.write('<img src="' + theImages[whichImage] + '" class="img-fluid" border=0 width="55%" height="70px">');
 } else if (whichImage == 2) {
  document.write('<img src="' + theImages[whichImage] + '" class="img-fluid" border=0 width="55%" height="70px">');
 } else if (whichImage == 3) {
  document.write('<img src="' + theImages[whichImage] + '" class="img-fluid" border=0 width="55%" height="70px">');
 } else if (whichImage == 4) {
  document.write('<img src="' + theImages[whichImage] + '" class="img-fluid" border=0 width="55%" height="70px">');
 } else if (whichImage == 5) {
  document.write('<img src="' + theImages[whichImage] + '" class="img-fluid" border=0 width="55%" height="70px">');
 }

}
