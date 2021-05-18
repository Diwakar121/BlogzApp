function makeSearch() {
    var q=$('#srchVal').val();
    console.log(`u srchd ${q}`);
    window.location.href =`/search?q=${q}`;
      
}


$('#notify').on('click', function(e){
 
  alert('No new Notifications');
 
})







$('#srchBox').on('keypress', function (e)
{
  if(e.which==13)
  makeSearch();

}
);
$('.srchIcon').on('click', function(){

    makeSearch();
      
   
})