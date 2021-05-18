console.log("yoyo");

var deleteThis = function(e) {
    console.log(e);
    $(e.target).parent().remove();
};
var imgHtml = `<div id="imgBox" class="mb-3 p-2" style="border:2px solid #DCDCDC;">
<label for="img" class="form-label">Image Url</label>
<input type="text" class="form-control imageBox box" id="img" placeholder="Image URL"  required>
<button  type="button" class="btn btn-secondary btn-sm mt-1"  onclick=deleteThis(event)>Delete</button>
</div>
`;

var textHtml = `<div id="textBox" class="mb-3 p-2" style="border:2px solid #DCDCDC;">
<label for="desc" class="form-label">Text</label>
<textarea class="form-control textBox box" style="white-space: pre-wrap;" id="desc" cols="20" rows="5" required></textarea>
<button type="button" class="btn btn-secondary btn-sm mt-1"  onclick=deleteThis(event)>Delete</button>
</div>`




$('.addImg').click(()=>{
    console.log("image");

    
    $('#last').append(imgHtml);
   
    
     
});

$('.addText').click(()=>{
    console.log("Text");
    $('#last').append(textHtml);
});



const getData= function() {

var obj={}
obj.texts=[];
obj.images=[];

var  boxes = document.querySelectorAll(' .box');
var count=0;
for(box of boxes) {
  box.setAttribute('id',count);  
count+=1;
}


var  textBoxes = document.querySelectorAll(' .textBox');
for(tb of textBoxes)
{
    obj.texts.push({pos: tb.getAttribute('id'),value:tb.value});
}
var  imageBoxes = document.querySelectorAll(' .imageBox');
for(ib of imageBoxes)
{
 obj.images.push({pos: ib.getAttribute('id'),value:ib.value});
} 
obj.title = document.querySelector('#title').value;
obj.desc=document.querySelector('#desc').value;
obj.img=document.querySelector('#img').value;
var st=document.querySelector('#tags').value;
obj.tags=[];
for(s of st.split(','))
{
  for(ns of s.split(' '))
  {if(ns.length >2)
    {obj.tags.push(ns);}
  }
}

return obj;
}






$('#submitPost').click(function(e){
    e.preventDefault();
    console.log("called");
    
    const obj= getData();
    console.log(obj);
     const data={blog:obj};

    fetch('/blogs', {
  method: 'POST', 
  body: JSON.stringify(data),
  headers: {
    'Content-Type': 'application/json',
  }

}).then((res) => {if(res.status==200)
                   {
                    window.location.href ='/blogs';
                   }                                                                        
})
.catch((e)=>{console.log(e);})

console.log("submit");

});
