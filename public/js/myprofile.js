$('#profileBox').mouseenter(function(){

//console.log(1);
    $('#profile').css('opacity','0.5');
$('#changePic').css('visibility', 'visible');

}).mouseleave(function(){
  
    //console.log(3);
         $('#profile').css('opacity','1');
    $('#changePic').css('visibility', 'hidden');
})


$('#submit').on('click',function(e){
    e.preventDefault();
    console.log("called");
    
    $('#load').toggleClass("loader");

    document.getElementById('submit').style.pointerEvents = 'none'
    
    $('#load').css('opacity','1');
    var  profile = document.querySelector('#getProfile');
    var formData = new FormData();
    formData.append('profilePics',profile.files[0]);
fetch('http://localhost:3000/upload-profilePic',{
    method:'POST',
    body:formData	
}).then((res) => {if(res.status==200)
    {
      
    $('#load').toggleClass("loader");
    document.getElementById('submit').style.pointerEvents= 'auto'
    
     window.location.href ='/myprofile';
    }                                                                        
}).catch(function(e) {
   
    document.getElementById('submit').style.pointerEvents = 'auto'
    $('#load').toggleClass("loader");
    
    console.log('Error',e);
    alert("faield");
})

}
)





