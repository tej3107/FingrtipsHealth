const exp = require('express');
const app = exp();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(exp.static('public'));

function getAge(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

var name="",age=0,email="",sex="",hgt=0,wgt=0,temp=0,dob="",smoke="",alcohol="",physc="",bmi=0;
var ag=50*365,hg=170,wi=70,gd=2,sb=120,db=80,ch=1,gl=1,sm=1,al=1,ph=1;
var ubp=0,lbp=0,gul=0,chol=0;
var data2=0;
// age in days
// height in cm
// weight in float kg
// gender 1-female 2-male
// systolic,dias int
// chol, gluse 1-normal 2-abv 3-welanv
// smoke, alcol, activ 0-no 1-yes
var data=[];var ab=[];
var perc=[];

app.get('/',(req,res)=>{res.render("home.ejs");})

app.get('/detail',(req,res)=>{res.render("detail.ejs");})

app.post('/gentest',(req,res)=>{
    var gender = req.body;
    if(gender.male=='male')sex='male';
    else sex='female';
    console.log(sex);
    res.redirect("/gentest");
})
app.get('/gentest',(req,res)=>{res.render("gentest.ejs");})

app.post('/misc',(req,res)=>{
    var t = req.body;
    // console.log(t.x101);
    if(t.x95=='')temp=95;
    else if(t.x98=='98')temp=98;
    else if(t.x101=='101')temp=101;
    else if(t.x103=='103')temp=103;
    else if(t.x105=='105')temp=105;
    res.redirect('/misc');
})
app.get('/misc',(req,res)=>{
    res.render('misc.ejs');
})

app.get('/gender',(req,res)=>{res.render("gender.ejs");})

app.post('/for',(req,res)=>{
    name = req.body.fname+" "+req.body.sname;
    email = req.body.email;
    dob = req.body.age;
    age = getAge(dob);
    console.log(age);
    console.log(name);
    console.log(email);
    res.redirect('/for');
})
app.get('/for',(req,res)=>{res.render("for.ejs");})

app.post('/hw',(req,res)=>{
    ubp = req.body.ubp;
    lbp = req.body.lbp;
    gul = req.body.Glucose;
    chol = req.body.Cholesterol;

    console.log(gul,chol);

    if(ubp<10||ubp>200)ubp=120;
    if(lbp<10||lbp>200)lbp=80;
    res.redirect('/hw');
})
app.get('/hw',(req,res)=>{res.render("hw.ejs");})

app.post('/temp',(req,res)=>{
    hgt = req.body.hgt;
    wgt = req.body.wgt;
    h = hgt/100;
    bmi = (wgt/(h*h)).toFixed(2);
    console.log(hgt,wgt);
    res.redirect('/temp');
})
app.get('/temp',(req,res)=>{res.render("temp.ejs");})

app.post('/symptoms',(req,res)=>{
    smoke = req.body.smoke;
    alcohol = req.body.alcohol;
    physc = req.body.physc;
    console.log(smoke,alcohol,physc);

    ag = age*365;
    gd = sex === 'male'? 2 : 1;
    hg = hgt;
    wi = wgt;
    sb = ubp;
    db = lbp;
    if(chol==='norm')ch=1;
    else if(chol==='abvnor')ch=2;
    else ch=3;
    if(gul==='norm')gl=1;
    else if(gul==='abvnor')gl=2;
    else gl=3;
    sm = smoke==='yes'?1:0;
    al = alcohol==='yes'?1:0;
    ph = physc==='yes'?1:0;
    res.redirect('/symptoms');
})
app.get('/symptoms',(req,res)=>{
    console.log(ag,hg,wi,gd,sb,db,ch,gl,sm,al,ph,"11 done");
    res.render("symptoms.ejs",{ag:ag,hg:hg,wi:wi,gd:gd,sb:sb,db:db,ch:ch,gl:gl,sm:sm,al:al,ph:ph});
})

app.post("/results",(req,res)=>{
    data=[];perc=[];ab=[];
    data.push(req.body.a);perc.push(req.body.a1);
    data.push(req.body.b);perc.push(req.body.b1);
    data.push(req.body.c);perc.push(req.body.c1);
    data.push(req.body.d);perc.push(req.body.d1);
    data.push(req.body.e);perc.push(req.body.e1);
    ab.push(req.body.f1);ab.push(req.body.f2);

    data2 = req.body.new;
    console.log(data2);

    // console.log(req.body);

    console.log(name,age,email,sex,hgt,wgt,temp,dob,smoke,alcohol,physc,bmi);
    console.log(ubp,lbp,gul,chol);

    res.redirect('/results');
})
app.get('/results',(req,res)=>{
    res.render("result",{name:name,age:age,dob:dob,email:email,sex:sex,bmi:bmi,result:data,perc:perc,ab:ab,data2:data2});
})

app.listen(process.env.PORT||3000,process.env.IP,()=>{
    console.log("Server");
})