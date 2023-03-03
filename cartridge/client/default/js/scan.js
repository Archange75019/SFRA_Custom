window.onload = function () {
  
    function startScanner() {
     var video =  document.getElementById('video')
     try {
       Quagga.init({
         inputStream: {
             name: "Live",
             type: "LiveStream",
             target: video,
             size: 800
         },
         decoder: {
             readers: [
                 "code_128_reader",
                 "ean_reader",
                 "ean_8_reader",
                 "code_39_reader",
                 "code_39_vin_reader",
                 "codabar_reader",
                 "upc_reader",
                 "upc_e_reader",
                 "i2of5_reader"
             ],
             debug: {
                 showCanvas: true,
                 showPatches: true,
                 showFoundPatches: true,
                 showSkeleton: true,
                 showLabels: true,
                 showPatchLabels: true,
                 showRemainingPatchLabels: true,
                 boxFromPatches: {
                     showTransformed: true,
                     showTransformedBox: true,
                     showBB: true
                 }
             }
         },
 
       }, function (err) {
         if (err) {
             console.log(err);
             return
         }
 
         console.log("Initialization finished. Ready to start");
         Quagga.start();
       });
       Quagga.onDetected( async function (result) {
         if (result.codeResult && result.codeResult.code.length === 13 ) {
           await fetch(video.getAttribute('data-scanUrl'),
           {
             method: 'POST',
             body: JSON.stringify({EAN: result.codeResult.code}),
             headers: {
               "Content-type": "application/json; charset=UTF-8"
             }
           })
           .then(function(res){ return res.json(); })
           .then(function(data){
             if (!data.error) {
               console.log(data)
               Quagga.stop()
               location.href= data.redirectUrl
             }
             
           });
         }
       })
     } catch (error) {
       console.log(error)
     }
   }
   
   navigator.mediaDevices.getUserMedia({ video:{facingMode: 'environment' } })
    .then(function(stream) {
    strm=stream
 
    document.getElementById('video').srcObject=stream;
    document.getElementById('video').play();
    startScanner()
    
   })
   .catch(function(err) {
   console.log('erreur detecté: ' + err);
   })
 }